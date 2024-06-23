"use client";

import { useState, useEffect } from "react";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Adjust the path if needed

const ReligionCard = () => {
  const { theme } = useTheme();
  const [data, setData] = useState<{ name: string; children: { name: string; value: number }[] }>({ name: "religions", children: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/religion-data");
        const result = await response.json();

        console.log("API Response:", result); // Logging API response for debugging

        if (Array.isArray(result) && result.length > 0) {
          const formattedData = {
            name: "religions",
            children: result.map((item: { religion: string; count: number }) => ({
              name: item.religion,
              value: item.count,
            })),
          };
          console.log("Formatted Data:", formattedData); // Logging formatted data for debugging
          setData(formattedData);
        } else {
          console.warn("No data received from API or data is not in the expected format.");
          setData({ name: "religions", children: [] });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setData({ name: "religions", children: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const themeSettings = {
    textColor: theme === "dark" ? "#ffffff" : "#333333",
    tooltip: {
      container: {
        background: theme === "dark" ? "#333333" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#333333",
      },
    },
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Religion Distribution</CardTitle>
        <CardDescription>Overview of user religions</CardDescription>
      </CardHeader>
      <CardContent className="w-full h-[400px]">
        {loading ? (
          <div className="skeleton-loader w-full h-full" />
        ) : (
          <ResponsiveTreeMap
            data={data} // Updated to use data instead of root
            identity="name"
            value="value"
            innerPadding={3}
            outerPadding={3}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            label={(node) => `${node.id}: ${node.value}`}
            labelSkipSize={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.2]],
            }}
            theme={themeSettings}
            colors={{ scheme: "nivo" }}
            animate={true}
            motionConfig="gentle"
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.1]],
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReligionCard;
