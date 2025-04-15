##Logic for LLMService
import S3Service
import logging

class LLMService:

    def __init__(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
            logging.FileHandler("project.log"),
            logging.StreamHandler()]
        )

        self.s3 = S3Service.S3Service()

def uploadResponseToS3(response, file_name, obj_name):
    try:
        logging.info(f"LLM. Writing response to file: {file_name}")
        with open(file_name, 'w') as file:
            file.write(response)
        S3Service.uploadFileToS3(file_name, obj_name)
        logging.info(f"LLM. File uploaded to S3: {obj_name}")

    except Exception as e:
        logging.error(f"LLM. Error uploading file to bucket: {file_name}, Error: {e}")
        return False