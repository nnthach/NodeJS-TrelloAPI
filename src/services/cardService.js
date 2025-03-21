import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
    };

    //1. Call to Model and save newCard to Database
    const createdCard = await cardModel.createNew(newCard);
    console.log("createdCard in CardService", createdCard);

    //2. Return expect value from newCard for render (tùy dự án)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId);
    console.log("get id from new Card", getNewCard);

    //3. Another logic function....
    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard);
    }

    //4. Return result
    return getNewCard;
  } catch (error) {
    throw error;
  }
};

export const cardService = {
  createNew,
};
