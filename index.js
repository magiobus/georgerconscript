const getLogFromFtp = require("./getlog.js");
const georgeLib = require("./georgelib.js");
const rConLib = require("./rConLib.js");

require("dotenv").config();

// const wordsArray = ["CheckModsNeedUpdate: Mods updated"]; //this is for testing
const custommsg = "Se necesita update en el server";
const wordsArray = ["CheckModsNeedUpdate: Mods need update."];
const time = 3; //last minutes of logs to check
const telegramToken = process.env.TELEGRAM_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
//ftp
const host = process.env.FTP_HOST;
const ftpuser = process.env.FTP_USER;
const ftppass = process.env.FTP_PASSWORD;
const ftpport = process.env.FTP_PORT;

//rcon credentials
const rconhost = process.env.RCON_HOST;
const rconpass = process.env.RCON_PASSWORD;
const rconport = process.env.RCON_PORT;

//main program
main();

async function main() {
  // //rcon
  const connInstance = await rConLib.connect(rconhost, rconport, rconpass); //Send command to server
  //wait 3 seconds
  await georgeLib.sleep(3000);
  await getLogFromFtp(host, ftpuser, ftppass, ftpport); //Download file from ftp
  const text = await georgeLib.readLog(); //read file from disk and returns an array of textlines
  //iterate tru file to get the last 10 minutes of logs
  const freshLogsArray = await georgeLib.getLastMinutes(text, time); //Receives log text and time in minutes
  //Detect words in logs....
  const detectedLogsArray = await georgeLib.detectWordsInLogs(
    freshLogsArray,
    wordsArray
  ); //Receives array of logs
  console.log("detectedLogsArray =>", detectedLogsArray);
  if (detectedLogsArray.length > 0) {
    await georgeLib.sendTelegram(custommsg, telegramToken, telegramChatId);
  }
  await georgeLib.sleep(1000);
  //close rcon connection
  await rConLib.killProcess(connInstance);
}

// el array esta vacion, entonces no detecto nada
// el array trae algo, detecto algo

//For every log in detectedLogsArray, send to telegram

//   detectedLogsArray.map(async (log) => {
//
//   });
// }
