# Setup and development of Ch@or

To set up and run Ch@or, do

1. `npm install`
2. `npm run initdb`
3. `npm start`

If you've set up Ch@or previously, you may need to upgrade your database:

- `npm run upgradedb-2019-02-01` – upgrade database from API v1 to support API v2
- `npm run upgradedb-emoji` – upgrade database to support UNICODE emoji

For development, to make sure your changes keep with the coding style of Ch@or, you can run eslint with `npm run lint`
