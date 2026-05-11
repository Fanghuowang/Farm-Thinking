import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, Button, Flex, Spinner, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { MdAutoFixHigh } from "react-icons/md";

const API_URL = "http://localhost:8000/api/ai-advisor";

function computeSummary(history) {
  if (!history || history.length === 0) return null;
  const len = history.length;
  const avg = (key) => {
    const sum = history.reduce((a, d) => a + (d[key] || 0), 0);
    return Math.round((sum / len) * 10) / 10;
  };
  return {
    avg_temperature: avg("temperature"),
    avg_humidity: avg("humidity"),
    avg_ph: avg("ph"),
    avg_soil_moisture: avg("soil_moisture"),
    avg_reservoir_level: avg("reservoir_level"),
    data_points: len,
  };
}

export default function AIAgronomistPanel({ history, plantProfile }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const subtextColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  const bgColor = useColorModeValue("white", "navy.700");
  const [recommendation, setRecommendation] = useState(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const summary = computeSummary(history);

  const fetchAdvice = useCallback(() => {
    if (!summary) return;
    setLoading(true);
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_profile: plantProfile || "Lettuce", sensor_summary: summary }),
    })
      .then((r) => r.json())
      .then((data) => {
        setRecommendation(data.recommendation);
        setSource(data.source);
      })
      .catch(() => setRecommendation("Failed to fetch recommendation."))
      .finally(() => setLoading(false));
  }, [summary, plantProfile]);

  useEffect(() => {
    if (summary && summary.data_points >= 5 && !recommendation) {
      fetchAdvice();
    }
  }, [summary, fetchAdvice, recommendation]);

  return (
    <Box bg={bgColor} p="20px" borderRadius="16px" boxShadow="sm" minH="250px">
      <Flex align="center" mb="12px">
        <Text fontSize="md" fontWeight="bold" color={textColor}>
          AI Agronomist
        </Text>
        {source && (
          <Text fontSize="xs" color={subtextColor} ml="8px">
            ({source})
          </Text>
        )}
      </Flex>

      {summary && (
        <SimpleGrid columns={3} gap="8px" mb="14px">
          <Box bg="gray.50" p="8px" borderRadius="8px">
            <Text fontSize="xs" color="gray.500">Avg Temp</Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>{summary.avg_temperature}°C</Text>
          </Box>
          <Box bg="gray.50" p="8px" borderRadius="8px">
            <Text fontSize="xs" color="gray.500">Avg Humidity</Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>{summary.avg_humidity}%</Text>
          </Box>
          <Box bg="gray.50" p="8px" borderRadius="8px">
            <Text fontSize="xs" color="gray.500">Avg pH</Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>{summary.avg_ph}</Text>
          </Box>
          <Box bg="gray.50" p="8px" borderRadius="8px">
            <Text fontSize="xs" color="gray.500">Soil Moisture</Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>{summary.avg_soil_moisture}%</Text>
          </Box>
          <Box bg="gray.50" p="8px" borderRadius="8px">
            <Text fontSize="xs" color="gray.500">Reservoir</Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>{summary.avg_reservoir_level}%</Text>
          </Box>
          <Box bg="gray.50" p="8px" borderRadius="8px">
            <Text fontSize="xs" color="gray.500">Data Points</Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>{summary.data_points}</Text>
          </Box>
        </SimpleGrid>
      )}

      {loading ? (
        <Flex align="center" justify="center" py="20px">
          <Spinner size="md" color="brand.500" />
        </Flex>
      ) : recommendation ? (
        <Text fontSize="sm" color={subtextColor} lineHeight="tall" whiteSpace="pre-wrap">
          {recommendation}
        </Text>
      ) : (
        <Text fontSize="sm" color={subtextColor}>
          Collecting data for analysis ({summary ? summary.data_points : 0} points)...
        </Text>
      )}

      <Button
        mt="14px"
        size="sm"
        leftIcon={<MdAutoFixHigh />}
        variant="brand"
        onClick={fetchAdvice}
        isLoading={loading}
      >
        Refresh Advice
      </Button>
    </Box>
  );
}