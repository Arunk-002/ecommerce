const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
require('dotenv').config()

// Configure the S3 client
const s3Client = new S3Client({
  region:"ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});// for authorisation
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'stackup-bucket',
    key: (req, file, cb) => {
        console.log('Uploading file:', file);
        cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = {upload};


