import requests
#from Managers.DocManager import DocManager as docManager
import S3Service as s3
import logging

class PMCService:

    def __init__(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
            logging.FileHandler("project.log"),
            logging.StreamHandler()]
    )
        self.s3Service = s3.S3Service()

    def fetch_pmc_article(self, pmcid):
        url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pmc&id={pmcid}&retmode=xml"
        response = requests.get(url)
        logging.info(f"Fetching PMC article with ID: {pmcid}")

        logging.info(f"Response status code: {response.status_code}")
        if response.status_code == 200:
            with open(f"{pmcid}.xml", "w") as f:
                f.write(response.text)
            f.close()

            logging.info(f"PMC article {pmcid} fetched successfully.")

            # docManager.add_document(pmcid, response.text)
            logging.info(f"Document {pmcid} added to DocManager.")

            self.s3Service.upload_file(f"{pmcid}.xml", f"{pmcid}")
            logging.info(f"Document {pmcid} uploaded to S3 bucket.")
            
        else:
            logging.ERROR(f"Error fetching PMC articles: {response.status_code}")
            raise Exception(f"Error fetching PMC articles: {response.status_code}")

##testing the PMCService class
# PMCService.fetch_pmc_article("PMC123467")