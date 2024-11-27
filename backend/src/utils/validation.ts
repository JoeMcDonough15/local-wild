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

    const err: ApiError = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
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

//backend validation for post creation
export const validatePost = [
  check("imageFile")
    .exists({ checkFalsy: true })
    .withMessage("You must include an image file for a post."),

  check("title")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("You must include a title for your post."),
  handleValidationErrors,
];
