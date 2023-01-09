FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# é necessário instalar o mongo nesse conteiner
COPY . .

CMD ["npm", "start"]