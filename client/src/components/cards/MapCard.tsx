"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Province {
  address_province: string;
  count: number;
}

const colorScale = (value: number) => {
  if (value > 25) return "#EF4444"; // Red
  if (value > 20) return "#F97316"; // Orange
  if (value > 15) return "#FACC15"; // Yellow
  if (value > 10) return "#4ADE80"; // Light Green
  if (value > 5) return "#22C55E"; // Green
  return "#0EA5E9"; // Cyan
};

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

  const renderLegend = () => (
    <div className="flex justify-center mt-4">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4" style={{ backgroundColor: "#0EA5E9" }}></div>
        <span>0-5</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4" style={{ backgroundColor: "#22C55E" }}></div>
        <span>6-10</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4" style={{ backgroundColor: "#4ADE80" }}></div>
        <span>11-15</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4" style={{ backgroundColor: "#FACC15" }}></div>
        <span>16-20</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4" style={{ backgroundColor: "#F97316" }}></div>
        <span>21-25</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4" style={{ backgroundColor: "#EF4444" }}></div>
        <span>25+</span>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responses origin</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: "70vh", width: "100%", position: "relative" }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1000 }}
            data-tooltip-id="map-tooltip"
          >
            <ZoomableGroup center={[122, 12]} zoom={1}>
              <Geographies geography={geoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const province = formattedData.find(
                      (d) => d.id === geo.properties.NAME_1
                    );
                    const color = province
                      ? colorScale(province.value)
                      : "#EEE";

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={color}
                        stroke="#000"
                        strokeWidth={0.5}
                        data-tooltip-content={`${geo.properties.NAME_1}: ${
                          province ? province.value : "No data"
                        }`}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#F53", outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          <Tooltip id="map-tooltip" />
          {renderLegend()}
        </div>
      </CardContent>
    </Card>
  );
}
