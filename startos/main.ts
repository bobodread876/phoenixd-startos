import { sdk } from './sdk'
import { restPort } from './interfaces'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('[i] Starting phoenixd ...')

  // Create the subcontainer ONCE with the volume mounted
  const phoenixdSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'phoenixd' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/root/.phoenix',
      readonly: false,
    }),
    'phoenixd-sub',
  )
  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: phoenixdSub,
    exec: {
      command: [
        '/phoenix/phoenixd',
        '--agree-to-terms-of-service',
        '--http-bind-ip',
        '0.0.0.0',
      ],
      env: {
        HOME: '/root',
      },
    },
    ready: {
      display: 'REST Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, restPort, {
          successMessage: 'The REST interface is ready to accept connections',
          errorMessage: 'The REST Interface is not ready',
        }),
    },
    requires: [],
  })
})
