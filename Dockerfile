# Express-App
#
# VERSION  1.0.0

FROM node:latest

RUN mkdir -p /home/www/se-app
WORKDIR /home/www/se-app

COPY . /home/www/se-app
# RUN npm install  

EXPOSE 3019
CMD ["npm", "start"]

