import { auth } from '@/services/firebase'
import { Store } from '@/state/store'
import { toast } from '@/utils/toast'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { DBService } from './db'
import { FirebaseError } from 'firebase/app'
import { authErrorConverter } from '@/utils/error'
import { StorageService } from './storage'

/**
 * Authentication service to handle all auth related methods
 * -------------------------
 *
 * @class AuthService
 * @constructor
 * @param {Store} store - Store object to persist information
 */
export class AuthService {
  private store: Store
  private db: DBService

  constructor(store: Store, storage: StorageService) {
    this.store = store
    this.db = new DBService(storage)
  }

  public signInUser = async (email: string, password: string) => {
    this.store.updateLoading(true)

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const profile = await this.db.user.getUserById(userCredential.user.uid)

        if (profile) this.store.updateProfile(profile)

        this.store.updateUser(userCredential.user)
      })
      .catch((e: FirebaseError) => {
        toast({ title: 'Error', message: authErrorConverter(e.code) })
        this.store.updateLoading(false)
      })
  }

  public registerUser = async (fullName: string, email: string, password: string) => {
    this.store.updateLoading(true)

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        const { uid } = user

        if (!(await this.db.user.create(uid, fullName, email))) {
          toast({ title: 'Error', message: 'Something went wrong while creating your account. Please try again later' })
          return this.store.updateLoading(false)
        }

        // Store the crated users profile and user object in the store
        await this.signInUser(email, password)
      })
      .catch((e: FirebaseError) => {
        toast({ title: 'Error', message: authErrorConverter(e.code) })
        this.store.updateLoading(false)
      })
  }

  public signOut = async () => {
    this.store.updateLoading(true)

    signOut(auth)
      .then(() => {
        this.store.updateUser(false)
      })
      .catch((e: FirebaseError) => {
        toast({ title: 'Error', message: authErrorConverter(e.code) })
      })
      .finally(() => {
        this.store.updateLoading(false)
      })
  }

  public resetPassword = async (email: string) => {
    this.store.updateLoading(true)

    return sendPasswordResetEmail(auth, email)
      .then(() => {
        toast({
          title: 'Success',
          message: `An email will be sent if a user exists with the email ${email.toLowerCase()}`,
        })
        return true
      })
      .catch((e: FirebaseError) => {
        toast({ title: 'Error', message: authErrorConverter(e.code) })
        return false
      })
      .finally(() => {
        this.store.updateLoading(false)
        return true
      })
  }

  public deleteAccount = async () => {
    this.store.updateLoading(true)

    // Unassign therapist from caregiver
    const therapistId = this.store.profile?.therapist
    if (therapistId) {
      await this.db.user.unassignTherapistFromCaregiver(auth.currentUser.uid, therapistId)
    }

    // Delete user's profile from the database
    const profileDeleted = await this.db.user.delete()
    if (!profileDeleted) {
      toast({ title: 'Error', message: 'Something went wrong while deleting your profile' })
      return this.store.updateLoading(false)
    }

    // Delete user's cards from the database
    const cardsDeleted = await this.db.card.deleteAllMyCards()
    if (!cardsDeleted) {
      toast({ title: 'Error', message: 'Something went wrong while deleting your cards' })
      return this.store.updateLoading(false)
    }

    // Delete user's agenda from the database
    const agendaDeleted = await this.db.agenda.delete(auth.currentUser.uid)
    if (!agendaDeleted) {
      toast({ title: 'Error', message: 'Something went wrong while deleting your agenda' })
      return this.store.updateLoading(false)
    }

    // Delete the actual user account
    deleteUser(auth.currentUser)
      .then(() => {
        this.store.updateUser(false)

        toast({ title: 'Success', message: 'Account deleted successfully' })
      })
      .catch((e: FirebaseError) => {
        toast({ title: 'Error', message: authErrorConverter(e.code) })
      })
      .finally(() => {
        this.store.updateLoading(false)
      })
  }
}
