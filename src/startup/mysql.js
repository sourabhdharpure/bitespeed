'use strict';

const mysql = require('mysql2');
const globalConfig = require('../config/mysql.json');

const zonalConfig = {
    host: process.env.DB_HOST ?? 'localhost',
    database: process.env.DB_NAME ?? 'bitespeed',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? 'root',
    debug: false,
    ssl: false,
};

const state = {
  pool: null,
  readPool: null,
  mode: null,
};

function getDbServerConfig() {
  const zoneConfig = zonalConfig;
  return Object.assign({}, globalConfig, zoneConfig);
}


const connect = (mode, callback) => {
  const config = getDbServerConfig();
  const pool = mysql.createPool(config);
  state.pool = pool;
  state.promisePool = pool.promise();
  callback();
};

const connectDb = () => {
  db.connect(null, (err) => {
    if (err) {
      console.log('Unable to connect to MySQL.');
      process.exit(1);
    } else {
  
      httpServer.listen(PORT, async () => {
        console.log(`App listening started on port ${PORT}`);
      });
    }
  });
}

const getConnection = () => state.pool;

const getPromiseConnection = () => state.promisePool;


const closeConnections = () => {
  state.pool.end();
  state.promisePool.end();
};

module.exports = {
  connect,
  getConnection,
  getPromiseConnection,
  closeConnections,
};
