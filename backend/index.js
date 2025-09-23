
var express = require("express");
var path = require("path");
require("dotenv").config();
var cookieParser = require("cookie-parser");
var indexRouter = require("./routes/index");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // Levels: error, warn, info, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: "logs/app.log" }), // Log to a file
    new winston.transports.Console(), // Log to console
  ],
});

var cors = require("cors");
var app = express();
const { Sequelize } = require("sequelize");
// view engine setup
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const { sequelize } = require("./models");
// sequelize.sync().then(() => console.log("✅ DB Synced"));
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ DB Synced with Alter"));
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ DB Connected");
  })
  .catch((err) => {
    console.error("❌ DB Connection Error: ", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/admin", indexRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("Locals: ", res.locals);
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  console.log(`${req.method} ${req.url} - ${err.message}`);
  res.status(500).json({ error: "Internal Server Error" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

module.exports = app;