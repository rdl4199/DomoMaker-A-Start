const models = require('../models');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    console.log('Happened');
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'DOMO ALREADY EXIST' });
    }
    return res.status(400).json({ error: 'AN ERROR OCCUREd' });
  }
};

const makerPage = (req, res) => {
  console.log(req.session.account._id);
  Domo.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occured!' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

module.exports = {
  makerPage,
  makeDomo,
};
