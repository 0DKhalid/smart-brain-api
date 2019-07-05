const registerHandller = (req, res, db, bcrypt) => {
  const { email, password, name } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('information is not valid');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        email: email,
        hash: hash
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => res.json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('unable to register'));
};

module.exports = {
  registerHandller
};