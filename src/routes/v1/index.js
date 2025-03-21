import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRoutes } from "~/routes/v1/boardRoutes";
import { cardRoutes } from "~/routes/v1/cardRoutes";
import { columnRoutes } from "~/routes/v1/columnRoutes";

const Router = express.Router();

// Check api v1 status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use" });
});

// Board api
Router.use("/boards", boardRoutes);

// Card api
Router.use("/cards", cardRoutes);

// Column api
Router.use("/columns", columnRoutes);

export const APIs_V1 = Router;
