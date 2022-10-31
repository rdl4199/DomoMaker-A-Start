const mongoose = require('mongoose')
const _ = require('underscore')
const models = require('../models')
const Domo = models.Domo

let DomoModel = {}

const setName = (name) => _.escape(name).trim()

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    require: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
})

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
})

DomoSchema.statics.findByOwner= (ownerID, callback) => {
  const search = {
    ownder: mongoose.Types.ObjectId(ownerID)
  }
  return DomoModel.find(Search).select('name age').lean().exec(callback)
}

DomoModel = mongoose.model('Domo', DomoSchema)

module.exports = DomoModel

const makeDomo = async (req, res) => {
  if(!req.body.name || !req.body.age)
  {
    return res.status(400).json({ error: 'Both name and age are required!'})
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
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
    Domo.findByOwner(req.session.account._id, (err, docs) => {
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
