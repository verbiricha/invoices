import { useState } from 'react'
import type { ChangeEvent } from 'react'

import {
  Select,
  Link,
  Flex,
  Box,
  Divider,
  Heading,
  Center,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { CopyIcon, LinkIcon, CheckIcon } from '@chakra-ui/icons'
import { useIntl } from 'react-intl'

import { useCopy } from 'lib/hooks'
import type { Invoice } from 'lib/types'

const inputChange = (setter: (s: string) => void) => {
  return (ev: ChangeEvent<any>) => {
    setter(ev.target.value)
  }
}

type PreviewInvoiceProps = Pick<Invoice, 'issuer' | 'customer' | 'amount' | 'currency' | 'dueDate' | 'memo'>

const PreviewInvoice = ({ issuer, amount, currency, dueDate, customer, memo }: PreviewInvoiceProps) => {
  const intl = useIntl()
  return (
    <>
      <Text color="gray.700" fontSize="lg">
        Invoice from {issuer}
      </Text>

      <Text fontSize="6xl" fontWeight="bold">
        {intl.formatNumber(Number(amount), {
          style: 'currency',
          currency,
        })}
      </Text>
      <Text color="gray.500" fontSize="sm">
        Due {intl.formatDate(dueDate)}
      </Text>

      <Divider mt={2} mb={2} />

      <Flex flexDirection="column">
        <Flex flexDirection="row" mb={2}>
          <Box width="80px">
            <Text color="gray.500">To</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">{customer}</Text>
          </Box>
        </Flex>
        <Flex flexDirection="row" mb={2}>
          <Box width="80px">
            <Text color="gray.500">From</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">{issuer}</Text>
          </Box>
        </Flex>
        <Flex flexDirection="row">
          <Box width="80px">
            <Text color="gray.500">Memo</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">{memo}</Text>
          </Box>
        </Flex>
      </Flex>

      <Divider mt={2} mb={2} />
    </>
  )
}
const openUrl = (url: string) => {
  window.open(url, '_blank')
}


interface ShareInvoiceProps {
  onClose: () => void
  email?: string
  shortId: string
}

const ShareInvoice = ({ onClose, email, shortId }: ShareInvoiceProps) => {
  const { host, protocol } = typeof window !== 'undefined' ? window.location : { host: '', protocol: 'http:' }
  const invoiceUrl = `${protocol}//${host}/invoices/${shortId}`

  const noop = () => null
  const { copied, copy } = useCopy()

  const actions = (
    <HStack cursor="pointer" spacing={4}>
      {copied ? <CheckIcon color="green.500" /> : <CopyIcon onClick={() => copy(invoiceUrl)} />}
      <LinkIcon onClick={() => openUrl(invoiceUrl)}/>
    </HStack>
  )

  return (
    <>
      {email ? (
        <Text>Share with link or send email to <Link href={`mailto:${email}?body=${invoiceUrl}`}>{email}</Link></Text>
      ) : (
        <Text>Share the following link with your customer</Text>
      )}
      <InputGroup mt={2}>
        <Input
          type="text"
          value={invoiceUrl} 
          onChange={noop}
        />
        <InputRightAddon>
          {actions}
        </InputRightAddon>
      </InputGroup>
      <Flex mt={4} flexDirection="row-reverse" width="100%">
        <Button variant="solid" onClick={onClose}>
          Done
        </Button>
      </Flex>
    </>
  )
}

interface CreateInvoiceProps {
  currencies: string[]
  isOpen: boolean
  onClose: () => void
}

export const CreateInvoice = ({ currencies,  isOpen, onClose }: CreateInvoiceProps) => {
  const [preview, setPreview] = useState(false)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const [invoice, setInvoice] = useState()
  const [customer, setCustomer] = useState('')
  const [email, setEmail] = useState<string | null>()
  const [issuer, setIssuer] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(currencies[0])
  const [memo, setMemo] = useState('')
  const [dueDate, setDueDate] = useState('')

  const cleanAndClose = () => {
    // @ts-expect-error
    setInvoice()
    setPreview(false)
    setCreating(false)
    setCreated(false)
    setCustomer('')
    setEmail(null)
    setIssuer('')
    setAmount('')
    setMemo('')
    setDueDate('')
    onClose()
  }

  const isDueDateInvalid = dueDate === '' || Date.parse(dueDate) < Date.now()
  const isIncomplete =
    customer === '' || issuer === '' || amount === '' || memo === '' || isDueDateInvalid

  const postInvoice = () => {
    setCreating(true)
    fetch('/api/invoices', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        issuer,
        amount: Number(amount),
        currency,
        customer,
        memo,
        dueDate,
      }),
    })
      .then((r) => r.json())
      .catch((err) => {
        setCreating(false)
        console.error(err)
      })
      .then((invoice) => {
        setInvoice(invoice)
        setCreated(true)
        setCreating(false)
      })
  }

  const invoiceForm = (
    <>
      <Text fontWeight="bold" color="gray.500" mb={2}>Customer Name</Text>
      <Input
        name="customer"
        value={customer}
        onChange={inputChange(setCustomer)}
        required
        placeholder="Manuela Rios"
        mb={2}
      />
      <Text fontWeight="bold" color="gray.500" mb={2}>Customer Email (optional)</Text>
      <Input
        name="customer-email"
        value={email || ''}
        onChange={inputChange(setEmail)}
        type="email"
        placeholder="manuela@strike.me"
        mb={2}
      />
      <Text fontWeight="bold" color="gray.500" mb={2}>From</Text>
      <Input
        name="issuer"
        value={issuer}
        onChange={inputChange(setIssuer)}
        placeholder="Alejandro's Grill"
        mb={2}
      />
      <Text color="gray.500" mb={2}>Amount</Text>
      <Flex>
        <Select
          width="120px"
          isDisabled={currencies.length <= 1}
          mr={1}
          onChange={inputChange(setCurrency)}
        >
          {currencies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Input
          name="amount"
          value={amount}
          onChange={inputChange(setAmount)}
          type="number"
          min="0.01"
          placeholder="420.69"
          mb={2}
        />
      </Flex>
      <Text fontWeight="bold" color="gray.500" mb={2}>Memo</Text>
      <Input
        name="memo"
        value={memo}
        onChange={inputChange(setMemo)}
        placeholder="Thank you for the purchase!"
        mb={2}
      />
      <Text fontWeight="bold" color="gray.500" mb={2}>Due date</Text>
      <Input value={dueDate} onChange={inputChange(setDueDate)} type="date" name="due" mb={2} />

      <Divider mt={2} mb={2} />

      <Center mt="20px">
        <HStack spacing="3">
          <Button variant="outline" onClick={cleanAndClose}>
            Cancel
          </Button>

          <Button isDisabled={isIncomplete} variant="solid" onClick={() => setPreview(!preview)}>
            Preview
          </Button>
        </HStack>
      </Center>
    </>
  )

  const invoicePreview = (
    <>
      <PreviewInvoice
        issuer={issuer}
        customer={customer}
        currency={currency}
        amount={Number(amount)}
        dueDate={new Date(dueDate)}
        memo={memo}
      />

      <Center mt="20px">
        <HStack spacing="3">
          <Button variant="outline" onClick={() => setPreview(false)}>
            Edit
          </Button>

          <Button 
            isLoading={creating}
            onClick={postInvoice}
            variant="solid">
            Share Invoice
          </Button>
        </HStack>
      </Center>
    </>
  )

  const boxShadow = '0 3px 2px rgba(255, 255, 255, 0.034), 0 7px 5px rgba(255, 255, 255, 0.048), 0 12px 24px rgba(255, 255, 255, 0.086)'

  return (
    <Modal isOpen={isOpen} onClose={cleanAndClose}>
      <ModalOverlay />
      <ModalContent sx={{ boxShadow }}>
        <ModalHeader>
          {created ? 'Share Invoice' : preview ? 'Preview Invoice' : 'Create Invoice'}
        </ModalHeader>
        <Divider />
        <ModalCloseButton _focus={{ boxShadow: 'none' }} />
        <ModalBody>
          {created ? (
            // @ts-expect-error
            <ShareInvoice onClose={cleanAndClose} email={email} shortId={invoice?.shortId} />
          ) : preview ? invoicePreview : invoiceForm}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
