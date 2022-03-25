import { Box, Text } from '@chakra-ui/react'

export const Footer = () => {
  return (
    <Box m={4} position="fixed" bottom={0} width="100%">
      <Text color="gray.500" fontSize="sm" align="center">
        © 2022 Strike
      </Text>
    </Box>
  )
}
