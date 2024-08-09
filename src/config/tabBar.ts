import Home from '#/assets/icons/home.svg'
import Cards from '#/assets/icons/cards.svg'
import Agenda from '#/assets/icons/agenda.svg'
import Add from '#/assets/icons/add.svg'
import Sequence from '#/assets/icons/sequence.svg'
import { TabBarConfig } from '@/types/tabBar'

export const tabBarConfig: TabBarConfig = {
  home: {
    title: 'Home',
    icon: {
      src: Home,
    },
    link: 'Home',
  },
  agenda: {
    title: 'Agenda',
    icon: {
      src: Agenda,
    },
    link: 'Agenda',
  },
  add: {
    icon: {
      src: Add,
      w: 30,
      h: 30,
    },
    link: 'NewCard',
  },
  cards: {
    title: 'Cards',
    icon: {
      src: Cards,
    },
    link: 'Cards',
  },
  sequence: {
    title: 'Sequences',
    icon: {
      src: Sequence,
    },
    link: 'Sequence',
  },
}
