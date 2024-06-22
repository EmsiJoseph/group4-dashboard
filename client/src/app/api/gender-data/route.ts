import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const results = await query(
      `
      SELECT
        SUM(gender = 'Male') AS male_count,
        SUM(gender = 'Female') AS female_count,
        SUM(gender = 'Other') AS other_count,
        COUNT(*) AS total_count
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
