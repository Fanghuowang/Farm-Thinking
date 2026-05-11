import React from "react";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarBrand() {
  let textColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Text
        fontSize="xl"
        fontWeight="bold"
        color={textColor}
        my="32px"
        letterSpacing="tight"
      >
        Aero-AI
      </Text>
    </Flex>
  );
}

export default SidebarBrand;
