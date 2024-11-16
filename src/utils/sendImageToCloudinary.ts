/* eslint-disable no-console */
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import config from "../config";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: config.clodinary.cloud_name,
  api_key: config.clodinary.api_key,
  api_secret: config.clodinary.api_secret, // Click 'View Credentials' below to copy your API secret
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    // Upload an image
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName,
      },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log("File is deleted.");
          }
        });
      }
    );
  });
};
