const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const async = require("async");
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "server"
});
const news = function (url, category) {         //獲取新聞標題和網址
    request({
        url: url,
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function () {
            news.push([$(this).text(), $(this).attr('href').replace(".", "https://news.google.com"), category]);
        });
        let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";
        con.query(sql, [news], function (err, result) {
            if (!err && result.affectedRows > 0) {
                console.log(category + " number of records inserted: " + result.affectedRows);
            } else {
                console.log(category + " number of records inserted: 0");
            }
        });
    })
};

function run() {
    news("https://news.google.com/news/u/0/headlines?hl=zh-TW&ned=zh-tw_tw&gl=TW", 'headline');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant", 'international');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant", 'business');
    news("https://news.google.com/topics/CAAqLAgKIiZDQkFTRmdvSkwyMHZNR1ptZHpWbUVnVjZhQzFVVnhvQ1ZGY29BQVAB?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant", 'science');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNREpxYW5RU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant", 'entertainment');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant", 'sport');
    news("https://news.google.com/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR3QwTlRFU0JYcG9MVlJYS0FBUAE?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant", 'health');
    catchRealUrl();
}

run();
setInterval(run, 1000 * 60 * 30);

function catchRealUrl() {                   //由轉址頁面取得原網址
    setTimeout(function () {
        let sql = "SELECT url FROM news WHERE `realUrl` IS NULL ";
        let count = 0;
        con.query(sql, function (err, rows, result) {
            let news;
            let fakeUrl = [];
            rows.forEach(function (row) {
                fakeUrl.push(row.url)
            });
            async.mapLimit(fakeUrl, 10, function (url, callback) {
                fetchUrl(url, callback);
            }, function (err, result) {
                sql = "DELETE FROM `news` WHERE `realUrl` = '//www.google.com'";
                con.query(sql, function (err, rows, result) {
                });
                console.log(count);
                catchNewsContent();
            });

            function fetchUrl(url, callback) {
                request({
                    url: url,
                    method: "GET"
                }, function (error, response, body) {
                    if (error || !body) {
                        return;
                    }
                    let news = analyze(body);
                    sql = "UPDATE `news` SET `realUrl`='" + news + "' WHERE `news`.`url` = '" + url + "'";
                    con.query(sql, function (err, rows, result) {
                    });
                    count++;
                    callback(null, count);
                })
            }

            function analyze(body) {
                if(body){
                const $ = cheerio.load(body);
                    $('body a').each(function () {
                        news = $(this).attr('href');
                    });
                }else {
                    news="";
                }
                return news;
            }
        })
    }, 1000 * 30)
}
function catchNewsContent() {            //取得原網址新聞內容
    let sql = "SELECT realUrl FROM news WHERE `article` IS NULL";
    let count = 0;
    con.query(sql, function (err, rows, result) {
        let realUrl = [];
        rows.forEach(function (row) {
            realUrl.push(row.realUrl)
        });
        console.log(realUrl);
        async.mapLimit(realUrl, 10, function (url, callback) {
            fetchUrl(url, callback);
        }, function (err, result) {
            sql = "DELETE FROM `news` WHERE `article` = '' or `article` IS NULL";
            con.query(sql, function (err, rows, result) {
            });
            console.log(count);
        });

        function fetchUrl(url, callback) {
            request({
                url: url,
                method: "GET"
            }, function (error, response, body) {
                if (error || !body || response.statusCode !== 200) {
                    deleteNull(url);
                }
                let news;
                if (body) {
                    news = analyze(body, url);
                } else {
                    return;
                }
                if (news === "") {
                    sql = "DELETE FROM `news` WHERE `realUrl` = '" + url + "'";
                } else {
                    sql = "UPDATE `news` SET `article`=\"" + news + "\" WHERE `news`.`realUrl` = '" + url + "'";
                }
                console.log(sql);
                con.query(sql, function (err, rows, result) {
                });
                count++;
                console.log(count);
                callback(null, count);
            })
        }

        function analyze(body, url) {
            if(body){
            const $ = cheerio.load(body);
            let news = "";
            if (!url.includes('apple')) {
                $('p').each(function () {
                    if ($(this).text() !== "" && $(this).text().includes("。") && !($(this).text().includes("]※")) && !($(this).text().includes("圖／")) && !($(this).text().includes("圖/"))) {
                        news += $(this).text().replace(/\t/g, "").replace(/\n/g, "<br>").replace(/ /g, "") + '<br>';
                    }
                });
            }
            if (url.includes('appledaily')) {
                $('article article p').each(function () {
                    if ($(this).text() !== "" && $(this).text().includes("。") && !($(this).text().includes("]※")) && !($(this).text().includes("圖／")) && !($(this).text().includes("圖/"))) {
                        news += $(this).text().replace(/\t/g, "").replace(/\n/g, "<br>").replace(/ /g, "");
                    }
                });
            }
            if (news === "") {
                $('.h7').each(function () {
                    if ($(this).text() !== "" && $(this).text().includes("。") && !($(this).text().includes("]※")) && !($(this).text().includes("圖／")) && !($(this).text().includes("圖/"))) {
                        news += ($(this).text().replace(/\t/g, "").replace(/\n/g, "<br>").replace(/ /g, ""));
                    }
                });
            }
            return news;
            }
        }
    })
}

function deleteNull(url) {
    let sql = "DELETE FROM `news` WHERE `realUrl` = '" + url + "'";
    con.query(sql, function (err, rows, result) {
    });
}