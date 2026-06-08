const express = require("express");
const app = express();

app.use(express.json());

function formatName(rawName) {
  if (!rawName) return "there";

  if (typeof rawName === "object") {
    return rawName.name || rawName.original || rawName.displayName || "there";
  }

  return rawName;
}

function formatDate(rawDate) {
  if (!rawDate) return "";

  if (typeof rawDate === "object") {
    const year = rawDate.year || "";
    const month = rawDate.month || "";
    const day = rawDate.day || "";

    if (year && month && day) {
      return `${day}-${month}-${year}`;
    }
  }

  return rawDate;
}

function formatTime(rawTime) {
  if (!rawTime) return "";

  if (typeof rawTime === "object") {
    const hours = rawTime.hours ?? "";
    const minutes = rawTime.minutes ?? 0;

    if (hours !== "") {
      const formattedMinutes = String(minutes).padStart(2, "0");
      return `${hours}:${formattedMinutes}`;
    }
  }

  return rawTime;
}

app.post("/", (req, res) => {
  const params = req.body.sessionInfo?.parameters || {};
  const tag = req.body.fulfillmentInfo?.tag || "";

  const name = formatName(params.name);
  const phone = params.phone || "";
  const service = params.service_type || "";
  const date = formatDate(params.date);
  const time = formatTime(params.time);

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
