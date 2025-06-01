import json
import boto3
import logging
from dotenv import load_dotenv
import os

# This file contains the S3Service class which is responsible for interacting with the AWS S3 Service.
# It includes methods for uploading, downloading, and listing files in an S3 bucket.

class S3Service:
    def __init__(self, bucket="pubanalyzer-docs"):
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

            self.bucket_name = bucket
            logging.info(f"Setting bucket name to {self.bucket_name}.")

            logging.info("Initializing S3Service.")
            self.s3_client = boto3.client('s3', region_name="us-east-2")
            logging.info("S3 client connection created successfully.")

        except:
            logging.error("Failed to create S3 client. Please check your AWS credentials and region.")
            raise

    def upload_annotation(self, s3Key, file_content):
        try:
            existing = self.get_annotations(s3Key)
            if existing is None:
                existing = []

            annotation_id = file_content.get('id') ##should be a unique id for each annotation
            if not annotation_id:
                raise ValueError("Annotation must include an 'id' field.")

            updated = False
            for idx, annotation in enumerate(existing):
                if annotation.get('id') == annotation_id:
                    existing[idx] = file_content
                    updated = True
                    logging.info(f"Updated existing annotation with ID {annotation_id}.")
                    break

            if not updated:
                existing.append(file_content)
                logging.info(f"Appended new annotation with ID {annotation_id}.")

            json_data = json.dumps(existing)
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=s3Key,
                Body=json_data,
                ContentType='application/json'
            )
            logging.info(f"Annotations saved successfully to {s3Key}.")

        except Exception as e:
            logging.error(f"Failed to upload annotation: {e}")
            raise


    def get_annotations(self, s3Key):
        try:
            logging.info(f"Retrieving annotations from S3 with key {s3Key}.")
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=s3Key)
            content = response['Body'].read().decode('utf-8')
            data = json.loads(content)

            if not isinstance(data, list):
                logging.warning(f"Expected a list in {s3Key}, but got {type(data)}. Converting to list.")
                data = [data]

            return data
        
        except self.s3_client.exceptions.NoSuchKey:
            logging.error(f"No annotations found for key {s3Key}.")
            return None
        
        except Exception as e:
            logging.error(f"Failed to retrieve annotations: {e}")
            raise

    def upload_file(self, file_name, file_path):
        if not os.path.isfile(file_path):
            logging.error(f"File not found at {file_path}")
            raise FileNotFoundError(f"File not found at {file_path}")

        logging.info(f"Uploading {file_path} to the bucket {self.bucket_name} as {file_name}.")

        try:
            self.s3_client.upload_file(file_path, self.bucket_name, file_name)

        except:
            logging.error(f"Failed to upload {file_name} to bucket {self.bucket_name}.")
            raise

    def download_file(self, file_name):
        try:
            return self.s3_client.download_file(self.bucket_name, file_name, file_name)
        except FileNotFoundError:
            logging.error(f"The file {file_name} was not found in bucket {self.bucket_name}.")
            return None
        except:
            logging.error(f"Failed to download {file_name} from bucket {self.bucket_name}.")
            return None

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
