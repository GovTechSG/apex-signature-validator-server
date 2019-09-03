FROM node:10-alpine

ENV HOME=/home/node

WORKDIR ${HOME}

COPY package.json .

RUN npm install

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3544

CMD ["npm", "start"]