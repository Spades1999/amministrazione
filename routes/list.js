const express = require("express");
const router = express.Router();

const societa_controller = require('../controllers/societaController');
const admin_controller = require('../controllers/adminController');
const dipendente_controller = require('../controllers/dipendenteController');



/// SOCIETA ROUTES ///
//GET Home Page
router.get('/', societa_controller.index);

router.get('/societa/create', societa_controller.societa_create_get);
router.post('/societa/create', societa_controller.societa_create_post);

router.get('/societa/:id/delete', societa_controller.societa_delete_get);
router.post('/societa/:id/delete', societa_controller.societa_delete_post);

router.get('/societa/:id/update', societa_controller.societa_update_get);
router.post('/societa/:id/update', societa_controller.societa_update_post);

router.get('/societa/:id', societa_controller.societa_detail);
router.get('/listaSocieta', societa_controller.societa_list);



/// ADMIN ROUTES ///
router.get('/admin/create', admin_controller.admin_create_get);
router.post('/admin/create', admin_controller.admin_create_post);

router.get('/admin/:id/delete', admin_controller.admin_delete_get);
router.post('/admin/:id/delete', admin_controller.admin_delete_post);

router.get('/admin/:id/update', admin_controller.admin_update_get);
router.post('/admin/:id/update', admin_controller.admin_update_post);

router.get('/admin/:id', admin_controller.admin_detail);
router.get('/listaAdmin', admin_controller.admin_list);



/// DIPENDENTE ROUTES ///
router.get('/dipendente/create', dipendente_controller.dipendente_create_get);
router.post('/dipendente/create', dipendente_controller.dipendente_create_post);

router.get('/dipendente/:id/delete', dipendente_controller.dipendente_delete_get);
router.post('/dipendente/:id/delete', dipendente_controller.dipendente_delete_post);

router.get('/dipendente/:id/update', dipendente_controller.dipendente_update_get);
router.post('/dipendente/:id/update', dipendente_controller.dipendente_update_post);

router.get('/dipendente/:id', dipendente_controller.dipendente_detail);
router.get('/listaDipendenti', dipendente_controller.dipendente_list);


module.exports = router;