const express = require("express");
const app = express();

app.use(express.json());

app.post("/", (req, res) => {
  const params = req.body.sessionInfo?.parameters || {};
  const tag = req.body.fulfillmentInfo?.tag || "";

  const rawName = params.name;
  const name =
    typeof rawName === "object"
      ? rawName.name || rawName.original || "there"
      : rawName || "there";

  const phone = params.phone || "";
  const service = params.service_type || "";
  const date = params.date || "";
  const time = params.time || "";

  if (tag === "show_available_slots") {
    return res.json({
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: [
                `Available slots for ${service}: 3 March at 10 AM, 3 March at 4 PM, and 4 March at 11 AM. Please choose your preferred date and time.`
              ]
            }
          }
        ]
      }
    });
  }

  if (tag === "confirm_booking") {
    return res.json({
      fulfillmentResponse: {
        messages: [
          {
            text: {
              text: [
                `Appointment confirmed for ${name}. Service: ${service}. Date: ${date}. Time: ${time}. Phone: ${phone}.`
              ]
            }
          }
        ]
      }
    });
  }

  return res.json({
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: ["Webhook called, but no valid tag was received."]
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
