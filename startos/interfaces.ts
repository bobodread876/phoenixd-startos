import { sdk } from './sdk'

export const restPort = 9740

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const restMulti = sdk.MultiHost.of(effects, 'rest-multi')
  const restMultiOrigin = await restMulti.bindPort(restPort, {
    protocol: 'https',
    preferredExternalPort: restPort,
    addSsl: {
      alpn: null,
      preferredExternalPort: restPort,
    },
  })

  const phoenixdrestConnect = sdk.createInterface(effects, {
    name: 'rest Phoenixd',
    id: 'rest-interface',
    description: 'Used for rest connections',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const restReceipt = await restMultiOrigin.export([phoenixdrestConnect])

  return [restReceipt]
})
