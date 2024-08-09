import { Auth } from 'firebase/auth'
import { Firestore, addDoc, collection, deleteDoc, doc, query, or, where, getDocs } from 'firebase/firestore'

export class CategoryService {
  private categoryPath = 'category'

  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  /**
   * Inserts a new category into the database
   * @param name The name of the category
   * @param parentCategory The parent category of the category, default null if no parent category
   * @returns The id of the inserted category
   */
  public async create(name: string, parentCategory: string = null): Promise<string> {
    return addDoc(collection(this.firestore, this.categoryPath), {
      name: name,
      parentCategory: parentCategory,
      ownerId: this.auth.currentUser.uid,
    }).then((docRef) => docRef.id)
  }

  /**
   * Deletes a category from the database
   * @param id The id of the category to delete
   * @returns True if the category was deleted, false if the category was not deleted
   */
  public async remove(id: string): Promise<boolean> {
    return deleteDoc(doc(this.firestore, this.categoryPath, id))
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Gets all the categories in the database that belong to the current user
   *
   * @returns An array of all the categories in the database in the structure {name: string, parentCategory: string}
   */
  public async getAll(): Promise<Category[]> {
    return getDocs(
      query(
        collection(this.firestore, this.categoryPath),
        or(where('ownerId', '==', this.auth.currentUser.uid), where('global', '==', true)),
      ),
    ).then((q) => q.docs.map((doc) => doc.data() as Category))
  }
}
