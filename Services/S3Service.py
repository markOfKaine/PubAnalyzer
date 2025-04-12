import boto3
import logging

# This file contains the S3Service class which is responsible for interacting with the AWS S3 Service.
# It includes methods for uploading, downloading, and listing files in an S3 bucket.

##TODO : Create Bucket and IAM role.

class S3Service:
    def __init__(self, region_name):
        try:        
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                handlers=[
                logging.FileHandler("project.log"),
                logging.StreamHandler()]
                )
            logging.info("Initializing Logging.")

            self.bucket_name = "pubanalyzer-articles"
            logging.info(f"Setting bucket name to {self.bucket_name}.")

            logging.info("Initializing S3Service.")
            self.s3_client = boto3.client('s3', region_name=region_name)
            logging.info("S3 client connection created successfully.")

        except:
            logging.error("Failed to create S3 client. Please check your AWS credentials and region.")
            raise

    @staticmethod
    def upload_file(self, file_name, object_name=None):
        ##DocManager should have already validated that the file is not a duplicate
        ##Object name should be the PMC ID of the article.
        logging.info(f"Uploading {file_name} to the bucket {self.bucket_name} as {object_name}.")

        try:
            if object_name is None:
                object_name = file_name
            self.s3_client.upload_file(file_name, self.bucket_name, object_name)

        except:
            logging.error(f"Failed to upload {file_name} to bucket {self.bucket_name}.")
            raise

    @staticmethod
    def download_file(self, object_name, file_name):
        try:
            self.s3_client.download_file(self.bucket_name, object_name, file_name)

        except:
            logging.error(f"Failed to download {object_name} from bucket {self.bucket_name}.")
            raise

    @staticmethod
    def delete_file(self, object_name):
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=object_name)
            logging.info(f"Deleted {object_name} from bucket {self.bucket_name}.")

        except:
            logging.error(f"Failed to delete {object_name} from bucket {self.bucket_name}.")
            raise

    @staticmethod
    def list_articles(self):
        try:
            logging.info(f"Listing articles in bucket {self.bucket_name}.")
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
            return [item['Key'] for item in response.get('Contents', [])]
        
        except:
            logging.error(f"Failed to list articles in bucket {self.bucket_name}.")
            raise
