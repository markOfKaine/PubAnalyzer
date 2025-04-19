import requests # type: ignore
from Managers.DocManager import DocManager
from Services.S3Service import S3Service
import logging
import tarfile
import xml.etree.ElementTree as ET
from pathlib import Path 
import hashlib 



class PMCDownloader:
    """
    A tool for downloading and extracting PDF files from the PubMed Central Open Access archive
    and storing them in AWS S3.
    
    This class handles fetching metadata, downloading tarballs, extracting PDF files,
    and storing them in S3 buckets.
    """
    
    DEFAULT_OA_API_URL = "https://www.ncbi.nlm.nih.gov/pmc/utils/oa/oa.fcgi"
    PDF_EXTENSION = ".pdf"
    TARBALL_EXTENSION = ".tar.gz"
    
    def __init__(
        self, 
        pdf_bucket_name: str = "pubanalyzer-articles",
        temp_bucket_name: str = "pubanalyzer-temp",
        temp_local_dir: str = "temp_local",
        api_url: str = None,
        timeout: int = 30,
        log_level: int = logging.INFO
    ):
        """
        Initialize the PMCDownloader with configurable parameters.
        
        Args:
            pdf_bucket_name: S3 bucket name for PDFs
            temp_bucket_name: S3 bucket name for temporary tarballs
            temp_local_dir: Directory for temporary local storage
            api_url: Custom API URL (uses default if None)
            timeout: Request timeout in seconds
            log_level: Logging level (default: INFO)
        """
        self.s3Service = S3Service() 
        self.docManager = DocManager() 
        
        self.temp_local_dir = Path(temp_local_dir)
        self.temp_local_dir.mkdir(exist_ok=True, parents=True)
        
        self.api_url = api_url or self.DEFAULT_OA_API_URL
        self.timeout = timeout
        
        self._setup_logging(log_level)
        
    def _setup_logging(self, log_level: int) -> None:
        """Set up logging configuration."""
        self.logger = logging.getLogger("PMCDownloader")
        self.logger.setLevel(log_level)
        
        # Create console handler if none exists
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
    
    def fetch_tarball_url(self, pmcid: str) -> str:
        """
        Fetch the tarball URL for a given PMC ID.
        
        Args:
            pmcid: PubMed Central ID (format: PMCxxxxxxx)
            
        Returns:
            URL to the tarball file
            
        Raises:
            ValueError: If the tarball URL cannot be found
        """
        self.logger.info(f"Fetching metadata for {pmcid}")
        
        try:
            response = requests.get(self.api_url, params={"id": pmcid}, timeout=self.timeout)
            response.raise_for_status()
            
            root = ET.fromstring(response.content)
            record = root.find(".//record")
            
            if record is None:
                raise ValueError(f"No record found for {pmcid}")
            
            for link in record.findall("link"):
                if link.attrib.get("format") == "tgz":
                    url = link.attrib["href"]
                    # Convert FTP URLs to HTTPS
                    if url.startswith("ftp://"):
                        url = url.replace("ftp://", "https://")
                    self.logger.debug(f"Found tarball URL: {url}")
                    return url
            
            raise ValueError(f"No tarball found for {pmcid}")
            
        except ET.ParseError:
            raise ValueError(f"Failed to parse XML response for {pmcid}")
        except requests.RequestException as e:
            raise ValueError(f"Request failed: {str(e)}")

    def download_tarball(self, pmcid: str, tar_url: str) -> Path:
        """
        Download a tarball from the specified URL to a local temp file.
        
        Args:
            pmcid: PubMed Central ID
            tar_url: URL to the tarball file
            
        Returns:
            Path to the downloaded tarball file
            
        Raises:
            ValueError: If the download fails
        """
        tar_path = self.temp_local_dir / f"{pmcid}{self.TARBALL_EXTENSION}"
        self.logger.info(f"Downloading tarball from {tar_url}")
        
        try:
            response = requests.get(tar_url, stream=True, timeout=self.timeout)
            response.raise_for_status()
            
            checksum = hashlib.md5()
            
            with open(tar_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    checksum.update(chunk)
                    f.write(chunk)
            
            self.logger.debug(f"Download complete: {tar_path} (MD5: {checksum.hexdigest()})")
            
            tar_object_name = f"temp_{pmcid}{self.TARBALL_EXTENSION}"
            self.s3Service.upload_file(str(tar_path), tar_object_name)
            self.logger.info(f"Uploaded tarball to S3 as {tar_object_name}")
            
            return tar_path
            
        except requests.RequestException as e:
            raise ValueError(f"Failed to download tarball: {str(e)}")

    def extract_pdf(self, pmcid: str, tar_path: Path) -> list:
        """
        Extract PDF files from a tarball and upload to S3.
        
        Args:
            pmcid: PubMed Central ID
            tar_path: Path to the tarball file
            
        Returns:
            List of S3 object keys for the extracted PDFs
            
        Raises:
            tarfile.ReadError: If the tarball is corrupt or invalid
        """
        self.logger.info(f"Extracting PDFs from {tar_path}")
        extracted_files = []
        
        try:
            with tarfile.open(tar_path, "r:gz") as tar:
                pdf_members = [m for m in tar.getmembers() if m.name.endswith(self.PDF_EXTENSION)]
                
                if not pdf_members:
                    self.logger.warning(f"No PDFs found in tarball: {tar_path}")
                    return []
                
                s3_pdf_key = f"{pmcid}{self.PDF_EXTENSION}"

                if len(pdf_members) > 1:
                    self.logger.warning(f"Multiple PDFs found in tarball for {pmcid}, using the first one.")
                
                temp_pdf_path = self.temp_local_dir / f"{pmcid}{self.PDF_EXTENSION}"

                with open(temp_pdf_path, "wb") as out_file:
                    out_file.write(tar.extractfile(pdf_members[0]).read())

                self.docManager.add_document(s3_pdf_key, str(temp_pdf_path))
                self.logger.info(f"✅ PDF extracted and uploaded to S3 as {s3_pdf_key}")
                extracted_files.append(s3_pdf_key)
                
                if temp_pdf_path.exists():
                    temp_pdf_path.unlink()
                
                # If there are multiple PDFs, log them but don't extract
                if len(pdf_members) > 1:
                    self.logger.info(f"Additional PDFs in tarball were not extracted: {[m.name for m in pdf_members[1:]]}")
                    
        except tarfile.ReadError:
            self.logger.error(f"Failed to read tarball: {tar_path}")
            raise
            
        return extracted_files

    def cleanup_tarball(self, tar_path: Path) -> None:
        """
        Remove a downloaded tarball file from local storage and S3.
        
        Args:
            tar_path: Path to the tarball file
        """
        if tar_path.exists():
            tar_path.unlink()
            self.logger.info(f"Removed local tarball: {tar_path}")
        
        tar_object_name = f"temp_{tar_path.name}"
        self.s3Service.delete_file(tar_object_name)
        self.logger.info(f"🧹 Removed tarball from S3: {tar_object_name}")

    def run(self, pmcid: str) -> list:
        """
        Process a single PMC ID: fetch metadata, download tarball, extract PDFs, upload to S3.
        
        Args:
            pmcid: PubMed Central ID
            
        Returns:
            List of S3 object keys for extracted PDF files
        """
        self.logger.info(f"Processing {pmcid}...")
        extracted_files = []
        
        try:
            tar_url = self.fetch_tarball_url(pmcid)
            self.logger.info(f"Downloading TAR from: {tar_url}")
            
            tar_path = self.download_tarball(pmcid, tar_url)
            extracted_files = self.extract_pdf(pmcid, tar_path)
            
            if extracted_files:
                self.cleanup_tarball(tar_path)
            else:
                self.logger.warning("No PDF found in archive.")
                
            return extracted_files
                
        except Exception as e:
            self.logger.error(f"❌ Error: {str(e)}")
            return []


# Example usage
# if __name__ == "__main__":
#     # Configure the downloader with custom settings
#     downloader = PMCDownloader(
#         pdf_bucket_name="pubanalyzer-articles",
#         temp_bucket_name="pubanalyzer-temp",
#         temp_local_dir="temp_local",
#         log_level=logging.INFO
#     )
    
#     # Process a single PMC ID
#     result = downloader.run("PMC6801828")
    
#     # Print summary
#     print(f"\nExtracted and uploaded {len(result)} PDF files for PMC6801828")
#     print(f"S3 Object keys: {result}")