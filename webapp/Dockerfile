FROM node:18 as builder

ENV ENV="prod"

WORKDIR /code

RUN apt-get update && apt-get install -y yarn

COPY package.json yarn.lock lerna.json tailwind.config.js /code/
COPY packages/annotator/package.json /code/packages/annotator/package.json
COPY packages/api/package.json /code/packages/api/package.json
COPY packages/app/package.json /code/packages/app/package.json
COPY packages/viewer/package.json /code/packages/viewer/package.json
RUN --mount=type=cache,target=/root/.cache/yarn/v6 \
    yarn install --frozen-lockfile

ARG API_HOST_ORIGIN
ARG DICOMWEB_ORIGIN

COPY packages /code/packages
COPY tsconfig.json /code/
RUN yarn build

RUN mv /code/packages/app/build /prod_files

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /prod_files .
