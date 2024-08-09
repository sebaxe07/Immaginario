import { Button, Dialog, Portal } from 'react-native-paper'

import Input from '@/components/input/FormInput'
import React, { useContext } from 'react'
import AgendaContext from '@/context/AgendaContext'
import { toast } from '@/utils/toast'
import { useStore } from '@/providers/store-provider'
import { Connector } from '@/lib/connector'
import { z } from 'zod'
import { saveDaySchema } from '@/schema/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const SaveDayPrompt = ({ visiblePrompt, setVisiblePrompt }) => {
  const { selectedUser, selectedDay } = useContext(AgendaContext)
  const store = useStore()
  const connector = new Connector(store)
  const userId = selectedUser?.uid
  const { t } = useTranslation()

  type SaveDaySchema = z.infer<typeof saveDaySchema>

  const { control, handleSubmit, clearErrors, reset } = useForm<SaveDaySchema>({
    resolver: zodResolver(saveDaySchema),
    defaultValues: {
      name: '',
    },
  })

  const handleSaveDay = async (formData: SaveDaySchema) => {
    store.setLoading(true)
    setVisiblePrompt(false)

    await connector.db.agenda
      .saveDay(selectedDay ?? 0, formData.name, userId)
      .then(() => reset())
      .catch(() => {
        toast({ title: 'Error', message: 'Error while saving day' })
      })
      .finally(() => {
        store.setLoading(false)
      })
  }

  const handleCancel = () => {
    clearErrors()
    setVisiblePrompt(false)
    reset()
  }

  return (
    <Portal>
      <Dialog
        visible={visiblePrompt}
        style={{ backgroundColor: 'white' }}
        onDismiss={() => {
          setVisiblePrompt(false)
        }}
      >
        <Dialog.Title>Save day</Dialog.Title>
        <Dialog.Content>
          <Input name="name" label={t('components.chooseName')} control={control} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>{t('standards.cancel')}</Button>
          <Button onPress={handleSubmit(handleSaveDay)}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export default SaveDayPrompt
