const express = require("express");
const app = express();
require("dotenv").config();
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

app.use("/api/v1/", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Service running on port ${PORT}`);
});

module.exports = app;
