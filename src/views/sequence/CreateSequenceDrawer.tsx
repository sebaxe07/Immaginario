import { Colors } from '#/colors'
import MiniCard from '@/components/card/MiniCard'
import Input from '@/components/input/FormInput'
import useNavigate from '@/hooks/useNavigate'
import { Connector } from '@/lib/connector'
import { createSequenceState } from '@/state/sequence'
import { toast } from '@/utils/toast'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useStore } from '@/providers/store-provider'
import { z } from 'zod'
import { sequenceSchema } from '@/schema/forms'
import CircleAddButton from '@/components/button/CircleAddButton'
import { getUUID } from '@/utils/uuid'
import { useTranslation } from 'react-i18next'

interface CreateSequenceDrawerProps {
  sheet: React.RefObject<BottomSheet>
  refresh: () => void
}

const CreateSequenceDrawer = ({ sheet, refresh }: CreateSequenceDrawerProps) => {
  const navigate = useNavigate()

  const [cards, setSequence] = useAtom(createSequenceState)
  const handleAddCard = () => navigate.to('AddCardsSequence', { update: false })

  const resetSequence = () => setSequence([])

  const handleCancelNewSequence = () => {
    sheet.current.close()
    reset()
    resetSequence()
  }

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(sequenceSchema),
    defaultValues: {
      name: '',
    },
  })

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const handleCreateSequence = async (formData: z.infer<typeof sequenceSchema>) => {
    if (cards.length === 0) {
      return toast({ title: 'Error', message: t('screens.sequence.createSequenceDrawer.least1Card') })
    }

    store.setLoading(true)

    connector.db.sequence
      .create(
        formData.name,
        cards[0].imgUrl,
        cards.map((c) => ({ content: c, uniqueId: getUUID(), type: 'card' })),
      )
      .then(refresh)
      .catch(() => {
        toast({ title: 'Error', message: 'Something went wrong and the sequence could not be created' })
      })
      .finally(() => {
        store.setLoading(false)
        handleCancelNewSequence()
      })
  }

  return (
    <BottomSheet
      ref={sheet}
      enablePanDownToClose
      index={-1}
      snapPoints={['90%']}
      backdropComponent={(backdrop) => (
        <BottomSheetBackdrop
          {...backdrop}
          style={{ position: 'absolute', top: -150, left: 0, height: '120%', width: '100%' }}
          disappearsOnIndex={-1}
        />
      )}
    >
      <View className="m-4 flex items-center">
        <Text className="text-[16px] font-semibold text-primary">
          {t('screens.sequence.createSequenceDrawer.createSeq')}
        </Text>
      </View>
      <View className="items-center">
        <ScrollView
          className="h-[45%] w-3/4 rounded-md border border-primary py-5"
          contentContainerStyle={{
            flexGrow: 1,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
          }}
          showsVerticalScrollIndicator={true}
        >
          {cards.map((card, index) => (
            <MiniCard key={index} name={card.name} image={card.imgUrl} />
          ))}
          <CircleAddButton handler={handleAddCard} />
        </ScrollView>
      </View>
      <View className="mt-5 items-center justify-center">
        <Input
          name="name"
          control={control}
          label={t('standards.seqName')}
          className="w-64"
          style={{
            fontSize: 18,
            backgroundColor: Colors.white,
          }}
        />
      </View>

      <View className="mx-auto my-8 w-5/6 items-end">
        <View className="h-12 max-w-[65%] flex-row space-x-2">
          <TouchableOpacity
            className="flex-1 items-center justify-center rounded-full border border-primary bg-white text-center text-base"
            onPress={handleCancelNewSequence}
          >
            <Text className="text-black">{t('standards.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center justify-center rounded-full bg-primary"
            onPress={handleSubmit(handleCreateSequence)}
          >
            <Text className="text-white">{t('standards.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  )
}

export default CreateSequenceDrawer
