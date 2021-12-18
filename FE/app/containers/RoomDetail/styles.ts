import styled from 'styled-components';
import { Button } from 'antd';

export const CenteredSection = styled.div`
	background-color: #282c34;
	height: 100vh;
	min-width: 100vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: black;
`;

export const Flex = styled.div`
  display: flex;
  justify-content: center;
  max-width: 600px;
  width: 50%;
`

export const JoinButton = styled(Button)`
	padding: 4px 12px;
	width: 100px;
	background: #359713;
	color: white;
  height: 100% !important;
  margin-left: 12px;
`;
