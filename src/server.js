import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config//environment";
import { APIs_V1 } from "~/routes/v1";

const START_SERVER = () => {
  const app = express();
  const port = env.APP_PORT;

  app.use("/v1", APIs_V1);

  app.listen(port, () => {
    console.log(`3. Hello ${env.AUTHOR}! Let's start your app on port ${port}`);
  });

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
