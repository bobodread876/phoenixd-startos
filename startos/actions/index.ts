import { sdk } from '../sdk'
import { viewCredentials } from './viewCredentials'
import { viewNodeInfo } from './viewNodeInfo'
import { viewConnectionInfo } from './viewConnectionInfo'
import { configureNetwork } from './configureNetwork'
import { configureLiquidity } from './configureLiquidity'
import { configureIntegrations } from './configureIntegrations'

export const actions = sdk.Actions.of()
  .addAction(viewCredentials)
  .addAction(viewNodeInfo)
  .addAction(viewConnectionInfo)
  .addAction(configureNetwork)
  .addAction(configureLiquidity)
  .addAction(configureIntegrations)
