import { Text, TouchableOpacity, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { tabBarConfig } from '@/config/tabBar'
import useNavigate from '@/hooks/useNavigate'
import { useTranslation } from 'react-i18next'

const TabBar = ({ disabledMargin = false, openPopup }) => {
  const route = useRoute()
  const cursorPosition = route.name

  const items = Object.values(tabBarConfig)

  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <View
      className={`${
        disabledMargin ? 'm-6' : ''
      } absolute inset-x-0 bottom-0 flex flex-row justify-evenly bg-transparent`}
    >
      <View className="flex w-full flex-1 flex-row justify-evenly rounded-2xl border border-primary/30 bg-white px-2.5 shadow">
        {items.map((item) => (
          <TouchableOpacity
            onPress={() => {
              if (item.popup) {
                openPopup()
              } else if (item.link) {
                navigate.to(item.link)
              }
            }}
            key={item.link}
          >
            <TabBarItemContainer>
              <TabBarItemIcon icon={item.icon.src} h={item.icon?.h} w={item.icon?.w} />
              {item?.title && <TabBarItemText>{t('components.nav.' + item.title)}</TabBarItemText>}
            </TabBarItemContainer>
            {item.title && item.title === cursorPosition && <TabBarCurrentItemIndicator />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const TabBarCurrentItemIndicator = () => {
  return <View className="absolute bottom-[7px] left-[19px] h-[3px] w-[22px] rounded-[16px] bg-accent" />
}

const TabBarItemIcon = ({ icon: Icon, h = 18, w = 18 }) => {
  return <Icon height={h} width={w} />
}

const TabBarItemText = ({ children }) => {
  return <Text className="mt-1 w-[65px] text-center text-[12px] text-primary">{children}</Text>
}

const TabBarItemContainer = ({ children }) => {
  return <View className="flex h-[60px] w-[60px] flex-col items-center rounded-[16px] p-3">{children}</View>
}

export default TabBar
