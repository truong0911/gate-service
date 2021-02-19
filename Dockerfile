FROM node:12-alpine as builder

WORKDIR /server
COPY ["package.json", "package-lock.json", "tsconfig.*", "nest-cli.json", "./"]
RUN npm install
RUN npm run build

FROM node:12-alpine
WORKDIR /server
COPY --from=builder /server/package.json /server/dist ./
COPY --from=builder /server/node_modules ./node_modules
CMD npm start