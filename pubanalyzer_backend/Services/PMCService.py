import requests
import logging
import tarfile
import hashlib
from pathlib import Path
from dotenv import load_dotenv
from s3Integration.S3Service import S3Service

def setup_logger(name: str, level=logging.INFO):
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("project.log"),
            logging.StreamHandler()
        ]
    )
    logger = logging.getLogger(name)
    logger.setLevel(level)
    return logger

class PMCService:
    """
    Downloads PMC tarballs, extracts the PDF, uploads the PDF to S3,
    and cleans up local files.
    """
    DEFAULT_OA_API_URL = "https://www.ncbi.nlm.nih.gov/pmc/utils/oa/oa.fcgi"
    PDF_EXTENSION = ".pdf"
    TARBALL_EXTENSION = ".tar.gz"

    def __init__(
        self,
        temp_local_dir: str = "temp_local",
        api_url: str = None,
        timeout: int = 30,
        log_level: int = logging.INFO
    ):
        load_dotenv()
        self.logger = setup_logger("PMCService", log_level)
        self.s3 = S3Service()
        self.api_url = api_url or self.DEFAULT_OA_API_URL
        self.timeout = timeout

        self.temp_dir = Path(temp_local_dir)
        self.temp_dir.mkdir(parents=True, exist_ok=True)

    def fetch_tarball_url(self, pmcid: str) -> str:
        """
        Fetch the HTTPS URL of the PMC tarball for the given PMCID.
        """
        self.logger.info(f"Fetching tarball URL for {pmcid}")
        resp = requests.get(self.api_url, params={"id": pmcid}, timeout=self.timeout)
        resp.raise_for_status()
        
        # parse XML
        from xml.etree import ElementTree as ET
        root = ET.fromstring(resp.content)
        rec = root.find('.//record')
        if rec is None:
            raise ValueError(f"No record found for {pmcid}")
        for link in rec.findall('link'):
            if link.attrib.get('format') == 'tgz':
                url = link.attrib['href']
                if url.startswith('ftp://'):
                    url = url.replace('ftp://', 'https://')
                self.logger.debug(f"Tarball URL: {url}")
                return url
        raise ValueError(f"No tarball link found for {pmcid}")

    def download_extract_and_upload(self, pmcid: str) -> bool:
        """
        Full workflow: download tarball, extract PDF, upload PDF to S3,
        then clean up local files.
        Returns True on success, False otherwise.
        """
        try:
            url = self.fetch_tarball_url(pmcid)
            self.logger.info(f"Downloading tarball from {url}")
            
            # download tarball
            tar_path = self.temp_dir / f"{pmcid}{self.TARBALL_EXTENSION}"
            checksum = hashlib.md5()
            with requests.get(url, stream=True, timeout=self.timeout) as r:
                r.raise_for_status()
                with open(tar_path, 'wb') as tf:
                    for chunk in r.iter_content(8192):
                        checksum.update(chunk)
                        tf.write(chunk)
            self.logger.debug(f"Downloaded {tar_path} (MD5: {checksum.hexdigest()})")

            # extract PDF
            with tarfile.open(tar_path, 'r:gz') as tar:
                pdf_members = [m for m in tar.getmembers() if m.name.endswith(self.PDF_EXTENSION)]
                if not pdf_members:
                    self.logger.error("No PDF found in tarball")
                    return False
                member = pdf_members[0]
                pdf_path = self.temp_dir / f"{pmcid}{self.PDF_EXTENSION}"
                with open(pdf_path, 'wb') as pf:
                    pf.write(tar.extractfile(member).read())
            self.logger.info(f"Extracted PDF to {pdf_path}")

            # upload PDF
            s3_key = f"{pmcid}{self.PDF_EXTENSION}"
            self.s3.upload_file(str(pdf_path), s3_key)
            self.logger.info(f"Uploaded PDF to S3 as {s3_key}")
            return True

        except Exception as e:
            self.logger.error(f"Error processing {pmcid}: {e}")
            return False

        finally:
            # cleanup local files
            if 'tar_path' in locals() and tar_path.exists():
                tar_path.unlink()
                self.logger.debug(f"Deleted local tarball {tar_path}")
            if 'pdf_path' in locals() and pdf_path.exists():
                pdf_path.unlink()
                self.logger.debug(f"Deleted local PDF {pdf_path}")

# test 
# download_extract_and_upload("PMC1234567") <-- not a real PMCID 