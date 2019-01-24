const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "server"
});
const news = function (url,category) {
    request({
        url: url,
        method: "GET"
    }, function (error, response, body) {
        if (error || !body) {
            return;
        }
        const $ = cheerio.load(body);
        let news = [];
        $('article div h4 a').each(function() {
            news.push([$(this).text(),$(this).attr('href').replace(".","https://news.google.com"),category]);
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
    news("https://news.google.com/news/u/0/headlines?hl=zh-TW&ned=zh-tw_tw&gl=TW",'headline');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx1YlY4U0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",'international');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx6TVdZU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",'business');
    news("https://news.google.com/topics/CAAqLAgKIiZDQkFTRmdvSkwyMHZNR1ptZHpWbUVnVjZhQzFVVnhvQ1ZGY29BQVAB?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",'science');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNREpxYW5RU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",'entertainment');
    news("https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFp1ZEdvU0JYcG9MVlJYR2dKVVZ5Z0FQAQ?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",'sport');
    news("https://news.google.com/topics/CAAqJQgKIh9DQkFTRVFvSUwyMHZNR3QwTlRFU0JYcG9MVlJYS0FBUAE?hl=zh-TW&gl=TW&ceid=TW%3Azh-Hant",'health');
}
run();
setInterval(run,1000*60*30);