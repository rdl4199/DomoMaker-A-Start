const models = require('../models')
const Domo = models.Domo

const makeDomo = async (req, res) => {
  if(!req.body.name || !req.body.age)
  {
    return res.status(400).json({ error: 'Both name and age are required!'})
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account.id,
  }

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save()
    return res.json({redirect: '/maker'});
  }
  catch (err) {
    console.log(err)
    if(err.code === 11000)
    {
      return res.status(400).json({error: "DOMO ALREADY EXIST"})
  
    }
    return res.status(400).json({ error: 'AN ERROR OCCUREd'})
  }
}

const makerPage = (req, res) => {
    Domo.findByOwner(req.session.account.id, (err, docs) => {
      if(err) {
        console.log(err)
        return res.status(400).json({ error: 'An error has occured!'})
        
      }

      return res.render('app', {domo: docs})
    })
};


module.exports = {
  makerPage,
  makeDomo,
};
