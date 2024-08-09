import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/input/FormInput'
import { newCategorySchema } from '@/schema/forms'
import { Connector } from '@/lib/connector'
import { useStore } from '@/providers/store-provider'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet'
import { toast } from '@/utils/toast'
import { useTranslation } from 'react-i18next'

interface CategorySheetProps {
  sheet: React.RefObject<BottomSheet>
  existingCategories: string[]
  refresh: () => void
}

const CategorySheet = ({ sheet, existingCategories, refresh }: CategorySheetProps) => {
  type NewCategorySchema = z.infer<typeof newCategorySchema>

  const { control, handleSubmit, clearErrors } = useForm<NewCategorySchema>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: '',
    },
  })

  const handleCancel = () => {
    clearErrors()
    sheet.current.close()
  }

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)

  const handleCreateCategory = async (formData: NewCategorySchema) => {
    setLoading(true)

    if (existingCategories.map((c) => c.toLowerCase()).includes(formData.name.toLowerCase())) {
      setLoading(false)
      return toast({ title: 'Error', message: 'Category already exists' })
    }

    await connector.db.category.create(formData.name).finally(() => {
      setLoading(false)
      sheet.current.close()
      refresh()
    })
  }

  return (
    <View className="flex-1 items-center rounded-t-[28px]">
      <View className="flex-[1] justify-center">
        <Text className="text-center text-xl font-medium tracking-normal text-primary ">
          {t('components.folder.createCat')}
        </Text>
      </View>
      <View className="flex-[4] ">
        <View className="flex-1">
          <Input name="name" label={t('components.folder.catName')} control={control} customWidth={300} />
        </View>
        <View className=" flex-1 items-end ">
          <View className="h-[50px] flex-row items-center space-x-1">
            <Button mode="outlined" onPress={handleCancel}>
              {t('standards.cancel')}
            </Button>
            <Button mode="contained" onPress={handleSubmit(handleCreateCategory)} loading={loading}>
              {t('standards.create')}
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CategorySheet
