import type { NavigationConfig } from '@/types/navigation'
import HomeScreen from '@/views/HomeScreen'
import AgendaScreen from '@/views/agenda/AgendaScreen'
import LoginScreen from '@/views/auth/LoginScreen'
import CardsScreen from '@/views/card/CardsScreen'

import SequenceScreen from '@/views/sequence/SequencesScreen'
import SettingsScreen from '@/views/SettingsScreen'
import RegisterScreen from '@/views/auth/RegisterScreen'
import LandingScreen from '@/views/LandingScreen'
import ForgotPasswordScreen from '@/views/auth/ForgotPasswordScreen'
import CardOptions from '@/views/card/CardOptionsScreen'
import AssignTherapistScreen from '@/views/therapist/AssignTherapistScreen'
import AddCardsAgendaScreen from '@/views/agenda/AddCardsAgendaScreen'
import AddSeqAgendaScreen from '@/views/agenda/AddSeqAgendaScreen'
import SequenceOptions from '@/views/sequence/SequenceOptionsScreen'
import { CreateNewDialog } from '@/components/createNew/CreateNewDialog'
import { CreateNewCard } from '@/components/createNew/CreateNewCard'
import SubLevels from '@/views/SubLevelScreen'
import AddUpdateCardsSequenceScreen from '@/views/sequence/AddCardsSequenceScreen'
import EditCardScreen from '@/views/card/EditCardScreen'
import EditSequenceScreen from '@/views/sequence/EditSequenceScreen'
import ChangeImagePopUp from '@/components/popup/ChangeImagePopUp'
import SavedDaysScreen from '@/views/agenda/SavedDaysScreen'

/**
 *
 * This is the navigation configuration file.
 *
 * It is used to define the routes of the application.
 *
 * The routes are defined as an object with the following structure:
 * {
 *  [routeName]: {
 *  name: string
 *  component: React.ComponentType<any>
 *  protected?: boolean
 *  options?: NativeStackNavigationOptions | null
 *  }
 *
 * */
export const navigationConfig: NavigationConfig = {
  routes: {
    Landing: {
      name: 'Landing',
      component: LandingScreen,
    },
    Login: {
      name: 'Login',
      component: LoginScreen,
    },
    Register: {
      name: 'Register',
      component: RegisterScreen,
    },

    ForgotPassword: {
      name: 'ForgotPassword',
      component: ForgotPasswordScreen,
    },
    Home: {
      name: 'Home',
      component: HomeScreen,
      protected: true,
    },
    Agenda: {
      name: 'Agenda',
      component: AgendaScreen,
      protected: true,
    },
    SavedDays: {
      name: 'SavedDays',
      component: SavedDaysScreen,
      protected: true,
    },
    Cards: {
      name: 'Cards',
      component: CardsScreen,
      protected: true,
    },
    AddCardsSequenceScreen: {
      name: 'AddCardsSequence',
      component: AddUpdateCardsSequenceScreen,
      protected: true,
    },
    AddCardsAgendaScreen: {
      name: 'AddCardsAgenda',
      component: AddCardsAgendaScreen,
      protected: true,
    },
    AddSeqAgendaScreen: {
      name: 'AddSeqAgenda',
      component: AddSeqAgendaScreen,
      protected: true,
    },
    CardOptions: {
      name: 'CardOptions',
      component: CardOptions,
      protected: true,
    },
    SubLevels: {
      name: 'SubLevels',
      component: SubLevels,
      protected: true,
    },
    CardEdit: {
      name: 'CardEdit',
      component: EditCardScreen,
      protected: true,
    },
    Sequence: {
      name: 'Sequence',
      component: SequenceScreen,
      protected: true,
    },
    SequenceEdit: {
      name: 'SequenceEdit',
      component: EditSequenceScreen,
      protected: true,
    },
    SequenceOptions: {
      name: 'SequenceOptions',
      component: SequenceOptions,
      protected: true,
    },
    Add: {
      name: 'Add',
      component: CreateNewDialog,
      protected: true,
    },
    NewCard: {
      name: 'NewCard',
      component: CreateNewCard,
      protected: true,
    },
    Settings: {
      name: 'Settings',
      component: SettingsScreen,
      protected: true,
    },
    ChangeImagePopUp: {
      name: 'ChangeImagePopUp',
      component: ChangeImagePopUp,
      protected: true,
    },
  },
  therapistRoutes: {
    AssignTherapists: {
      name: 'AssignTherapist',
      component: AssignTherapistScreen,
    },
  },
}
