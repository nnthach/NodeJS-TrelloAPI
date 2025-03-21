import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/models/validators";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).required().trim().strict().messages({
      // https://stackoverflow.com/questions/48720942/node-js-joi-how-to-display-a-custom-error-messages
      "string.trim": `Title must not have leading or trailing whitespace`,
      "string.empty": `Title cannot be an empty field`,
      "string.min": `Title should have a minimum length of 3`,
      "string.max": `Title should have a maximum length of 50`,
      "any.required": `Title is a required field`,
    }),
    description: Joi.string().min(3).max(250).required().trim().strict(),
    type: Joi.string()
      .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
      .required(),
  });

  try {
    // abortEarly false để trả về tất cả các lỗi của tất cả field
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Validate hợp lệ chuyển tiếp tới Controller
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError);
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    //   errors: new Error(error).message,
    // });
  }
};

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(250).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true, // update cho phep unknown vì có 1 số field ko cần thiết
    });

    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError);
  }
};

export const boardValidation = {
  createNew,
  update,
};
