const express = require('express');
const middlewares = require('../middlewares');
const Offer = require('../models/offer');

const router = express.Router();

router.use(middlewares.protectedRoute);

/* GET users listing. */
router.get('/', (req, res, next) => {
  const userID = res.locals.currentUser._id;
  Offer.find({ userID })
    .then((offers) => {
      res.render('protected/dashboard', { offers });
    })
    .catch((error) => {
      next(error);
    });
});

// GET create offer form
router.get('/create', (req, res, next) => {
  res.render('protected/create');
});

// POST create offer
router.post('/create', (req, res, next) => {
  const { from, until, location, budget } = req.body;
  const userID = req.session.currentUser._id;

  Offer.create({
    userID,
    from,
    until,
    location,
    budget,
  })
    .then((createdOffer) => {
      res.redirect('/dashboard');
    })
    .catch((error) => {
      next(error);
    });
});

// // GET ONE OFFER DETAIL
router.get('/offer/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(req.session.currentUser._id);
  const userID = req.session.currentUser._id;
  Offer.findById(id)
    .then((offer) => {
      res.render('protected/offer', { offer, userID });
    })
    .catch((error) => {
      next(error);
    });
});

// GET SEARCH INPUT

router.get('/q', (req, res, next) => {
  const { q } = req.query;
  console.log(q);
  Offer.find({ location: q })
    .then((offers) => {
      res.render('protected/search', { offers });
    })
    .catch((error) => {
      next(error);
    });
});


module.exports = router;
