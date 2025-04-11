from Services import S3Service as s3

class DocManager:
    def __init__(self):    
        self.s3Service = s3.S3Service()
        self.documents = {}

    def add_document(self, doc_id, content):
        if doc_id is None | doc_id.isInstance(str) == False | content is None | content.isInstance(str) == False:
            raise ValueError("Document ID and content cannot be None or a non-string.")

        elif doc_id in self.documents:
            raise ValueError(f"Document with ID {doc_id} already exists.")
        
        else:
            self.s3Service.upload_file(doc_id, content)
            self.documents[doc_id] = content

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