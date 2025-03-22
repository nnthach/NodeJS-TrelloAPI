import express from "express";
import { boardController } from "~/controllers/boardController";
import { boardValidation } from "~/validations/boardValidation";

const Router = express.Router();

Router.route("/")
  .get(boardController.getAllBoard)
  .post(boardValidation.createNew, boardController.createNew);

Router.route("/:id")
  .get(boardController.getDetail)
  .put(boardValidation.update, boardController.update);

Router.route('/supports/moving_cards')
  .put(boardValidation.moveCardToDifferentColumn,boardController.moveCardToDifferentColumn)
export const boardRoutes = Router;
