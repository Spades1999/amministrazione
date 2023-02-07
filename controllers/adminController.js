const { body, validationResult } = require("express-validator");


const Societa = require("../models/societa");
const Admin = require('../models/admin');
const Dipendente = require('../models/dipendente');


const async = require('async');

// Display list of all Admins.
exports.admin_list = function (req, res, next) {
  Admin.find()
  .sort([['last_name', 'ascending']])
  .exec(function (err, list_admins) {
    if(err) {
      return next(err);
    }
    res.render('admin_list', {
      title: 'Lista Amministratori',
      admin_list: list_admins,
    });
  });
};

// Display detail page for a specific Admin.
exports.admin_detail = (req, res, next) => {
  	async.parallel(
      {
        admin(callback) {
          Admin.findById(req.params.id)
          .exec(callback);
        },
        admins_societa(callback) {
          Societa.find({ admin: req.params.is }, 'first_name last_name societa')
          .populate('societa')
          .populate('admin')
          .exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if(results.admin == null) {
          const err = new Error('Amministratore non trovato');
          err.status = 404;
          return next (err);
        }
        res.render('admin_detail', {
          title: 'Dettagli amministratore',
          admin: results.admin,
          admins_societa: results.admins_societa,
        });
      }
    );
};

// Display Admin create form on GET.
exports.admin_create_get = (req, res, next) => {
  res.render('admin_form', { title: 'Crea un Amministratore'});
};

// Handle Admin create on POST.
exports.admin_create_post = [
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

  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('admin_form', {
        title: 'Crea un amministratore',
        admin: req.body,
        errors: errors.array(),
      });
      return;
    }
    const admin = new Admin({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      email: req.body.email,
      phone_number: req.body.phone_number,
      codice_fiscale: req.body.codice_fiscale,
      conto_corrente: req.body.conto_corrente,
      iban: req.body.iban,
    });
    admin.save((err) => {
      if(err) {
        return next(err);
      }
      res.redirect(admin.url);
    });
  },
];

// Display Admin delete form on GET.
exports.admin_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Admin delete GET");
};

// Handle Admin delete on POST.
exports.admin_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Admin delete POST");
};

// Display Admin update form on GET.
exports.admin_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Admin update GET");
};

// Handle Admin update on POST.
exports.admin_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Admin update POST");
};
