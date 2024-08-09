export const authErrorConverter = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-disabled':
      return 'This user has been disabled'
    case 'auth/user-not-found':
      return 'No user found with this email and password'
    case 'auth/invalid-login-credentials':
      return 'No user found with this email and password'
    case 'auth/email-already-in-use':
      return 'This email is already in use'
    case 'auth/operation-not-allowed':
      return 'This operation is not allowed'
    case 'auth/weak-password':
      return 'This password is too weak'
    default:
      return 'An error occurred. Please try again later'
  }
}
