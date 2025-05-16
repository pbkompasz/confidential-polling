import { getConfig } from './PortoConfig'
import { Storage } from 'porto'
import { Porto } from 'porto/remote'

export const porto = Porto.create({
  ...getConfig(),
  storage: Storage.combine(Storage.cookie(), Storage.localStorage()),
})
