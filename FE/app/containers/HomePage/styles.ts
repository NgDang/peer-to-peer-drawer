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
  margin: auto;
  padding: 12px;
  width: 60%;
  max-width: 480px;
`

export const JoinButton = styled(Button)`
	padding: 4px 12px;
	width: 80px;
	background: #359713;
	color: white;
  height: 40px !important;
  margin-left: 12px;
  border-color: black;
`;

export const LeftSidebar = styled.div`
  position: fixed;
  z-index: 99;
  bottom: 0;
  width: 100%;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  input {
    border: 1px solid;
  }
`
export const RightContent = styled.div`
  min-height: 100%;
  width: 100%;
  height: fit-content;
  padding-bottom: 64px;
  background-color: white;
  .ant-row {
    width: 100%;
    margin: 0px !important;
    padding: 16px 8px !important;

  }
`
export const MetaCard = styled(Card)`
  width: 100%;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  max-width: 360px;
  transition: transform .2s;
  .ant-card-head-title {
    font-weight: bold;
  }
  .ant-card-body {
    padding: 12px 24px;
  }
  :hover {
    border: 1px solid #c4a7a7;
    transform: scale(1.02);
  }
`
