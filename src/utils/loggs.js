const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
require("dotenv").config();
console.log(`${process.env.loki_host}`);
const options = {
  transports: [
    new LokiTransport({
      host: `${process.env.LOKI_HOST}`,
      labels:"my-server"
    })
  ]

};

const logger = createLogger(options);
module.exports=logger
