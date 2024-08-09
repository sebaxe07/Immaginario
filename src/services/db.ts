import { auth, firestore } from '@/services/firebase'
import { UserService } from './db/user'
import { CategoryService } from './db/category'
import { CardService } from './db/card'
import { SequenceService } from './db/sequence'
import { AgendaService } from './db/agenda'
import { StorageService } from './storage'

/**
 * Database service class to handle all DB related methods
 * -------------------------
 *
 * @class DBService
 * @constructor
 * @param {Store} store - Store object to persist information
 */
export class DBService {
  public user: UserService
  public category: CategoryService
  public card: CardService
  public sequence: SequenceService
  public agenda: AgendaService

  constructor(storage: StorageService) {
    this.user = new UserService(firestore, auth)
    this.category = new CategoryService(firestore, auth)
    this.card = new CardService(firestore, auth, this.user, storage)
    this.sequence = new SequenceService(firestore, auth, this.user)
    this.agenda = new AgendaService(firestore, auth)
  }
}
