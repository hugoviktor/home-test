const {Op} = require("sequelize");
const allContracts = async (req, res) => {
    const {Contract} = req.app.get('models')
    const profile_id = req.query.profile_id;
    const contracts = await Contract.findAll({where: {ClientId: profile_id || 0, status: {[Op.not]: "terminated"}}})
    res.json(contracts)
}
module.exports = {allContracts}
