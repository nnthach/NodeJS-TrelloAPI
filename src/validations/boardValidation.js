import Joi from "joi";
import { StatusCodes } from "http-status-codes";

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
    description: Joi.string()
      .min(3)
      .max(250)
      .required()
      .trim()
      .strict()
      .messages({
        "string.trim": `Description must not have leading or trailing whitespace`,
        "string.empty": `Description cannot be an empty field`,
        "string.min": `Description should have a minimum length of 3`,
        "string.max": `Description should have a maximum length of 250`,
        "any.required": `Description is a required field`,
      }),
  });

  try {
    // abortEarly false để trả về tất cả các lỗi của tất cả field
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Validate hợp lệ chuyển tiếp tới Controller
    next();
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message,
    });
  }
};

export const boardValidation = {
  createNew,
};
