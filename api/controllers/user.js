const { pool } = require("../../utils/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { convertTime } = require("../../utils/convertTime");

const isValid = (value) => {
    return value != null && value != "";
}

const validateUser = async (user, cb) => {
    const error = new Error();
    error.status = 400;
    if (!isValid(user.name)) {
        error.message = "Name cannot be null or empty!!";
        cb(error);
    }
    if (!isValid(user.email)) {
        error.message = "Email cannot be null or empty!!";
        cb(error);
    }
    if (!isValid(user.password)) {
        error.message = "Password cannot be null or empty!!";
        cb(error);
    }
    if (user.age < 18 || user.age > 65) {
        error.message = "Age should be between 18 to 65!!";
        cb(error);
    }
    try {
        const data = await pool.query("select count(*) from users where email=$1", [user.email]);
        if (data.rows[0]['count'] > 0) {
            error.message = "User already exists!!";
            cb(error);
        }
        else {
            cb(null);
        }
    }
    catch (error) {
        cb(error);
    }
};

exports.registerUser = (req, res, next) => {
    const { name, email, password, age, gender } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            next(err);
        }
        else {
            validateUser({ name, email, password, age, gender }, (err) => {
                if (err) next(err);
                else {
                    var date = new Date();
                    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1).toDateString();
                    const queryText = "insert into users(name,email,password,age,gender,due_date) values($1,$2,$3,$4,$5,$6) returning *";
                    const queryValues = [name, email, hash, age, gender, lastDay];
                    pool.query(queryText, queryValues, (err, data) => {
                        if (err) next(err)
                        else {
                            if (data.rowCount > 0) {
                                res.status(201).json({
                                    message: "user created successfully",
                                    data: data.rows[0]
                                })
                            } else {
                                res.status(500).json({
                                    message: "something went wrong"
                                })
                            }
                        };
                    });
                };
            });
        };
    });
};

exports.loginUser = (req, res, next) => {
    try {
        const authFailedErr = new Error("Authentication failed!!");
        authFailedErr.status = 401;
        const queryText = "select id,name,email,password from users where email=$1";
        const queryValues = [req.body.email];
        pool.query(queryText, queryValues, (err, data) => {
            if (err) next(err);
            else if (data.rowCount < 1) {
                next(authFailedErr);
            }
            else {
                const { password, email, name, id } = data.rows[0];
                bcrypt.compare(req.body.password, password, (err, result) => {
                    if (err) next(err);
                    else if (result == false) {
                        next(authFailedErr);
                    }
                    else {
                        const token = jwt.sign({
                            id: id,
                            name: name,
                            email: email
                        }, process.env.JWT_KEY, {
                            expiresIn: "1h"
                        })
                        res.status(200).json({
                            message: "Authentication successful!!",
                            token: token
                        })

                    }
                })
            }
        })
    }
    catch (error) {
        console.error(`Debug: ${error}`);
        res.status(500).json({
            message: "Internal sever error"
        });
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.userData.id;
        const queryText = "SELECT json_build_object('name', users.name,'email', users.email,'age',users.age,'gender',users.gender,'end_date',users.end_date,'due_date',users.due_date,'curr_batch',(SELECT row_to_json(batch) FROM batch WHERE users.curr_batch = batch.id),'next_batch',(SELECT row_to_json(batch) FROM batch WHERE users.next_batch = batch.id)) json FROM users where users.id=$1";
        const queryValues = [userId];
        const userDetails = await (await pool.query(queryText, queryValues)).rows[0]['json'];
        if (userDetails["curr_batch"] != null) {
            const timings = convertTime(userDetails["curr_batch"]["start_time"], userDetails["curr_batch"]["duration"]);
            userDetails["curr_batch"]["timings"] = timings;
        }
        if (userDetails["next_batch"] != null) {
            const timings = convertTime(userDetails["next_batch"]["start_time"], userDetails["next_batch"]["duration"]);
            userDetails["next_batch"]["timings"] = timings;
        }
        userDetails["payment_status"] = req.paymentStatus;
        res.status(req.paymentStatus ? 200 : 402).json({
            user: userDetails,
        })

    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.userData.id;
        const batchId = req.body.batch_id;
        const userDetails = (await pool.query("select curr_batch,next_batch,end_date from users where id=$1", [userId])).rows[0];
        let currBatch = userDetails["curr_batch"];
        let nextBatch = userDetails["next_batch"];
        if (userDetails["curr_batch"] != null) nextBatch = batchId;
        else currBatch = batchId;
        await pool.query("update users set curr_batch = $1, next_batch = $2 where id = $3", [currBatch, nextBatch, userId]);
        return res.status(200).json({
            message: "Batch updated!!"
        });
    } catch (error) {
        next(error);
    }
}

