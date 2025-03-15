import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { slugify } from "~/utils/Formatters";

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //1. Call to Model and save newBoard to Database
    const createdBoard = await boardModel.createNew(newBoard);
    console.log("createdBOARD in boardService", createdBoard);

    //2. Return expect value from newBoard for render (tùy dự án)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    console.log("get id from new board", getNewBoard);

    //3. Another logic function....

    //4. Return result
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};
