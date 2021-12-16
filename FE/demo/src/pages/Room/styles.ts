import styled from "styled-components";

export const Wrapper = styled.div`
  background-color: #282c34;
  height: 100vh;
  font-size: calc(10px + 2vmin);
  color: white;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
`;

export const LeftPanel = styled.div`
  position: relative;
  min-height: 100vh;
  width: 80%;
  overflow: hidden;

  canvas {
    width: 100%;
    height: 100vh;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    background: white;
  }
  .cam {
    position: absolute;
    top: 0;
    right: 0;
  }
`;

export const RightPanel = styled.div`
  position: relative;
  top: 0;
  right: 0px;
  bottom: 0px;
  height: 100vh;
  width: 20%;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  color: black;
  overflow: scroll;
`;

export const ButtonLeave = styled.button`
  height: 32px;
  width: 100px;
  background: red;
  color: white;
  border-radius: 20px;
  font-weight: bold;
`;

export const MessageItem = styled.div`
  display: flex;
  font-size: 16px;
	padding: 8px 4px;
	justify-content: end;
	&.active {
			justify-content: start;
	}
  p {
    font-weight: bold;231
  }
`;
