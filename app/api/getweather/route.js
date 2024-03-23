import { NextResponse } from "next/server";
import axios from "axios";
const baseUrl = "https://aviationweather.gov";

// this routes updates exchangerates from binance in a table in supabase every x minutes
export async function GET(req, res) {
  //   // Check headers to get token
  //   const authorization = req.headers.get("Authorization")
  //   if (!authorization) return NextResponse.json({ error: "No token provided" }, { status: 401 })
  //   const token = authorization?.replace("Bearer ", "")
  //   if (token !== process.env.CRON_SECRET) return NextResponse.json({ error: "Invalid Token" }, { status: 401 })

  try {
    const tafUrl = `${baseUrl}/api/data/taf`;

    const id = "MMTJ";
    const { data } = await axios.get(tafUrl, {
      params: {
        ids: id,
        format: "json", // Assuming you want the response in JSON format
      },
    });

    const fcsts = data[0].fcsts;
    fcsts.map((fcst) => {
      fcst.clouds.map((cloud) => {
        if (cloud.cover === "OVC" || cloud.cover === "BKN") {
          if (cloud.base > 513) {
            cloud.runway = "27";
          } else if (cloud.base <= 513) {
            cloud.runway = "9";
          }
        }
      });
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("error in conversion", error);
    return NextResponse.json({ error: "An error happened " }, { status: 500 });
  }
}
