##Logic for LLMService
from openai import OpenAI
from s3Integration.S3Service import S3Service
import os
from dotenv import load_dotenv
import logging

class SeekService:

    def __init__(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
            logging.FileHandler("project.log"),
            logging.StreamHandler()]
        )

        load_dotenv()
        self.client = OpenAI(api_key=os.getenv('SEEK_API_KEY'), base_url="https://api.deepseek.com/v1")
        self.s3 = S3Service()

    def generateResponse(self, prompt, max_tokens=150):
        try:
            logging.info(f"LLM. Generating response. Max tokens: {max_tokens}")
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[{"role": "user", "content": "Can you briefly summarize the contents stated within this section. " + prompt}],
                max_tokens=max_tokens
            )
            return response.choices[0].message.content

        except Exception as e:
            logging.error(f"LLM. Error generating response: {e}")
            return None

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
