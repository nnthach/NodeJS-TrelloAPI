import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import ApiError from "~/utils/ApiError";
import { WHITELIST_DOMAINS } from "~/utils/constants";

export const corsOptions = {
  origin: function (origin, callback) {
    // console.log("origin cors", origin);

    // allow call api on postman if env is dev
    if (!origin && env.BUILD_MODE === "dev") {
      return callback(null, true);
    }

    // check origin is a domain allowed ?
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    // if domain not allow return false
    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allow by CORS`)
    );
  },

  optionsSuccessStatus: 200,

  // Cors allow receive cookies from req
  credentials: true,
};
