const {Op} = require("sequelize");
const allJobs = async (req, res) => {
    const {Contract, Job} = req.app.get('models')
    const profile_id = req.query.profile_id;
    const contracts = await Contract.findAll({
        include: {
            model: Job, where: {
                paid: {
                    [Op.is]: null
                }
            }
        },
        where: {ClientId: profile_id || 0, status: {[Op.or]: ["in_progress", "new"]}}
    })
    res.json(contracts)
}

const paidJob = async (req, res) => {
    const {Contract, Job, Profile} = req.app.get('models')
    const job_id = req.params.job_id
    const job = await Job.findOne({
        include: {model: Contract, include: [{model: Profile, as: "Client"}, {model: Profile, as: "Contractor"}]},
        where: {id: job_id}
    })
    const jobData = job.get({plain: true})
    console.log(jobData)
    if (jobData.price > jobData.Contract.Client.balance) {
        res.status(400).send({error: "No enough balance"})
    } else {
        //Move balance from clien to contractor
        await Profile.update(
            {balance: jobData.Contract.Client.balance - jobData.price}, {where: {id: jobData.Contract.Client.id}}
        )
        await Profile.update(
            {balance: jobData.Contract.Contractor.balance + jobData.price}, {where: {id: jobData.Contract.Contractor.id}}
        )
        res.status(204).send()
    }




}
module.exports = {allJobs, paidJob}
