const pool = require("./pool");

require('dotenv').config();

async function createUser(fName, lName, username, password, membership) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [fName, lName, username, password, membership]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw err; // Re-throw the error to be handled by the caller
    } finally {
      client.release();
    }
  }

async function findUserByUsername(username) {
    console.log(username)
    const client = await pool.connect();
    try {
        const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
        );
        console.log(result.rows[0])
        return result.rows[0];
    } catch (err) {
        console.error('Error finding user:', err);
        throw err;
    } finally {
        client.release();
    }
}

async function findUserById(id) {
    const client = await pool.connect();
    try {
        const result = await client.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
        );
        return result.rows;
    } catch (err) {
        console.error('Error finding user:', err);
        throw err;
    } finally {
        client.release();
    }
}


module.exports = {
    createUser, 
    findUserByUsername,
    findUserById
};