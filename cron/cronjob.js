const cron = require("node-cron");
var utils = require("../untils/utils");

/////////////////////////////////////////////////////////////////////////
//                         Cron Job
/////////////////////////////////////////////////////////////////////////
//┌────────────── second (0 - 59) (optional)
//│ ┌──────────── minute (0 - 59) 
//│ │ ┌────────── hour (0 - 23)
//│ │ │ ┌──────── day of the month (1 - 31)
//│ │ │ │ ┌────── month (1 - 12)
//│ │ │ │ │ ┌──── day of the week (0 - 6) (0 and 7 both represent Sunday)
//│ │ │ │ │ │
//│ │ │ │ │ │
//* * * * * * 
/////////////////////////////////////////////////////////////////////////


module.exports = () => {
    //clear vcode in SQLite
    cron.schedule("*/1 * * * *", function () {
        console.log("---------------------");
        var date_ob = new Date();
        var day = ("0" + date_ob.getDate()).slice(-2);
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        var year = date_ob.getFullYear();
        var hours = ("0" + date_ob.getHours()).slice(-2);
        var minutes = ("0" + (date_ob.getMinutes() - 1)).slice(-2);
        var seconds = ("0" + date_ob.getSeconds()).slice(-2);
        if (minutes == "-1") {
            minutes = "59";
            hours = hours - 1;
        }
        var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        utils.verificationCodeRepo.deleteByDateTime(dateTime).then((result) => {
            console.log(dateTime);
            console.log(result);
        });
    });
    //rebuilds database each 12 hour
    cron.schedule("0 */12 * * *", function () {
        utils.verificationCodeRepo.rebuilds().then((result) => {
            console.log(result.id);
        });
    });
}
