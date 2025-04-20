import logging

class LoggerService:

    def __init__(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler("project.log"),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info("LoggerService initialized.")

    def uploadLogs(self):
        ##TODO: should this connect to s3 bucket, RDS, or some other service?
        return