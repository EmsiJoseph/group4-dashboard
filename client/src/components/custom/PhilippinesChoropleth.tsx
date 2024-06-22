"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Province {
  address_province: string;
  count: number;
}

export default function PhilippinesChoropleth() {
  const [geoData, setGeoData] = useState<any>(null);
  const [provinceData, setProvinceData] = useState<Province[]>([]);

  useEffect(() => {
    fetch("/philippines-provinces.geojson")
      .then((response) => response.json())
      .then((data) => setGeoData(data));

    fetch("/api/provinces-data")
      .then((response) => response.json())
      .then((data) => setProvinceData(data));
  }, []);

  if (!geoData || !provinceData) {
    return <div>Loading...</div>;
  }

  const formattedData = provinceData.map((province: Province) => ({
    id: province.address_province,
    value: province.count,
  }));

  const colorScale = (value: number) => {
    if (value > 25) return "#FF0000"; // Red
    if (value > 20) return "#FF7F00"; // Orange
    if (value > 15) return "#FFFF00"; // Yellow
    if (value > 10) return "#7FFF00"; // Light Green
    if (value > 5) return "#00FF00"; // Green
    return "#00FFFF"; // Cyan
  };

  return (
    <TooltipProvider>
      <div style={{ height: "70vh", width: "100%" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 3000 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup center={[122, 12]} zoom={1}>
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const province = formattedData.find(
                    (d) => d.id === geo.properties.NAME_1
                  );
                  const color = province ? colorScale(province.value) : "#EEE";

                  return (
                    <Tooltip key={geo.rsmKey}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          fill={color}
                          stroke="#000"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#F53", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {geo.properties.NAME_1}:{" "}
                          {province ? province.value : "No data"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </TooltipProvider>
  );
}
