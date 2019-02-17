const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const async = require("async");
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nayuyu1884",
    database: "server"
});

function run() {
    setTimeout(function () {
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
                sql = "DELETE FROM `news` WHERE `article` = '' or `article` IS NULL" ;
                con.query(sql, function (err, rows, result) {
                });
                console.log(count);
            });

            function deleteNull(url) {
                sql = "DELETE FROM `news` WHERE `realUrl` = '"+url+"'" ;
                con.query(sql, function (err, rows, result) {
                });
            }

            function fetchUrl(url, callback) {
                request({
                    url: url,
                    method: "GET"
                }, function (error, response, body) {
                    if (error || !body || response.statusCode !== 200) {
                        deleteNull(url);
                    }
                    let news = analyze(body, url);
                    if(news===""){
                        sql = "DELETE FROM `news` WHERE `realUrl` = '"+ url +"'";
                    }else {
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
        })
    })
}

run();