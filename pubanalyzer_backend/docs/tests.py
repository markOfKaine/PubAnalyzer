import os
import sys
import logging
from pathlib import Path

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from Services.PMCService import PMCDownloader
from Services.S3Service import S3Service

def test_pmc_download(pmcid="PMC6801828"):
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger("PMC_Test")
    
    temp_dir = Path("temp_test_dir")
    temp_dir.mkdir(exist_ok=True)
    
    logger.info(f"Starting test for {pmcid}...")
    
    try:
        downloader = PMCDownloader(
            pdf_bucket_name="pubanalyzer-articles",
            temp_bucket_name="pubanalyzer-temp",
            temp_local_dir=str(temp_dir),
            log_level=logging.INFO
        )
        
        logger.info("Step 1: Fetching tarball URL...")
        tar_url = downloader.fetch_tarball_url(pmcid)
        logger.info(f"✅ Found tarball URL: {tar_url}")
        
        logger.info("Step 2: Downloading tarball...")
        tar_path = downloader.download_tarball(pmcid, tar_url)
        logger.info(f"✅ Downloaded tarball to: {tar_path}")
        
        logger.info("Step 3: Extracting PDF...")
        extracted_files = downloader.extract_pdf(pmcid, tar_path)
        
        if extracted_files:
            logger.info(f"✅ Successfully extracted {len(extracted_files)} PDFs:")
            for file in extracted_files:
                logger.info(f"  - {file}")
            
            logger.info("Step 4: Verifying file in S3...")
            s3_service = S3Service()
            s3_files = s3_service.list_articles()
            
            expected_pdf = f"{pmcid}.pdf"
            if expected_pdf in s3_files:
                logger.info(f"✅ Verified {expected_pdf} exists in S3 bucket")
            else:
                logger.error(f"Could not find {expected_pdf} in S3 bucket")
                logger.info(f"Files in bucket: {s3_files[:10]}...")
        else:
            logger.error("No PDFs were extracted from the tarball")
        
        logger.info("Step 5: Cleaning up temporary files...")
        downloader.cleanup_tarball(tar_path)
        logger.info("✅ Cleanup complete")
        
        logger.info("Test completed!")
        
    except Exception as e:
        logger.error(f"Test failed with error: {str(e)}")
    
    finally:
        for file in temp_dir.glob("*"):
            try:
                file.unlink()
                logger.info(f"Removed temporary file: {file}")
            except:
                logger.warning(f"Couldn't remove file: {file}")
        
        try:
            temp_dir.rmdir()
            logger.info(f"Removed temporary directory: {temp_dir}")
        except:
            logger.warning(f"Couldn't remove directory: {temp_dir}")

if __name__ == "__main__":
    # You can change the PMC ID here if needed
    test_pmc_download("PMC6801828")