const path = require('path')

const buildEslintCommand = (filenames) => {
  const filenamesToLint = filenames.filter((f) => f !== __filename)
  if (!filenamesToLint.length) {
    return 'echo Nothing to lint'
  }
  return `next lint --max-warnings=0 --fix --file ${filenamesToLint
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`
}

const prettierCommand = 'prettier --write --ignore-unknown'

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, prettierCommand],
  '**/!(*.{js,jsx,ts,tsx})': prettierCommand,
}
