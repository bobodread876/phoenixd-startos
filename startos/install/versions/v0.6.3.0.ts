import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { sdk } from '../../sdk'
import { rm } from 'fs/promises'

export const v_0_6_3_0 = VersionInfo.of({
  version: '0.6.3:0',
  releaseNotes: 'Initial Release for StartOS',
  migrations: {
    up: async (effects) => {},
    down: async (effects) => {},
  },
})
