import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/models/validators";

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

const createNew = async (data) => {
  try {
    const createdBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(data);

    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: id,
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
