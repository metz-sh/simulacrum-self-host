# Self host metz.sh
This is a mono-repo forked from metz's hosted app that you can run yourself on your own infrastructure.

## Features
- Sync projects to your own database
- Rust based backend for faster startup on serverless platforms
- Next.JS based webapp for ease of development

## Configuration
The backend is contained in `rusty-backend` folder which in turn contains `config.env`. Use this file to modify the configuration.
| Name | Type | Role  |
|------|-----|---|
| LOAD_CONFIG_FROM_ENV | `bool` | Makes the app take config from environment  |
| CONFIG_ENV | `'LOCAL or DEV or PROD'` | The environment to run the server in  |
| CONFIG_RUN_MIGRATIONS | `bool` | If this is true then at startup all the migrations will be run. `sqlx` takes care of safety  |
| CONFIG_DB__URL | `string` | The db url to connect to  |
| CONFIG_DB__POOL__MIN | `number` | Minimum size for Database Pool  |
| CONFIG_DB__POOL__MAX | `number` | Maximum size for Database Pool  |
| CONFIG_DB__POOL__ACQUIRE_TIMEOUT | `number` | Seconds to wait for connection from pool  |
| CONFIG_FRONTEND_ORIGIN | `string` | Used for CORS. Only this origins will be allowed to access the server  |
| CONFIG_SERVER__PORT | `number` | Port which the server will run on  |

<br/>

For the webapp, which is in `app.metz`, the configuration is in `.env`

| Name | Type | Role  |
|------|-----|---|
| NEXT_PUBLIC_BASE_API_PATH | `string` | Base path for backend  |

## How to run?
Quickstart:
```bash
docker compose up
```
This will create a postgres container, wire everything together and start the server at [http://localhost:3000](http://localhost:3000)

Another compose file is provided in case you want to bring your own storage. 
```bash
docker compose -f docker-compose-external-db.yaml up
```
Simply update this section in the file `CONFIG_DB__URL: <your-db-url>`

> [!IMPORTANT]
> Building this requires enough resources else docker kills it. Please provide at least 2G of RAM.
