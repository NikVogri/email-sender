const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_NAME,
  password: process.env.DB_PW,
  database: process.env.DB_DB,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

exports.checkIfUnique = async (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM email_list WHERE email = ?",
      [email],
      (err, result, fields) => {
        if (err) return reject(new Error(err.message));
        resolve(!result.length);
      }
    );
  });
};

exports.addToList = async (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO email_list (email) VALUES (?)",
      [email],
      (err) => {
        if (err) return reject(new Error(err.message));
        resolve();
      }
    );
  });
};

exports.getData = async () => {
  const query = `SELECT * FROM countries WHERE country = 'Slovenia'`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(new Error(err.message));
      return resolve(results[results.length - 1]);
    });
  });
};

exports.getEmails = async () => {
  const query = `SELECT * FROM email_list`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(new Error(err.message));
      resolve(results.map((result) => result.email));
    });
  });
};
