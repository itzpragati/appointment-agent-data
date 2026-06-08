const express = require("express");

const app = express();

app.use(express.json());

app.post("/", (req, res) => {

  const params = req.body.sessionInfo?.parameters || {};

  const name = params.name || "";
  const service = params.service_type || "";
  const date = params.date || "";
  const time = params.time || "";
  const phone = params.phone || "";

  res.json({
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: [
              `Appointment confirmed for ${name}. Service: ${service}. Date: ${date}. Time: ${time}. Phone: ${phone}`
            ]
          }
        }
      ]
    }
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Webhook running");
});
