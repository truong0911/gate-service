# NestJS Base Project
### Install project
```bash
npm i
npm run build
cp example.env .env
```

### Install MongoDB
```bash
docker-compose -f docker_compose/mongodb.yml --env-file=.env up -d
```

### Install Redis
```bash
docker-compose -f docker_compose/redis.yml --env-file=.env up -d
```