import React from "react";
import { Box, Text, Switch, Flex, useColorModeValue } from "@chakra-ui/react";

export default function DemoMode({ demoActive, onToggle }) {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const bgColor = useColorModeValue("white", "navy.700");

    return (
        <Box bg={bgColor} p="12px" borderRadius="10px" boxShadow="sm">
            <Flex align="center" justify="space-between">
                <Box>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        Demo Mode
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                        Speeds up sensor stream to simulate 24h in 5 min
                    </Text>
                </Box>
                <Switch
                    colorScheme="brand"
                    size="md"
                    isChecked={demoActive}
                    onChange={(e) => onToggle(e.target.checked)}
                />
            </Flex>
        </Box>
    );
}