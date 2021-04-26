FROM node:14-alpine

LABEL org.opencontainers.image.source https://github.com/spaceflight-live/comet

ENV PORT 3000

RUN mkdir -p /usr/src/comet
WORKDIR /usr/src/comet

COPY package*.json /usr/src/comet/
RUN npm install

COPY . /usr/src/comet

ARG CONSTELLATION_SSR_HOST

RUN npm run build
EXPOSE 3000

CMD [ "npm", "start" ]
