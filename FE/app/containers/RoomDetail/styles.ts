import styled from 'styled-components';
import { Button, Card } from 'antd';

export const Section = styled.div`
	height: 100%;
	min-width: 100%;
	color: black;
  display: flex;
`;

export const Flex = styled.div`
  display: flex;
  justify-content: center;
  max-width: 600px;
  width: 90%;
  margin: auto;
  padding: 20px 0px;
`

export const JoinButton = styled(Button)`
	padding: 4px 12px;
	width: 80px;
	background: #359713;
	color: white;
  height: 40px !important;
  margin-left: 12px;
`;

export const LeftSidebar = styled.div`
  height: 100%;
  width: 30%;
  background-color: #282c34;
`
export const RightContent = styled.div`
  height: 100%;
  width: 70%;
  background-color: white;
  .ant-row {
    width: 100%;
    margin: 0px !important;
    padding: 16px 8px !important;

  }
`
export const MetaCard = styled(Card)`
  height: 100px;
  width: 100%;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  display: -webkit-box;
  max-width: 360px;
  overflow: hidden;
  .ant-card-body {
    width: 100%;
  }
`