# Financial tracker

A simple server-side program to track financial values and send data to specify emails

## Environment variables

- FINANCIAL_TRACKER_PORT (The app port listening)
- FINANCIAL_TRACKER_DATABASE_NAME
- FINANCIAL_TRACKER_DATABASE_USER
- FINANCIAL_TRACKER_DATABASE_PASSWORD
- FINANCIAL_TRACKER_SENDER_EMAIL_HOST
- FINANCIAL_TRACKER_SENDER_EMAIL_PORT
- FINANCIAL_TRACKER_SENDER_EMAIL_USER
- FINANCIAL_TRACKER_SENDER_EMAIL_PASSWORD

## NPM commands

### Development

Install development and production packages

```bash
npm install
```

Start a development server with compilation watcher

```bash
npm run start:dev
```

### Production

Install only development packages

```bash
npm install --omit=dev
```

Build the application

```bash
npm run build
```

Start application

```bash
npm start
```

## Docker commands (development)

Start maildev

```bash
docker-compose -f maildev.yml up -d
```

Stop maildev

```bash
docker stop financialtracker_financial-tracker-maildev_1
```

## Docker commands (production)

Start application

```bash
docker-compose up -d
```

With a .env file

```bash
docker-compose --env-file ./.env up -d
```

Stop application

```bash
docker-compose down
```

Build/Rebuild application

```bash
docker-compose build
```

Start bash session into postresql container :

```bash
docker exec -ti financialtracker_financial-tracker-postgresql_1 bash
```
