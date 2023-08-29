FROM node:18.17.1
WORKDIR ./app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
COPY ./dist ./dist
CMD ["yarn", "run", "start:dev"]