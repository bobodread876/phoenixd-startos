import { sdk } from '../sdk'
import { phoenixConfFile } from '../fileModels/phoenix.conf'
import { restPort } from '../interfaces'

const { InputSpec, Value } = sdk

const viewNodeInfoSpec = InputSpec.of({
  'node-id': Value.text({
    name: 'Node ID',
    description: 'Lightning Network node public key',
    required: false,
    default: null,
    immutable: true,
  }),
  chain: Value.text({
    name: 'Chain',
    description: 'Bitcoin network',
    required: false,
    default: null,
    immutable: true,
  }),
  version: Value.text({
    name: 'Version',
    description: 'phoenixd version',
    required: false,
    default: null,
    immutable: true,
  }),
  balance: Value.text({
    name: 'Balance',
    description: 'Current Lightning balance',
    required: false,
    default: null,
    immutable: true,
  }),
  'auto-liquidity': Value.text({
    name: 'Auto Liquidity',
    description: 'Automatic inbound liquidity amount',
    required: false,
    default: null,
    immutable: true,
  }),
})

export const viewNodeInfo = sdk.Action.withInput(
  'view-node-info',
  async ({ effects }) => ({
    name: 'View Node Info',
    description: 'Display node information and balance',
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),
  viewNodeInfoSpec,
  async ({ effects }) => {
    try {
      // Read API password from config
      const conf = await phoenixConfFile.read().const(effects)
      if (!conf || !conf['http-password']) {
        throw new Error('phoenixd configuration not found')
      }

      // Call phoenixd REST API
      const response = await fetch(`http://localhost:${restPort}/getinfo`, {
        method: 'GET',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`:${conf['http-password']}`).toString('base64'),
        },
      })

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        )
      }

      const data = await response.json()

      // Format auto-liquidity setting
      const autoLiquidity = conf['auto-liquidity'] || '2m'
      let liquidityDisplay = 'Off'
      if (autoLiquidity === '2m') liquidityDisplay = '2,000,000 sats'
      else if (autoLiquidity === '5m') liquidityDisplay = '5,000,000 sats'
      else if (autoLiquidity === '10m') liquidityDisplay = '10,000,000 sats'

      return {
        'node-id': data.nodeId || 'N/A',
        chain: data.chain || 'N/A',
        version: data.version || 'N/A',
        balance: data.balanceSat
          ? `${data.balanceSat.toLocaleString()} sats`
          : '0 sats',
        'auto-liquidity': liquidityDisplay,
      }
    } catch (error) {
      return {
        'node-id': `Error: ${error instanceof Error ? error.message : String(error)}`,
        chain: null,
        version: null,
        balance: null,
        'auto-liquidity': null,
      }
    }
  },
  async ({ effects, input }) => {
    // This is a read-only action, no submission logic needed
  },
)
