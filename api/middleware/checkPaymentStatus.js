const { pool } = require("../../utils/dbConnection")

exports.checkPayment = async (req, res, next) => {
    try {
        const userId = req.userData.id;
        const dueDate = await (await pool.query("select due_date from users where id=$1", [userId])).rows[0]["due_date"];
        const currDate = new Date("2022-12-31");
        req.paymentStatus = currDate < dueDate;
        next();
    } catch (error) {
        next(error);
    }
}