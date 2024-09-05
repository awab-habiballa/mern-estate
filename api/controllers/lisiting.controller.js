import Listing from "../models/lisiting.model.js";

export const createListing = async (req, res, next) => {
  try {
    const lisiting = await Listing.create(req.body);
    return res.status(201).json(lisiting);
  } catch (error) {
    next(error);
  }
};
