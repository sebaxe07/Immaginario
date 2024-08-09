import React from 'react'
import { Card, IconButton } from 'react-native-paper'
import { View } from 'react-native'

const SavedDayCard = ({ savedDay, onRestore, onDelete }) => {
  return (
    <Card className="my-1">
      <Card.Title
        title={savedDay.name}
        left={(props) => <IconButton {...props} icon="content-save" />}
        right={(props) => (
          <View className="flex-row ">
            <IconButton {...props} icon="plus" onPress={() => onRestore(savedDay.id)} />
            <IconButton {...props} icon="delete" onPress={() => onDelete(savedDay.id)} />
          </View>
        )}
      />
    </Card>
  )
}

export default SavedDayCard
