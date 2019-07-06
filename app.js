const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const signin = require('./controller/signin');
const register = require('./controller/register');
const profile = require('./controller/profile');
const image = require('./controller/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('it`s works'));

app.post('/signin', (req, res) => {
  signin.signinHandller(req, res, db, bcrypt);
});
app.post('/register', (req, res) => {
  register.registerHandller(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.profileHandller(req, res, db);
});
app.put('/image', image.imageHandller(db));
app.post('/imageurl', (req, res) => {
  image.CallClarifaiApi(req, res);
});

app.listen(process.env.PORT || 3000, () => console.log('listen in port 3000'));
