import styled from '@emotion/styled';

const CounterStyled = styled.div`
  background-color: #00855b;
  width: 68px;
  height: 30px;
  border: 1px solid #00855b;
  background-color: #00855b;
  border-radius: 6px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  position: relative;
  input {
    width: 16px;
    height: 30px;
    color: #fff;
    font-size: 14px;
    border: none;
    font-weight: 600;
    background: none;
    padding: 0;
    text-align: center;
    background-color: transparent;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &:focus {
      outline: none;
      box-shadow: none;
    }
    &[type='number'] {
      -moz-appearance: textfield;
    }
  }
  button {
    padding: 0;
    height: 30px;
    width: 24px;
    min-width: 24px;
  }
`;

export const CounterYellowStyled = styled.div`
  background-color: #fff;
  width: 74px;
  padding-left: 2px;
  padding-right: 2px;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 20px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .button {
    background-color: #ffdd00;
    width: 20px;
    height: 20px;
    .image {
      color: #231f20;
      width: 18px;
      height: 18px;
    }
  }
  input {
    width: 20px;
    height: 30px;
    color: #000;
    font-size: 14px;
    border: none;
    font-weight: 600;
    background: none;
    padding: 0;
    text-align: center;
    background-color: transparent;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &:focus {
      outline: none;
      box-shadow: none;
    }
    &[type='number'] {
      -moz-appearance: textfield;
    }
  }
  button {
    padding: 0;
    height: 30px;
    width: 24px;
    min-width: 24px;
  }
`;

export const CounterFullYellowStyled = styled.div`
  background-color: #ffdd00;
  width: 74px;
  padding-left: 2px;
  padding-right: 2px;
  height: 30px;
  border: 1px solid #fff;
  border-radius: 20px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .button {
    background-color: #ffdd00;
    width: 20px;
    height: 20px;
    .image {
      color: #231f20;
      width: 18px;
      height: 18px;
    }
  }
  input {
    width: 20px;
    height: 30px;
    color: #000;
    font-size: 14px;
    border: none;
    font-weight: 600;
    background: none;
    padding: 0;
    text-align: center;
    background-color: transparent;
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &:focus {
      outline: none;
      box-shadow: none;
    }
    &[type='number'] {
      -moz-appearance: textfield;
    }
  }
  button {
    padding: 0;
    height: 30px;
    width: 24px;
    min-width: 24px;
  }
`;

export default CounterStyled;
