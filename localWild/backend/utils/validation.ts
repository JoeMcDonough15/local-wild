import { validationResult } from "express-validator";
import type { ValidationError } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "../types/index.js";

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors: Record<string, string> = {};
    for (const error of validationErrors.array()) {
      errors[error.param] = error.msg;
    }

    const err: ApiError = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

export default handleValidationErrors;
