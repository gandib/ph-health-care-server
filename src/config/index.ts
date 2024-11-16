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
    jwt_reset_password_secret: process.env.JWT_RESET_PASSWORD_SECRET,
    jwt_reset_password_expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
  },
  reset_password_link: process.env.RESET_PASSWORD_LINK,
  sendEmail: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  clodinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
};
