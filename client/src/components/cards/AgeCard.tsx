import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';

type AgeGroupData = {
  age_group: string;
  count: number;
};

const AgeCard: React.FC = () => {
  const [data, setData] = useState<AgeGroupData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/agegroup-data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: AgeGroupData[] = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Age Group Distribution</h2>
      <div style={{ height: 400 }}>
        <ResponsiveBar
          data={data}
          keys={['count']}
          indexBy="age_group"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Age Group',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionConfig={{ damping: 15 }}
        />
      </div>
    </div>
  );
};

export default AgeCard;

