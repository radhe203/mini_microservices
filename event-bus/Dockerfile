FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only=production

COPY . . 

EXPOSE 4005

CMD [ "npm" ,"start" ]



