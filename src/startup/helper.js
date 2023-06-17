const db = require('./mysql');


const sqlExecutorAsync = async (req, res, statement, values) => {
    const pool = db.getPromiseConnection();
    return await queryExecutor(statement, values, pool);
  };


const queryExecutor = async (statement, values, pool) => {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      const [rows] = await connection.query(statement, values);
      await connection.commit();
      connection.release();
      return { status: 'success', data: rows };
    } catch (err) {
      if(connection !== undefined) {
        await connection.rollback();
        connection.release();
      }
      return {status: 'error', msg: 'Unexpected error occurred', err};
    }
  };
  
  module.exports = {
    sqlExecutorAsync
  }