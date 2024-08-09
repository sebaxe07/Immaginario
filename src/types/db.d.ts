type Category = {
  name: string
  ownerId: string
  parentCategory?: string
}

type Card = {
  category: string
  global: boolean
  imgUrl?: string
  name: string
  ownerId: string
  voiceUrl?: string
  id: string
}

type SequenceObject = {
  type: 'card' | 'sequence'
  uniqueId: string
  content: Card | SequenceObject[]
}

type CardSequenceObject = {
  type: 'card'
  content: Card
}

type Sequence = {
  cards: SequenceObject[]
  name: string
  ownerId: string
  placeholder: string
  id: string
}

type Agenda = {
  agenda?: Partial<{ [key in WeekdayNumeral]: SequenceObject[] }>
  ownerId: string
}

type SavedDay = {
  name: string
  id: string
}

type WeekdayNumeral = 0 | 1 | 2 | 3 | 4 | 5 | 6

type UserProfile = {
  uid?: string
  email: string
  fullName: string
  type: 'therapist' | 'caregiver'
  therapist?: string
  therapistProfile?: Therapist['profile']
  caregivers?: string[]
}

type Therapist = {
  uid: string
  profile: {
    email: string
    fullName: string
    caregivers?: string[]
  }
}
