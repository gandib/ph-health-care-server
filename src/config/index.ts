import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_dev: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
