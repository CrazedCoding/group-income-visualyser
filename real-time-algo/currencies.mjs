'use strict'

// https://github.com/okTurtles/group-income/issues/813#issuecomment-593680834
// round all accounting to DECIMALS_MAX decimal places max to avoid consensus
// issues that can arise due to different floating point values
// at extreme precisions. If this becomes inadequate, instead of increasing
// this value, switch to a different currency base, e.g. from BTC to mBTC.
export const DECIMALS_MAX = 8

function commaToDots (value) {
  // ex: "1,55" -> "1.55"
  return typeof value === 'string' ? value.replace(/,/, '.') : value.toString()
}

function isNumeric (nr) {
  return !isNaN(nr - parseFloat(nr))
}

function isInDecimalsLimit (nr, decimalsMax) {
  const decimals = nr.split('.')[1]
  return !decimals || decimals.length <= decimalsMax
}

// NOTE: Unsure whether this is *always* string; it comes from 'validators' in other files
function validateMincome (value, decimalsMax) {
  const nr = commaToDots(value)
  return isNumeric(nr) && isInDecimalsLimit(nr, decimalsMax)
}

function decimalsOrInt (num, decimalsMax) {
  // ex: 12.5 -> "12.50", but 250 -> "250"
  return num.toFixed(decimalsMax).replace(/\.0+$/, '')
}

export function saferFloat (value) {
  // ex: 1.333333333333333333 -> 1.33333333
  return parseFloat(value.toFixed(DECIMALS_MAX))
}

export function normalizeCurrency (value) {
  // ex: "1,333333333333333333" -> 1.33333333
  return saferFloat(parseFloat(commaToDots(value)))
}

// NOTE: Unsure whether this is *always* string; it comes from 'validators' in other files
export function mincomePositive (value) {
  return parseFloat(commaToDots(value)) > 0
}

function makeCurrency (options) {
  const { symbol, symbolWithCode, decimalsMax, formatCurrency } = options
  return {
    symbol,
    symbolWithCode,
    decimalsMax,
    displayWithCurrency: (n) => formatCurrency(decimalsOrInt(n, decimalsMax)),
    displayWithoutCurrency: (n) => decimalsOrInt(n, decimalsMax),
    validate: (n) => validateMincome(n, decimalsMax)
  }
}

// NOTE: if we needed for some reason, this could also be defined in
//       a json file that's read in and generates this object. For
//       example, that would allow the addition of currencies without
//       having to "recompile" a new version of the app.
const currencies = {
  USD: makeCurrency({
    symbol: '$',
    symbolWithCode: '$ USD',
    decimalsMax: 2,
    formatCurrency: amount => '$' + amount
  }),
  EUR: makeCurrency({
    symbol: '€',
    symbolWithCode: '€ EUR',
    decimalsMax: 2,
    formatCurrency: amount => '€' + amount
  }),
  BTC: makeCurrency({
    symbol: 'Ƀ',
    symbolWithCode: 'Ƀ BTC',
    decimalsMax: DECIMALS_MAX,
    formatCurrency: amount => amount + 'Ƀ'
  })
}

export default currencies
