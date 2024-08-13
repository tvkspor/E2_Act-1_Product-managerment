const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");
require("dotenv").config();

const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT;

const routeAdmin = require("./routes/admin/index.router");
const route = require("./routes/client/index.router");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

const systemConfig = require("./config/system");

//TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

// App local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Flash
app.use(cookieParser("TUAN"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// Routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
