import React, { useState, useEffect } from "react";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";

const API_URL = "http://localhost:8000/api/savings";

export default function EnergySavingsCard({ sensorData }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtextColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  const bgColor = useColorModeValue("white", "navy.700");
  const [savings, setSavings] = useState(null);

  useEffect(() => {
    if (!sensorData) return;
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sensor_data: sensorData }),
    })
      .then((r) => r.json())
      .then(setSavings)
      .catch(() => {});
  }, [sensorData?.timestamp]);

  if (!savings) return null;

  return (
    <Box bg={bgColor} p="20px" borderRadius="16px" boxShadow="sm">
      <Text fontSize="md" fontWeight="bold" color={textColor} mb="16px">
        Energy & Resource Savings
      </Text>

      <Flex justify="space-between" mb="12px">
        <Box>
          <Text fontSize="xs" color={subtextColor}>Fixed Schedule</Text>
          <Text fontSize="lg" fontWeight="bold" color="red.400">
            RM {savings.fixed_schedule_cost_rm}
          </Text>
        </Box>
        <Box>
          <Text fontSize="xs" color={subtextColor}>AI Optimized</Text>
          <Text fontSize="lg" fontWeight="bold" color="green.400">
            RM {savings.ai_optimized_cost_rm}
          </Text>
        </Box>
      </Flex>

      <Box bg="green.50" p="12px" borderRadius="10px" mb="12px">
        <Flex justify="space-between" align="center">
          <Text fontSize="sm" fontWeight="600" color="green.700">
            Daily Savings
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="green.600">
            RM {savings.rm_saved}
          </Text>
        </Flex>
      </Box>

      <Flex gap="16px">
        <Box flex="1" bg="blue.50" p="10px" borderRadius="8px">
          <Text fontSize="xs" color="blue.600" fontWeight="600">Peak kWh Avoided</Text>
          <Text fontSize="md" fontWeight="bold" color="blue.700">{savings.kwh_saved}</Text>
        </Box>
        <Box flex="1" bg="cyan.50" p="10px" borderRadius="8px">
          <Text fontSize="xs" color="cyan.600" fontWeight="600">Water Saved</Text>
          <Text fontSize="md" fontWeight="bold" color="cyan.700">{savings.water_saved_litres} L</Text>
        </Box>
      </Flex>
    </Box>
  );
}
