# Docker Multistage construction 

### DEV ###
FROM node:14-alpine AS builder

#  Navigate to the container working directory 
WORKDIR /usr/src/app
#  Copy package.json
COPY package*.json ./
RUN npm install glob rimraf
RUN npm install --only=development
COPY . .
RUN npm run build-bundle


### PROD ###
FROM node:14-alpine as production

WORKDIR /usr/src/app

RUN apk update
RUN apk add libreoffice
RUN apk --no-cache add msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
