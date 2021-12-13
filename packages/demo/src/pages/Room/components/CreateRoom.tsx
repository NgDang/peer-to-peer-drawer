import React, { useState } from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
	background-color: #282c34;
  min-height: 100vh;
  font-size: calc(10px + 2vmin);
  color: white;
	display: flex;
	justify-content:flex-start;
	align-items: center;
	flex-direction: column;
	padding-top: 20px;
`

const FlexBox = styled.div`
  display: flex;
	align-items: center;
	justify-content: center;
	padding-bottom: 16px;
	width: 100%;
`;


const Input = styled.input`
	width: 60%;
	height: 30px;
	margin-right: 8px;
	border: none;
		outline: 0;
	&:hover, &:focus {
		border: none;
		outline: 0;
	}
`

const Button = styled.button`
	height: 32px;
	width: 20%;
	min-width: 64px;
`

const Divider = styled.hr`
	border-bottom: 3px solid white;
	width: 100%;
	padding: 0;
	margin: 0;
`

const Title = styled.h3`
	padding: 16px;
`
const RoomItem = styled.div`
	display: flex;
	align-items: center;
	padding-bottom: 16px;
	padding-top: 16px;
	width: 100%;
	position: relative;
	span {
		font-size: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		padding-right: 72px;
		padding-left: 20px;
	}

	button {
		background: none;
		color: white;
		font-size: 16px;
		font-weight: bold;
		text-decoration: underline;
		padding: 0;
		margin: 0;
		border: none;
		width: fit-content;
		position: absolute;
		right: 20px;
	}
`

function Home() {

	const [roomName, setRoomName] = useState('')

	return (
		<Wrapper>
			<FlexBox>
				<Input type="text" placeholder="Enter room id"  />
				<Button type="button" >Join</Button>
			</FlexBox>
			<FlexBox>
				<Input type="text" placeholder="Enter username" value={roomName} onChange={e => setRoomName(e.target.value)} />
				<Button type="button" >Create</Button>
			</FlexBox>
			<Divider />
			<Title>Room List</Title>
			<RoomItem>
				<span>{roomName}</span>
				<Button type="button" >Join</Button>
			</RoomItem>
		</Wrapper>
	)
}

export default Home
