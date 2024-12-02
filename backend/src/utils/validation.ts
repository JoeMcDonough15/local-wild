import { validationResult, check } from "express-validator";
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

    const err: ApiError = {
      name: "Bad Request",
      message: "Invalid input",
      errors: errors,
      status: 400,
    };

    next(err);
  }

  next();
};

// backend validation for login
export const validateLogin = [
  check("email")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

//backend validation for signup
export const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

export const validatePostBody = [
  check("title")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("You must include a title for your post."),
  handleValidationErrors,
];

//backend validation for post creation
export const checkForImage = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    const err: ApiError = {
      name: "File Required Error",
      message: "You must provide an image file when making a post.",
      status: 400,
    };
    return next(err);
  }

  next();
};
