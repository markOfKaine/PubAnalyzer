from Services.S3Service import S3Service

class DocManager:
    def __init__(self):    
        self.documents = {}
        self.s3Service = S3Service()

    def add_document(self, doc_id, file_path):
        if doc_id is None or not isinstance(doc_id, str) or file_path is None:
            raise ValueError("Document ID cannot be None and must be a string. File path cannot be None.")

        all_docs = self.list_documents()
        if doc_id in all_docs:
            raise ValueError(f"Document with ID {doc_id} already exists.")

        self.s3Service.upload_file(file_path, doc_id)
        self.documents[doc_id] = file_path
        return True

    def get_document(self, doc_id):
        return self.s3Service.download_file(doc_id)

    def remove_document(self, doc_id):
        ##should be an admin only feature
        if doc_id in self.documents:
            self.s3Service.delete_file(doc_id)
            del self.documents[doc_id]
            return True
        return False
    
    def list_documents(self):
        return self.s3Service.list_articles()