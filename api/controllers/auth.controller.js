import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { errorHandler } from "../util/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
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
  const uniqueUser = await User.findOne({ email });
  if (uniqueUser) {
    return next(errorHandler(401, "User is already Exist!"));
  }
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created Susscessfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
