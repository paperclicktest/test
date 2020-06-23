FROM node:lts-alpine
WORKDIR /Users/owner/Documents/paperclicks/server

COPY package*.json ./
RUN npm install
COPY . . 
EXPOSE 9000
CMD [ "npm", "start" ]