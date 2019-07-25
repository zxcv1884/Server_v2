const fs = require('fs');
const {google} = require('googleapis');
const mysql = require('mysql');

//
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "server"
});
function gettoken(){
let sql = "SELECT `googleCode`, `email` FROM `users` WHERE `googleUpdate` = 1";
con.query(sql, function (err, rows, result) {
    rows.forEach(function (row) {
        updateJson(row.googleCode, row.email)
    });
});
}
//
function updateJson(googleCode, email) {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        authorize(JSON.parse(content));
    });

    function authorize(credentials) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        getAccessToken(oAuth2Client);
    }

    function getAccessToken(oAuth2Client) {
        oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        oAuth2Client.getToken(googleCode, (err, token) => {
            if (err) {
                let sql = "UPDATE `users` SET `googleUpdate` = 0 WHERE `email` = '"+ email +"'";
                con.query(sql, function (err, result) {});
                console.log('錯誤的token');
                return err
            }
            oAuth2Client.setCredentials(token);
            let sql = "UPDATE `users` SET `googleUpdate` = 0, `googleCalendar` = '"+ JSON.stringify(token) +"' WHERE `email` = '"+ email +"'";
            con.query(sql, function (err, result) {});
            console.log(sql);  // !!需要
        });
    }
}
gettoken();
setInterval(gettoken,1000*60*5);