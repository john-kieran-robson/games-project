# Link

...

# Summary

Api that allows for posting of reviews for games and also the possibility to leave comments on reviews, that can be voted up or down.

# Instructions

cloning of repo:

```
$ git clone https://github.com/john-kieran-robson/games-project.git
```

Install Dependencies:

```
$ npm ci
```

ENV Files:

You need to make 2 .ENV files in the main directory of the project, to connect the databases.

```programming
.env.development
.env.test
```

one file should be called `.env.development` should contain the following:

```
PGDATABASE=nc_games
```

and `.env.test` should contain the following:

```
PGDATABASE=nc_games_test
```

Seed the database:

Run both of the following commands -

```
$ npm run setup-dbs
$ npm run seed
```

Run tests:

```
$ npm run test
```

# Minimum requirements

Node.js: `v16.17.1`
Postgres: `PostgreSQL 10.22`
