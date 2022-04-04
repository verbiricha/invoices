import { Box, Container } from '@chakra-ui/react'

import { StrikeLogo } from '../Icons'

export const Header = () => {
  return (
    <Box
      alignSelf="flex-end"
      display="flex"
      m={4}
      justifyContent="center"
      width="100%">
      <StrikeLogo />
    </Box>
  )
}
