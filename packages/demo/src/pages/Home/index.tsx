import React, { useState } from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
	background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

const Input = styled.input`
	min-width: 200px;
	height: 30px;
	margin: 20px;
	border: none;
		outline: 0;
	&:hover, &:focus {
		border: none;
		outline: 0;
	}
`

const Button = styled.button`
	padding: 4px 12px;
`

function Home() {

	const [userName, setUserName] = useState('')

	return (
		<Wrapper>
			<Input type="text" placeholder="Enter username" value={userName} onChange={e => setUserName(e.target.value)} />
			<Button type="button" disabled={!userName}>JOIN</Button>
		</Wrapper>
	)
}

export default Home
