const pool = require("./pool");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM posts");
  return rows;
}

async function searchMessages(id) {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id::TEXT LIKE ($1)", [id]);
  return rows;
}


module.exports = {
    getAllMessages,
    searchMessages
};
