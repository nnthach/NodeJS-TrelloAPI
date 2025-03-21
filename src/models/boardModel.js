import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/models/validators";
import { BOARD_TYPES } from "~/utils/constants";

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
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

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

// Get All Board
const getAllBoard = async () => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find()
      .toArray();

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Get by ID
const getDetail = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            // WHERE <foreignField> = <collection.localField>
            localField: "_id",
            foreignField: "boardId",
            as: "columns", // <output array field>
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            // WHERE <foreignField> = <collection.localField>
            localField: "_id",
            foreignField: "boardId",
            as: "cards", // <output array field>
          },
        },
      ])
      .toArray();

    return result[0] || null; // take single board by id
  } catch (error) {
    throw new Error(error);
  }
};

// Cập nhật push giá trị columnId vào mảng columnOrderIds
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(column.boardId),
        },
        {
          $push: {
            columnOrderIds: new ObjectId(column._id),
          },
        },
        { returnDocument: "after" }
      );

    return result.value; // findOneAndUpdate trả về kqua phải .value để nhận
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetail,
  getAllBoard,
  pushColumnOrderIds,
};
