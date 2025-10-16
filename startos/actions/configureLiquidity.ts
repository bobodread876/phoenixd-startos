import { sdk } from '../sdk'
import { phoenixConfFile } from '../fileModels/phoenix.conf'

const { InputSpec, Value } = sdk

const configureLiquiditySpec = InputSpec.of({
  'auto-liquidity': Value.select({
    name: 'Auto Liquidity',
    description:
      'Amount automatically requested when inbound liquidity is needed. ACINQ will open channels and provide liquidity for receiving payments.',
    default: '2m',
    values: {
      off: 'Off (Disable auto liquidity)',
      '2m': '2,000,000 sats (2m)',
      '5m': '5,000,000 sats (5m)',
      '10m': '10,000,000 sats (10m)',
    },
  }),
  'max-absolute-fee': Value.number({
    name: 'Max Absolute Fee',
    description:
      'Maximum absolute fee in satoshis for on-chain operations. Leave empty to use default (2% of auto-liquidity amount).',
    required: false,
    default: null,
    integer: true,
    min: 0,
  }),
  'max-fee-credit': Value.select({
    name: 'Max Fee Credit',
    description:
      'Maximum fee credit. If reached, payments will be rejected. This protects you from accumulating too many fees.',
    default: '100k',
    values: {
      off: 'Off (No limit)',
      '50k': '50,000 sats (50k)',
      '100k': '100,000 sats (100k)',
    },
  }),
})

export const configureLiquidity = sdk.Action.withInput(
  'configure-liquidity',
  async ({ effects }) => ({
    name: 'Configure Liquidity',
    description: 'Configure automatic liquidity management and fee settings',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  configureLiquiditySpec,
  async ({ effects }) => {
    const conf = await phoenixConfFile.read().const(effects)
    return {
      'auto-liquidity': conf?.['auto-liquidity'] ?? undefined,
      'max-absolute-fee': conf?.['max-absolute-fee'] ?? undefined,
      'max-fee-credit': conf?.['max-fee-credit'] ?? undefined,
    }
  },
  async ({ effects, input }) => {
    const updates: any = {
      'auto-liquidity': input['auto-liquidity'],
    }

    if (input['max-absolute-fee'] !== null) {
      updates['max-absolute-fee'] = input['max-absolute-fee']
    }

    if (input['max-fee-credit']) {
      updates['max-fee-credit'] = input['max-fee-credit']
    }

    await phoenixConfFile.merge(effects, updates)
  },
)
