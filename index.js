require('dotenv').config();

const express = require('express');
const Api = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', Api.health);

app.use('/', express.static('./public'));
app.use('/:page', express.static('./public'));

const server = app.listen(process.env.PORT || 3030);
server.on('listening', () => console.log(`Server listening on port ${process.env.PORT || 3030}`));

process.on('SIGINT', () => server.close(() => process.exit(0)));

process.on('unhandledRejection', (r) => {
  console.error('unhandledRejection', r);
  process.exit(1);
});
