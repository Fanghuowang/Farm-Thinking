import React from "react";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import {
  MdThermostat,
  MdWaterDrop,
  MdOpacity,
  MdScience,
  MdInvertColorsOff,
  MdBolt,
  MdWbSunny,
} from "react-icons/md";

const ICONS = {
  temperature: MdThermostat,
  humidity: MdWaterDrop,
  soil_moisture: MdOpacity,
  ph: MdScience,
  reservoir_level: MdInvertColorsOff,
  energy_consumption: MdBolt,
  ambient_light: MdWbSunny,
};

function getStatus(value, low, high) {
  if (value < low || value > high) return "critical";
  const lowWarn = low + (high - low) * 0.15;
  const highWarn = high - (high - low) * 0.15;
  if (value < lowWarn || value > highWarn) return "warning";
  return "ok";
}

const STATUS_COLORS = {
  ok: { bg: "green.100", border: "green.500", icon: "green.600" },
  warning: { bg: "orange.100", border: "orange.400", icon: "orange.500" },
  critical: { bg: "red.100", border: "red.500", icon: "red.500" },
};

export default function SensorTile({ sensorKey, label, value, unit, thresholds }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const status = thresholds ? getStatus(value, thresholds.low, thresholds.high) : "ok";
  const colors = STATUS_COLORS[status];
  const IconComponent = ICONS[sensorKey];

  return (
    <Box
      bg={useColorModeValue("white", "navy.700")}
      borderLeft="4px solid"
      borderColor={colors.border}
      p="18px"
      borderRadius="14px"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
    >
      <Flex align="center" mb="8px">
        {IconComponent && (
          <Flex
            w="36px"
            h="36px"
            borderRadius="10px"
            align="center"
            justify="center"
            bg={colors.bg}
            mr="10px"
          >
            <Icon as={IconComponent} color={colors.icon} w="20px" h="20px" />
          </Flex>
        )}
        <Text fontSize="sm" color="gray.500" fontWeight="500">
          {label}
        </Text>
      </Flex>
      <Flex align="baseline">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          {value}
        </Text>
        {unit && (
          <Text fontSize="sm" color="gray.500" ml="4px">
            {unit}
          </Text>
        )}
      </Flex>
    </Box>
  );
}
