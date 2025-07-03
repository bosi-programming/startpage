FROM node:22-alpine as build

WORKDIR /app

COPY . .
RUN apk add python3 && ln -sf python3 /usr/bin/python
RUN apk add py3-pip
RUN pip install setuptools --break-system-packages
RUN apk add build-base
RUN yarn
RUN yarn build
RUN yarn install --production

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["build"]
