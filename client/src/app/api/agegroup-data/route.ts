// src/api/agegroup-data/route.ts

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const results = await query(
      `
      SELECT
          CASE
              WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 0 AND 9 THEN '0-9'
              WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 10 AND 19 THEN '10-19'
              WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 20 AND 29 THEN '20-29'
              WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 30 AND 39 THEN '30-39'
              WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 40 AND 49 THEN '40-49'
              ELSE '50+'
          END AS age_group,
          COUNT(*) AS count
      FROM
          form_data.user_info
      GROUP BY
          age_group
      ORDER BY
          FIELD(age_group, '0-9', '10-19', '20-29', '30-39', '40-49', '50+')
      `
    );

    return NextResponse.json(results);
  } catch (error) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Error fetching data:', errorMessage);
    return NextResponse.json(
      { error: `Error fetching data: ${errorMessage}` },
      { status: 500 }
    );
  }
}