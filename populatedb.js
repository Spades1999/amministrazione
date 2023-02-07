const userArgs = process.argv.slice(2);


const async = require('async');
const Admin = require('./models/admin');
const Societa = require('./models/societa');
const Dipendente = require('./models/dipendente');


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}




const admins = [];
const leSocieta = [];
const dipendenti = [];




function societaCreate(name, street_address, email, phone_number, admin, dipendenti, cb) {
    societadetail = {
        name: name, 
        street_address: street_address, 
        email: email, 
        phone_number: phone_number, 
        admin: admin,
        dipendenti: dipendenti
    }

    const societa = new Societa(societadetail);

    societa.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('Nuova Societa: ' + societa);
        leSocieta.push(societa)
        cb(null, societa)
    }   );
}


function adminCreate(first_name, last_name, email, phone_number, societa, cb) {
    admindetail = {
        first_name: first_name, 
        last_name: last_name, 
        email: email, 
        phone_number: phone_number, 
        societa: societa
    }

    const admin = new Admin(admindetail);

    admin.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('Nuovo Amministratore: ' + admin);
        admins.push(admin)
        cb(null, societa)
    }   );
}


function dipendenteCreate(first_name, last_name, email, phone_number, societa, cb) {
    dipendentedetail = {
        first_name: first_name, 
        last_name: last_name, 
        email: email, 
        phone_number: phone_number, 
        societa: societa
    }

    const dipendente = new Dipendente(dipendentedetail);

    dipendente.save(function(err) {
        if (err) {
            //console.log('Error creating a new emplyee: ' + dipendente);
            cb(err, null)
            return
        }
        console.log('Nuovo Dipendente: ' + dipendente);
        dipendenti.push(dipendente)
        cb(null, societa)
    }   );
}







function createAdmins(cb) {
    async.parallel([
        function(callback) {
            adminCreate('Marco', 'Polo', 'marco.polo@mail.com', '11111111', leSocieta[0], callback);
        },
        function(callback) {
            adminCreate('Guido', 'Pollo', 'guido.pollo@mail.com', '22222222', leSocieta[1], callback);
        },
        function(callback) {
            adminCreate('Susanna', 'Rossi', 'susanna.rossi@mail.com', '33333333', leSocieta[2], callback);
        },
    ],
    cb);
}



function createDipendenti(cb) {
    async.parallel([
        function(callback) {
            dipendenteCreate('Mario', 'Rossi', 'mario.rossi@mail.com', '00111111', leSocieta[0], callback);
        },
        function(callback) {
            dipendenteCreate('Giacomo', 'Verdi', 'giacomo.verdi@mail.com', '00222222', leSocieta[1], callback);
        },
        function(callback) {
            dipendenteCreate('Anna', 'Bianchi', 'anna.bianchi@mail.com', '00333333', leSocieta[2], callback);
        },
    ],
    cb);
}



function createTutteSocieta(cb) {
    async.parallel([
        function(callback) {
            societaCreate('Societa1', 'Indirizzo 1', 'societa1@email.com', '01111111', admins[0], dipendenti[0], callback);
        },
        function(callback) {
            societaCreate('Societa2', 'Indirizzo 2', 'societa2@email.com', '02222222', admins[1], dipendenti[1], callback);
        },
        function(callback) {
            societaCreate('Societa3', 'Indirizzo 3', 'societa3@email.com', '03333333', admins[2], dipendenti[2], callback);
        },
    ],
    cb);
}





async.series([
    createAdmins,
    createDipendenti,
    createTutteSocieta
],
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});