# Setup guide

## Dependencies

- Node
- MySQL

## Build the frontend
Move into the `frontend` folder.

```bash
cd frontend
```

Install all dependencies.

```bash
npm install
```

Build the frontend for production.

```bash
npm run build
```

## Start the server

Move into the `backend` folder.

```bash
cd backend
```

Install all dependencies.

```bash
npm install
```

### Environmental variables

In case that any of the default server values do not work for you they can be changed by creating a `.env` file.

```bash
touch .env
```

The following variables can be set in the `.env` file.

```bash
PORT=3000
MYSQLHOST =localhost
MYSQLUSER =root
MYSQLPASS =1234
MYSQLDB =testDB
```

Start the server.

```bash
npm run start
```
