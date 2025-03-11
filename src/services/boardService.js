import ApiError from "~/utils/ApiError";
import { slugify } from "~/utils/Formatters";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    // Call to Model and save newBoard to Database

    // Another logic function....

    // Return result
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
