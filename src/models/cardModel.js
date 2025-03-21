import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/models/validators";

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// 1.Validate
const validateBeforeCreate = async (data) => {
  const validate = await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
  return validate;
};

// 2. Create
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    console.log("valid data", validData);

    const changeIdTypeToObjectId = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId),
    };

    const createdCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(changeIdTypeToObjectId);

    return createdCard;
  } catch (error) {
    throw new Error(error);
  }
};

// 3. Return expect value for render
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id), // để luôn luôn là Obj Id trong mongodb
      });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
};
