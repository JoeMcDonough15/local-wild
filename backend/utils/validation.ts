import { validationResult, ValidationError } from "express-validator";
import { NextFunction, Request, Response } from "express";

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
    validationErrors
      .array()
      .forEach((error: ValidationError) => (errors[error.param] = error.msg));

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors,
};
