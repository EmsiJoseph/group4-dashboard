"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "../ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMale,
  faFemale,
  faGenderless,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export default function GenderDistro() {
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/api/gender-data")
      .then((response) => response.json())
      .then((data) => {
        const result = data[0]; // Assuming data is an array with one object
        setMaleCount(parseInt(result.male_count, 10));
        setFemaleCount(parseInt(result.female_count, 10));
        setOtherCount(parseInt(result.other_count, 10));
        setTotalCount(parseInt(result.total_count, 10));
      })
      .catch((error) =>
        console.error("Error fetching respondent data:", error)
      );
  }, []);

  const CardItem = ({
    icon,
    gender,
    count,
    bgColor,
    iconColor,
  }: {
    icon: any;
    gender: any;
    count: any;
    bgColor: string;
    iconColor: string;
  }) => (
    <Card
      className={`h-full flex items-center justify-between px-4 py-2 ${bgColor}`}
    >
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={icon} className={`w-5 h-5 ${iconColor}`} />
        <CardDescription className={`text-gray-700 ${iconColor}`}>
          {gender}
        </CardDescription>
      </div>
      <div className={`text-lg font-bold ${iconColor}`}>{count}</div>
    </Card>
  );

  return (
    <div className="col-span-1 grid gap-[12px]">
      <CardItem
        icon={faMale}
        gender="Male"
        count={maleCount}
        bgColor="bg-blue-100"
        iconColor="text-blue-500"
      />
      <CardItem
        icon={faFemale}
        gender="Female"
        count={femaleCount}
        bgColor="bg-pink-100"
        iconColor="text-pink-500"
      />
      <CardItem
        icon={faGenderless}
        gender="Other"
        count={otherCount}
        bgColor="bg-purple-100"
        iconColor="text-purple-500"
      />
      <CardItem
        icon={faUsers}
        gender="Total"
        count={totalCount}
        bgColor="bg-gray-100"
        iconColor="text-gray-500"
      />
    </div>
  );
}
