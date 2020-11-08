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
  const query = "SELECT * FROM email_list WHERE email = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [email], (err, result) => {
      if (err) return reject(new Error(err.message));
      resolve(!result.length);
    });
  });
};

exports.addToList = async (email) => {
  const query = "INSERT INTO email_list (email) VALUES (?)";
  return new Promise((resolve, reject) => {
    connection.query(query, [email], (err) => {
      if (err) return reject(new Error(err.message));
      resolve();
    });
  });
};

exports.bindCountriesToEmail = async (email, countries) => {
  const query = `INSERT INTO email_country (country, email_id, created_at) VALUES ?`;
  return new Promise(async (resolve, reject) => {
    try {
      const emailId = await getEmailId(email);
      const queryData = countries.map((country) => [
        country,
        emailId,
        new Date(),
      ]);
      connection.query(query, [queryData], (err, results, a) => {
        if (err) return reject(new Error(err.message));
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

const getEmailId = async (email) => {
  const query = `SELECT * FROM email_list WHERE email = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [email], (err, results) => {
      if (err) reject(new Error(err.message));
      resolve(results[0].id);
    });
  });
};

exports.getCountryList = async (emailId) => {
  const query = `SELECT * FROM email_country WHERE email_id = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [emailId], (err, results) => {
      if (err) reject(new Error(err.message));
      return resolve(results);
    });
  });
};

exports.getData = async (country) => {
  const query = `SELECT * FROM countries WHERE country = ?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [country], (err, results) => {
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
      resolve(
        results.map((result) => ({ email: result.email, id: result.id }))
      );
    });
  });
};
