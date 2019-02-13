const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nayuyu1884",
    database: "server"
});

function run() {
    setTimeout(function () {
        let sql = "SELECT url,ID FROM news WHERE `RealUrl` IS NULL ";
        con.query(sql, function (err, rows, result) {
            let news;
            rows.forEach(function (row) {
                request({
                    url: row.url,
                    method: "GET"
                }, function (error, response, body) {
                    if (error || !body) {
                        return;
                    }
                    const $ = cheerio.load(body);
                    $('body a').each(function () {
                        news = $(this).attr('href');
                    });
                    console.log(news);
                    sql = "UPDATE `news` SET `realUrl`='" + news + "' WHERE `news`.`ID` = " + row.ID;
                    con.query(sql, function (err, rows, result) {
                    });
                });
            });
        });
    },1000)
}

run();
setInterval(run, 1000 * 60 * 30);