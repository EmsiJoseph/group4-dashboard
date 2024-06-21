"use client";

import { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ResponsesDistribution = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<
    { question: string; yes: number; no: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/answers-data");
        const result = await response.json();

        const responseData = result[0];
        const formattedData = [
          {
            question: "q1",
            yes: Number(responseData.q1_yes),
            no: Number(responseData.q1_no),
          },
          {
            question: "q2",
            yes: Number(responseData.q2_yes),
            no: Number(responseData.q2_no),
          },
          {
            question: "q3",
            yes: Number(responseData.q3_yes),
            no: Number(responseData.q3_no),
          },
          {
            question: "q4",
            yes: Number(responseData.q4_yes),
            no: Number(responseData.q4_no),
          },
          {
            question: "q5",
            yes: Number(responseData.q5_yes),
            no: Number(responseData.q5_no),
          },
          {
            question: "q6",
            yes: Number(responseData.q6_yes),
            no: Number(responseData.q6_no),
          },
          {
            question: "q7",
            yes: Number(responseData.q7_yes),
            no: Number(responseData.q7_no),
          },
          {
            question: "q8",
            yes: Number(responseData.q8_yes),
            no: Number(responseData.q8_no),
          },
          {
            question: "q9",
            yes: Number(responseData.q9_yes),
            no: Number(responseData.q9_no),
          },
          {
            question: "q10",
            yes: Number(responseData.q10_yes),
            no: Number(responseData.q10_no),
          },
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const themeSettings = {
    textColor: theme === "dark" ? "#ffffff" : "#333333",
    axis: {
      domain: {
        line: {
          stroke: theme === "dark" ? "#777777" : "#dddddd",
        },
      },
      legend: {
        text: {
          fill: theme === "dark" ? "#aaaaaa" : "#555555",
        },
      },
      ticks: {
        line: {
          stroke: theme === "dark" ? "#777777" : "#dddddd",
          strokeWidth: 1,
        },
        text: {
          fill: theme === "dark" ? "#aaaaaa" : "#555555",
        },
      },
    },
    grid: {
      line: {
        stroke: theme === "dark" ? "#444444" : "#dddddd",
      },
    },
    legends: {
      text: {
        fill: theme === "dark" ? "#ffffff" : "#333333",
      },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Responses Distribution</CardTitle>
        <CardDescription>
          The distribution of "Yes" and "No" responses for each question.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-[400px]">
        {loading ? (
          <div className="skeleton-loader w-full h-full" />
        ) : (
          <ResponsiveBar
            data={data}
            keys={["yes", "no"]}
            indexBy="question"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            theme={themeSettings}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Questions",
              legendPosition: "middle",
              legendOffset: 42,
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Responses",
              legendPosition: "middle",
              legendOffset: -50,
              truncateTickAt: 0,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            motionConfig="stiff"
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={(e) =>
              e.id + ": " + e.formattedValue + " in question: " + e.indexValue
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsesDistribution;
