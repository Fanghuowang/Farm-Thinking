import React from "react";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";

const VPD_MIN = 0;
const VPD_MAX = 4;

function calcVPD(tempC, humidityPct) {
  const svp = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  return svp * (1 - humidityPct / 100);
}

function vpdColor(vpd) {
  if (vpd < 0.4) return "#3B82F6";
  if (vpd < 0.8) return "#10B981";
  if (vpd < 1.2) return "#22C55E";
  if (vpd < 1.5) return "#F59E0B";
  if (vpd < 2.0) return "#F97316";
  return "#EF4444";
}

function vpdLabel(vpd) {
  if (vpd < 0.4) return "Too Low";
  if (vpd < 0.8) return "Low";
  if (vpd < 1.2) return "Optimal";
  if (vpd < 1.5) return "Moderate";
  if (vpd < 2.0) return "High";
  return "Critical";
}

function GaugeSVG({ value }) {
  const clamped = Math.min(Math.max(value, VPD_MIN), VPD_MAX);
  const pct = clamped / VPD_MAX;
  const angle = pct * 180;
  const rad = (angle * Math.PI) / 180;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const needleLen = 55;
  const nx = cx + needleLen * Math.cos(Math.PI - rad);
  const ny = cy - needleLen * Math.sin(Math.PI - rad);
  const color = vpdColor(clamped);

  return (
    <svg width="180" height="100" viewBox="0 0 180 100">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${pct * Math.PI * r} ${Math.PI * r}`}
        opacity="0.9"
      />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill={color} />
      <text x={cx - r + 5} y={cy - 5} fontSize="10" fill="#A0AEC0">0</text>
      <text x={cx + r - 15} y={cy - 5} fontSize="10" fill="#A0AEC0">4</text>
      <text x={cx - 10} y={cy + 16} fontSize="12" fill="#A0AEC0">kPa</text>
    </svg>
  );
}

export default function VPDGauge({ temperature, humidity }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtextColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  const bgColor = useColorModeValue("white", "navy.700");

  if (temperature == null || humidity == null) return null;

  const vpd = calcVPD(temperature, humidity);
  const color = vpdColor(vpd);

  return (
    <Box
      bg={bgColor}
      p="20px"
      borderRadius="16px"
      boxShadow="sm"
    >
      <Text fontSize="md" fontWeight="bold" color={textColor} mb="12px">
        VPD Gauge
      </Text>
      <Flex direction="column" align="center">
        <GaugeSVG value={vpd} />
        <Text fontSize="2xl" fontWeight="bold" color={color} mt="8px">
          {vpd.toFixed(2)} kPa
        </Text>
        <Text fontSize="sm" color={subtextColor}>
          {vpdLabel(vpd)}
        </Text>
      </Flex>
    </Box>
  );
}
