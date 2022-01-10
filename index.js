const express = require('express');
const mysql = require('mysql2');

// Should be kept as environment variable
const mysqlConfig = {
  host: process.env.MYSQL_DATABASE || 'mysql_server',
  user: process.env.MYSQL_USER || 'student',
  password: process.env.MYSQL_PASSWORD || 'secret',
  database: process.env.MYSQL_ROOT_PASSWORD || 'test_db',
};

const port = process.env.PORT || 3000;
// Connecting to mysql container
const con = mysql.createConnection(mysqlConfig);
con.connect(function (err) {
  if (err) throw err;
  console.log('connected');
});

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Testing my server');
});

app.get('/teacher/:teacherID', function (req, res) {
  const sql = `SELECT name from Teachers WHERE idTeachers=${req.params.teacherID}`;
  con.query(sql, function (err, result) {
    console.log(sql);
    if (err) throw err;
    res.send(result);
  });
});

app.get('/pupil/:pupilID', function (req, res) {
  const id = req.params.pupilID;
  const sql = `SELECT Pupil_name from Pupils WHERE idPupils=${id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result[0].Pupil_name);
    res.send(result);
  });
});

app.get('/subject/:subjectID', function (req, res) {
  const sql = ` SELECT Subject_name from Subjects WHERE idSubjects=${req.params.subjectID}`;
  con.query(sql, function (err, result) {
    console.log(sql);
    if (err) throw err;
    res.send(result);
  });
});

app.post('/new/:table', function (req, res) {
  const table = req.params.table;
  const { content } = req.body;
  console.log(content, table);
  const sql = `INSERT INTO ${table}
  VALUES (${content});  `;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(' inserted');
  });
});
// ** Update By ID ** //
app.put('/update/:tableName', function (req, res) {
  const { tableName } = req.params;
  const { id, set } = req.body;

  const sql = `Update ${tableName} 
                  SET ${set.key} = '${set.value}'
                  WHERE id${tableName} = '${id}'`;
  con.query(sql, function (err, result, fields) {
    console.log(result);
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.delete('/remove/:table/:ID', function (req, res) {
  const { table, ID } = req.params;
  const sql = `
  DELETE FROM ${table} WHERE id${table}=${ID};
  `;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send('deleted');
  });
});

//  Creating first table "numbers"
// app.get('/create-table', function (req, res) {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS numbers (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       number INT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     ) ENGINE=INNODB;
//   `;
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     res.send('numbers table created');
//   });
// });

// // Adding a random number ti "numbers" table
// app.get('/insert', function (req, res) {
//   const number = Math.round(Math.random() * 100);
//   const sql = `INSERT INTO numbers (number) VALUES (${number})`;
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     res.send(`${number} inserted into table`);
//   });
// });

// Fetching number's table
app.get('/fetch/:table', function (req, res) {
  const sql = `SELECT * FROM ${req.params.table}`;
  con.query(sql, function (err, result, fields) {
    console.log(result);
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

app.listen(port, () => {
  console.log(`running on ${port}`);
});
