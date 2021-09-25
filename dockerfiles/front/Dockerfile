FROM node:12.18.3
LABEL maintainer = "trolliama"

WORKDIR /front

COPY . .

RUN npm install -g npm@7.20.3
RUN npm install

RUN npm rebuild node-sass

RUN adduser user
USER user

CMD ["npm", "start"]