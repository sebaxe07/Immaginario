import React, { Dispatch, SetStateAction } from 'react'

type DayContextType = {
  selectedUser: UserProfile
  selectedDay: WeekdayNumeral
  setSelectedDay: Dispatch<SetStateAction<WeekdayNumeral>>
  setSelectedUser: Dispatch<SetStateAction<UserProfile>>
}

const AgendaContext = React.createContext<DayContextType>({
  selectedUser: null,
  setSelectedUser: () => {},
  selectedDay: 0,
  setSelectedDay: () => {},
})

export default AgendaContext
