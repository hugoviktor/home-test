const {Op} = require("sequelize");
const deposit = async (req, res) => {
    const {Contract, Job, Profile} = req.app.get('models')
    const userid = req.params.userId
    const amt = req.body.amount;
    const profile = await Profile.findOne({
        include: {
            model: Contract, as: "Client", include: {
                model: Job, where: {
                    paid: {
                        [Op.is]: null
                    }
                }
            }
        },
        where: {id: userid}
    })

    const dataProfile = profile.get({plain: true})

    let totalToPaid = 0
    dataProfile.Client.forEach(c => {
        totalToPaid += c.Jobs.map(j => j.price)
            .reduce((prev, curr) => prev + curr)
    })
    console.info(amt)
    const paidLimit = 25 * totalToPaid / 100
    if (amt > paidLimit)
        res.json({err: "Deposit exceed the allowed limit"})
    res.status(204).send()

}
module.exports = {deposit}
