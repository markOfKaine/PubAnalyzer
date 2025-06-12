from django.test import SimpleTestCase
from unittest.mock import Mock, patch
import io
import tempfile

from .PMCService import PMCService


class PMCServiceTests(SimpleTestCase):
    """Tests for :class:`PMCService`."""

    @patch("pmcIntegration.PMCService.requests.get")
    def test_fetch_tarball_url_converts_ftp(self, mock_get):
        xml = (
            "<records>"
            "<record>"
            "<link format='tgz' href='ftp://example.com/file.tar.gz'/>"
            "</record>"
            "</records>"
        )
        mock_resp = Mock(status_code=200, content=xml)
        mock_resp.raise_for_status = Mock()
        mock_get.return_value = mock_resp

        service = PMCService()
        url = service.fetch_tarball_url("PMC123")
        self.assertEqual(url, "https://example.com/file.tar.gz")

    @patch("pmcIntegration.PMCService.requests.get")
    def test_fetch_tarball_url_no_record_raises(self, mock_get):
        xml = "<records></records>"
        mock_resp = Mock(status_code=200, content=xml)
        mock_resp.raise_for_status = Mock()
        mock_get.return_value = mock_resp

        service = PMCService()
        with self.assertRaises(ValueError):
            service.fetch_tarball_url("PMC000")

    @patch("pmcIntegration.PMCService.requests.get")
    def test_fetch_tarball_url_no_tgz_link_raises(self, mock_get):
        xml = "<records><record><link format='pdf' href='ftp://x.com/file.pdf'/></record></records>"
        mock_resp = Mock(status_code=200, content=xml)
        mock_resp.raise_for_status = Mock()
        mock_get.return_value = mock_resp

        service = PMCService()
        with self.assertRaises(ValueError):
            service.fetch_tarball_url("PMC001")

    @patch.object(PMCService, "fetch_tarball_url", return_value="http://example.com/archive.tar.gz")
    @patch("pmcIntegration.PMCService.requests.get")
    @patch("pmcIntegration.PMCService.tarfile.open")
    def test_download_extract_success(self, mock_tar_open, mock_get, mock_fetch):
        class FakeResp:
            def __enter__(self):
                return self
            def __exit__(self, exc_type, exc, tb):
                pass
            def raise_for_status(self):
                pass
            def iter_content(self, size):
                yield b"data"
        class FakeTar:
            def __enter__(self):
                return self
            def __exit__(self, exc_type, exc, tb):
                pass
            def getmembers(self):
                m = Mock()
                m.name = "file.pdf"
                return [m]
            def extractfile(self, member):
                return io.BytesIO(b"PDF")

        mock_get.return_value = FakeResp()
        mock_tar_open.return_value = FakeTar()

        with tempfile.TemporaryDirectory() as tdir, tempfile.TemporaryDirectory() as pdir:
            service = PMCService(temp_local_dir=tdir, pdf_output_dir=pdir)
            result = service.download_extract_and_upload("PMC123")
            self.assertTrue(result.endswith("PMC123.pdf"))

    @patch.object(PMCService, "fetch_tarball_url", return_value="http://example.com/archive.tar.gz")
    @patch("pmcIntegration.PMCService.requests.get")
    @patch("pmcIntegration.PMCService.tarfile.open")
    def test_download_extract_no_pdf_returns_false(self, mock_tar_open, mock_get, mock_fetch):
        class FakeResp:
            def __enter__(self): return self
            def __exit__(self, exc_type, exc, tb): pass
            def raise_for_status(self): pass
            def iter_content(self, size): yield b"data"
        class FakeTar:
            def __enter__(self): return self
            def __exit__(self, exc_type, exc, tb): pass
            def getmembers(self): return []

        mock_get.return_value = FakeResp()
        mock_tar_open.return_value = FakeTar()

        with tempfile.TemporaryDirectory() as tdir, tempfile.TemporaryDirectory() as pdir:
            service = PMCService(temp_local_dir=tdir, pdf_output_dir=pdir)
            self.assertFalse(service.download_extract_and_upload("PMC999"))