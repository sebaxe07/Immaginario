import { Auth } from 'firebase/auth'
import {
  arrayRemove,
  arrayUnion,
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

export class UserService {
  private caregiverPath = 'caregiver'
  private therapistPath = 'therapist'

  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  /**
   * Gets a user profile by its id.
   * @param id The id of the user
   * @returns The user profile of the user with the given id.
   * Field therapist is null if the user is a therapist, otherwise it is the id of the therapist of the user.
   * Field caregivers is null if the user is a caregiver, otherwise it is an array of ids of the caregivers of the user.
   */
  public async getUserById(id: string): Promise<UserProfile | null> {
    const caregiver = await getDoc(doc(this.firestore, this.caregiverPath, id))
      .then((querySnapshot) => (querySnapshot.exists() ? (querySnapshot.data() as UserProfile) : null))
      .catch(() => null)

    if (caregiver) {
      caregiver.type = 'caregiver'
      return caregiver
    }

    const therapist = await getDoc(doc(this.firestore, this.therapistPath, id))
      .then((querySnapshot) => (querySnapshot.exists() ? (querySnapshot.data() as UserProfile) : null))
      .catch(() => null)

    if (!therapist) return null

    therapist.type = 'therapist'
    return therapist
  }

  /**
   * Handles all the database operations for the therapist collection.
   * @returns An array of therapist profiles.
   */
  public async getAllTherapists(): Promise<Therapist[]> {
    const therapists = collection(this.firestore, this.therapistPath)
    return await getDocs(therapists)
      .then((q) => q.docs.map((doc) => ({ uid: doc.id, profile: doc.data() }) as Therapist))
      .catch(() => null)
  }

  /**
   * Gets all caregivers from the database.
   * @returns An array of caregiver profiles.
   */
  public async getAllCaregivers(): Promise<UserProfile[]> {
    const caregivers = collection(this.firestore, this.caregiverPath)
    return await getDocs(caregivers)
      .then((q) => q.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as UserProfile))
      .catch(() => null)
  }

  /**
   * Gets all caregivers with their associated therapists.
   * @returns An array of caregiver profiles including their therapist's profile.
   */
  public async getAllCaregiversWithTherapist(): Promise<UserProfile[]> {
    const therapists = await this.getAllTherapists()
    const therapistSet = therapists.reduce((acc, user) => {
      const { caregivers: _, ...restProfile } = user.profile
      acc[user.uid] = restProfile
      return acc
    }, {})

    const caregivers = await this.getAllCaregivers()
    caregivers.forEach((caregiver: UserProfile) => {
      caregiver.therapistProfile = therapistSet[caregiver.therapist]
    })

    return caregivers
  }

  /**
   * Gets all caregivers of logged user
   * @returns list of caregiver profiles
   */
  public async getOwnCaregivers(): Promise<UserProfile[]> {
    const therapist = this.auth.currentUser.uid
    return getDocs(query(collection(this.firestore, this.caregiverPath), where('therapist', '==', therapist)))
      .then((q) => q.docs.map((doc) => ({ uid: doc.id, ...doc.data() }) as UserProfile))
      .catch(() => {
        console.log('No permission (Caregiver account)')
        return []
      })
  }

  /**
   * Assigns a therapist to a caregiver.
   * @param caregiverId The id of the caregiver
   * @param therapistId The id of the therapist
   * @returns True if the operation was successful, false otherwise.
   */
  public async assignTherapistToCaregiver(caregiverId: string, therapistId: string): Promise<boolean> {
    const updateCaregiver = await setDoc(
      doc(this.firestore, this.caregiverPath, caregiverId),
      { therapist: therapistId },
      { merge: true },
    )
      .then(() => true)
      .catch(() => false)

    const updateTherapist = await updateDoc(doc(this.firestore, this.therapistPath, therapistId), {
      caregivers: arrayUnion(caregiverId),
    })
      .then(() => true)
      .catch(() => false)

    return updateCaregiver && updateTherapist
  }

  public async unassignTherapistFromCaregiver(caregiverId: string, therapistId: string): Promise<boolean> {
    const updateCaregiver = await setDoc(
      doc(this.firestore, this.caregiverPath, caregiverId),
      { therapist: null },
      { merge: true },
    )
      .then(() => true)
      .catch(() => false)

    const updateTherapist = await updateDoc(doc(this.firestore, this.therapistPath, therapistId), {
      caregivers: arrayRemove(caregiverId),
    })
      .then(() => true)
      .catch(() => false)

    return updateCaregiver && updateTherapist
  }

  /**
   * Gets the user profile of the current user.
   * @returns The user profile of the current user.
   */
  public async getUserInfo(): Promise<UserProfile | null> {
    return await this.getUserById(this.auth.currentUser.uid)
  }

  /**
   * Creates a new user in the database.
   * @param uid The id of the user
   * @param fullName The full name of the user
   * @param email The email of the user
   * @param therapist The id of the therapist of the user, default null if no therapist
   * @returns True if the operation was successful, false otherwise.
   */
  public async create(uid: string, fullName: string, email: string, therapist: string = null): Promise<boolean> {
    return setDoc(doc(this.firestore, this.caregiverPath, uid), {
      fullName,
      email,
      therapist,
    })
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Deletes a user from the database.
   * @param uid The id of the user to delete.
   * @returns True if the operation was successful, false otherwise.
   */
  public async delete(): Promise<boolean> {
    return deleteDoc(doc(this.firestore, this.caregiverPath, this.auth.currentUser.uid))
      .then(() => true)
      .catch(() => false)
  }
}
