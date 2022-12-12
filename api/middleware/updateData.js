const { pool } = require("../../utils/dbConnection");

exports.updateDb = async (req, res, next) => {
    try {
        const userId = req.userData.id;
        const userDetails = (await pool.query("select curr_batch,next_batch,end_date from users where id = $1", [userId])).rows[0];
        if (userDetails["end_date"] == null || userDetails["end_date"] < new Date()) {
            const date = new Date();
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toDateString();
            await pool.query("update users set end_date = $1, curr_batch =$2,next_batch = $3 where id = $4", [endDate, userDetails["next_batch"], null, userId]);
        }
        next();
    } catch (error) {
        next(error);
    }
}