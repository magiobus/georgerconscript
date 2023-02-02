const georgeLib = {};
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const format = require("date-fns/format");
const { es } = require("date-fns/locale");

georgeLib.sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

georgeLib.readLog = async () => {
  console.log("Reading log file");
  try {
    const text = fs.readFileSync("server-console.txt", "utf8");
    return text;
  } catch (error) {
    throw new Error("Error reading file from disk");
  }
};

georgeLib.getLastMinutes = async (textContent, time = 5) => {
  const newLogs = [];

  //it gets the last x minutes of logs
  //iterate tu file to get everything per lines, use word LOG as first word in line
  textLines = textContent.split("\n");

  //now unixtimestamp
  const now = new Date();
  const nowUnix = now.getTime();

  //iterate tru textlines and get the timestamp if exists using , and >
  textLines.map(async (line) => {
    const lastTimeMinutesTimestamp = nowUnix - time * 60 * 1000;

    const aftercomma = line.split(",")[1];
    let timestamp = undefined;
    if (aftercomma) timestamp = aftercomma.split(">")[0];

    //check if unixtimestamp is in the last x minutes
    if (timestamp) {
      //get now date in unixtimestamp
      //check if timestamp is in > lastTimeMinutesTimestamp
      if (timestamp > lastTimeMinutesTimestamp) {
        //convert timestamp which is in unixtimestamp to date
        // const timeStampText = georgeLib.unixToDate(timestamp);
        // console.log("timestap =>", timestamp, timeStampText);
        //get distance between now and timestamp
        const newLine = line;
        newLogs.push(newLine);
      }
    }
  });

  return newLogs;
};

georgeLib.detectWordsInLogs = async (logsArray, wordsArray) => {
  const detectedLogs = [];
  //iterate tru logsArray
  logsArray.map(async (log) => {
    //iterate tru wordsArray
    wordsArray.map(async (word) => {
      //check if word is in line
      if (log.includes(word)) {
        //if word is in line, send to telegram
        //parse log to add int he line how many minutes was ago
        detectedLogs.push(log);
      }
    });
  });

  return detectedLogs;
};

georgeLib.sendTelegram = async (text, token, telegramUserId) => {
  const bot = new TelegramBot(token, { polling: true });
  //send message to specific user using telegram
  bot.sendMessage(telegramUserId, text);
};

georgeLib.unixToDate = (unixtimestamp, withHour = true) => {
  let d = new Date(unixtimestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh == 0) {
    h = 12;
  }

  // ie: 2013-02-18, 8:35 AM
  if (withHour) {
    time = dd + "/" + mm + "/" + yyyy + ", " + h + ":" + min + " " + ampm;
  } else {
    time = dd + "/" + mm + "/" + yyyy;
  }

  return time;
};

module.exports = georgeLib;
