import express, { NextFunction, Request, Response } from "express";
import { ApiError } from "../types";
require("express-async-errors");
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import configurationObj from "./config";
const csurf = require("csurf");
const { environment } = configurationObj;
const isProduction = environment === "production";
// const { ValidationError } = require("sequelize");
import routes from "./routes";
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

app.use(routes);

// Catch unhandled requests and forward to error handler.
app.use((_req: Request, _res: Response, next) => {
  // console.log(_req._parsedOriginalUrl.pathname, " ^^^^^^")
  const err: ApiError = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = {
    name: "Resource Not Found Error",
    message: "The requested resource couldn't be found.",
  };
  err.status = 404;
  next(err);
});

// // Process sequelize errors
// app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
//   // check if error is a Sequelize error:
//   if (err instanceof ValidationError) {
//     let errors = {};
//     for (let error of err.errors) {
//       errors[error.path] = error.message;
//     }
//     err.title = "Validation error";
//     err.errors = errors;
//   }
//   next(err);
// });

// Error formatter
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
