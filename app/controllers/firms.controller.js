const Firm = require('../models/firm');

module.exports = {
    showFirms: showFirms,
    showSingle: showSingle,
    // seedFirms: seedFirms,
    showCreate: showCreate,
    processCreate: processCreate,
    showEdit: showEdit,
    processEdit: processEdit,
    deleteFirm: deleteFirm
};

/**
 * show all firms
 */
function showFirms(req, res) {
    //get all firms
    Firm.find({}, (err, firms) => {
        if (err){
            res.status(404);
            res.send('Firms not found!');
        }

        //return a view  with data
        res.render('pages/firms', {
            firms: firms,
            success: req.flash('success')
        });
    });
}

/**
 * show a single firm
 */
function showSingle(req, res) {
    //get a single firm
    Firm.findOne({_id: req.params._id}, (err, firm) => {
        if (err){
            res.status(404);
            res.send('Firms not found!');
        }

        res.render('pages/single', {
            firm: firm,
            success: req.flash('success')
        });
    });
}

/**
 * seed our database
 */
function seedFirms(req, res) {
    //create some firms
    const firms = [{}];

    //use the Firm model to insert/save
    Firm.remove({}, () => {
        for (firm of firms) {
            var newFirm = new Firm(firm);
            newFirm.save();
        }
    });

    //seeded!
    res.send('Database seeded!');
}

/**
 * Show the create form
 */
function showCreate(req, res) {
    res.render('pages/create', {
        errors: req.flash('errors')
    });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
    //validate information
    req.checkBody('name_firm', 'Name is required.').notEmpty();
    req.checkBody('ceo_firm', 'Ceo is required.').notEmpty();
    req.checkBody('address_firm', 'Address is required.').notEmpty();

    //if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors){
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/firms/create');
    }

    //create a new firm
    const firm = new Firm({
        name: req.body.name_firm,
        ceo: req.body.ceo_firm,
        address: req.body.address_firm
    });

    //save firm
    firm.save((err) => {
        if(err)
            throw err;

        //set a successful flash message
        req.flash('success', 'Successfully created firm!');

        //redirect to the newly created firm
        // res.redirect(`/firms/${firm._id}`);
        res.redirect('/firms');
    });
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
    Firm.findOne({ _id: req.params._id }, (err, firm) =>{
        res.render('pages/edit', {
            firm: firm,
            errors: req.flash('errors')
        });
    });
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
    //validate information
    req.checkBody('name_firm', 'Name is required.').notEmpty();
    req.checkBody('ceo_firm', 'Ceo is required.').notEmpty();
    req.checkBody('address_firm', 'Address is required.').notEmpty();

    //if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors){
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/firms/${req.params._id}/edit`);
    }

    //finding a current firm
    Firm.findOne({_id: req.params._id}, (err, firm) => {
        //updating that firm
        firm.name = req.body.name_firm;
        firm.ceo = req.body.ceo_firm;
        firm.address = req.body.address_firm;

        firm.save((err) => {
            if (err)
                throw err;

            //success flash message
            //redirect back to the /firms
            req.flash('success', 'Successfully updated firm.');
            res.redirect('/firms');
        });
    });
}

/**
 * Delete an firm
 */
function deleteFirm(req, res) {
    Firm.remove({_id: req.params._id}, (err) => {
        //set flash data
        //redirect back to the firms page
        req.flash('success', 'Firm delete!');
        res.redirect('/firms');
    });
}