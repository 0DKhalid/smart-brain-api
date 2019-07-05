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
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test',
    database: 'smartbrain'
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const dataBase = {
  users: [
    {
      id: '1',
      name: 'khalid',
      email: 'khalid@gmail.com',
      password: 'khalid',
      createAt: new Date()
    },
    {
      id: '2',
      name: 'ali',
      email: 'ali@gmail.com',
      password: 'ali',
      createAt: new Date()
    }
  ]
};

app.get('/', (req, res) => res.json({ hello: 'hello' }));

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

/*

register --> post --> create user
signin --> post -->  user signin
prfile/:userId --> get -->  get user Profile
image --> put -->  in existing user profile

*/
