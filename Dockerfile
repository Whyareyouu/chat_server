FROM node:18.17.1
WORKDIR ./app
COPY package*.json ./
RUN npm install --force
COPY . .
COPY ./dist ./dist
CMD ["npm", "run", "start:dev"]