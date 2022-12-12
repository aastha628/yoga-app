const { pool } = require("../../utils/dbConnection")
const { convertTime } = require("../../utils/convertTime")

exports.getBatches = (req, res, next) => {
    try {
        pool.connect(async (err, db) => {
            if (err) throw err;
            const data = await pool.query("select * from batch");
            const batchesData = data.rows.map(item => {
                const timings = convertTime(item.start_time, item.duration);
                return {
                    id: item.id,
                    title: item.batch_name,
                    description: item.description,
                    instructorName: item.instructor_name,
                    timings: timings
                }
            })
            res.json({
                message: "data of batches",
                data: batchesData
            });
        })

    }
    catch (error) {
        console.error(`Debug: ${error}`);
        res.status(500).json({
            message: "Internal sever error"
        });
    }
}

exports.batchDetails = async (req, res, next) => {
    try {
        const batchid = req.params.batchID;
        const queryText = "select * from batch where id=$1";
        const queryValues = [batchid];
        const details = await pool.query(queryText, queryValues);
        res.status(200).json({
            message: "Batch details",
            Batch: details
        });
    } catch (error) {
        console.error(`Debug: ${error}`);
        res.status(500).json({
            message: "Internal sever error"
        });
    }
}