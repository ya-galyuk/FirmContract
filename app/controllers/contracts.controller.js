const Contract = require('../models/contract');
const Firm = require('../models/firm');
const moment = require('moment');

module.exports = {
    showContracts: showContracts,
    showSingleContract: showSingleContract,
    showCreateContract: showCreateContract,
    processCreateContract: processCreateContract,
    showEditContract: showEditContract,
    processEditContract: processEditContract,
    deleteContract: deleteContract,
    searchContract: searchContract
};

/**
 * show all contracts
 */
function showContracts(req, res) {
    Contract.aggregate([
        {
            $lookup:
                {
                    from: "firms",
                    localField: "firmId",
                    foreignField: "_id",
                    as: "listFirms"
                }
        }
    ], (err, contracts) => {
        if (err) {
            res.status(404);
            res.send('Contracts not found!');
        }

        //return a view  with data
        res.render('pages/contracts/contracts', {
            contracts: contracts,
            moment: moment,
            success: req.flash('success'),
            errors: req.flash('errors')
        });
    });
    // }
}

/**
 * show a single contract
 */
function showSingleContract(req, res) {
    //get a single contract
    Contract.findOne({_id: req.params._id}, (err, contract) => {
        if (err) {
            res.status(404);
            res.send('Contracts not found!');
        }

        res.render('pages/contracts/single', {
            contract: contract,
            moment: moment,
            success: req.flash('success')
        });
    });
}

/**
 * Show the create contract
 */
function showCreateContract(req, res) {
    //get list firm
    Firm.aggregate([{$project: {_id: 1, name: 1}}], (err, firms) => {
        if (err) {
            res.status(404);
            res.send('Firms not found!');
        }

        res.render('pages/contracts/create', {
            firms: firms,
            success: req.flash('success'),
            errors: req.flash('errors')
        });
    });
}

/**
 * Process the creation contract
 */
function processCreateContract(req, res) {
    //validate information
    req.checkBody('name_contract', 'Name is required.').notEmpty();
    req.checkBody('number_contract', 'Number is required.').notEmpty();
    req.checkBody('sum_contract', 'Sum is required.').notEmpty();
    req.checkBody('dateStart_contract', 'Date start is required.').notEmpty();
    req.checkBody('dateFinish_contract', 'Date finish is required.').notEmpty();
    req.checkBody('prepayment_contract', 'Prepayment is required.').notEmpty();
    req.checkBody('firmId_contract', 'Firm is required.').notEmpty();

    //if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/contracts/create');
    }

    //create a new contract
    const contract = new Contract({
        name: req.body.name_contract,
        number: req.body.number_contract,
        sum: req.body.sum_contract,
        dateStart: req.body.dateStart_contract,
        dateFinish: req.body.dateFinish_contract,
        prepayment: req.body.prepayment_contract,
        firmId: req.body.firmId_contract
    });

    //save contract
    contract.save((err) => {
        if (err)
            throw err;

        //set a successful flash message
        req.flash('success', 'Successfully created firm!');

        //redirect to the newly created firm
        // res.redirect(`/contracts/${contract._id}`);
        res.redirect('/contracts');
    });
}

/**
 * Show the edit contract
 */
function showEditContract(req, res) {
    Contract.findOne({_id: req.params._id}, (err, contract) => {
        Firm.aggregate([{$project: {_id: 1, name: 1}}], (err, firms) => {
            res.render('pages/contracts/edit', {
                contract: contract,
                firms: firms,
                moment: moment,
                errors: req.flash('errors')
            });
        });
    });
}

/**
 * Process the edit contract
 */
function processEditContract(req, res) {
    //validate information
    req.checkBody('name_contract', 'Name is required.').notEmpty();
    req.checkBody('number_contract', 'Number is required.').notEmpty();
    req.checkBody('sum_contract', 'Sum is required.').notEmpty();
    req.checkBody('dateStart_contract', 'Date start is required.').notEmpty();
    req.checkBody('dateFinish_contract', 'Date finish is required.').notEmpty();
    req.checkBody('prepayment_contract', 'Prepayment is required.').notEmpty();
    req.checkBody('firmId_contract', 'Firm is required.').notEmpty();

    //if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/contracts/${req.params._id}/edit`);
    }

    //finding a current contract
    Contract.findOne({_id: req.params._id}, (err, contract) => {
        //updating that contract
        contract.name = req.body.name_contract;
        contract.number = req.body.number_contract;
        contract.sum = req.body.sum_contract;
        contract.dateStart = req.body.dateStart_contract;
        contract.dateFinish = req.body.dateFinish_contract;
        contract.prepayment = req.body.prepayment_contract;
        contract.firmId = req.body.firmId_contract;

        contract.save((err) => {
            if (err)
                throw err;

            //success flash message
            //redirect back to the /contracts
            req.flash('success', 'Successfully updated contract.');
            res.redirect('/contracts');
        });
    });
}

/**
 * Delete an contract
 */
function deleteContract(req, res) {
    Contract.remove({_id: req.params._id}, (err) => {
        //set flash data
        //redirect back to the firms page
        req.flash('success', 'Contract delete!');
        res.redirect('/contracts');
    });
}

/**
 * Search an contract
 */

function searchContract(req, res) {
    req.checkBody('searchText', 'Field must be not empty.').notEmpty();

    //if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/contracts`);
    }

    Contract.aggregate([
        {
            $match: {
                $or: [
                    {name: {$regex: req.body.searchText}},
                    {number: {$regex: req.body.searchText}}
                ]
            }
        },
        {
            $lookup:
                {
                    from: "firms",
                    localField: "firmId",
                    foreignField: "_id",
                    as: "listFirms"
                }
        }
    ], (err, contracts) => {
        console.log("contract 2");

        console.log(contracts);

        if (err) {
            res.status(404);
            res.send('Contracts not found!');
        }

        //return a view  with data
        res.render('pages/contracts/contracts', {
            contracts: contracts,
            moment: moment,
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    });
}