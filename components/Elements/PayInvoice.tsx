import { useState, useEffect, useCallback } from 'react'

import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
} from '@chakra-ui/react'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import type { NextPage, GetServerSideProps } from 'next'
import { useIntl } from 'react-intl'

import { useCopy } from 'lib/hooks'
import type { User, Invoice, Quote } from 'lib/types'
import { QR } from 'components'

const LIGHTNING = 'lightning'
const ONCHAIN = 'bitcoin'

type Scheme = typeof LIGHTNING | typeof ONCHAIN

const isQuoteExpired = ({ now, expiration }: { now: number, expiration: string }) => {
  const expirationDate = Date.parse(expiration)
  const timeRemaining = (expirationDate - now) / 1000
  return timeRemaining <= 0
}

interface QuoteDisplayProps extends Quote {
  scheme: Scheme
  setScheme: (s: Scheme) => void
}

const QuoteDisplay = ({ scheme, setScheme, ln, amount, onchain, expiration }: QuoteDisplayProps) => {
  const [now, setNow] = useState(Date.now())

  const expirationDate = Date.parse(expiration)
  const timeRemaining = (expirationDate - now) / 1000
  const isExpired = timeRemaining <= 0

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const qrData = scheme === LIGHTNING  ? ln : `${onchain}?amount=${amount}`
  const qrCode = <QR scheme={scheme} data={qrData} />

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" height={260}>
      <Box position="relative">
        {isExpired ? (
          <Box filter="blur(4px)" pointerEvents="none">
            {qrCode}
          </Box>
        ) : (
          qrCode
        )}
        {onchain && !isExpired && scheme === ONCHAIN && (
          <ChevronLeftIcon
            cursor="pointer"
            h={6}
            w={6}
            position="absolute"
            top="45%"
            left="-10px"
            onClick={() => setScheme(LIGHTNING)}
          />
        )}
        {onchain && !isExpired && scheme === LIGHTNING && (
          <ChevronRightIcon
            cursor="pointer"
            h={6}
            w={6}
            position="absolute"
            top="45%"
            right="-10px"
            onClick={() => setScheme(ONCHAIN)}
          />
        )}
      </Box>

      {isExpired && (
        <Text fontFamily="monospace" fontSize="sm" color="red.500">
          Expired, please refresh
        </Text>
      )}
      {!isExpired && (
        <Text fontFamily="monospace" fontSize="sm" color="orange.500">
          Expires in {timeRemaining.toFixed()} seconds
        </Text>
      )}
    </Flex>
  )
}

interface PayInvoiceProps {
  user: User
  invoice: Invoice
}

export const PayInvoice: NextPage<PayInvoiceProps> = ({ user, invoice }) => {
  const intl = useIntl()
  const [isFetchingQuote, setIsFetchingQuote] = useState(false)
  const [quote, setQuote] = useState<Quote | null>()
  const [theInvoice, setInvoice] = useState<Invoice>(invoice)
  const [scheme, setScheme] = useState<Scheme>(LIGHTNING)
  const { copied, copy } = useCopy()

  const { shortId, amount, currency, issuer, memo, status, customer } = theInvoice
  const { handle, avatarUrl } = user

  const isExpired = status === 'EXPIRED'
  const isPaid = status === 'PAID'

  const fetchInvoice = useCallback(() => {
    fetch(`/api/invoices/${shortId}`)
      .then((r) => r.json())
      .then((inv) => {
        setInvoice(inv)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [shortId])

  useEffect(() => {
    const interval = setInterval(fetchInvoice, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [fetchInvoice])

  const fetchQuote = () => {
    setIsFetchingQuote(true)
    fetch(`/api/invoices/${shortId}/quote`)
      .then((r) => r.json())
      .then((quote) => {
        setIsFetchingQuote(false)
        setQuote(quote)
      })
      .catch((err) => {
        console.error(err)
        setIsFetchingQuote(false)
      })
  }

  const willShowCopyButton = quote && !isQuoteExpired({ now: Date.now(), expiration: quote.expiration })
  const qrData = scheme === LIGHTNING  ? quote?.ln || '' : `${quote?.onchain}?amount=${quote?.amount}`

  const refreshAndCancel = (
    <Stack alignItems="center" justifyContent="center" mt="20px" width="100%">
      {willShowCopyButton ? (
        <Button
          variant="outline"
          width="80%"
          onClick={() => copy(qrData)}
        >
          {copied ? <CheckIcon color="green.500" /> : "Copy"}
        </Button>
      ) : (
        <Button
          isLoading={isFetchingQuote}
          variant="outline"
          width="80%"
          onClick={fetchQuote}>
          Refresh
        </Button>
      )}
      <Button
        isDisabled={isFetchingQuote}
        variant="ghost"
        width="80%"
        onClick={() => {
          setQuote(null)
          setIsFetchingQuote(false)
        }}
      >
        Cancel
      </Button>
    </Stack>
  )

  const payButton = (
    <Button
      isLoading={isFetchingQuote}
      colorScheme="brand"
      color="black"
      variant="solid"
      mt="auto"
      mb="5"
      width="80%"
      onClick={fetchQuote}
    >
      Pay
    </Button>
  )

  return (
    <Container maxW="container.xl">
      <Center height="80vh">
        <Flex
          flexDirection="column"
          alignItems="center"
          bg="gray.100"
          height="580px"
          borderRadius="20px"
          width="280px"
        >
          <Avatar mt={-5} mb={2} name={handle} src={avatarUrl} />
          <Heading fontSize="xl">
            {issuer}
          </Heading>
          <Text>{customer}</Text>
          <Text fontSize="5xl" fontWeight="bold" lineHeight={1.2}>
            {intl.formatNumber(Number(amount), { style: 'currency', currency })}
          </Text>
          {quote && quote.amount && (
            <Text fontSize="sm">
              {intl.formatNumber(Number(quote.amount), {
                style: 'currency',
                currency: 'BTC',
                minimumFractionDigits: 8,
              })}
            </Text>
          )}
          {!isExpired && !isPaid && <Text mb={2} color="gray.500">{memo}</Text>}
          {isExpired && <Text color="red.500">This invoice has expired</Text>}
          {isPaid ? (
            <Center height="240px">
              <CheckIcon color="green.500" h={30} w={30} />
              <Text fontSize="6xl" color="green.500">
                Paid
              </Text>
            </Center>
          ) : quote ? (
            <QuoteDisplay scheme={scheme} setScheme={setScheme} {...quote} />
          ) : (
            <Box height={260} width={260}></Box>
          )}
          {!isExpired && !isPaid && (quote ? refreshAndCancel : payButton)}
        </Flex>
      </Center>
    </Container>
  )
}
