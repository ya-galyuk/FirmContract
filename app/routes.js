//create a new express router
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller'),
    firmsController = require('./controllers/firms.controller'),
    contractsController = require('./controllers/contracts.controller');

//export router
module.exports = router;

//define routes
router.get('/', mainController.showHome);

//firms =============================
router.get('/firms', firmsController.showFirms);

//seed firms
// router.get('/firms/seed', firmsController.seedFirms);

//create firms
router.get('/firms/create', firmsController.showCreate);
router.post('/firms/create', firmsController.processCreate);

//edit firms
router.get('/firms/:_id/edit', firmsController.showEdit);
router.post('/firms/:_id', firmsController.processEdit);

//delete firms
router.get('/firms/:_id/delete', firmsController.deleteFirm);

//show a single firm
router.get('/firms/:_id', firmsController.showSingle);


//contracts ============================
router.get('/contracts', contractsController.showContracts);

//search for contract
router.post('/contracts', contractsController.searchContract);


//create contract
router.get('/contracts/create', contractsController.showCreateContract);
router.post('/contracts/create', contractsController.processCreateContract);

//edit contract
router.get('/contracts/:_id/edit', contractsController.showEditContract);
router.post('/contracts/:_id', contractsController.processEditContract);

//delete contract
router.get('/contracts/:_id/delete', contractsController.deleteContract);

//show a single contract
router.get('/contracts/:_id', contractsController.showSingleContract);

