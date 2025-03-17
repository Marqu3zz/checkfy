import {Pool} from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Connected to database successfully!');
});

pool.on('error', (err) => {
    console.error(`Error of connection database: ${err.message}`);
});

export default pool;
