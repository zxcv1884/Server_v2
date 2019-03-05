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
            });

            function fetchUrl(url, callback) {
                request({
                    url: url,
                    method: "GET"
                }, function (error, response, body) {
                    if (error || !body ) {
                        return;
                    }
                    let news;
                    if(body){
                    news = analyze(body);
                    }else{
                        return;
                    }
                    sql = "UPDATE `news` SET `realUrl`='" + news + "' WHERE `news`.`url` = '" + url + "'";
                    con.query(sql, function (err, rows, result) {
                    });
                    count++;
                    callback(null, count);
                })
            }

            function analyze(body) {
                const $ = cheerio.load(body);
                $('body a').each(function () {
                    news = $(this).attr('href');
                });
                return news;
            }
        })
    },);
}

run();
setInterval(run, 1000 * 60 * 30);