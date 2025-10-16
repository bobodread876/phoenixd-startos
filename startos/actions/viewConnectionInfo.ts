import { sdk } from '../sdk'
import { phoenixConfFile } from '../fileModels/phoenix.conf'
import { restPort } from '../interfaces'

const { InputSpec, Value } = sdk

const viewConnectionInfoSpec = InputSpec.of({
  'rest-url': Value.text({
    name: 'REST API URL',
    description: 'phoenixd REST API endpoint',
    required: false,
    default: null,
    immutable: true,
  }),
  'api-password': Value.text({
    name: 'API Password',
    description: 'HTTP Basic Authentication password',
    required: false,
    default: null,
    immutable: true,
    masked: true,
  }),
  username: Value.text({
    name: 'Username',
    description: 'HTTP Basic Authentication username (always empty)',
    required: false,
    default: null,
    immutable: true,
  }),
  'node-id': Value.text({
    name: 'Node ID',
    description: 'Lightning Network node public key',
    required: false,
    default: null,
    immutable: true,
  }),
})

export const viewConnectionInfo = sdk.Action.withInput(
  'view-connection-info',
  async ({ effects }) => ({
    name: 'View Connection Info',
    description: 'Display connection information for external applications',
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),
  viewConnectionInfoSpec,
  async ({ effects }) => {
    try {
      // Read API password from config
      const conf = await phoenixConfFile.read().const(effects)
      if (!conf || !conf['http-password']) {
        throw new Error('phoenixd configuration not found')
      }

      // Get Node ID from API
      let nodeId = 'N/A'
      try {
        const response = await fetch(`http://localhost:${restPort}/getinfo`, {
          method: 'GET',
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(`:${conf['http-password']}`).toString('base64'),
          },
        })
        if (response.ok) {
          const data = await response.json()
          nodeId = data.nodeId || 'N/A'
        }
      } catch (error) {
        // If API call fails, just show N/A for node ID
      }

      return {
        'rest-url': `https://phoenixd.local:${restPort}`,
        'api-password': conf['http-password'],
        username: '(empty/blank)',
        'node-id': nodeId,
      }
    } catch (error) {
      return {
        'rest-url': `Error: ${error instanceof Error ? error.message : String(error)}`,
        'api-password': null,
        username: null,
        'node-id': null,
      }
    }
  },
  async ({ effects, input }) => {
    // This is a read-only action, no submission logic needed
  },
)
