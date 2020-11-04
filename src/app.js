const express = require("express");
const app = express();
const { checkIfUnique, addToList } = require("./helpers/database.js");
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
