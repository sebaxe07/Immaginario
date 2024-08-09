import { Store } from '@/state/store'
import { AuthService } from '@/services/auth'
import { DBService } from '@/services/db'
import { StorageService } from '@/services/storage'
import { AudioService } from '@/services/audio'

/**
 * Connector class that acts as a proxy class for connecting different services together
 * -------------------------
 *
 * @class Connector
 * @constructor
 * @param {Store} store - Store object to persist information
 */
export class Connector {
  public store: Store
  public auth: AuthService
  public db: DBService
  public storage: StorageService
  public audio: AudioService

  constructor(store: Store) {
    this.store = store

    this.storage = new StorageService()
    this.auth = new AuthService(store, this.storage)
    this.db = new DBService(this.storage)
    this.audio = new AudioService(store)
  }
}
