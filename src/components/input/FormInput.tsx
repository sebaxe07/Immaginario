import { Control, useController, Path, FieldValues } from 'react-hook-form'
import { TextInput, TextInputProps, HelperText } from 'react-native-paper'
import { View } from 'react-native'
import { Colors as c } from '#/colors'
import { useState } from 'react'

export interface InputProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>
  control: Control<T>
  label: string
  isPassword?: boolean
  customWidth?: number
}

function Input<T extends FieldValues>({ name, control, label, isPassword, customWidth, ...props }: InputProps<T>) {
  const defaultValue = control._options.defaultValues[name as string] ?? ('' as unknown as T[Path<T>])

  const {
    field: { value, onChange },
    formState: { errors },
  } = useController({ name, control, defaultValue })

  const isError = errors[name]

  const [isActive, setIsActive] = useState(false)
  const [isSecure, setIsSecure] = useState(isPassword)

  const icon = (function () {
    if (isPassword) return { src: isSecure ? 'eye-off' : 'eye', color: c.detail, action: () => setIsSecure((s) => !s) }

    if (isError) return { src: 'alert-circle', color: c.incomplete, action: null }

    if (!isActive) return { src: '', color: '', action: null }

    return {
      src: 'close-circle-outline',
      color: c.detail,
      action: () => {
        onChange('')
      },
    }
  })()

  return (
    <View>
      <TextInput
        value={value}
        mode="outlined"
        className={`h-14 ${customWidth ? `w-[${customWidth}px]` : ''} bg-white`}
        onChangeText={onChange}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        error={!!errors[name]}
        label={label}
        secureTextEntry={isSecure}
        right={<TextInput.Icon icon={icon.src} color={icon.color} style={{ marginTop: 15 }} onPress={icon.action} />}
        {...props}
      />

      {errors[name] && (
        <HelperText
          type="error"
          className={`mb-[-10px] ${customWidth ? `w-[${customWidth}px]` : ''}`}
          visible={!!errors[name]}
        >
          {(errors[name] as { message: string })?.message}
        </HelperText>
      )}
    </View>
  )
}

export default Input
