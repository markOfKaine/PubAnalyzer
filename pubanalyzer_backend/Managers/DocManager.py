from s3Integration.S3Service import S3Service as s3
from singleton_decorator import singleton

@singleton  
class DocManager:
    def __init__(self):
        self.s3Service = s3()
        self.documents = {}
        ##contains doc_id(PMCID) and content
        self.instance = None

    def add_document(self, doc_id, content):
        if not isinstance(doc_id, str) or not isinstance(content, str):
            raise ValueError("Document ID and content cannot be None or a non-string.")

        if doc_id in self.documents:
            raise ValueError(f"Document with ID {doc_id} already exists.")

        self.s3Service.upload_file(doc_id, content)
        self.documents[doc_id] = content

    def get_document(self, doc_id):
        file = self.s3Service.download_file(doc_id)
        return file

    def remove_document(self, doc_id, admin):
        ##should be an admin only feature
        if admin:
            if doc_id in self.documents:
                self.s3Service.delete_file(doc_id, doc_id)
                del self.documents[doc_id]
                return True
            return False
    
    def list_documents(self):
        return self.s3Service.list_articles()