FROM node:lts-alpine
WORKDIR /app
COPY . ./
COPY .env.dev ./.env
RUN yarn --frozen-lockfile
ENV PORT=8080 HOST=0.0.0.0
EXPOSE 8080
CMD ["yarn", "start", "--port=8080"]
