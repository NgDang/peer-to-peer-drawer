import React from "react";
import styled from "styled-components";
import CreateRoom from './components/CreateRoom'
import GameRoom from './components/GameRoom';

const FlexBox = styled.div`
  display: flex;
`;


const Left = styled.div`
	width: 30%;
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
`

function Room() {
  return( 
		<FlexBox>
			<Left>
				<CreateRoom />
			</Left>
			
			<GameRoom />
		</FlexBox>
	);
}

export default Room;
