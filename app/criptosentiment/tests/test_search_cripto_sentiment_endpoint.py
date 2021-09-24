from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

search_url = reverse("criptosentiment:search")


class TestCriptoSentimentSearch(TestCase):
    """Test for the search endpoint"""

    def setUp(self) -> None:
        self.client = APIClient()

    def test_search_valid_cripto(self) -> None:
        payload = {"coin": "Bitcoin"}
        res = self.client.post(search_url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        for key in ["trend", "symbol", "price", "market_cap", "sentiments"]:
            self.assertTrue(res.data[key])
        self.assertEqual(len(res.data[key]), 3)

        self.assertEqual(len(res.data["trend"]), 2)
        self.assertEqual(type(list(res.data["trend"]["trend_dates"])[0]), str)
        self.assertFalse(":" in res.data["trend"]["trend_dates"][0])

    def test_search_invelid_cripto(self) -> None:
        payload = {"coin": "DoNotExistCoin"}
        res = self.client.post(search_url, payload)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
