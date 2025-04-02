const {Router} = require('express')
const indexRouter = Router()
const usersController = require("../controllers/usercontroller");
const {createUser} = require("../db/passport");

function getCurrentPostgresTimestampLocal() {
  const now = new Date(); // Gets the current date and time in the local timezone

  const year = now.getFullYear();
  // getMonth() is 0-indexed (0 = January), so we add 1
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0'); // 24-hour format
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  // Construct the timestamp string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

indexRouter.get("/", usersController.usersListGet);

indexRouter.get("/new", (req, res) => {
    res.render("form");
});

indexRouter.get("/signup", (req, res) => {
    res.render("signup");
});

indexRouter.post("/new", async (req, res) => {
  try {
    const messageText = req.body.text;
    const messageTitle = req.body.title;
    const messageTime = getCurrentPostgresTimestampLocal()
    await pool.query("insert into posts (username, title, sent, contents) values ($1, $2, $3, $4)", [req.body.username, messageTitle,messageTime,messageText]);
    res.redirect("/");
   } catch (error) {
      console.error(error);
      next(error);
     }
  });

indexRouter.post("/signup", async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, process.env.SECRET);
    const membership = req.body.membership;
    const firstName = req.body.first;
    const lastName = req.body.last;
    createUser(firstName, lastName, username, password, membership)
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = indexRouter;

// app.post("/sign-up", async (req, res, next) => {
//     try {
//      const hashedPassword = await bcrypt.hash(req.body.password, 10);
//      await pool.query("insert into users (username, password) values ($1, $2)", [req.body.username, hashedPassword]);
//      res.redirect("/");
//     } catch (error) {
//        console.error(error);
//        next(error);
//       }
//    });