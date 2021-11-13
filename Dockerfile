FROM node:16.13.0-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY ./dist ./dist
RUN npm run build

CMD ["npm", "start"]
