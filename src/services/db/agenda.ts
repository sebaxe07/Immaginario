import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { Auth } from 'firebase/auth'

export class AgendaService {
  private agendaPath = 'agenda'
  private savedDaysPath = 'savedDays'

  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  /**
   * Sets the agenda for a specific day
   * @param day The day of the agenda (0-6)
   * @param agendaSequence The sequence of the agenda. Must be an array of elements of type {type: string, content: string|any[]} where type is either "card" or "sequence" and content is the id of the card (if type is "card") or an array of elements of type {type: string, content: string|any[]} if type is "sequence"
   * @param caregiverId The id of the caregiver
   */
  public async setDay(day: WeekdayNumeral, agendaSequence: SequenceObject[], caregiverId: string): Promise<boolean> {
    try {
      await updateDoc(doc(this.firestore, this.agendaPath, caregiverId), {
        [`agenda.${day}`]: agendaSequence,
      })
      return true
    } catch (e) {
      if (e.code === 'not-found') {
        await setDoc(doc(this.firestore, this.agendaPath, caregiverId), {
          ownerId: caregiverId,
        })
        return this.setDay(day, agendaSequence, caregiverId)
      }
      return false
    }
  }

  /**
   * Gets the agenda for a specific caregiver.
   * @param caregiverId The id of the caregiver
   * @returns The agenda of the specified caregiver or null if it does not exist.
   */
  public async getAgenda(caregiverId: string): Promise<Agenda | null> {
    return await getDoc(doc(this.firestore, this.agendaPath, caregiverId)).then((doc) => doc.data() as Agenda)
  }

  /**
   * Deletes the agenda of a specific caregiver.
   * @param caregiverId
   */
  public async delete(caregiverId: string): Promise<boolean> {
    return await deleteDoc(doc(this.firestore, this.agendaPath, caregiverId))
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Saves the agenda of a specific day for a specific caregiver.
   * @param day The day of the agenda (0-6)
   * @param name The name of the save
   * @param caregiverId The id of the caregiver
   * @returns The id of the save
   */
  public async saveDay(day: WeekdayNumeral, name: string, caregiverId: string): Promise<string> {
    const dayData = await getDoc(doc(this.firestore, this.agendaPath, caregiverId)).then((doc) => doc.data())
    return addDoc(collection(this.firestore, this.savedDaysPath), {
      name,
      ownerId: caregiverId,
      data: dayData['agenda'][day],
    }).then((docRef) => docRef.id)
  }

  /**
   * Deletes a saved day.
   * @param id The id of the saved day to delete
   */
  public async deleteSavedDay(id: string): Promise<boolean> {
    return await deleteDoc(doc(this.firestore, this.savedDaysPath, id))
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Gets the saved days of the current user.
   * @returns An array of saved days
   */
  public async getSavedDays(userId: string): Promise<SavedDay[]> {
    return await getDocs(query(collection(this.firestore, this.savedDaysPath), where('ownerId', '==', userId))).then(
      (q) =>
        q.docs.map((doc) => {
          const { name } = doc.data()
          const id = doc.id
          return { name, id }
        }) as SavedDay[],
    )
  }

  /**
   * Restores a saved day into a specific day of the agenda.
   * @param saveId The id of the saved day to restore
   * @param day The day of the agenda (0-6)
   * @param caregiverId The id of the caregiver
   */
  public async restoreSavedDay(saveId: string, day: WeekdayNumeral, caregiverId: string): Promise<boolean> {
    const savedDay = (await getDoc(doc(this.firestore, this.savedDaysPath, saveId)).then(
      (doc) => doc.data()['data'],
    )) as SequenceObject[]
    if (savedDay) {
      return await this.setDay(day, savedDay, caregiverId)
    }
  }
}
