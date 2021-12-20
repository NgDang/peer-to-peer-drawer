import React from 'react';
import { MetaCard } from '../styles'

interface PropsType {
  room: any;
  onJoinRoom(id: string): void;
}

function RoomCard(props: PropsType) {
  const { room, onJoinRoom } = props

  const handleJoinRoom = () => {
    onJoinRoom(room?.id)
  }

  return (
    <MetaCard onClick={handleJoinRoom}>
      <div>
        <b>Room Name: </b>
        {room.name}
      </div>
      <div>
        <b>Owner: </b>
        {room?.owner?.name}
      </div>
    </MetaCard>
  );
}

export default RoomCard;
