const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
// const expressValidator = require('express');

const signin = require('./controller/signin');
const register = require('./controller/register');
const profile = require('./controller/profile');
const image = require('./controller/image');
const auth = require('./controller/authorization');
const validation = require('./validation/validation');
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'khalid',
    password: 'test',
    database: 'smartbrain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
// app.use(expressValidator());

app.get('/', (req, res) => res.send('it`s works'));

app.post('/signin', (req, res) => {
  signin.singinAuthentication(req, res, db, bcrypt);
});
app.post('/register', validation, (req, res) => {
  register.registerHandller(req, res, db, bcrypt);
});

app.get('/profile/:id', auth.authRequire, (req, res) => {
  profile.profileHandller(req, res, db);
});
app.post('/profile/:id', auth.authRequire, (req, res) => {
  profile.profileUpdateHandller(req, res, db);
});
app.put('/image', auth.authRequire, image.imageHandller(db));
app.post('/imageurl', auth.authRequire, (req, res) => {
  image.CallClarifaiApi(req, res);
});

app.listen(process.env.PORT || 3000, () => console.log('listen in port 3000'));
