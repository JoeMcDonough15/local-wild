import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import multer from "multer";
const NAME_OF_BUCKET = process.env.AWS_BUCKET_NAME;
export const singlePublicFileUpload = async (file) => {
    const { originalname, buffer } = file;
    const Key = new Date().getTime().toString() + path.extname(originalname);
    const client = new Upload({
        client: new S3Client({ region: "us-east-1" }),
        params: {
            Bucket: NAME_OF_BUCKET,
            Key: Key,
            Body: buffer,
            ACL: "public-read",
        },
    }).done();
    const imageUrl = (await client).Location;
    if (!imageUrl) {
        throw new Error("failed to upload image");
    }
    return imageUrl;
};
const storage = multer.memoryStorage();
export const singleMulterUpload = (nameOfKey //'image' comes in, from the form field's name attribute
) => multer({ storage: storage }).single(nameOfKey);
