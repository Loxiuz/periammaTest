import mysql from "mysql2";
import "dotenv/config";
import fs from "fs";

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

if (process.env.MYSQL_CERT) {
  connection.ssl = { cs: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") };
}

export default connection;
