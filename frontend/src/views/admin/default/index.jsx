import { Box, Text, Badge, SimpleGrid, Flex, Select, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";
import useSensorData from "hooks/useSensorData";
import SensorTile from "./components/SensorTile";
import VPDGauge from "./components/VPDGauge";
import HistoricalChart from "./components/HistoricalChart";
import EnergySavingsCard from "./components/EnergySavingsCard";
import AIAgronomistPanel from "./components/AIAgronomistPanel";
import DecisionLog from "./components/DecisionLog";
import DemoMode from "./components/DemoMode";

const SENSOR_CARDS = [
  { key: "temperature", label: "Temperature", unit: "C", thresholds: { low: 14, high: 28 } },
  { key: "humidity", label: "Humidity", unit: "%", thresholds: { low: 40, high: 85 } },
  { key: "soil_moisture", label: "Soil Moisture", unit: "%", thresholds: { low: 25, high: 75 } },
  { key: "ph", label: "pH", unit: "", thresholds: { low: 5.0, high: 7.5 } },
  { key: "reservoir_level", label: "Reservoir", unit: "%", thresholds: { low: 15, high: 100 } },
  { key: "energy_consumption", label: "Energy", unit: "kW", thresholds: { low: 0.3, high: 4.5 } },
];

const PLANT_OPTIONS = ["Lettuce", "Strawberry", "Saffron"];

export default function Dashboard() {
  const { sensorData, alerts, connected, history, dismissAlert } = useSensorData();
  const [plantProfile, setPlantProfile] = useState("Lettuce");
  const [demoActive, setDemoActive] = useState(false);
  const panelBg = useColorModeValue("white", "navy.700");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtextColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex align="center" mb="20px" justify="space-between" wrap="wrap" gap="12px">
        <Flex align="center">
          <Text fontSize="2xl" fontWeight="bold">
            Aero-AI Dashboard
          </Text>
          <Badge ml="3" colorScheme={connected ? "green" : "red"} fontSize="sm" px="8px" py="2px" borderRadius="full">
            {connected ? "LIVE" : "DISCONNECTED"}
          </Badge>
        </Flex>
        <Select
          value={plantProfile}
          onChange={(e) => setPlantProfile(e.target.value)}
          w="180px"
          size="sm"
          borderRadius="10px"
          bg={panelBg}
          color={textColor}
        >
          {PLANT_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
        <DemoMode demoActive={demoActive} onToggle={setDemoActive} />
      </Flex>

      {sensorData ? (
        <>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 3, "2xl": 6 }} gap="20px" mb="20px">
            {SENSOR_CARDS.map(({ key, label, unit, thresholds }) => (
              <SensorTile
                key={key}
                sensorKey={key}
                label={label}
                value={sensorData[key]}
                unit={unit}
                thresholds={thresholds}
              />
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 3 }} gap="20px" mb="20px">
            <HistoricalChart history={history} />
            <EnergySavingsCard sensorData={sensorData} />
            <VPDGauge temperature={sensorData.temperature} humidity={sensorData.humidity} />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap="20px">
            <AIAgronomistPanel history={history} plantProfile={plantProfile} />
            <DecisionLog alerts={alerts} dismissAlert={dismissAlert} />
          </SimpleGrid>
        </>
      ) : (
        <Text color={subtextColor}>Waiting for sensor data...</Text>
      )}
    </Box>
  );
}