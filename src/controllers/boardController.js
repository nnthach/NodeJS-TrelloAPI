import { StatusCodes } from "http-status-codes";
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

    // Có kết quả trả về Client
    res
      .status(StatusCodes.CREATED)
      .json({ message: "POST from Controller APIs create new board" });
  } catch (error) {
    next(error); // Có error điêu hướng qua middleware error handling
  }
};

export const boardController = {
  createNew,
};
