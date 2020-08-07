# charlottes-nc-news

This project builds a northcoders news api and allows you interact with the app as a user.

## Getting started

These instructions will get the project up and running on your local machine for development and testing purposes.

Ensure you are in the correct working directory and run the following command to clone the repo:

```
git clone https://github.com/charlottebrady/backend-nc-news.git
```

### Pre-requisites

Firstly, there are numerous packages you will need to install.

Let's begin with the one's required to set up the database:

1. postgres - install pg using the following command in your terminal

```
npm install pg
```

2. knex - install knex using the following command in the terminal

```
npm install knex --save
```

Then for the creation of the server:

3. express - install express using the following command in the terminal

```
npm install express
```

Then for testing purposes:

4. jest - install jest by running the following command in your terminal

```
npm install -D jest
```

5. supertest - install supertest bu running the following command in your terminal

```
npm install -D supertest
```

6. jest-sorted - install jest-sorted by running the following command in your terminal

```
npm install -D jest-sorted
```

NOTE: the final three packages are installed as devDependencies as we only use these for testing purposes.

### Installing

Now we can begin to get a development environment running. We need to seed the database first, do this with the following command:

```
npm run seed
```

The database should now have populated tables for: users, articles, topics and comments.

Edit the `query.sql` file specifying which database to connect to (dev: nc_news, test: nc_news_test) and write out some SQL statements of your own to see our database has been successfully seeded.
Example:

```
/c nc_news

SELECT * FROM users

```

To run the query as see what the database responds with, run the following command in your terminal

```
psql -f query.sql
```

## Running the tests

The tests are broken down by endpoints - there are 5 testing documents for our api within the `__tests__` directory.

### Testing break-down

You should run each test file individually with

```
npm test filename.test.js
```

where `filename` is replaced with one of the 5 endpoints mentioned above.

## Hosted version

A hosted version of this api can be found at this link:

https://charlottes-nc-news.herokuapp.com/

follow with the path you would like to request, i.e if I wanted to review the articles i could add on '`/api/articles`' and our nc-news articles should appear in the browser.
