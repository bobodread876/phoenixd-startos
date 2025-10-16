import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'phoenixd',
  title: 'phoenixd',
  license: 'Apache-2.0',
  wrapperRepo: 'https://github.com/Start9Labs/phoenixd-startos',
  upstreamRepo: 'https://github.com/ACINQ/phoenix/issues',
  supportSite: 'https://phoenix.acinq.co/server',
  marketingSite: 'https://phoenix.acinq.co/server',
  donationUrl: 'https://phoenix.acinq.co',
  docsUrl:
    'https://github.com/Start9Labs/phoenixd-startos/blob/master/instructions.md',
  description: {
    short:
      'phoenixd for StartOS is a minimal, specialized Lightning node designed for sending and receiving Lightning payments',
    long: 'phoenixd is a minimal, specialized Lightning node designed for sending and receiving Lightning payments. phoenixd makes it very easy to develop any application that needs to interact with Lightning, by abstracting away all the complexity, without compromising on self-custody.',
  },
  volumes: ['main'],
  images: {
    phoenixd: {
      source: { dockerBuild: { dockerfile: 'Dockerfile' } },
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
