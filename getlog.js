const ftp = require("basic-ftp");

async function getLogFromFtp(host, user, password, port) {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log("Connecting to FTP server");
    await client.access({
      host,
      user,
      password,
      port,
      secure: false,
    });

    // console.log(await client.list());
    await client.downloadTo("server-console.txt", "server-console.txt");
    console.log("Downloaded server-console.txt");
  } catch (err) {
    console.log("Something happen connecting or downloading from ftp", error);
  }
  client.close();
}

module.exports = getLogFromFtp;
