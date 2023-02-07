const { body, validationResult } = require("express-validator");

const Dipendente = require("../models/dipendente");
//const Admin = require('../models/admin');
const Societa = require('../models/societa');

const async = require('async');


// Display list of all Dipendenti.
exports.dipendente_list = function (req, res, next) {
  Dipendente.find()
  .sort([['last_name', 'ascending']])
  //.populate('societa')
  .exec(function (err, list_dipendenti) {
    if(err) {
      return next(err);
    }
    res.render('dipendente_list', {
      title: 'Lista Dipendenti',
      dipendente_list: list_dipendenti,
    });
  });
};

// Display detail page for a specific Dipendente.
exports.dipendente_detail = (req, res, next) => {
  async.parallel(
    {
      dipendente(callback) {
        Dipendente.findById(req.params.id)
        .populate('societa')
        .exec(callback);
      },
      societa_dipendente(callback) {
        Dipendente.find({ societa: req.params.id })
        .populate('societa')
        .exec(callback);
      },
      societa_name(callback) {
        Societa.findById(req.params.id)
        .populate('name')
        .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if(results.dipendente == null) {
        const err = new Error('Dipendente non trovato');
        err.status = 404;
        return next (err);
      }
      res.render('dipendente_detail', {
        title: 'Dettagli dipendente',
        dipendente: results.dipendente,
        societa_dipendente: results.societa_dipendente,
        societa_name: results.societa_name,
      });
    }
  );
};

// Display Dipendente create form on GET.
exports.dipendente_create_get = (req, res, next) => {

  async.parallel(
    {
      leSocieta(callback) {
        Societa.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
    res.render('dipendente_form', {
      title: 'Crea un nuovo dipendente',
      societa_list: results.leSocieta, //The controller gets a list of all leSocieta (societa_list) and passes it to the view dipendente_form.pug (along with the title)
    });
   }
  );
};

// Handle Dipendente create on POST.
exports.dipendente_create_post = [

  /* In order to validate the information we first convert the 
  request to an array */
  (req, res, next) => {
    if (!Array.isArray(req.body.societa)) {
      req.body.societa = typeof req.body.societa === 'undefined' ? [] : [req.body.societa];
    }
    next();
  },

  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape() //will replace certain characters (i.e. <, >, /, &, ', ") with the corresponding HTML entity
    .withMessage("First name must be specified.")
    .isAlphanumeric() //check if the string contains only letters and numbers (a-zA-Z0-9)
    .withMessage("First name has non-alphanumeric characters."),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true }) //the checkFalsy flag means that we'll accept either an empty string or null as an empty value
    .isISO8601()
    .toDate(),
  body('email')
    .isEmail()
    .normalizeEmail() //ensures the email address is in a safe and standard format
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email must be specified."),
  body('phone_number')
    .isNumeric()
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Phone number must be specified."),
  body('codice_fiscale')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Codice fiscale must be specified.")
    .isAlphanumeric(),
  body('conto_corrente')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Conto corrente must be specified.")
    .isAlphanumeric(),
  body('iban')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("IBAN must be specified.")
    .isAlphanumeric(),
  body('societa.*')
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const dipendente = new Dipendente({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      email: req.body.email,
      phone_number: req.body.phone_number,
      codice_fiscale: req.body.codice_fiscale,
      conto_corrente: req.body.conto_corrente,
      iban: req.body.iban,
      societa: req.body.societa,
    });

    if(!errors.isEmpty()) {

      async.parallel(
        {
          leSocieta(callback) {
            Societa.find(callback);
          },
        },
        
        (err, results) => {
          if (err) {
            return next(err);
          }

        res.render('dipendente_form', {
          title: 'Crea un nuovo dipendente',
          societa_list: results.leSocieta,
          dipendente,
          errors: errors.array(),
        });
       }
      );
      return;
    }
    dipendente.save((err) => {
      if(err){
        return next(err);
      }
      res.redirect(dipendente.url);
    });
  },
];

// Display Dipendente delete form on GET.
exports.dipendente_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Dipendente delete GET");
};

// Handle Dipendente delete on POST.
exports.dipendente_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Dipendente delete POST");
};

// Display Dipendente update form on GET.
exports.dipendente_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Dipendente update GET");
};

// Handle Dipendente update on POST.
exports.dipendente_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Dipendente update POST");
};
