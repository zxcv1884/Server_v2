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
        let sql = "SELECT RealUrl,ID FROM news WHERE `article` IS NULL";
        con.query(sql, function (err, rows, result) {
            rows.forEach(function (row) {
                request({
                    url: row.RealUrl,
                    method: "GET"
                }, function (error, response, body) {
                    if (error || !body) {
                        return;
                    }
                    const $ = cheerio.load(body);
                    let news = "";
                    if (!row.RealUrl.includes('apple')) {
                        $('p').each(function () {
                            if ($(this).text() !== "" && $(this).text().includes("。") && !($(this).text().includes("]※")) && !($(this).text().includes("圖／")) && !($(this).text().includes("圖/"))) {
                                news += $(this).text().replace(/\t/g, "").replace(/\n/g, "<br>").replace(/ /g, "") + '<br>';
                            }
                        });
                    }
                    if (row.RealUrl.includes('appledaily')) {
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
                    // if (row.RealUrl.includes('hk')||row.RealUrl.includes('applealmond') ||row.RealUrl.includes('gnn.gamer') || row.RealUrl.includes('stock.yahoo.com')||row.RealUrl.includes('4gamers.com')||row.RealUrl.includes('techbang.com')||row.RealUrl.includes('news.pts.org.tw')||row.RealUrl.includes('thenewslens')) {
                    sql = "DELETE FROM `news` WHERE `article` = ''";
                    con.query(sql, function (err, rows, result) {
                    });
                    sql = "UPDATE `news` SET `article`='" + news + "' WHERE `news`.`ID` = " + row.ID;
                    con.query(sql, function (err, rows, result) {
                    });
                });
            });
        });
    }, 1000 * 60)
}
run();
setInterval(run, 1000 * 60 * 30);