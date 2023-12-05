"use strict";

import express from "express";
import cors from "cors";
import connection from "./database.js";
import { resolve } from "path";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(8080, () => {
  console.log("App running...");
});

function errorResult(err, result, response) {
  if (err) {
    console.log(err);
  } else {
    response.json(result);
  }
}
app.get("/", (req, res) => res.json({ message: "Connection made!" }));

/* ------------ Sponsors ------------ */
app.get("/sponsors", async (req, res) => {
  connection.query(
    "SELECT * FROM sponsors ORDER BY sponsorName;",
    (err, result) => {
      // print error or respond with result.
      errorResult(err, result, res);
    }
  );
});
app.post("/sponsors", async (req, res) => {
  const reqBody = req.body;

  try {
    const selectResult = await new Promise((resolve, reject) => {
      connection.query("SELECT sponsorId FROM sponsors", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    let randomId = 0;
    const sponsorIds = new Set(
      selectResult.map((id) => {
        return id.sponsorId;
      })
    );

    for (let i = 0; i < 200; i++) {
      randomId = "K" + (Math.floor(Math.random() * 9000) + 1000);
      if (!sponsorIds.has(randomId)) {
        const insertResult = await new Promise((resolve, reject) => {
          connection.query(
            "INSERT INTO sponsors (sponsorId, sponsorName, sponsorEmail, privatErhverv, cprCvr, sponsorPhone, notes, reepayHandlePeriamma, foreningLetId, reepayHandleDonations, paymentPlatform, aktive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              randomId,
              reqBody.sponsorName,
              reqBody.sponsorEmail,
              reqBody.privatErhverv,
              reqBody.cprCvr,
              reqBody.sponsorPhone,
              reqBody.notes,
              reqBody.reepayHandlePeriamma,
              reqBody.foreningLetId,
              reqBody.reepayHandleDonations,
              reqBody.paymentPlatform,
              reqBody.aktive,
            ],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        if (insertResult) {
          console.log("Sponsor added!");
          return res.status(200).json({ message: "Sponsor added!" });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});
