import { auth, storage } from '@/services/firebase'
import { deleteObject, FirebaseStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

/**
 * Storage service class to handle all storage related methods
 * -------------------------
 *
 * @class StorageService
 */
export class StorageService {
  private storage: FirebaseStorage

  constructor() {
    this.storage = storage
  }

  /**
   * Uploads an image to Firebase rage and returns the download url
   *
   * @param cardId The id of the card
   * @param imageUrl The local uri of the image to upload
   * @returns The url of the image
   */
  public uploadCardImage = async (cardId: string, imageUrl: string): Promise<string> => {
    const image = await fetch(imageUrl)
    const blob = await image.blob()
    const metadata = {
      customMetadata: {
        owner: auth.currentUser.uid,
      },
    }
    const snapshot = await uploadBytesResumable(ref(this.storage, `card/image/${cardId}`), blob, metadata)
    return await getDownloadURL(snapshot.ref)
  }

  /**
   * Uploads an audio to Firebase rage and returns the download url
   *
   * @param cardId The id of the card
   * @param audioUrl The local uri of the audio to upload
   * @returns The url of the audio
   */
  public uploadCardAudio = async (cardId: string, audioUrl: string): Promise<string> => {
    const audio = await fetch(audioUrl)
    const blob = await audio.blob()
    const metadata = {
      customMetadata: {
        owner: auth.currentUser.uid,
        cardId,
      },
    }
    const snapshot = await uploadBytesResumable(ref(this.storage, `card/audio/${cardId}`), blob, metadata)
    return await getDownloadURL(snapshot.ref)
  }

  /**
   * Deletes an image from Firebase and returns a boolean indicating whether the image was deleted or not
   *
   * @param cardId The id of the card
   * @returns A boolean indicating whether the image was deleted or not
   */
  public deleteCardImage = async (cardId: string): Promise<boolean> => {
    return await deleteObject(ref(this.storage, `card/image/${cardId}`))
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Deletes an audio file from Firebase and returns a boolean indicating whether the audio was deleted or not
   *
   * @param cardId The id of the card
   * @returns A boolean indicating whether the audio was deleted or not
   */
  public deleteCardAudio = async (cardId: string): Promise<boolean> => {
    return await deleteObject(ref(this.storage, `card/audio/${cardId}`))
      .then(() => true)
      .catch((e) => false)
  }

  /**
   * Deletes the image and audio of a card from Firebase rage (if they exist)
   *
   * @param cardId The id of the card
   */
  public deleteCardInfo = async (cardId: string): Promise<boolean> => {
    const audioRef = await this.deleteCardAudio(cardId)
    const imageRef = await this.deleteCardImage(cardId)

    return audioRef && imageRef
  }
}
