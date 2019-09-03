FROM node:lts-alpine

ENV HOME=/home/node

WORKDIR ${HOME}

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3544

CMD ["npm", "start"]