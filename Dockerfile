FROM node:19-alpine3.16

WORKDIR /app
COPY . .
RUN chmod +x docker-boot.sh
RUN npm install -g nodemon
RUN npm install
ENTRYPOINT ["./docker-boot.sh"]
