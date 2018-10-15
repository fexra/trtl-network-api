# TRTL Services API Dashboard

The TurtleWallet API module allows developers to register their application and build on top of the Turtle Network without having to worry about the infrastructure. Developers can register there app with the database and generate addresses, send transfers and query incoming transactions.

![Design Layout](readme_layout.png)

## Requirements
- Node.Js 8+
- MySQL
- Redis
- ts-api
- ts-worker
- TurtleCoind
- Turtle-Service

## Environment Variables

```
APP_PORT=8011
APP_SECRET=98275998E75C05EB90EF846C8962E76FE4A60A2F6C8DB8A1B0B7917853A900B7
APP_COOKIE_SECRET=239DDEFDD2A324DDE9F6C96840471A37376612A507C80D4B5D187881E75F67319
APP_ISSUER=TRTL Services

DB_HOST=localhost
DB_PORT=3306
DB_USER=r
DB_PASS=
DB_NAME=

TS_FEE=2.1

APP_DEBUG=1
BLUEBIRD_DEBUG=0
```