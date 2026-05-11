import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, Flex, IconButton, Button, useColorModeValue } from "@chakra-ui/react";
import { MdClose, MdWarning } from "react-icons/md";

const API_URL = "http://localhost:8000/api/decision-log";

const DEMO_ACTIONS = [
    { actuator: "fan", command: "on" },
    { actuator: "pump", command: "on" },
    { actuator: "light", command: "dim" },
];

export default function DecisionLog({ alerts = [], dismissAlert }) {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const subtextColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
    const bgColor = useColorModeValue("white", "navy.700");
    const [logEntries, setLogEntries] = useState([]);

    const fetchLog = useCallback(() => {
        fetch(`${API_URL}?limit=30`)
            .then((r) => r.json())
            .then(setLogEntries)
            .catch(() => { });
    }, []);

    useEffect(() => {
        fetchLog();
        const interval = setInterval(fetchLog, 5000);
        return () => clearInterval(interval);
    }, [fetchLog]);

    const triggerDemo = () => {
        DEMO_ACTIONS.forEach((action, i) => {
            setTimeout(() => {
                fetch("http://localhost:8000/api/actuator", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(action),
                })
                    .then(() => fetchLog());
            }, i * 300);
        });
    };

    const allEntries = [
        ...alerts.map((a, i) => ({ ...a, _key: `alert-${i}`, _type: "alert" })),
        ...logEntries.map((e, i) => ({ ...e, _key: `log-${i}`, _type: "log" })),
    ]
        .filter((e) => e.timestamp)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 20);

    return (
        <Box bg={bgColor} p="20px" borderRadius="16px" boxShadow="sm" minH="250px" maxH="400px" display="flex" flexDirection="column">
            <Flex align="center" justify="space-between" mb="12px">
                <Text fontSize="md" fontWeight="bold" color={textColor}>
                    Decision Log
                </Text>
                <Button
                    size="xs"
                    leftIcon={<MdWarning />}
                    colorScheme="orange"
                    variant="outline"
                    onClick={triggerDemo}
                >
                    Simulate Actions
                </Button>
            </Flex>
            <Box flex="1" overflowY="auto">
                {allEntries.length > 0 ? (
                    allEntries.map((entry) => (
                        <Flex
                            key={entry._key}
                            bg={entry.severity === "critical" ? "red.50" : entry.severity === "warning" ? "orange.50" : "gray.50"}
                            borderLeft="4px solid"
                            borderColor={entry.severity === "critical" ? "red.500" : entry.severity === "warning" ? "orange.400" : "green.400"}
                            p="10px"
                            mb="6px"
                            borderRadius="6px"
                            align="center"
                            justify="space-between"
                        >
                            <Box>
                                <Text fontSize="xs" fontWeight="600" color={textColor}>
                                    {entry.action || entry.message?.slice(0, 60)}
                                </Text>
                                <Text fontSize="xs" color={subtextColor}>
                                    {entry.detail || entry.source || ""}
                                </Text>
                            </Box>
                            {entry._type === "alert" && dismissAlert && (
                                <IconButton
                                    size="xs"
                                    icon={<MdClose />}
                                    variant="ghost"
                                    aria-label="Dismiss"
                                    onClick={() => dismissAlert(alerts.indexOf(entry))}
                                />
                            )}
                        </Flex>
                    ))
                ) : (
                    <Text fontSize="sm" color={subtextColor}>No recent actions or alerts. Click "Simulate Actions" to test.</Text>
                )}
            </Box>
        </Box>
    );
}