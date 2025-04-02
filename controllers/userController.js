const db = require("../db/queries");

async function usersListGet(req, res) {
  const messages = await db.getAllMessages();
  // console.log("Usernames: ", messages)
  res.render("index", {
    title: "Usernames",
    messages: messages
  })
}

async function usersSearchGet(req, res) {
  const message = await db.searchMessages(req.params.id);
  console.log(message)
  res.render("messageDetails", 
    {
      message: message[0]
    });
}

module.exports = {
    usersListGet,
    usersSearchGet
  };