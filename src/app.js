const express = require("express");
const app = express();
const {
  checkIfUnique,
  addToList,
  getEmails,
  getData,
} = require("./helpers/database.js");
const { sendEmail } = require("./helpers/email.js");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

app.use(express.json());
app.set("trust-proxy", 1);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 5,
  })
);
app.use(helmet());

app.post("/add-email", async (req, res) => {
  const { email } = req.body;

  try {
    const uniqueEmail = await checkIfUnique(email);

    if (!uniqueEmail) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already on our list" });
    }

    await addToList(email);
    res
      .status(200)
      .json({ success: true, msg: "Email successfully added to our list" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error, please try again later" });
  }
});

app.get("/send-emails", async (req, res) => {
  try {
    const data = await getData();
    const emails = await getEmails();
    await sendEmail(data, emails);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
