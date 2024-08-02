import { createPool } from 'mysql2/promise';

// import config from '../config/config.json' assert { type: 'json' };

// const pool = createPool({
//     host: config.host,
//     user: config.user,
//     database: config.database,
//     password: config.password,
// });


const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DATABASE || 'railway',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
});
    
try {
    const connection = pool.getConnection(); 
    if(connection)
        console.log('Connected to the database'+connection);
} catch (err) {
    console.error('Error connecting to database:', err);
}
    
export default pool;