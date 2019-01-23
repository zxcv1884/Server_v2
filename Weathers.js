const request = require('request');
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nayuyu1884",
    database: "server"
});
const weathers = function (weathers_url) {
    request(weathers_url, function (error, response, body) {
        if (!error && response.statusCode === 200 && safelyParseJSON(body) === true) {
            let importedJSON = JSON.parse(body);
            let locations = (importedJSON.records.locations[0].locationsName);
            for (let i = 0; i < importedJSON.records.locations[0].location.length; i++) {
                let location = (importedJSON.records.locations[0].location[i].locationName);
                for (let j = 0; j < (importedJSON.records.locations[0].location[i].weatherElement.length); j++) {
                    let elementname = (importedJSON.records.locations[0].location[i].weatherElement[j].description);
                    if(elementname==='6小時降雨機率' || elementname==='12小時降雨機率'){
                        elementname = '降雨機率';
                    }
                    if(elementname==='體感溫度'){
                        elementname = '溫度';
                    }
                    if(elementname==='天氣現象'||elementname==='天氣現象編號'||elementname==='降雨機率'||elementname==='溫度'){
                        for (let z = 0; z < (importedJSON.records.locations[0].location[i].weatherElement[j].time.length); z++) {
                            let time = (importedJSON.records.locations[0].location[i].weatherElement[j].time[z].startTime);
                            if (time === undefined) {
                                time = (importedJSON.records.locations[0].location[i].weatherElement[j].time[z].dataTime)
                            }
                            let elementvalue = (importedJSON.records.locations[0].location[i].weatherElement[j].time[z].elementValue[0].value);
                            let sql = "INSERT INTO weathers (`縣市`, `鄉鎮`, `時間`,`" + elementname + "`) VALUES('" + locations + "', '" + location + "', '" + time + "', '" + elementvalue + "') ON DUPLICATE KEY UPDATE `" + elementname + "`='" + elementvalue + "'";
                            console.log(sql);
                            con.query(sql);
                            if ((importedJSON.records.locations[0].location[i].weatherElement[j].time[z].elementValue.length) === 2) {
                                elementvalue = (importedJSON.records.locations[0].location[i].weatherElement[j].time[z].elementValue[1].value);
                                 sql = "INSERT INTO weathers (`縣市`, `鄉鎮`, `時間`,`天氣現象編號`) VALUES('" + locations + "', '" + location + "', '" + time + "', '" + elementvalue + "') ON DUPLICATE KEY UPDATE `天氣現象編號`='" + elementvalue + "'";
                                console.log(sql);
                                con.query(sql);
                            }
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
function safelyParseJSON (json) {
    var parsed;
    try {
        parsed = JSON.parse(json)
    } catch (e) {
        return false;
    }
    return true ;// Could be undefined!
}
function weather(){
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
setInterval(weather,1000*60*60);



