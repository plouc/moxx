FROM mhart/alpine-node:6.4
MAINTAINER benitteraphael@gmail.com

RUN mkdir -p /moxx

WORKDIR /moxx

COPY package.json /moxx/

RUN npm install --production

COPY lib /moxx/lib
COPY bin /moxx/bin

EXPOSE 5000

ENTRYPOINT ["node", "bin/moxx"]