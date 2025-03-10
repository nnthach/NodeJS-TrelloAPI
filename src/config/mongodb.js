import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config//environment";

let trelloDBInstance = null;

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect DB
export const CONNECT_DB = async () => {
  // Connect MG Atlas with uri
  await mongoClientInstance.connect();

  // Connect success => take db name
  trelloDBInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

// Dùng để export trelloDBInstance after connect success to MongoDb for reuse anywhere in code
export const GET_DB = () => {
  if (!trelloDBInstance) throw new Error("Connect to Database fail");
  return trelloDBInstance;
};

// Close db
export const CLOSE_DB = async () => {
  console.log("Run close_db");
  await mongoClientInstance.close();
};
