import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const results = await query(
      `
      SELECT
        SUM(q1 = 'YES') AS q1_yes,
        SUM(q1 = 'NO') AS q1_no,
        SUM(q2 = 'YES') AS q2_yes,
        SUM(q2 = 'NO') AS q2_no,
        SUM(q3 = 'YES') AS q3_yes,
        SUM(q3 = 'NO') AS q3_no,
        SUM(q4 = 'YES') AS q4_yes,
        SUM(q4 = 'NO') AS q4_no,
        SUM(q5 = 'YES') AS q5_yes,
        SUM(q5 = 'NO') AS q5_no,
        SUM(q6 = 'YES') AS q6_yes,
        SUM(q6 = 'NO') AS q6_no,
        SUM(q7 = 'YES') AS q7_yes,
        SUM(q7 = 'NO') AS q7_no,
        SUM(q8 = 'YES') AS q8_yes,
        SUM(q8 = 'NO') AS q8_no,
        SUM(q9 = 'YES') AS q9_yes,
        SUM(q9 = 'NO') AS q9_no,
        SUM(q10 = 'YES') AS q10_yes,
        SUM(q10 = 'NO') AS q10_no
      FROM user_info;
    `
    );

    return NextResponse.json(results);
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error fetching data:", errorMessage);
    return NextResponse.json(
      { error: `Error fetching data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
