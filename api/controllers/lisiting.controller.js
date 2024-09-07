import Listing from "../models/lisiting.model.js";
import mongoose from "mongoose";

import { errorHandler } from "../util/error.js";

export const createListing = async (req, res, next) => {
  try {
    const lisiting = await Listing.create(req.body);
    return res.status(201).json(lisiting);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const userListing = await Listing.findById(req.params.id);

  if (!userListing) return next(errorHandler(404, "listing not found!"));

  if (userListing.userRef !== req.user.id)
    return next(errorHandler(401, "You can only delete your own listing"));

  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const userListing = await Listing.findById(req.params.id);
  console.log(userListing);

  if (!userListing) return next(errorHandler(404, "Listing not found!"));

  if (userListing.userRef !== req.user.id)
    return next(errorHandler(401, "You can only update your own listings!"));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
