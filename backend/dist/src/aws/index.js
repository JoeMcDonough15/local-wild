// all code that interacts with aws goes here and can be easily exported
import AWS from "aws-sdk";
import multer from "multer";
const NAME_OF_BUCKET = process.env.AWS_BUCKET_NAME;
//  make sure to set environment variables in production for:
//  AWS_ACCESS_KEY_ID
//  AWS_SECRET_ACCESS_KEY
//  and aws will automatically use those environment variables
export const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
// --------------------------- Public UPLOAD ------------------------
export const singlePublicFileUpload = async (file) => {
    const { originalname, mimetype, buffer } = await file;
    const path = require("path");
    // name of the file in your S3 bucket will be the date in ms plus the extension name
    const Key = new Date().getTime().toString() + path.extname(originalname);
    const uploadParams = {
        Bucket: NAME_OF_BUCKET || "",
        Key,
        Body: buffer,
        ACL: "public-read",
    };
    const result = await s3.upload(uploadParams).promise();
    // save the name of the file in your bucket as the key in your database to retrieve for later
    return result.Location;
};
// --------------------------- Storage ------------------------
const storage = multer.diskStorage({
    destination: "tmp/uploads", // multer should create this directory if it doesn't exist
});
export const singleMulterUpload = (nameOfKey //'image' comes in, from the form field's name attribute
) => multer({ storage: storage }).single(nameOfKey);
