FROM node:25.9-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2375

CMD ["npm", "start"]