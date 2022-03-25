import { Box, Container } from '@chakra-ui/react'

import { StrikeLogo } from '../Icons'

export const Header = () => {
  return (
    <Box display="flex" m={4} justifyContent="center">
      <StrikeLogo />
    </Box>
  )
}
