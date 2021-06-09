const express = require("express");
const app = express();
const dotenv = require("dotenv");
const db = require("./models");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "./.env" });

app.get("/", (req, res) => {
  res.status(200).send({
    message: `Welcome to order Anything Application from kilobyte. Now use '/signUp' route with 'GET' method to know the necessary parameters and roles for registering to get started. If you have already registered then use '/login' route with 'POST' method and your credentials.`,
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//routes
require("./routes/r-index")(app);

const PORT = process.env.PORT;
let addItem;

//preload items and roles data
db.sequelize
  .sync({ force: false })
  .then(async () => {
    await db.roles.bulkCreate([
      { role: "Customer" },
      { role: "Delivery Person" },
      { role: "Admin" },
    ]);
    let hashedPassword = await bcrypt.hash("admin123", 8);
    let getAdminRoleId = await db.roles.findOne({ where: { role: "Admin" } });
    await db.users.create({
      phoneNo: "0123456789",
      password: hashedPassword,
      roleID: getAdminRoleId.roleID,
    });
    addItem = await db.items.create({
      itemName: "chips",
      itemCategory: "Food and Beverages",
    });
    await db.pickUpLocations.bulkCreate([
      {
        pickUpLocationAddress: "24x7 Sector 54, Gurgaon",
        lat: "12.21",
        long: "28.72",
        itemID: addItem.itemID,
      },
      {
        pickUpLocationAddress: "Big Bazaar, Sector 25, Gurgaon",
        lat: "12.23",
        long: "28.79",
        itemID: addItem.itemID,
      },
    ]);
    addItem = await db.items.create({
      itemName: "disprin",
      itemCategory: "pharmacy",
    });
    db.pickUpLocations.bulkCreate([
      {
        pickUpLocationAddress: "Apollo Medicine, Sector 63, Gurgaon",
        lat: "12.25",
        long: "28.52",
        itemID: addItem.itemID,
      },
      {
        pickUpLocationAddress: "Apollo Medicine, Sector 22, Gurgaon",
        lat: "12.20",
        long: "28.29",
        itemID: addItem.itemID,
      },
    ]);
    app.listen(PORT, () => {
      console.log(`App is Running at the PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Could Not connect to database ${err}`);
  });
