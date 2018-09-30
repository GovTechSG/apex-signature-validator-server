FROM node:10-alpine

ENV HOME="/home/node/app"

WORKDIR ${HOME}

COPY . ${HOME}

RUN npm install

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3387

USER node

CMD npm start