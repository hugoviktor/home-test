const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const {allContracts} = require("./controllers/contracts");
const {allJobs, paidJob} = require("./controllers/jobs");
const {deposit} = require("./controllers/balances");
const {mostEarned, mostExpenses} = require("./controllers/admin");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const contract = await Contract.findOne({where: {id}})
    //retrieve only contract associated with the correct contractor
    if (!contract || contract.dataValues.ContractorId !== req.profile.dataValues.id) return res.status(404).end()
    res.json(contract)
})

app.get('/contracts', allContracts)
app.get('/jobs/unpaid', allJobs)
app.get('/jobs/:job_id/pay', paidJob)
app.post('/balances/deposit/:userId', deposit)
app.get("/admin/best-profession", mostEarned)
app.get("/admin/best-clients", mostExpenses)


module.exports = app;
