import json
from typing import List
from django.test import TestCase
from unittest import mock
from datetime import datetime, timedelta

import pandas as pd
import numpy as np

from commons.utils import (
    get_google_trend,
    get_twitter_sentiment,
    get_coin_info,
)

# Mock Classes goes here


class MockTweet:
    def __init__(self, tweet: str, *args: list, **kwargs: dict):
        self.text: str = tweet


class MockTweepyCursor:
    def __init__(self, tweets: List[str], *args, **kwargs):
        self.tweets: List[MockTweet] = []
        for tweet in tweets:
            self.tweets.append(MockTweet(tweet=tweet))

    def items(self, *args, **kwargs):
        return self.tweets


class MockResponse:
    def __init__(self, response: dict, *args, **kwargs):
        self.text: dict = json.dumps(response)


class MockTrendReq:
    def build_payload(self, *args, **kwargs):
        return self

    def interest_over_time(self, *args, **kwargs) -> pd.DataFrame:
        initial_date: datetime = datetime(2021, 1, 1)
        days = pd.date_range(initial_date, initial_date + timedelta(90))

        np.random.seed(seed=1111)
        data: np.ndarray = np.random.randint(1, high=100, size=len(days))
        self.df: pd.DataFrame = pd.DataFrame(
            {"date": days, "bitcoin": data, "isPartial": [False] * len(days)}
        ).set_index("date")

        return self.df


# Tests goes here


class TestUtilTwitterSentiment(TestCase):
    def setUp(self):
        self.test_cases: dict[str, dict] = {
            "positive_major_sentiment": {
                "tweets": ["Good", "Good", "Bad", "i don't know"],
                "assert": {
                    "major_sentiment": 1,
                    "sentiments": [1, 1, 2],
                    "tweets": 4,
                },
            },
            "neutral_major_sentiment": {
                "tweets": ["", "Good", "Bad", ""],
                "assert": {
                    "major_sentiment": 0,
                    "sentiments": [1, 2, 1],
                    "tweets": 4,
                },
            },
            "negative_major_sentiment": {
                "tweets": ["Bad", "Good", "Bad", ""],
                "assert": {
                    "major_sentiment": -1,
                    "sentiments": [2, 1, 1],
                    "tweets": 4,
                },
            },
        }

    def test_get_twitter_sentiment(self):
        for test_case_values in self.test_cases.values():
            mock_cursor = mock.patch(
                "commons.utils.tweepy.Cursor",
                return_value=MockTweepyCursor(
                    tweets=test_case_values["tweets"]
                ),
            )
            mock_cursor.start()

            data = get_twitter_sentiment("Bitcoin")

            mock_cursor.stop()

            self.assertEqual(data, test_case_values["assert"])


class TestUtilCoinInfo(TestCase):
    def setUp(self):
        coins: List[dict] = [
            {
                "DISPLAY": {"USD": {"MKTCAP": "$10000", "PRICE": "$2"}},
                "CoinInfo": {"Name": "BTC", "FullName": "Bitcoin"},
            },
            {
                "DISPLAY": {"USD": {"MKTCAP": "$103000", "PRICE": "$12"}},
                "CoinInfo": {
                    "Name": "ETH",
                    "FullName": "Ethereum",
                },
            },
        ]
        self.response: dict = MockResponse({"Data": coins})

    def test_get_coin_info(self):
        mock_response = mock.patch(
            "commons.utils.requests.Session.get",
            return_value=self.response,
        )
        mock_response.start()

        data = get_coin_info("bitcoin")

        self.assertEqual(data["symbol"], "BTC")
        self.assertEqual(data["price"], "$2")
        self.assertEqual(data["market_cap"], "$10000")

        mock_response.stop()


class TestUtilGoogleTrend(TestCase):
    @mock.patch("commons.utils.TrendReq", return_value=MockTrendReq())
    def test_get_google_trend(self, mock_trend):
        data = get_google_trend("bitcoin")

        self.assertTrue(data)
        self.assertEqual(len(data["trend"]), 2)

        self.assertGreater(len(data["trend"]["values"]), 6)
        self.assertLess(len(data["trend"]["values"]), 10)

        self.assertGreater(len(data["trend"]["trend_dates"]), 6)
        self.assertLess(len(data["trend"]["trend_dates"]), 10)
