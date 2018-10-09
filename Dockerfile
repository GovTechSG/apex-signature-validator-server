FROM node:10-alpine

ENV HOME=/home/node

WORKDIR ${HOME}

COPY . ${HOME}

RUN npm install

RUN npm run build

RUN npm install --production

ENV NODE_ENV=production

EXPOSE 3544

CMD ["npm", "start"]