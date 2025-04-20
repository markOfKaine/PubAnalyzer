import boto3
import logging
from dotenv import load_dotenv
import os

# This file contains the S3Service class which is responsible for interacting with the AWS S3 Service.
# It includes methods for uploading, downloading, and listing files in an S3 bucket.

class S3Service:
    def __init__(self):
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

            self.bucket_name = "pubanalyzer-articles"
            logging.info(f"Setting bucket name to {self.bucket_name}.")

            logging.info("Initializing S3Service.")
            self.s3_client = boto3.client('s3', region_name="us-east-2")
            logging.info("S3 client connection created successfully.")

        except:
            logging.error("Failed to create S3 client. Please check your AWS credentials and region.")
            raise

    def upload_file(self, file_name, file_content):
        logging.info(f"Uploading {file_content} to the bucket {self.bucket_name} as {file_name}.")

        try:
            self.s3_client.upload_file(file_name, self.bucket_name, file_content)

        except:
            logging.error(f"Failed to upload {file_name} to bucket {self.bucket_name}.")
            raise

    def download_file(self, file_name):
        try:
            self.s3_client.download_file(self.bucket_name, file_name, file_name)
        except FileNotFoundError:
            logging.error(f"The file {file_name} was not found in bucket {self.bucket_name}.")
            raise
        except:
            logging.error(f"Failed to download {file_name} from bucket {self.bucket_name}.")
            raise

    def delete_file(self, file_name):
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_name)
            logging.info(f"Deleted {file_name} from bucket {self.bucket_name}.")
        except FileNotFoundError:
            logging.error(f"The file {file_name} was not found in bucket {self.bucket_name}.")
            raise
        except:
            logging.error(f"Failed to delete {file_name} from bucket {self.bucket_name}.")
            raise

    def list_articles(self):
        try:
            logging.info(f"Listing articles in bucket {self.bucket_name}.")
            response = self.s3_client.list_objects_v2(Bucket=self.bucket_name)
            return [item['Key'] for item in response.get('Contents', [])]
        except:
            logging.error(f"Failed to list articles in bucket {self.bucket_name}.")
            raise

#testing the S3Service class
# s3 = S3Service()
# with open("test.txt", "w") as f:
#     f.write("This is a test file.")
# s3.upload_file("test.txt", "PMCID123456")
# print(s3.list_articles())
# s3.download_file("PMCID123456", "test_downloaded.txt")
# s3.delete_file("PMCID123456")
