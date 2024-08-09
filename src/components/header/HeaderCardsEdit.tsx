import useNavigate from '@/hooks/useNavigate'
import { Appbar } from 'react-native-paper'
import React from 'react'

import LeftArrow from '#/assets/icons/leftArrow.svg'
import EditImg from '#/assets/icons/editImg.svg'

interface HeaderCardsEditProps {
  onPressedButton: () => void
}

const HeaderCardsEdit = ({ onPressedButton }: HeaderCardsEditProps) => {
  const navigate = useNavigate()

  const goBack = () => navigate.goBack()

  const renderLeftArrow = () => <LeftArrow width={20} height={20} />
  const renderEditImg = () => <EditImg width={30} height={30} />

  return (
    <Appbar.Header className="justify-between bg-transparent" statusBarHeight={0}>
      <Appbar.Action
        className="left-[8px] h-[45px] w-[45px] rounded-full bg-white "
        size={20}
        animated={false}
        icon={renderLeftArrow}
        onPress={goBack}
      />
      <Appbar.Action
        animated={false}
        className="absolute right-[12px] h-[45px] w-[45px] flex-1 rounded-full bg-white"
        icon={renderEditImg}
        size={30}
        onPress={onPressedButton}
      />
    </Appbar.Header>
  )
}

export default HeaderCardsEdit
