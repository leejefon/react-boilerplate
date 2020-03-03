FROM node:8-alpine  

WORKDIR /usr/src/app
COPY package.json ./package.json

RUN apk --no-cache add curl strace tcpdump && npm install
RUN npm cache clean --force

COPY . .
CMD [ "npm", "start" ]
