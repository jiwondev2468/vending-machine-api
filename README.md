
## Description

[Nest.js](https://github.com/nestjs/nest) 기반 웹 메타버스 갤러리 프로젝트의 백엔드 (API 서버) 부분.

## Installation

```bash
$ npm install

# mariadb (docker) 설치
$ sh install_mariadb.sh
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# prisma playground
$ npx prisma studio
```

## 프로젝트 구조

서버 구조 세팅

- AWS Cloud, 인프라 구조 계획
  S3 with CloudFront - ALB(ELB) - ECS[docker[paypal, portone, AWS SES]] - ElasticCache(Redis) - S3 - RDS(MariaDB)

- [ERD by ERDCloud](https://www.erdcloud.com/d/Mepq6EBNSwzHnKTqJ) 
