import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req) {
  const { feedback } = await req.json();
  console.log(feedback);

  const email = `<html>
              <style>
                body {
                  background-color: #121212;
                  color: #fff;
                  font-family: Arial, sans-serif;
                  display: flex;
                    justify-content: center;
                    align-items: center;
                    
                }
                h1 {
                  color: #f0f0f0;
                }
                p {
                  margin: 1em 0;
                }
                a {
                  color: #0070f3;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
                <body>
                    <h1>Feedback | Mintcode Ai</h1>
                    <p>${feedback}</p>
                </body>
            </html>`;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const response = await resend.emails.send({
      from: "ai@thebandbaja.live",
      to: "adilsarfr00@gmail.com",
      subject: "Feedback | Mintcode Ai",
      html: email,
    });

    console.log("Feedback sent:", response);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.error(error, 500);
  }
}
