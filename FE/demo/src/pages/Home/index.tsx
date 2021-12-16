import React, { useState } from 'react';
import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { homeService } from '../../services/homeServices';

const Wrapper = styled.div`
	background-color: #282c34;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: black;
	min-width: ;
`;
const Box = styled.div`
	heigh: auto;
	max-width: 600;
	padding: 60px 40px;
	display: flex;
	box-shadow: rgba(0, 0, 0, 0.56) 0px 22px 70px 4px;
	border-radius: 12px;
	background: white;
`;

const Button = styled.button`
	padding: 4px 12px;
	width: 100px;
	background: #359713;
	color: white;
`;

interface HomeProps {
	history: {
		push(url: string): void;
	};
}

function Home(props: HomeProps) {
	const [userName, setUserName] = useState('');

	const handleJoinRoom = () => {
		homeService.getJoinLink().then((res) => {
			props.history.push(`/room/${res.data.link}`);
		});
	};

	return (
		<Wrapper>
			<Box>
				<Input
					size="large"
					placeholder="Enter your username"
					prefix={<UserOutlined />}
					value={userName}
					onChange={(e: { target: HTMLInputElement }) => setUserName(e.target.value)}
				/>
				<Button type="button" disabled={!!userName} onClick={handleJoinRoom}>
					Join
				</Button>
			</Box>
		</Wrapper>
	);
}

export default Home;
