import { Colors } from '#/colors'
import { TextInput } from 'react-native-paper'
import { useTranslation } from 'react-i18next'

interface SearchBarProps {
  value: string
  handler: React.Dispatch<React.SetStateAction<string>>
  placeholder?: string
}

const SearchBar = ({ value, handler, placeholder }: SearchBarProps) => {
  const handleReset = () => handler('')
  const { t } = useTranslation()

  return (
    <TextInput
      placeholder={placeholder ?? t('search')}
      mode="outlined"
      className="w-full"
      left={<TextInput.Icon icon="magnify" color={Colors.primary} />}
      right={value && <TextInput.Icon icon="close" color={Colors.primary} onPress={handleReset} />}
      value={value}
      onChangeText={handler}
      style={{ backgroundColor: Colors.white, height: 45 }}
      outlineStyle={{ borderRadius: 50, borderWidth: 1 }}
    />
  )
}

export default SearchBar
