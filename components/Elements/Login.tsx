import { signIn } from 'next-auth/react'

import { Flex, Center, Box, Button, Text, Link } from '@chakra-ui/react'

export const Login = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh">
      <Flex
        p={4}
        height="50%"
        width="260px"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="1px"
        borderColor="gray.200"
        borderRadius={10}
      >
        <Button
          variant="outline"
          onClick={() => signIn('strike')}>
          Login with Strike
        </Button>
      </Flex>
      <Box mt={2}>
        <Text fontSize="sm" color="gray.500">
          {"Don't have an account?"}
          <Link
            ml={1}
            color="white"
            isExternal
            href="https://strike.me/download"
            fontSize="sm"
            fontWeight="bold"
          >
           Sign up
          </Link>
        </Text>
      </Box>
    </Flex>
  )
}
