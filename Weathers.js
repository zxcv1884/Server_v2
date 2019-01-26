const request = require('request');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "server"
});
const weathers = function (weathers_url) {
    request(weathers_url, function (error, response, body) {
        if (!error && response.statusCode === 200 && safelyParseJSON(body) === true) {
            let importedJSON = JSON.parse(body);
            let country = importedJSON.records.locations[0].locationsName;
            for (let location of importedJSON.records.locations[0].location) {
                let sonOfCountry = location.locationName;
                for (let status of location.weatherElement) {
                    let statusDescription = status.description;
                    if (statusDescription === '6小時降雨機率' || statusDescription === '12小時降雨機率') {
                        statusDescription = '降雨機率';
                    } else if (statusDescription === '體感溫度') {
                        statusDescription = '溫度';
                    }
                    if (statusDescription === '天氣現象' || statusDescription === '天氣現象編號' || statusDescription === '降雨機率' || statusDescription === '溫度') {
                        for (let statusOfTime of status.time) {
                            let time = (statusOfTime.startTime);
                            if (time === undefined) {
                                time = (statusOfTime.dataTime)
                            }
                            let sql;
                            if (statusDescription === "天氣現象") {
                                let wxText = statusOfTime.elementValue[0].value;
                                let wxCode = statusOfTime.elementValue[1].value;
                                sql = "INSERT INTO weathers (`縣市`, `鄉鎮`, `時間`,`天氣現象`,`天氣現象編號`) VALUES('" + country + "', '" + sonOfCountry + "', '" + time + "', '" + wxText + "', '" + wxCode + "') ON DUPLICATE KEY UPDATE `天氣現象`='" + wxText + "',`天氣現象編號`='" + wxCode + "'";
                            } else if (statusDescription === "降雨機率") {
                                let value = (statusOfTime.elementValue[0].value);
                                let dt = new Date(time);
                                dt.setHours(dt.getHours() + 3);
                                let dtime = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
                                sql = "INSERT INTO weathers (`縣市`, `鄉鎮`, `時間`,`" + statusDescription + "`) VALUES('" + country + "', '" + sonOfCountry + "', '" + time + "', '" + value + "') ON DUPLICATE KEY UPDATE `" + statusDescription + "`='" + value + "'";
                                con.query(sql);
                                sql = "INSERT INTO weathers (`縣市`, `鄉鎮`, `時間`,`" + statusDescription + "`) VALUES('" + country + "', '" + sonOfCountry + "', '" + dtime + "', '" + value + "') ON DUPLICATE KEY UPDATE `" + statusDescription + "`='" + value + "'";
                            } else {
                                let value = (statusOfTime.elementValue[0].value);
                                sql = "INSERT INTO weathers (`縣市`, `鄉鎮`, `時間`,`" + statusDescription + "`) VALUES('" + country + "', '" + sonOfCountry + "', '" + time + "', '" + value + "') ON DUPLICATE KEY UPDATE `" + statusDescription + "`='" + value + "'";
                            }
                            console.log(sql);
                            con.query(sql);
                        }
                    }
                }
            }
        }
    });
};

function deleteOldWeathers() {
    con.query("DELETE FROM `weathers` WHERE `時間` < DATE_SUB(CURRENT_TIME,INTERVAL 3 HOUR)");
}

function safelyParseJSON(json) {
    try {
        JSON.parse(json)
    } catch (e) {
        return false;
    }
    return true;// Could be undefined!
}

function weather() {
    deleteOldWeathers();
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-001?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//宜蘭縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-005?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//桃園市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-009?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//新竹縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-013?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//苗栗縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-017?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//彰化縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-021?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//南投縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-025?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//雲林縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-029?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//嘉義縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-033?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//屏東縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-037?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//臺東縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-041?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//花蓮縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-045?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//澎湖縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-049?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//基隆市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-053?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//新竹市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-057?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//嘉義市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-061?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//臺北市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-065?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//高雄市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-069?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//新北市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-073?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//臺中市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-077?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//臺南市
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-081?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//連江縣
    weathers('https://opendata.cwb.gov.tw./api/v1/rest/datastore/F-D0047-085?elementName=Wx,AT,PoP6h&Authorization=CWB-010473E7-0B4D-48F7-8479-8F07AB175432');//金門縣
}

weather();
setInterval(weather, 1000 * 60 * 60);