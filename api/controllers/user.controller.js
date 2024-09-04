import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../util/error.js";
import { validationResult } from "express-validator";

export const test = (req, res) => {
  res.json({
    message: "Hello Awab!!",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your account!"));

  //validation for user input
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.path);
    const emailError = errorMessages.includes("email");
    const passwordError = errorMessages.includes("password");

    if (emailError && passwordError) {
      return next(errorHandler(422, "Invalid Email and password!"));
    } else if (emailError) {
      return next(errorHandler(422, "Invalid Email!"));
    } else if (passwordError) {
      return next(errorHandler(422, "Invalid password!"));
    }
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (error) {
    next(error);
  }
};
