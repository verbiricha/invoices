import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'

const SHORT_ID_LENGTH = 16

export const generateShortId = customAlphabet(nolookalikesSafe, SHORT_ID_LENGTH)
