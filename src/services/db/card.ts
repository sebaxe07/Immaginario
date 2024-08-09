import { Auth } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { UserService } from './user'
import { StorageService } from '../storage'

export class CardService {
  private cardPath = 'card'

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private userService: UserService,
    private storageService: StorageService,
  ) {}

  /**
   * Inserts a new card into the database
   * @param name The name of the card
   * @param imgUrl The url of the image of the card
   * @param voiceUrl The url of the voice recording of the card, or null if no voice recording
   * @param category The category of the card, or null if no category
   * @param global
   * @returns The id of the inserted card
   */
  public async create(
    name: string,
    imgUrl: string,
    category: string = null,
    voiceUrl: string = null,
    global: boolean = false,
  ): Promise<string> {
    return addDoc(collection(this.firestore, this.cardPath), {
      name,
      imgUrl,
      voiceUrl,
      ownerId: this.auth.currentUser.uid,
      global,
      category,
    }).then((docRef) => docRef.id)
  }

  /**
   * Deletes a card from the database
   * @param id The id of the card to delete
   * @returns True if the card was deleted, false if the card was not deleted
   */
  public async remove(id: string): Promise<boolean> {
    // Delete both image and audio associated with the card
    this.storageService.deleteCardInfo(id)

    return deleteDoc(doc(this.firestore, this.cardPath, id))
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Deletes all the cards in the database owned by the current user (caregiver)
   *
   * @returns A boolean indicating whether the cards were deleted or not
   */
  public async deleteAllMyCards(): Promise<boolean> {
    return getDocs(query(collection(this.firestore, this.cardPath), where('ownerId', '==', this.auth.currentUser.uid)))
      .then((q) => {
        q.docs.forEach((doc) => {
          deleteDoc(doc.ref)
        })
        return true
      })
      .catch(() => false)
  }

  /**
   * Updates the voice recording url of a card
   * @param id The id of the card to update
   * @param voiceUrl The new voice recording url
   * @returns True if the card was updated, false if the card was not updated
   */
  public async setVoiceUrl(id: string, voiceUrl: string): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.cardPath, id), {
      voiceUrl,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the image url of a card
   * @param id The id of the card to update
   * @param imgUrl The new image url
   * @returns True if the card was updated, false if the card was not updated
   */
  public async setImageUrl(id: string, imgUrl: string): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.cardPath, id), {
      imgUrl,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the voice recording url of a card
   * @param id The id of the card to update
   * @returns True if the card was updated, false if the card was not updated
   */
  public async deleteVoiceRecording(id: string): Promise<boolean> {
    this.storageService.deleteCardAudio(id)

    return updateDoc(doc(this.firestore, this.cardPath, id), {
      voiceUrl: null,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the voice recording url of a card
   * @param id The id of the card to update
   * @param name The new voice recording url
   * @returns True if the card was updated, false if the card was not updated
   */
  public async setName(id: string, name: string): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.cardPath, id), {
      name,
    })
      .then(() => true)
      .catch(() => false)
  }

  public async setGlobal(id: string, global: boolean): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.cardPath, id), {
      global,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the category of a card
   * @param id The id of the card to update
   * @param category The new category
   * @returns True if the card was updated, false if the card was not updated
   */
  public async setCategory(id: string, category: string): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.cardPath, id), {
      category,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the card
   * @param id The id of the card to update
   *
   * @param name The new name
   * @param category The new category
   * @param global The new global status
   *
   * @returns True if the card was updated, false if the card was not updated
   */
  public async update(id: string, name: string, category: string, global: boolean): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.cardPath, id), {
      name,
      category,
      global,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Gets all the cards in the database owned by the current user (caregiver and his therapist)
   * @returns An array of all the cards owned by the current user
   */
  // public async getMyCards(): Promise<Card[]> {
  //   const user = await this.userService.getUserInfo()

  //   if (user.type == 'caregiver') {
  //     return getDocs(
  //       query(
  //         collection(this.firestore, this.cardPath),
  //         or(where('ownerId', '==', this.auth.currentUser.uid), where('ownerId', '==', user.therapist)),
  //       ),
  //     ).then((q) => q.docs.map((doc) => doc.data() as Card))
  //   } else {
  //     return getDocs(
  //       query(collection(this.firestore, this.cardPath), where('ownerId', '==', this.auth.currentUser.uid)),
  //     ).then((q) => q.docs.map((doc) => doc.data() as Card))
  //   }
  // }

  public async getMyCards(userId = null): Promise<Card[]> {
    const userInfo = await this.userService.getUserInfo()
    const queries = [
      query(collection(this.firestore, this.cardPath), where('ownerId', '==', this.auth.currentUser.uid)),
    ]

    if (userInfo.type === 'caregiver' && userInfo.therapist) {
      queries.push(query(collection(this.firestore, this.cardPath), where('ownerId', '==', userInfo.therapist)))
    }

    if (userId) {
      queries.push(query(collection(this.firestore, this.cardPath), where('ownerId', '==', userId)))
    }

    let cards = []
    for (const q of queries) {
      const querySnapshot = await getDocs(q)
      cards = cards.concat(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    return cards
  }

  /**
   * When needed, therapist can get all the cards of a specific caregiver
   * @param caregiverId The id of the caregiver. Must be a caregiver assigned to the therapist
   * @returns An array of all the cards of the caregiver with the given id
   */
  public async getCaregiverCards(caregiverId: string): Promise<Card[]> {
    return getDocs(query(collection(this.firestore, this.cardPath), where('ownerId', '==', caregiverId))).then((q) =>
      q.docs.map((doc) => doc.data() as Card),
    )
  }

  /**
   * Gets all the cards in the database that are global
   * @returns An array of all global cards in the database
   */
  public async getGlobal(): Promise<Card[]> {
    return getDocs(query(collection(this.firestore, this.cardPath), where('global', '==', true))).then((q) =>
      q.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Card),
    )
  }

  /**
   * Gets cards based on an array of card IDs
   * @param cardIds An array of card IDs to fetch
   * @returns An array of cards corresponding to the given card IDs
   */
  public async getCardsByIds(cardIds: string[]): Promise<Card[]> {
    const cardPromises = cardIds.map(async (cardId) => {
      const cardDoc = await getDoc(doc(this.firestore, this.cardPath, cardId))
      return cardDoc.exists() ? { id: cardId, ...cardDoc.data() } : null
    })

    const cards = await Promise.all(cardPromises)
    return cards.filter((card) => card !== null) as Card[]
  }
}
