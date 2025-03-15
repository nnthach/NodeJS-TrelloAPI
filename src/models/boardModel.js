import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/models/validators";

/*
* Phải thêm validate ở tầng Model vì:
- Lỗi có thể xuất hiện sau tâng Validation (ex: Controller / Service)
- Model validation nhiêu field hơn
- Validation chỉ validate những field mà client gửi đến
- Cho nên validate ở Model là cần thiết trước khi lưu vao database 
*/

// Define Collection (Name and Schema)
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(3).max(50).required().trim().strict(),
  slug: Joi.string().min(3).required().trim().strict(),
  description: Joi.string().min(3).max(250).required().trim().strict(),

  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// 1. Validate
const validateBeforeCreate = async (data) => {
  const validate = await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
  return validate;
};

// 2. Create
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    console.log("valid data", validData);

    const createdBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(validData);

    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

// 3. Return expect value for render
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id), // để luôn luôn là Obj Id trong mongodb
      });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
};
