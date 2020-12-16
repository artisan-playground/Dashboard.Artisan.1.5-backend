FROM node:lts-alpine as node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
#RUN yarn
COPY . /usr/src/app
RUN yarn
# EXPOSE 8100
ENV TYPEORM_CONNECTION=mysql
ENV TYPEORM_HOST=dev-db.artisandigital.tech
ENV TYPEORM_USERNAME=root
ENV TYPEORM_PASSWORD=artisanadmin
ENV TYPEORM_DATABASE=claris
ENV TYPEORM_PORT=3306
ENV TYPEORM_SYNCHRONIZE=true
ENV TYPEORM_LOGGING=false
ENV TYPEORM_ENTITIES=src/models/*.ts
ENV GITHUB_RUN_NUMBER=$GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT
ENV AUTH_LINEBOT_RT=Bearer {r438mW0sv46s/5eUhG5DfTS1kG7MOYhVGMQ4h653iNZZ6p7l0xd730Lp1OheFQUpN0xGX1exCsva2kq71Z19T9Bn0/9/LpLPmBjGvwdb4uLDH9N7KpSsSKwiGOc0vYYfS10YXjJLoCv8wBd8rj5d2wdB04t89/1O/w1cDnyilFU=}
ENV AUTH_LINEBOT_WS=Bearer {x2ae019g1Mwae82jj8T4kePi+cfo3D30MeVY6xIm/9u8fGr+sNM7ceYYBh0aBsXB3DCieHU87sGfWuEcAFX5EprxwI6VGUBtIvu/FaPOtc5CNhsTGbwZB5UNwRv1oAGmUnREXyUX60t3N1YXk/hM2QdB04t89/1O/w1cDnyilFU=}
ENV AUTH_LINEBOT_SALES=Bearer {kA7Uevxwm1hzcjK1JxI4EUmctVCH/kDXoIxDMIp6WAaGwwlXbGypGHyO1WVMVr7lVsfpm+2TrI9YruTizlERt45roDgTqKw8u3jKQbvEt0a73vgGqaRaSuTSYQR7r/Aq6hW9uJtpwYoI9YxU+rq9PQdB04t89/1O/w1cDnyilFU=}
ENV EMAIL_NAME="sapolayot  <sapolayot.nantawong@gmail.com>"
ENV AUTHEN_EMAIL_USER=sapolayot.nantawong@gmail.com
ENV AUTHEN_EMAIL_PASSWORD=Lampang005001234
ENV JWT_SECRET=artisanSecretString
ENV LINK_FRONTEND=https://claris-portal.artisandigital.tech
ADD start.sh /
RUN chmod +x /start.sh

CMD ["/start.sh"]
