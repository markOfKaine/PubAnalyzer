import logging
from abc import ABC, abstractmethod

class BasicLLMService(ABC):

    def __init__(self):
            logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
            logging.FileHandler("project.log"),
            logging.StreamHandler()]
        )

    @abstractmethod
    def generateResponse(self, prompt, image_file=None):
        pass
