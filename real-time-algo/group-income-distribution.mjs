import parseMonthlyDistributionFromEvents from './monthly-event-parser.mjs'
// import minimizeTotalPaymentsCount from '~/frontend/utils/distribution/payments-minimizer.js'
import { merge } from './giLodash.mjs'

export default function groupIncomeDistribution (distributionEvents, opts) {
  opts = merge({ adjusted: false, minimizeTxns: false, latePayments: [] }, opts)
  if (opts.minimizeTxns && !opts.adjusted) {
    throw new Error('minimizeTxns = true means adjusted must be true too!')
  }
  const dist = parseMonthlyDistributionFromEvents(distributionEvents, opts)
  return dist
  // return opts.minimizeTxns ? minimizeTotalPaymentsCount(dist) : dist
}
