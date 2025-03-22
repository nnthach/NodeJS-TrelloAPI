import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
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

const getAllBoard = async () => {
  try {
    const gotAllBoard = await boardModel.getAllBoard();

    if (!gotAllBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board list not found");
    }

    return gotAllBoard;
  } catch (error) {
    throw error;
  }
};

const getDetail = async (boardId) => {
  try {
    const gotBoard = await boardModel.getDetail(boardId);

    if (!gotBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    // tạo ra 1 board mới ko ảnh hưởng cái cũ
    const resBoard = cloneDeep(gotBoard);

    // cards đang nằm ngoài columns và trong boards => đưa nó vào trong columns
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
    });

    // delete cards trong boards vì nó đã nằm trong columns như ta làm
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };

    console.log("data tto update", updateData);

    const updatedBoard = await boardModel.update(boardId, updateData);

    console.log("updatte at service", updatedBoard);
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });

    await cardModel.update(reqBody.currentCardId,{
      columnId: reqBody.nextColumnId
    })

    return {
      updateResult: "Successfully",
    };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetail,
  getAllBoard,
  update,
  moveCardToDifferentColumn,
};
