FROM python:3.9
LABEL maintainer="trolliama"

ENV PYTHONUNBUFFERED 1 

COPY ./requirements.txt /requirements.txt

# RUN apk add --update --no-cache postgresql-client jpeg-dev openssl-dev
# RUN apk add --update --no-cache --virtual .tmp-build-deps \
#     gcc libc-dev linux-headers postgresql-dev libxml2-dev \
#     libxslt-dev python3-dev

RUN pip install -r requirements.txt

RUN mkdir /app

WORKDIR /app
COPY ./app /app

RUN adduser user

USER user

RUN python -m nltk.downloader vader_lexicon

CMD ["gunicorn","api.wsgi:application","--bind","0.0.0.0:8000","--timeout","300"]