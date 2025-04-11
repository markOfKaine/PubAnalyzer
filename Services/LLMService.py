##Logic for LLMService
import S3Service
import logging

def uploadResponseToS3(response, file_name, obj_name):
    try:
        logging.info(f"Writing response to file: {file_name}")
        with open(file_name, 'w') as file:
            file.write(response)
        S3Service.uploadFileToS3(file_name, obj_name)
        logging.info(f"File uploaded to S3: {obj_name}")

    except Exception as e:
        logging.error(f"Error uploading file to bucket: {file_name}, Error: {e}")
        return False