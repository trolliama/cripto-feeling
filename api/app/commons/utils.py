import json
import os
from typing import List

from nltk.sentiment.vader import SentimentIntensityAnalyzer
import tweepy
import requests
from pytrends.request import TrendReq


def get_google_trend(coin):
    """Responsible for get the search amount of an specific coin
    in the past 3 months"""

    pytrends = TrendReq(hl="en-US", timeout=(25, 40))

    # build the payload to get the searchs from 3 months ago unitl today
    pytrends.build_payload(
        [coin], cat=0, timeframe="today 3-m", geo="", gprop=""
    )
    df = pytrends.interest_over_time().drop(["isPartial"], axis=1)
    # df = df.drop(["isPartial"], axis=1)

    # transform datetime into str and get only the date
    trend_dates = list(map(lambda x: x.split()[0], df.index.map(str)))
    values = list(df.loc[:, coin])  # amount of searchs per day

    decreased_values = []
    decreased_trend_dates = []

    # This code block will filter the data to get the value every 8 days.
    # This way it will fit in the frontend chart
    for i in range(len(values)):
        if i % len(values) // 8 == 0:
            decreased_values.append(values[i])
            decreased_trend_dates.append(trend_dates[i])

    return {
        "trend": {
            "values": decreased_values,
            "trend_dates": decreased_trend_dates,
        }
    }


def get_coin_info(coin):
    """Responsible for get the market info (price, symbol, market_cap)
    of an specific coin"""

    api_key = os.environ.get("CRYPTOCOMPARE_API_KEY")

    session = requests.Session()
    session.headers.update({"authorization": f"Apikey {api_key}"})

    url = "https://min-api.cryptocompare.com/data/top/mktcapfull"
    params = {"limit": 10, "tsym": "USD"}

    response = session.get(url, params=params)
    coin_list = json.loads(response.text)["Data"]

    # Search for the coin in the list
    for coin_info in coin_list:
        display = coin_info["DISPLAY"]["USD"]
        info = coin_info["CoinInfo"]

        if info["FullName"].upper() == coin.upper():

            return {
                "market_cap": display["MKTCAP"],
                "price": display["PRICE"],
                "symbol": info["Name"],
            }


def get_twitter_sentiment(keyword):
    """Get the sentiment about a cryptocoin on twitter"""

    auth = tweepy.AppAuthHandler(
        os.environ.get("TWITTER_CONSUMER_KEY"),
        os.environ.get("TWITTER_KEY_SECRET"),
    )

    api = tweepy.API(auth, wait_on_rate_limit=True)
    major_sentiment = negatives = neutrals = positives = tweets = 0

    for tweet in tweepy.Cursor(api.search, q=keyword, lang="en").items(100):
        sentiment = SentimentIntensityAnalyzer().polarity_scores(tweet.text)[
            "compound"
        ]

        if sentiment > 0:
            positives += 1
        elif sentiment < 0:
            negatives += 1

        tweets += 1

    neutrals: int = tweets - (positives + negatives)
    sentiments: List[int] = [negatives, neutrals, positives]

    if sentiments.index(max(sentiments)) == 0:
        major_sentiment = -1  # negative
    elif sentiments.index(max(sentiments)) == 1:
        major_sentiment = 0  # neutral
    else:
        major_sentiment = 1  # positive

    return {
        "major_sentiment": major_sentiment,
        "sentiments": sentiments,
        "tweets": tweets,
    }
