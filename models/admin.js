const mongoose = require('mongoose');
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    societa: { type: Schema.Types.ObjectId, ref: 'Societa' }, //eventually, for more than one societa, use Schema.Types.ObjectId.Mixed
    email: { type: String, required: true, maxLength: 100 },
    phone_number: { type: Number },
    iban: { type: String, maxLength: 100 },
    codice_fiscale: { type: String, maxLength: 100 },
    conto_corrente: { type: String, maxLength: 100 }
});




AdminSchema.virtual('name').get(function () {
    let fullname = '';
    if(this.first_name && this.last_name) {
        fullname = `${this.last_name}, ${this.first_name}`;
    }
    if(!this.first_name || this.last_name) {
        fullname = '';
    }
    return fullname;
});



AdminSchema.virtual('url').get(function () {
    return `/list/admin/${this._id}`;
});


AdminSchema.virtual('date_of_birth_formatted').get(function() {
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
});




module.exports = mongoose.model('Admin', AdminSchema); 