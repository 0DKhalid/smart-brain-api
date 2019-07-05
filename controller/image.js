const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '0e8eed5aea324b8e97f43a3302868b44'
});

const CallClarifaiApi = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('unable to get call api'));
};

const imageHandller = db => (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('Could not update entries'));
};

module.exports = {
  imageHandller,
  CallClarifaiApi
};
