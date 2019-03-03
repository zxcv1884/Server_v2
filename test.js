const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nayuyu1884",
    database: "server"
});
// let newArr = [];
// con.query("SELECT * FROM `weathers` WHERE `鄉鎮` ='板橋區' ORDER BY `weathers`.`時間` ASC", function (error, result) {
//     let j = 0;
//     let weekday = new Array(7);
//     weekday[0] = "（日）";
//     weekday[1] = "（一）";
//     weekday[2] = "（二）";
//     weekday[3] = "（三）";
//     weekday[4] = "（四）";
//     weekday[5] = "（五）";
//     weekday[6] = "（六）";
//     for(let i of result){
//         // newArr.push(result[j].時間);
//         let datetime = new Date();
//         datetime.setTime(result[j].時間);
//         if (datetime.getHours() < 10){
//             newArr.push(weekday[datetime.getDay()]+"0"+datetime.getHours()+":00");
//         } else {
//         newArr.push(weekday[datetime.getDay()]+datetime.getHours()+":00");
//         }
//         j++;
//     }
//      console.log(newArr)
// });
let title = [];
let article = [];
let url = [];
let category = "headline";
con.query("SELECT * FROM `news` WHERE `category` ='" + category + "' ORDER BY `news`.`time` ASC Limit 100", function (error, result) {
    // console.log(result[0].realUrl);
    for (let i = 0 ; i <result.length; i++){
        title.push(result[i].title)
        article.push(result[i].article)
        url.push(result[i].realUrl)
    }
    console.log(title[0]);
});
