import Listing from "../models/lisiting.model.js";

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

export const getListing = async (req, res, next) => {
  try {
    const userListing = await Listing.findById(req.params.id);

    if (!userListing) return next(errorHandler(404, "Listing not found!"));

    return res.status(200).json(userListing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { address: { $regex: searchTerm, $options: "i" } },
          ],
          offer,
          furnished,
          parking,
          type,
        },
      },
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $gt: ["$discountPrice", 0] }, // Use discountPrice if greater than 0
              then: "$discountPrice", // Sort by discountPrice
              else: "$regularPrice", // Otherwise, use regularPrice
            },
          },
        },
      },
      {
        $sort: {
          [sort === "regularPrice" ? "effectivePrice" : sort]:
            order === "asc" ? 1 : -1, // Sort by effectivePrice if sorting by price
        },
      },
    ])
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
