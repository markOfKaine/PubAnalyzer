from django.test import SimpleTestCase
from unittest.mock import Mock, patch

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