FROM node:lts-alpine
WORKDIR /Users/owner/Documents/paperclicks/server

COPY package*.json ./
RUN npm install
EXPOSE 9000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

COPY . . 


CMD /wait && npm start