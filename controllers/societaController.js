const { body, validationResult } = require("express-validator");

const Societa = require("../models/societa");
const Admin = require('../models/admin');
const Dipendente = require('../models/dipendente');

const async = require('async');




exports.index = (req, res) => {
  async.parallel(
    {
      societa_count(callback) {
        Societa.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },

      dipendente_count(callback) {
        Dipendente.countDocuments({}, callback);
      },

      admin_count(callback) {
        Admin.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', { //view (template) named 'index'
        title: 'Amministrazione',
        error: err,
        data: results,
      });
    }
  );
};



/* 
the callback passed to the query renders the book_list(.pug) 
template, passing the title and book_list (list of books with 
authors) as variables.
*/
// Display list of all Societa.
exports.societa_list = (req, res, next) => {
  Societa.find({}, 'name')
  .sort({ name: 1 })
  .exec(function (err, list_leSocieta) {
    if (err){
      return next (err);
    }
    res.render('societa_list', { title:'Lista delle Società', societa_list: list_leSocieta });
  });
};

// Display detail page for a specific Societa.
exports.societa_detail = (req, res, next) => {
  async.parallel(
    {
      societa(callback) {
        Societa.findById(req.params.id)
        .populate('admin')
        //.populate('dipendenti')
        .exec(callback);
      },
      admin(callback) {
        Admin.findById(req.params.id)
        .populate('societa')
        .exec(callback);
      },
      dipendenti_societa(callback) {
        Dipendente.find({ societa: req.params.id }, 'first_name last_name')
        .populate('societa')
        //.populate('dipendenti')
        .exec(callback);
      },
    },
    (err, results) => {
        if(err) {
          return next(err);
        }
        if(results.societa == null) {
          const err = new Error('Società non trovata');
          err.status = 404;
          return next(err);
        }
        res.render('societa_detail', {
          title: results.societa.title,
          societa: results.societa,
          dipendenti_societa: results.dipendenti_societa,
        });
    }
  );
};

// Display Societa create form on GET.
exports.societa_create_get = (req, res, next) => {
  async.parallel(
    {
      admins(callback) {
        Admin.find(callback);
      },
      dipendenti(callback) {
        Dipendente.find(callback);
      },
    },
    (err, results) => {
      if(err) {
        return next(err);
      }
      res.render('societa_form', {
        title: 'Crea una nuova società',
        admins: results.admins,
        dipendenti: results.dipendenti,
      });
    }
  );
};

// Handle Societa create on POST.
exports.societa_create_post = [
  /* In order to validate the information we first convert the 
  request to an array */
  (req, res, next) => {
    if (!Array.isArray(req.body.admin)) {
      req.body.admin = typeof req.body.admin === 'undefined' ? [] : [req.body.admin];
    }
    next();
  },

  // Validate and sanitize fields.
  body('name', 'Il nome non può essere vuoto')
    .trim()
    .isLength({min:1 })
    .escape(),
  body('street_address', 'Indirizzo non deve essere vuoto')
    .trim()
    .isLength({ min:1 })
    .escape()
    .isAlphanumeric(),
  body('email', 'Email non può essere vuota')
    .isEmail()
    .normalizeEmail() //ensures the email address is in a safe and standard format
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email must be specified."),
  body('phone_number', 'Numero di telefono non può essere vuoto')
    .isNumeric()
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Phone number must be specified."),
  body('admin.*') 
    .escape(), //We use a wildcard in the sanitizer to individually validate each of the admin array entries

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Societa object with escaped and trimmed data.
      const societa = new Societa({
        name: req.body.name,
        street_address: req.body.street_address,
        email: req.body.email,
        phone_number: req.body.phone_number,
        admin: req.body.admin,
      });
      
      if(!errors.isEmpty()) {
      //There are errors. Render form again with sanitized values/error messages.

        // Get all admins and dipendenti for form
        async.parallel(
          {
            admins(callback) {
              Admin.find(callback);
            },
            dipendenti(callback) {
              Dipendente.find(callback);
            },
          },
          
          (err, results) => {
            if (err) {
              return next(err);
            }

            res.render("societa_form", {
              title: "Crea una nuova società",
              admins: results.admins,
              societa,
              errors: errors.array(),
            });
          }
        );
        return;
      }

      // Data from form is valid. Save book.
      societa.save((err) => {
        if(err) {
          return next(err);
        }
        // Successful: redirect to new societa record
        res.redirect(societa.url);
      });
  },
];

// Display Societa delete form on GET.
exports.societa_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Societa delete GET");
};

// Handle Societa delete on POST.
exports.societa_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Societa delete POST");
};

// Display Societa update form on GET.
exports.societa_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Societa update GET");
};

// Handle Societa update on POST.
exports.societa_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Societa update POST");
};
