import { sdk } from '../sdk'
import { phoenixConfFile } from '../fileModels/phoenix.conf'

export const viewCredentials = sdk.Action.withoutInput(
  'view-credentials',
  async ({ effects }) => ({
    name: 'View Credentials',
    description: 'Display API credentials and connection information',
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    const conf = await phoenixConfFile.read().const(effects)
    if (!conf || !conf['http-password']) {
      throw new Error('phoenixd configuration not found')
    }

    return {
      version: '1',
      title: 'API Credentials',
      message: 'Use these credentials to access the phoenixd REST API',
      result: {
        type: 'single',
        value: conf['http-password'],
        copyable: true,
        qr: true,
        masked: true,
      },
    }
  },
)
