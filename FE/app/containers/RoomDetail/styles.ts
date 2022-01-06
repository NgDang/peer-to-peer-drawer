import styled from "styled-components";

export const Container = styled.div`
  margin: 0;
  padding-top: 0px;
  display: flex;
  width: 100%;
  height: calc(100vh - 80px);
  overflow: hidden;
  flex-direction: row;
  .leaveBtn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: red;
    color: white;
    border: none;
    outline: 0;
    min-width: 100px;
    cursor: pointer;
  }
`;

export const BoardWrapper = styled.div`
  width: 70%;
  height: 100%;
  box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
  div {
    width: 100%;
    height: 100%;
  }
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`

export const RightWrapper = styled.div`
  position: relative;
  width: 30%;
  height: 100%;
  padding: 12px 24px;
  overflow: scroll;
  video {
    margin: 20px auto;
    width: 100% !important;
    height: fit-content;
    border: 1px solid red;
    &.owner {
      border: 2px solid yellow;
    }
  }
  .btn-note {
    float: right;
    margin: auto 0px 0px;
    border: none;
    background: transparent;
    outline: 0;
    box-shadow: none;
    padding: 0px;
    &:hover,
    &:focus {
      background: transparent;
      outline: 0;
      box-shadow: none;
    }
  }
`

export const HelperText = styled.div`
  span {
    font-size: 16px;
  }
`
