import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    console.log("req body", req.body);
    console.log("req query", req.query);
    console.log("req params", req.params);
    console.log("req files", req.files);
    console.log("req cookies", req.cookies);
    console.log("req jwtDecoded", req.jwtDecoded);

    // Điều hướng dữ liệu sang tầng Service
    const createdBoard = await boardService.createNew(req.body);

    // Có kết quả trả về Client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error); // Có error điêu hướng qua middleware error handling
  }
};

const getAllBoard = async (req, res, next) => {
  try {
    const gotAllBoard = await boardService.getAllBoard();

    res.status(StatusCodes.OK).json(gotAllBoard);
  } catch (error) {
    next(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    console.log(boardId);

    const gotBoard = await boardService.getDetail(boardId);

    res.status(StatusCodes.OK).json(gotBoard);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;

    const updatedBoard = await boardService.update(boardId, req.body);

    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetail,
  getAllBoard,
  update,
  moveCardToDifferentColumn,
};
