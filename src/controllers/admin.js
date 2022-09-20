const  {Op, Sequelize} = require("sequelize");
const mostEarned = async (req, res) => {
    const {Job, Profile, Contract} = req.app.get('models')
    const start = req.query.start
    const end = req.query.end;
    const data = await Profile.findAll({
        include: Profile,
        includeIgnoreAttributes: false,
        attributes: [
            "id",
            "firstName",
            [Sequelize.fn('sum', Sequelize.col("price")), "total"]
        ],
        include: {
            model: Contract, as: "Contractor",
            attributes: ["createdAt"],
            where: {createdAt: {[Op.between] : [start, end]}},
            include: {
                attributes: ["price"],
                model: Job, where: {
                    paid: true
                }
            }
        },
        group: ["Profile.id", "Profile.firstName"],
        order: [["total", "DESC"]]
    })

    res.json(data)

}

const mostExpenses = async (req, res) => {
    const {Job, Profile, Contract} = req.app.get('models')
    const start = req.query.start
    const end = req.query.end;
    const limit = req.query.limit || 2;
    const data = await Profile.findAll({
        include: Profile,
        includeIgnoreAttributes: false,
        subQuery: false,
        attributes: [
            "id",
            "firstName",
            [Sequelize.fn('sum', Sequelize.col("price")), "total"]
        ],
        include: {
            model: Contract, as: "Client",
            attributes: ["createdAt"],
            where: {createdAt: {[Op.between] : [start, end]}},
            include: {
                attributes: ["price"],
                model: Job, where: {
                    paid: true
                }
            }
        },
        group: ["Profile.id", "Profile.firstName"],
        limit: limit,
        order: [["total", "DESC"]],
    })

    res.json(data)

}

module.exports = {mostEarned, mostExpenses}
