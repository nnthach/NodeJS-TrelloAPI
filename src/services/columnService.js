import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    };

    //1. Call to Model and save newColumn to Database
    const createdColumn = await columnModel.createNew(newColumn);
    console.log("createdColumn in ColumnService", createdColumn);

    //2. Return expect value from newColumn for render (tùy dự án)
    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );
    console.log("get id from new Column", getNewColumn);

    //3. Another logic function....
    if (getNewColumn) {
      // Xử lý cấu trúc data
      // getNewColumn.cards = []

      // Cập nhật mảng columnOrderIds trong boards
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    //4. Return result
    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };

    console.log("data tto update", updateData);

    const updatedColumn = await columnModel.update(columnId, updateData);

    console.log("updatte at service", updatedColumn);
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
};
