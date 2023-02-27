const { Client, authenticate } = require("./models/SheetsClient");

const main = async () => {
  const instance = await authenticate();
  const jeep = new Client(instance);
  jeep.markDone("123");
};

main();
