import { useState } from 'react'
import { useIntl } from 'react-intl'

import { useSession, signOut } from 'next-auth/react'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Heading,
  Stack,
  Link,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons'

import { CreateInvoice } from './CreateInvoice'
import { ALL, PAID, UNPAID, EXPIRED } from 'lib/types'
import type { User, Invoice, InvoiceStatuses } from 'lib/types'


const normalize = (s: string) => {
  if (s.length === 0) {
    return s
  }
  const c = s[0]
  const cs = s.slice(1)
  return [c.toUpperCase(), cs.toLowerCase()]
}

interface InvoiceStatusProps {
  status: InvoiceStatuses
  setStatus: (s: InvoiceStatuses) => void
}

const STATUSES: InvoiceStatuses[] = [PAID, UNPAID, EXPIRED, ALL]

const InvoiceStatus = ({ status, setStatus }: InvoiceStatusProps) => {
  const selectors = STATUSES.map((s) => (
    <Button
      key={s}
      color={s === status ? 'white' : 'gray.300'}
      variant="unstyled"
      p={2}
      mb="-1px"
      outline="none"
      borderRadius="none"
      borderBottom={s === status ? '2px' : 'none'}
      borderBottomColor={s === status ? 'brand.500' : 'none'}
      onClick={() => setStatus(s)}
    >
      {normalize(s)}
    </Button>
  ))
  return (
    <Box borderBottom="1px" borderColor="gray.200" mb={4}>
      <ButtonGroup>{selectors}</ButtonGroup>
    </Box>
  )
}

interface InvoicesTableProps {
  invoices: Invoice[]
}

const InvoicesTable = ({ invoices }: InvoicesTableProps) => {
  const intl = useIntl()

  if (invoices.length === 0) {
    return (
      <Flex padding={40} justifyContent="center">
        <Text>No invoices available</Text>
      </Flex>
    )
  }

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th isNumeric={true}>Amount</Th>
            <Th>Memo</Th>
            <Th>Issuer</Th>
            <Th>Customer</Th>
            <Th>Due</Th>
            <Th>Created</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invoices.map(
            ({ shortId, amount, currency, issuer, customer, memo, dueDate, createdAt, status }) => (
              <Tr key={shortId}>
                <Td>
                  <Link
                    isExternal
                    fontFamily="monospace"
                    color="brand.500"
                    href={`/invoices/${shortId}`}>
                    {shortId}
                  </Link>
                </Td>
                <Td
                  fontWeight="bold"
                  color={status === PAID ? 'green.500' : status === EXPIRED ? 'gray.300' : 'white'}
                  isNumeric={true}
                >
                  {intl.formatNumber(Number(amount), {
                    style: 'currency',
                    currency,
                  })}
                </Td>
                <Td>{memo}</Td>
                <Td>{issuer}</Td>
                <Td>{customer}</Td>
                <Td>{intl.formatDate(dueDate)}</Td>
                <Td>{intl.formatDate(createdAt)}</Td>
              </Tr>
            )
          )}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

interface UserDropdownProps {
  name: string
  avatarUrl?: string
}

const UserDropdown = ({ name, avatarUrl }: UserDropdownProps) => {
  const [dropdown, setDropdown] = useState(false)
  const userDropdown = (
    <Flex
      alignItems="center"
      justifyContent="center"
      borderBottomLeftRadius={10}
      borderBottomRightRadius={10}
      bg="gray.200"
      position="absolute"
      top="40px"
      right="0"
      width="220px">
      <Button
        p={2}
        variant="unstyled"
        onClick={() => signOut()}>
        Sign out
      </Button>
    </Flex>
  )
  return (
    <>
      <Flex
        flexDirection="row"
        alignItems="center"
        p={2}
        bg="gray.200"
        height="40px"
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        borderBottomLeftRadius={dropdown ? "none" : 10}
        borderBottomRightRadius={dropdown ? "none" : 10}
        position="relative"
        width="220px"
        onClick={() => setDropdown(!dropdown)}
      >
        <Avatar mr={2} size="xs" src={avatarUrl} name={name} />
        <Text ml="auto" fontWeight="bold">{name}</Text>
        <Box ml="auto">
          <ChevronDownIcon w={7} h={7} />
        </Box>
        {dropdown && userDropdown}
      </Flex>
    </>
  )
}

interface InvoicesProps {
  user: User
  invoices: Invoice[]
}

export const Invoices = ({ user, invoices }: InvoicesProps) => {
  const { data: session } = useSession()
  const [theInvoices, setInvoices] = useState(invoices)
  const [status, setStatus] = useState<InvoiceStatuses>(PAID)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const currencies = user.currencies.filter(({ isInvoiceable }) => isInvoiceable).map(({ currency }) => currency)
  const tableInvoices = status === ALL ? theInvoices : theInvoices.filter((i) => i.status === status)

  const changeStatus = (s: InvoiceStatuses) => {
    setStatus(s)
    fetchInvoices()
  }

  const fetchInvoices = () => {
    fetch('/api/invoices')
    .then((r) => r.json())
    .then((invoices) => {
      setInvoices(invoices)
    })
    .catch((err) => {
      console.error(err)
    })
  }

  const onCloseCreate = () => {
    onClose()
    fetchInvoices()
  }

  return (
    <>
      <Flex mb={6} alignItems="center" justifyContent="space-between">
        <Box>
          <Heading as="h1">Invoices</Heading>
        </Box>
        {session && session.user && <UserDropdown name={session.user.name || ""} avatarUrl={user.avatarUrl} />}
      </Flex>
      <Text>Review your invoices generated with Strike</Text>
      <Flex mb={4} alignItems="center" justifyContent="space-between">
        <Box></Box>
        <Box>
          <Button colorScheme="brand" variant="outline" onClick={onOpen}>
            <Text color="white">Create Invoice</Text>
            <AddIcon ml={2} color="white" />
          </Button>
        </Box>
      </Flex>

      <InvoiceStatus status={status} setStatus={changeStatus} />
      <InvoicesTable invoices={tableInvoices} />

      <CreateInvoice currencies={currencies} isOpen={isOpen} onClose={onCloseCreate} />
    </>
  )
}
