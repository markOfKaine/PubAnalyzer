import boto3 # type: ignore
import logging
from dotenv import load_dotenv # type: ignore
import os

# This file contains the S3Service class which is responsible for interacting with the AWS S3 Service.
# It includes methods for uploading, downloading, and listing files in an S3 bucket.

class S3Service:
    def __init__(self, bucket_name=None):
        try:        
            load_dotenv()
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                handlers=[
                logging.FileHandler("project.log"),
                logging.StreamHandler()]
                )
            logging.info("Initializing Logging.")

            self.bucket_name = bucket_name if bucket_name else "pubanalyzer-articles"
            logging.info(f"Setting bucket name to {self.bucket_name}.")

            logging.info("Initializing S3Service.")
            self.s3_client = boto3.client('s3', region_name="us-east-2")
            logging.info("S3 client connection created successfully.")

        except:
            logging.error("Failed to create S3 client. Please check your AWS credentials and region.")
            raise

    def upload_file(self, file_name, object_name=None, bucket_name=None):

        ##DocManager should have already validated that the file is not a duplicate
        ##Object name should be the PMC ID of the article.
        target_bucket = bucket_name if bucket_name else self.bucket_name
        logging.info(f"Uploading {file_name} to the bucket {target_bucket} as {object_name}.")

        try:
            if object_name is None:
                object_name = os.path.basename(file_name)
            self.s3_client.upload_file(file_name, target_bucket, object_name)
            return True

        except:
            logging.error(f"Failed to upload {file_name} to bucket {target_bucket}.")
            raise

    def download_file(self, object_name, file_name, bucket_name=None):
        target_bucket = bucket_name if bucket_name else self.bucket_name
        try:
            self.s3_client.download_file(target_bucket, object_name, file_name)
            logging.info(f"Downloaded {object_name} from bucket {target_bucket} to {file_name}.")
            return True

        except:
            logging.error(f"Failed to download {object_name} from bucket {target_bucket}.")
            raise

    def delete_file(self, object_name, bucket_name=None):
        target_bucket = bucket_name if bucket_name else self.bucket_name
        try:
            self.s3_client.delete_object(Bucket=target_bucket, Key=object_name)
            logging.info(f"Deleted {object_name} from bucket {target_bucket}.")
            return True

        except:
            logging.error(f"Failed to delete {object_name} from bucket {target_bucket}.")
            raise

    def list_articles(self, bucket_name=None):
        target_bucket = bucket_name if bucket_name else self.bucket_name
        try:
            logging.info(f"Listing articles in bucket {target_bucket}.")
            response = self.s3_client.list_objects_v2(Bucket=target_bucket)
            return [item['Key'] for item in response.get('Contents', [])]
        
        except:
            logging.error(f"Failed to list articles in bucket {target_bucket}.")
            raise


