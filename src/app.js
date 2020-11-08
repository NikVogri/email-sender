const express = require("express");
const app = express();
const {
  checkIfUnique,
  addToList,
  getEmails,
  getData,
  bindCountriesToEmail,
  getCountryList,
} = require("./helpers/database.js");
const { sendEmail } = require("./helpers/email.js");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.set("trust-proxy", 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 5,
  })
);
app.use(helmet());

app.post("/add-email", async (req, res) => {
  const { email, countries } = req.body;

  try {
    const uniqueEmail = await checkIfUnique(email);

    if (!uniqueEmail) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already on our list" });
    }

    await addToList(email);
    await bindCountriesToEmail(email, countries);

    res
      .status(200)
      .json({ success: true, msg: "Email successfully added to our list" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "Server error, please try again later" });
  }
});

app.get("/send-emails", async (req, res) => {
  try {
    const data = await getData();
    const emails = await getEmails();

    for (let i = 0; i < emails.length; i++) {
      let data = [];
      const countryList = await getCountryList(emails[i].id);

      for (let j = 0; j < countryList.length; j++) {
        data.push(await getData(countryList[j].country));
      }

      await sendEmail(data, emails[i].email);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
