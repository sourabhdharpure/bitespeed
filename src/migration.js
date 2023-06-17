const { connect, getPromiseConnection } = require('./startup/mysql');
const fs = require('fs');
const migrationSql = fs.readFileSync(__dirname + '/migration.sql', 'utf-8');

const startMigration = async () => {
    connect(null, async (err) => {
        if (err) {
            console.log('Unable to connect to MySQL.');
            process.exit(1);
        } else {
            const pool = getPromiseConnection();
            const connection = await pool.getConnection();
            try {
                const res = await connection.query(migrationSql)
                console.log("Result: ", res);
            } catch (error) {
                console.error(`Error running migraition: ${error}`);
                connection.end();
                return;   
            }
            console.log("Migration ran successfully");
            connection.release();
            process.exit(0);
        }
    })
}

startMigration();
