import { sdk } from '../sdk'
import { viewCredentials } from './viewCredentials'
import { viewNodeInfo } from './viewNodeInfo'
import { configureNetwork } from './configureNetwork'
import { configureLiquidity } from './configureLiquidity'
import { configureIntegrations } from './configureIntegrations'

export const actions = sdk.Actions.of()
  .addAction(viewCredentials)
  .addAction(viewNodeInfo)
  .addAction(configureNetwork)
  .addAction(configureLiquidity)
  .addAction(configureIntegrations)
