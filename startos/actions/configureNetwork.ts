import { sdk } from '../sdk'
import { phoenixConfFile } from '../fileModels/phoenix.conf'

const { InputSpec, Value } = sdk

const configureNetworkSpec = InputSpec.of({
  chain: Value.select({
    name: 'Bitcoin Network',
    description:
      'Select which Bitcoin network to use. WARNING: Changing this will require a full restart and may result in data loss.',
    default: 'mainnet',
    values: {
      mainnet: 'Mainnet (Production)',
      testnet: 'Testnet (Testing)',
    },
  }),
})

export const configureNetwork = sdk.Action.withInput(
  'configure-network',
  async ({ effects }) => ({
    name: 'Configure Network',
    description: 'Select which Bitcoin network to use (mainnet or testnet)',
    warning:
      'Changing the network requires a restart and may result in incompatibility with existing channels and data.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  configureNetworkSpec,
  async ({ effects }) => {
    const conf = await phoenixConfFile.read().const(effects)
    return {
      chain: conf?.chain ?? 'mainnet',
    }
  },
  async ({ effects, input }) => {
    await phoenixConfFile.merge(effects, {
      chain: input.chain,
    })
  },
)
