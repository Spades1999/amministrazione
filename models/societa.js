const mongoose = require('mongoose');
/* const Admin = require('./admin');
const Dipendente = require('./dipendente'); */

const Schema = mongoose.Schema;

const SocietaSchema = new Schema({
    name: { type: String, required: true },
    street_address: { type: String },
    phone_number: { type: Number, required: true },
    email: { type: String, required: true },
    dipendenti: { type: Schema.Types.Mixed, ref: 'Dipendente' },   //{ type: Schema.Types.ObjectId, ref: 'Dipendente' }
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' }
});

SocietaSchema.virtual('url').get(function (){
    return `/list/societa/${this._id}`;
});

module.exports = mongoose.model('Societa', SocietaSchema);