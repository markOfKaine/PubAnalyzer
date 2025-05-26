import logging
from s3Integration.S3Service import S3Service as s3
from singleton_decorator import singleton

@singleton  
class DocManager:
    def __init__(self):

        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
            logging.FileHandler("project.log"),
            logging.StreamHandler()]
            )
        
        self.s3Service = s3()
        self.documents = {}
        self.instance = None

    def add_document(self, pmcID, filepath):
        filepath = str(filepath)
        if not isinstance(pmcID, str) or not isinstance(filepath, str):
            logging.error("Document ID and content must be strings.")

        if pmcID in self.documents:
            logging.warning(f"Document with ID {pmcID} already exists.")

        self.s3Service.upload_file(pmcID, filepath)
        logging.info(f"Document {pmcID} uploaded successfully.")
        self.documents[pmcID] = filepath

    def get_document(self, pmcID):
        file = self.s3Service.download_file(pmcID)
        if not file:
            logging.error(f"Document with ID {pmcID} not found.")
            return None
        return file

    def remove_document(self, pmcID, admin):
        ##should be an admin only feature
        if admin:
            if pmcID in self.documents:
                self.s3Service.delete_file(pmcID, pmcID)
                del self.documents[pmcID]
                return True
            return False
    
    def list_documents(self):
        return self.s3Service.list_articles()