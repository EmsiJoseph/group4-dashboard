import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const results = await query(`
      SELECT address_province, COUNT(*) as count
      FROM user_info
      GROUP BY address_province
    `);

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
