FROM node:6

RUN mkdir -p /app
RUN mkdir -p /mocks
WORKDIR /app

COPY package.json /app/
COPY lib /app/lib
COPY bin /app/bin
RUN npm install

COPY examples /mocks

ENV MOCKS_DIR /mocks
ENV PORT 5000
ENV WATCH 1
ENV LOG_LEVEL info

CMD ["/bin/bash", "-c", "node ./bin/moxx -p $PORT -d $MOCKS_DIR -w $WATCH -l $LOG_LEVEL"]