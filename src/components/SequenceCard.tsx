import React from 'react'
import { Card, IconButton } from 'react-native-paper'

const SequenceCard = ({ sequence, onAdd }) => {
  return (
    <Card className="my-1">
      <Card.Title
        title={sequence.name}
        left={(props) => <IconButton {...props} icon="folder" />}
        right={(props) => <IconButton {...props} icon="plus" onPress={() => onAdd(sequence)} />}
      />
    </Card>
  )
}

export default SequenceCard
