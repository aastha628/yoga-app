const jwt = require("jsonwebtoken");
const { pool } = require("../../utils/dbConnection");

exports.checkAuth = (req, res, next) => {
    try {
        jwt.verify(req.headers.token, process.env.JWT_KEY, async (error, decode) => {
            if (error) {
                error.status = 403;
                next(error);
            }
            else {
                const userId = decode.id;
                const data = await pool.query("select * from users where id =$1", [userId]);
                if (data.rowCount == 0) {
                    const error = new Error("Authentication Failed!!");
                    error.status = 403;
                    next(error);
                } else {
                    req.userData = decode;
                    next();
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
}