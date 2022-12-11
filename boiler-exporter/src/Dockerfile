FROM node:19-alpine
WORKDIR /home/node/app
COPY package*.json ./
COPY index.js ./
RUN npm install
EXPOSE 80
ENTRYPOINT ["npm", "start"]