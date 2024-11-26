import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import configurationObj from "./config/index.js";
import csurf from "csurf";
import routes from "./routes/index.js";
const { environment, port } = configurationObj;
const isProduction = environment === "production";
// initialize app
const app = express();
// application middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false })); // for form data that isn't application/json
app.use(express.json());
// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}
// helmet helps set a variety of headers to better secure your app
app.use(helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
}));
// Set the _csrf token and create req.csrfToken method
app.use(csurf({
    cookie: {
        secure: isProduction,
        sameSite: isProduction && "lax",
        httpOnly: true,
    },
}));
app.use(routes);
// app.get("/", (_req, res, _next) => {
//   res.status(200).json({ message: "TEST" });
// });
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = {
        message: "The requested resource couldn't be found.",
    };
    err.title = "Resource Not Found";
    err.errors = {
        name: "Resource Not Found Error",
        message: "The requested resource couldn't be found.",
    };
    err.status = 404;
    next(err);
});
// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    // console.error('error in the error formatter: ', err);
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
    });
});
app.listen(port, () => console.log(`Listening on port ${port}...}`));
