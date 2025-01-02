const { ApiResponse } = require("../utils/apiResponse.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/apiError.js");
const client = require("prom-client"); // for metric collection

const metricsCollection = asyncHandler(async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics(); // Call the function to get metrics
  return res.send(metrics);
});

module.exports = metricsCollection;
