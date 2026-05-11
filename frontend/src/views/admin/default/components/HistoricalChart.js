import React, { useMemo } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import Chart from "react-apexcharts";

export default function HistoricalChart({ history }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtextColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  const bgColor = useColorModeValue("white", "navy.700");
  const gridColor = useColorModeValue("#E2E8F0", "rgba(135, 140, 189, 0.3)");

  const series = useMemo(() => {
    if (!history || history.length === 0) return [];
    return [
      {
        name: "Temperature",
        data: history.map((d) => ({
          x: new Date(d.timestamp).getTime(),
          y: d.temperature,
        })),
      },
      {
        name: "Humidity",
        data: history.map((d) => ({
          x: new Date(d.timestamp).getTime(),
          y: d.humidity,
        })),
      },
    ];
  }, [history]);

  const options = useMemo(
    () => ({
      chart: { toolbar: { show: false }, zoom: { enabled: false } },
      colors: ["#01B574", "#3B82F6"],
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        type: "datetime",
        labels: { style: { colors: subtextColor }, datetimeFormatter: { hour: "HH:mm" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: [
        { title: { text: "Temp (C)", style: { color: subtextColor } }, min: 10, max: 35 },
        { opposite: true, title: { text: "Humidity (%)", style: { color: subtextColor } }, min: 30, max: 100 },
      ],
      grid: { borderColor: gridColor, strokeDashArray: 3 },
      tooltip: { x: { format: "HH:mm:ss" } },
      legend: { position: "top", fontSize: "12px", labels: { colors: subtextColor } },
    }),
    [subtextColor, gridColor]
  );

  return (
    <Box bg={bgColor} p="20px" borderRadius="16px" boxShadow="sm">
      <Text fontSize="md" fontWeight="bold" color={textColor} mb="12px">
        Temperature & Humidity (24h)
      </Text>
      {series.length > 0 ? (
        <Chart options={options} series={series} type="line" height="260" />
      ) : (
        <Text fontSize="sm" color={subtextColor}>Collecting data...</Text>
      )}
    </Box>
  );
}
