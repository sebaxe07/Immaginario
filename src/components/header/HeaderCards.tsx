import useNavigate from '@/hooks/useNavigate'
import { Appbar, Menu } from 'react-native-paper'
import React from 'react'

import DotsMore from '#/assets/icons/dotsMore.svg'
import LeftArrow from '#/assets/icons/leftArrow.svg'
import { useNavigation } from '@react-navigation/native'
import { capitalize } from '@/utils/capitalize'
import { Alert } from 'react-native'
import { Connector } from '@/lib/connector'
import { useStore } from '@/providers/store-provider'
import { useTranslation } from 'react-i18next'

interface HeaderCardsTemplateProps {
  variant: 'card' | 'sequence'
  isOwner?: boolean
}

const HeaderCards = ({ variant, isOwner = false }: HeaderCardsTemplateProps) => {
  const navigate = useNavigate()
  const navigation = useNavigation()

  const goBack = () => navigation.goBack()
  const goToEditScreen = () => navigate.to(`${capitalize(variant)}Edit`)

  const [visible, setVisible] = React.useState(false)

  const openMenu = () => setVisible(true)

  const closeMenu = () => setVisible(false)

  const renderLeftArrow = () => <LeftArrow width={20} height={20} />
  const renderDotsMore = () => <DotsMore width={40} height={40} />

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const handleDelete = () => {
    if (variant === 'card') {
      Alert.alert(t('components.header.deleteCard'), t('components.header.areYouSureCard'), [
        {
          text: t('standards.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('standards.delete'),
          onPress: async () => {
            await connector.db.card.remove(store.card.id)
            goBack()
          },
          style: 'destructive',
        },
      ])

      return
    }

    Alert.alert(t('components.header.deleteSeq'), t('components.header.areYouSureSeq'), [
      {
        text: t('standards.cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('standards.delete'),
        onPress: async () => {
          await connector.db.sequence.delete(store.sequence.id)
          goBack()
        },
        style: 'destructive',
      },
    ])
  }

  return (
    <Appbar.Header className="justify-between bg-transparent" statusBarHeight={0}>
      <Appbar.Action
        className="left-[8px] h-[45px] w-[45px] rounded-full bg-white "
        size={20}
        animated={false}
        icon={renderLeftArrow}
        onPress={goBack}
      />
      {isOwner && (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              className=" right-[8px] h-[45px]  w-[45px] rounded-full bg-white "
              size={40}
              animated={false}
              icon={renderDotsMore}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu()
              goToEditScreen()
            }}
            title={
              t('components.header.edit') + ' ' + (variant == 'card' ? t('standards.card') : t('standards.sequence'))
            }
          />
          <Menu.Item
            onPress={() => {
              closeMenu()
              handleDelete()
            }}
            title={t('standards.delete') + ' ' + (variant == 'card' ? t('standards.card') : t('standards.sequence'))}
          />
        </Menu>
      )}
    </Appbar.Header>
  )
}

export default HeaderCards
