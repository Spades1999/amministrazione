const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const DipendenteSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    email: { type: String, required: true, maxLength: 100 },
    phone_number: { type: Number, required: true },
    codice_fiscale: { type: String, maxLength: 100 },
    conto_corrente: { type: String, maxLength: 100 },
    iban: { type: String, maxLength: 100 },
    societa: { type: Schema.Types.ObjectId, ref: 'Societa' }
});




DipendenteSchema.virtual('url').get(function () {
    return `/list/dipendente/${this._id}`;
});


DipendenteSchema.virtual('name').get(function () {
    let fullname = '';
    if(this.first_name && this.last_name) {
        fullname = `${this.last_name}, ${this.first_name}`;
    }
    if(!this.first_name || this.last_name) {
        fullname = '';
    }
    return fullname;
});


DipendenteSchema.virtual('date_of_birth_formatted').get(function() {
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});


module.exports = mongoose.model('Dipendente', DipendenteSchema); 