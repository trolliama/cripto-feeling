from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from commons.utils import (
    get_google_trend,
    get_twitter_sentiment,
    get_coin_info,
)


class SearchCoin(APIView):
    def post(self, request, format=None):
        coin = request.data["coin"]

        data = get_coin_info(coin)

        if not data:
            raise NotFound(detail="Error 404, page not found", code=404)

        data.update(get_twitter_sentiment(coin))
        data.update(get_google_trend(coin))

        return Response(data)
