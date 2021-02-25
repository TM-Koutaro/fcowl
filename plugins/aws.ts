import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
  accessKeyId: process.env.AWS_S3_ACCESSKEYID,
  secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY,
  region: process.env.AWS_S3_REGION
})

export default s3
