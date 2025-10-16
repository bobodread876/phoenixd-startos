import { sdk } from '../sdk'
import { phoenixConfFile } from '../fileModels/phoenix.conf'

const { InputSpec, Value } = sdk

const configureIntegrationsSpec = InputSpec.of({
  webhook: Value.text({
    name: 'Webhook URL',
    description:
      'HTTP endpoint to receive push notifications for payments. Leave empty to disable webhooks.',
    required: false,
    default: null,
  }),
  'webhook-secret': Value.text({
    name: 'Webhook Secret',
    description:
      'Secret used to authenticate webhook requests. Auto-generated on first run.',
    required: false,
    default: null,
    masked: true,
  }),
  'mempool-space-url': Value.text({
    name: 'Mempool URL',
    description:
      'Custom mempool.space URL for blockchain data. Leave empty to use default ACINQ-provided source.',
    required: false,
    default: null,
  }),
})

export const configureIntegrations = sdk.Action.withInput(
  'configure-integrations',
  async ({ effects }) => ({
    name: 'Configure Integrations',
    description: 'Configure webhook notifications and mempool data source',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  configureIntegrationsSpec,
  async ({ effects }) => {
    const conf = await phoenixConfFile.read().const(effects)

    return {
      webhook: conf?.webhook ?? null,
      'webhook-secret': conf?.['webhook-secret'] ?? null,
      'mempool-space-url': conf?.['mempool-space-url'] ?? null,
    }
  },
  async ({ effects, input }) => {
    const updates: any = {}

    // Webhook settings
    if (input.webhook) {
      updates.webhook = input.webhook
    }
    if (input['webhook-secret']) {
      updates['webhook-secret'] = input['webhook-secret']
    }

    // Mempool settings
    if (input['mempool-space-url']) {
      updates['mempool-space-url'] = input['mempool-space-url']
    }

    await phoenixConfFile.merge(effects, updates)
  },
)
