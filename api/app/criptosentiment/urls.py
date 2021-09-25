from django.urls import path

from criptosentiment.views import SearchCoin

app_name = "criptosentiment"

urlpatterns = [
    path("search/", SearchCoin.as_view(), name="search"),
]
