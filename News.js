const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nayuyu1884",
    database: "server"
});
const headline = function () {
    request({
        url: "https://news.google.com/news/u/0/headlines?hl=zh-TW&ned=zh-tw_tw&gl=TW",
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),'headline']);
        });
            let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";
            con.query(sql, [news], function (err, result) {
                if (!err && result.affectedRows > 0) {
                     console.log("Headline number of records inserted: " + result.affectedRows);
                } else {
                    console.log("Headline number of records inserted: 0");
                }
            });
        });
};
const international = function () {
    request({
        url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),'international']);
        });
        let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";
        con.query(sql, [news], function (err, result) {
            if (!err && result.affectedRows > 0) {
                console.log("International number of records inserted: " + result.affectedRows);
            } else {
                console.log("International number of records inserted: 0");
            }
        });
    })
};
const business = function () {
    request({
        url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),'business']);
        });
        let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";
        con.query(sql, [news], function (err, result) {
            if (!err && result.affectedRows > 0) {
                console.log("Business number of records inserted: " + result.affectedRows);
            } else {
                console.log("Business number of records inserted: 0");
            }
        });
    })
};
const science = function () {
    request({
        url: "https://news.google.com/topics/CAAqLAgKIiZDQkFTRmdvSkwyMHZNR1ptZHpWbUVnVjZhQzFVVnhvQ1ZGY29BQVAB?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),'science']);
        });
        let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";
        con.query(sql, [news], function (err, result) {
            if (!err && result.affectedRows > 0) {
                console.log("Science number of records inserted: " + result.affectedRows);
            } else {
                console.log("Science number of records inserted: 0");
            }
        });
    })
};
const entertainment = function () {
    request({
        url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNREpxYW5RU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),'entertainment']);
        });
        let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";
        con.query(sql, [news], function (err, result) {
            if (!err && result.affectedRows > 0) {
                console.log("Entertainment number of records inserted: " + result.affectedRows);
            } else {
                console.log("Entertainment number of records inserted: 0");
            }
        });
    })
};
const sport = function () {
    request({
        url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),'sport']);
        });
        let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";
        con.query(sql, [news], function (err, result) {
            if (!err && result.affectedRows > 0) {
                console.log("Sport number of records inserted: " + result.affectedRows);
            } else {
                console.log("Sport number of records inserted: 0");
            }
        });
    })
};
const health = function () {
    request({
        url: "https://news.google.com/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR3QwTlRFU0JYcG9MVlJYS0FBUAE?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),'health']);
        });
        let sql = "INSERT ignore INTO news (title, url,category) VALUES ?";

        con.query(sql, [news], function (err, result) {
            if (!err && result.affectedRows > 0) {
                console.log("Health number of records inserted: " + result.affectedRows);
            } else {
                console.log("Health number of records inserted: 0");
            }
        });
    })
};

function news() {
    headline();
    international();
    business();
    science();
    entertainment();
    sport();
    health();
}
news();
setInterval(news,1000*60*30);