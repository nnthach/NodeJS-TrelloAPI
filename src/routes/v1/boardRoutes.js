import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardController } from "~/controllers/boardController";
import { boardValidation } from "~/validations/boardValidation";

const Router = express.Router();

Router.route("/")
  .get(boardController.getAllBoard)
  .post(boardValidation.createNew, boardController.createNew);

Router.route("/:id").get(boardController.getDetail).put();
export const boardRoutes = Router;
