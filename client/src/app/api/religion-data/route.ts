// api/religion-data/route.ts

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const results = await query(`
      SELECT religion, COUNT(*) as count
      FROM user_info
      GROUP BY religion;
    `);

    // This automatically formats the results as an array of objects
    // [{ "religion": "Religion1", "count": 10 }, { "religion": "Religion2", "count": 20 }, ...]

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
