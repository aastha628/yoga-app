const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.ENVIRONMENT == 'dev'
});

const connectDb = async () => {
    try {
        await pool.connect();
        console.log("Database connection successful!");
    }
    catch (error) {
        console.log("Database connection failed!");
        console.error(`${error}`);
    }
}

module.exports = { connectDb, pool };
