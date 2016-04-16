FROM node:4.4

RUN mkdir /app
WORKDIR /app

ADD . /app/
RUN npm install
