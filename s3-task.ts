import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = "martina-bucket"; 

const readFromBucket = async (): Promise<void> => {
  try {
    const listObjectsParams: AWS.S3.ListObjectsV2Request = {
      Bucket: bucketName,
    };
    const response = await s3.listObjectsV2(listObjectsParams).promise();
    const files = response.Contents;

    if (files){
      for (const file of files) {
        const fileKey = file.Key ?? "";
        const extension = fileKey.split(".")[1];
        const getObjectParams: AWS.S3.GetObjectRequest = {
          Bucket: bucketName,
          Key: fileKey,
        };

        if (extension === "txt" || extension === "pdf") {
          const { Body } = await s3.getObject(getObjectParams).promise();
          if (Body) {
            const fileContent = Body.toString("utf-8");
            console.log("File:");
            console.log(fileKey);
            console.log("File content:");
            console.log(fileContent);
          }
        } else {
          console.log("File:");
          console.log(fileKey);
        }
      }
    }

    console.log("Files read successfully");
  } catch (error) {
    console.error("Error", error);
  }
};

const insertFileInBucket = async (
  fileKey: string,
  filePath: string,
  contentType: string
): Promise<void> => {
  try {
    const fileData = await readFile(filePath);

    const putObjectParams: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileData,
      ContentType: contentType,
    };

    await s3.putObject(putObjectParams).promise();
    console.log(`File uploaded to S3 bucket: ${fileKey}`);
  } catch (error) {
    console.error("Error: ", error);
  }
};

const readFile = (filePath: string): Promise<BufferSource> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

(async () => {
  await readFromBucket();

  const fileKey = "file3.txt";
  const filePath = "file3.txt";
  const fileContentType = "text/plain";

  const imageKey = "image.png";
  const imagePath = "image.png";
  const imageContentType = "image/png";

  await insertFileInBucket(fileKey, filePath, fileContentType);
  await insertFileInBucket(imageKey, imagePath, imageContentType);
})();
