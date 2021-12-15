import { useState } from 'react'
import styled from 'styled-components';
import { homeService } from '../../services/homeServices';

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

// const Input = styled.input`
// 	min-width: 200px;
// 	height: 30px;
// 	margin: 20px;
// 	border: none;
// 		outline: 0;
// 	&:hover, &:focus {
// 		border: none;
// 		outline: 0;
// 	}
// `

const Button = styled.button`
	padding: 4px 12px;
`

interface HomeProps  {
	history: any
}

function Home(props: HomeProps) {

	const [userName, setUserName] = useState('')

	const handleJoinRoom = () => {
		homeService.getJoinLink().then(res => {
			 props.history.push(`/room/${res.data.link}`)
		})
	}

	return (
		<Wrapper>
			<Button type="button"  onClick={handleJoinRoom}>JOIN</Button>
		</Wrapper>
	)
}

export default Home
