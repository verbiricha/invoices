import QRCodeReact from 'qrcode.react'
import { Center, Box, Flex } from '@chakra-ui/react'

import styles from './QR.module.css'

export const QR = ({ scheme = 'lightning', size = 260, data }) => {
  return (
    <Box position="relative" w={size}>
      <Box position="absolute">
        <a href={`${scheme}:${data}`}>
          <Box position="absolute" top={0} left={0}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <rect
                className={styles.rect}
                x="2"
                y="2"
                width={size - 4}
                height={size - 4}
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="6"
                strokeDashoffset={size * 4}
                strokeDasharray={size * 4}
                rx="28"
              />
            </svg>
          </Box>
        </a>
      </Box>
      <Flex
        w={size}
        h={size}
        bg="#1a1a1a"
        borderRadius={30}
        alignItems="center"
        justifyContent="center"
      >
        <Center bg="white" borderRadius={8} boxSizing="border-box" p={2}>
          <QRCodeReact value={data} size={208} />
        </Center>
      </Flex>
    </Box>
  )
}
