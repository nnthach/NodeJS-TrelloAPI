import express from "express";
import cors from "cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config//environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import { corsOptions } from "~/config/cors";

const START_SERVER = () => {
  const app = express();
  const port = env.LOCAL_DEV_APP_PORT;

  app.use(cors(corsOptions));

  // Enable req.body json data
  app.use(express.json());

  app.use("/v1", APIs_V1);

  // Middleware error handling
  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(
        `3. Production: Hello ${env.AUTHOR}! Let's start your app on port ${process.env.PORT}`
      );
    });
  } else {
    app.listen(port, () => {
      console.log(
        `3. Dev: Hello ${env.AUTHOR}! Let's start your app on port ${port}`
      );
    });
  }

  exitHook(() => {
    console.log("4. Disconnecting");
    CLOSE_DB();
    console.log("5. Disconnected");
  });
};

(async () => {
  try {
    console.log("1. Connecting to MongoDB CLoud Atlas");
    await CONNECT_DB();
    console.log("2. Connect success to MongoDB Cloud Atlas");

    START_SERVER();
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
})();
