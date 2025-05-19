##Logic for GeminiService
import os
import base64
import logging
import requests
from .BasicLLMService import BasicLLMService
from s3Integration.S3Service import S3Service

class GeminiService(BasicLLMService):

    def __init__(self):
        self.apiKey = os.getenv('GEMINI_API_KEY')
        self.apiUrl = (os.getenv('GEMINI_API_URL'))
        self.s3 = S3Service()

    def imageEncoding(self, file_obj):
        image_bytes = file_obj.read()
        encoded = base64.b64encode(image_bytes).decode('utf-8')
        return f"data:image/png;base64,{encoded}"

    def generateResponse(self, prompt, image=None):
        try:
            headers = {
                "Content-Type": "application/json"
            }

            parts = [{"text": prompt}]

            if image:
                image_data = self.imageEncoding(image)
                parts.append({
                    "inlineData": {
                        "mimeType": "image/png",
                        "data": image_data
                    }
                })

            payload = {
                "contents": [{
                    "role": "user",
                    "parts": parts
                }]
            }

            response = requests.post(
                f"{self.apiUrl}?key={self.apiKey}",
                headers=headers,
                json=payload
            )

            if response.status_code == 200:
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            else:
                logging.error(f"Gemini error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logging.error(f"Gemini. Error generating response: {e}")
            return None
        
    # def generateSummary(self, pmcId):
    #     try:
    #         maxTokens = 150
    #         logging.info(f"LLM. Generating summary for PMC ID: {pmcId}. Max tokens: {maxTokens}")
    #         response = self.client.chat.completions.create(
    #             model="gpt-4-turbo-2024-04-09",
    #             messages=[{"role": "user", "content": "Can you briefly summarize the contents stated within this section. https://www.ncbi.nlm.nih.gov/pmc/articles/ " + pmcId}],
    #             max_tokens=maxTokens
    #         )
    #         return response.choices[0].message.content
    #     except Exception as e:
    #         logging.error(f"LLM. Error generating summary: {e}")
    #         return None

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
