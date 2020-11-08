const sgMail = require("@sendgrid/mail");
require("dotenv").config();

exports.sendEmail = async (data, email) => {
  return new Promise((resolve, reject) => {
    try {
      sgMail.setApiKey(process.env.SENDGRID_KEY);

      let dataList = "";

      data.forEach(
        (val) =>
          (dataList += `
            <tr>
              <td>${val.country}</td>
              <td><strong>+${val.newCases}</strong></td>
              <td>+${val.newDeaths}</td>
              <td>${val.totalCases}</td>
            </tr>
      `)
      );

      const msg = {
        to: email,
        from: "tracker.virus2020@gmail.com",
        subject: `Daily Virus Briefing ${data[0].created_at.toLocaleString()}`,
        html: `
        <table>
          <thead>
            <tr>
            <th>Country</th>
            <th>New Cases</th>
            <th>New Deaths</th>
            <th>Total Infected</th>
          </tr>
          </thead>

          <tbody>
            ${dataList}
          </tbody>
        </table>

        <hr>
        <p>Thank you for subscribing</p>
        <p>Tracker Virus - Created by Nik Vogrinec</p>
        `,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("Emails sent...");
      } else {
        sgMail.send(msg);
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
