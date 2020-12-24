FROM node:lts-alpine as node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
#RUN yarn
COPY . /usr/src/app
RUN yarn
# EXPOSE 8100
ADD start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]
