const sgMail = require("@sendgrid/mail");
require("dotenv").config();

exports.sendEmail = async (data, emails) => {
  return new Promise((resolve, reject) => {
    try {
      sgMail.setApiKey(process.env.SENDGRID_KEY);

      const msg = {
        to: emails,
        from: "tracker.virus2020@gmail.com",
        subject: `Daily Virus Briefing ${data.created_at.toLocaleString()}`,
        html: `
        <table>
          <thead>
            <tr>
            <th>New Cases</th>
            <th>New Deaths</th>
            <th>Total Infected</th>
          </tr>
          </thead>

          <tbody>
            <tr>
              <td><strong>+${data.newCases}</strong></td>
              <td>+${data.newDeaths}</td>
              <td>${data.totalCases}</td>
            </tr>
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
        sgMail.sendMultiple(msg);
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
