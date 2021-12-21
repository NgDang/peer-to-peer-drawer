import React from 'react';
import { MetaCard } from '../styles'

interface PropsType {
  room: any;
  onJoinRoom(id: string, code: string): void;
}

function RoomCard(props: PropsType) {
  const { room, onJoinRoom } = props

  const handleJoinRoom = () => {
    onJoinRoom(room?.id, room?.code)
  }

  return (
    <MetaCard title={room.name} onClick={handleJoinRoom}>
      <p>
        <b>Owner: </b>{`${room?.owner?.name}`}</p>
      <p>
        <b>Code: </b>{`${room?.code}`}
      </p>
      <p>
        <b>User active: </b>{`${room?.userList?.length}`}
      </p>
    </MetaCard>
  );
}

export default RoomCard;
