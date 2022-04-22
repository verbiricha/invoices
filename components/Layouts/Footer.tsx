import { Link, Flex, Text } from '@chakra-ui/react'

export const Footer = () => {
  return (
    <Flex height="50px" width="100%" justifyContent="center">
      <Text textAlign="center" color="gray.500" fontSize="sm">
        Made with ❤️  and the <Link color="brand.500" isExternal href="https://developer.strike.me/">Strike API</Link> by <Link color="brand.500" isExternal href="https://strike.me/manuelarios">Manuela</Link> and <Link color="brand.500" isExternal href="https://strike.me/verbiricha">Alejandro</Link>
      </Text>
    </Flex>
  )
}
