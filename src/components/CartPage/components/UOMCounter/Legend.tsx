import styled from '@emotion/styled';

const Legend = styled.legend`
  font-size: 11px;
  position: absolute;
  display: inline-flex;
  align-items: center;
  background-color: white;
  top: -10px;
  width: max-content;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0;
  padding-left: 4px;
  padding-right: 4px;
  @media screen and (max-width: 991px) {
    font-size: 10px;
  }
  @media screen and (max-width: 575px) {
    font-size: 9px;
  }
`;
export default Legend;
