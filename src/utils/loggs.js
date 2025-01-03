const { createLogger, transports, format } = require("winston");
const LokiTransport = require("winston-loki");
require("dotenv").config();

// Log the Loki host for debugging
console.log(`Loki Host: ${process.env.LOKI_HOST}`);

const options = {
  level: "info", // Set log level if not set globally
  format: format.combine(
    format.timestamp(),
    format.simple() // Add timestamp and log format for clarity
  ),
  transports: [
    new LokiTransport({
      host: `${process.env.LOKI_HOST}`, // Ensure environment variable is correct
      labels: { job: "my-server" }, // Labels to identify logs in Loki
    }),
    new transports.Console({
      // Add console transport for local debugging
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
};

// Create the logger instance
const logger = createLogger(options);
logger.info("server is started")

// Export the logger
module.exports = logger;
