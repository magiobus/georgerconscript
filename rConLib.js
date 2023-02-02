// conectar al server y correr un comand

const Rcon = require("rcon"); //importacion de la liubreria

//inicializa
const rConLib = {};

rConLib.connect = async (host, rconport, rconpass) => {
  const conn = new Rcon(host, rconport, rconpass);
  try {
    await conn.connect(); //connect
    console.log("conectando...");
    //Process
    const authPromise = await new Promise((resolve) =>
      conn.on("auth", resolve)
    );
    await authPromise; //auth await
    console.log("ya se autentico");
    await conn.send("checkmodsneedupdate"); //send command
    console.log("ya mando comando");
    const responsePromise = await new Promise((resolve) =>
      conn.on("response", function (str) {
        resolve(str);
      })
    );
    const str = await responsePromise; //response await
    console.log("ya contesto al comando", str);
    return conn;
  } catch (error) {
    console.error("error en rcon =>", error);
  }
};

rConLib.killProcess = async (conn) => {
  console.log("killing process and disconnecting insance ");
  conn.disconnect();
  console.log("Desconectado");
  await process.exit();
};

module.exports = rConLib;
