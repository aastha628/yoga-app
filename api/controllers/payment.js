const { pool } = require("../../utils/dbConnection");

exports.makePayment = async (req, res, next) => {
    try {
        const userId = req.userData.id;
        const amount = req.body.amount;
        await pool.query("insert into payment (user_id,amount) values($1,$2)", [userId, amount]);
        const dueDate = (await pool.query("select due_date from users where id=$1", [userId])).rows[0]["due_date"];
        var newDate = new Date(dueDate.setMonth(dueDate.getMonth() + 1));
        await pool.query("update users set due_date =$1 where id=$2", [newDate, userId]);
        return res.status(200).json({
            message: "Payment successful"
        });
    } catch (error) {
        next(error);
    }
}