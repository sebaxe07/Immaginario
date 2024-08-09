import { Auth } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { UserService } from './user'

export class SequenceService {
  private sequencePath = 'sequence'

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private userService: UserService,
  ) {}

  /**
   * Inserts a new sequence into the database
   * @param name The name of the sequence
   * @param placeholder The url of the placeholder image of the sequence
   * @param cards The cards of the sequence
   * @returns The id of the inserted sequence
   */
  public async create(name: string, placeholder: string, cards: SequenceObject[]): Promise<string> {
    return addDoc(collection(this.firestore, this.sequencePath), {
      name,
      placeholder,
      ownerId: this.auth.currentUser.uid,
      cards,
    }).then((docRef) => docRef.id)
  }

  public async update(id: string, name: string, placeholder: string, cards: SequenceObject[]): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.sequencePath, id), {
      name,
      placeholder,
      ownerId: this.auth.currentUser.uid,
      cards,
    })
      .then(() => true)
      .catch((e) => {
        console.error(e)
        return false
      })
  }

  /**
   * Deletes a sequence from the database
   * @param id The id of the sequence to delete
   * @returns True if the sequence was deleted, false if the sequence was not deleted
   */
  public async delete(id: string): Promise<boolean> {
    return deleteDoc(doc(this.firestore, this.sequencePath, id))
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the name of a sequence
   * @param id The id of the sequence to update
   * @param name The new name of the sequence
   * @returns True if the sequence was updated, false if the sequence was not updated
   */
  public async setName(id: string, name: string): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.sequencePath, id), {
      name: name,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the cards of a sequence
   * @param id The id of the sequence to update
   * @param cards The new cards of the sequence
   * @returns True if the sequence was updated, false if the sequence was not updated
   */
  public async setCards(id: string, cards: SequenceObject[]): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.sequencePath, id), {
      cards,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Updates the placeholder image of a sequence
   * @param id The id of the sequence to update
   * @param placeholder The new placeholder image of the sequence
   */
  public async setPlaceholder(id: string, placeholder: string): Promise<boolean> {
    return updateDoc(doc(this.firestore, this.sequencePath, id), {
      placeholder: placeholder,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Gets all the sequences in the database owned by the current user (caregiver and his therapist)
   * @returns An array of all the sequences owned by the current user
   */
  // public async getMySequences(): Promise<Sequence[]> {
  //   const user = await this.userService.getUserInfo()
  //   if (user.type == 'caregiver') {
  //     return getDocs(
  //       query(
  //         collection(this.firestore, this.sequencePath),
  //         or(where('ownerId', '==', this.auth.currentUser.uid), where('ownerId', '==', user?.therapist)),
  //       ),
  //     ).then((q) => q.docs.map((doc) => doc.data() as Sequence))
  //   } else {
  //     return getDocs(
  //       query(collection(this.firestore, this.sequencePath), where('ownerId', '==', this.auth.currentUser.uid)),
  //     ).then((q) => q.docs.map((doc) => doc.data() as Sequence))
  //   }
  // }

  public async getMySequences(userId: string = null): Promise<Sequence[]> {
    const userInfo = await this.userService.getUserInfo()
    const queries = [
      query(collection(this.firestore, this.sequencePath), where('ownerId', '==', this.auth.currentUser.uid)),
    ]

    if (userInfo.type === 'caregiver' && userInfo.therapist) {
      queries.push(query(collection(this.firestore, this.sequencePath), where('ownerId', '==', userInfo.therapist)))
    }
    if (userId) {
      queries.push(query(collection(this.firestore, this.sequencePath), where('ownerId', '==', userId)))
    }

    let sequences = []
    for (const q of queries) {
      const querySnapshot = await getDocs(q)
      sequences = sequences.concat(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    return sequences
  }

  /**
   * When needed, therapist can get all the sequences of a specific caregiver
   * @param caregiverId The id of the caregiver. Must be a caregiver assigned to the therapist
   * @returns An array of all the sequences of the caregiver with the given id
   */
  public async getCaregiverSequences(caregiverId: string): Promise<Sequence[]> {
    return getDocs(query(collection(this.firestore, this.sequencePath), where('ownerId', '==', caregiverId))).then(
      (q) => q.docs.map((doc) => doc.data() as Sequence),
    )
  }
}
