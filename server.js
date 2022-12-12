const http = require("http");

require("dotenv").config();

const app = require("./app");
const HOST = process.env.ENVIRONMENT == "dev"? "localhost":"0.0.0.0";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT,HOST, () => { 
    console.log(`server running on http://${HOST}:${PORT}/`) 
});