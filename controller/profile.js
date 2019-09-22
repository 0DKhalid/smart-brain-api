const profileHandller = (req, res, db) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('user not found');
      }
    })
    .catch(err => console.log(err));
};

const profileUpdateHandller = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db('users')
    .where({ id })
    .update({ name })
    .then(response => {
      if (response) {
        res.json('success');
      } else {
        res.status(400).json('Unable to Update');
      }
    })
    .catch(err => res.status(400).json('error updating user'));
};

module.exports = {
  profileHandller,
  profileUpdateHandller
};
