/**
 *
 * OtpInput
 *
 */
import styled from '@emotion/styled';
import * as React from 'react';

import ReactOtpInput from './ReactOtpInput';

interface Props {
  otp: string;
  setOtp: Function;
  hasErrored?: boolean;
  onEnter: Function;
  error?: any;
}

const Div = styled.div`
  .inputStyle {
    width: 50px !important;
    height: 50px;
    margin: 0 0.5rem;
    border-radius: 12px;
    // border: 1px solid #f2eee4;
    background-color: #f8f4e9;
    margin: 0px 8px;
    &:active {
      border: 1px solid #f2eee4 !important;
    }
  }
  margin-bottom: 10px;
`;

export function OtpInput(props: Props) {
  const { otp, setOtp, hasErrored, onEnter } = props;

  return (
    <Div>
      <ReactOtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        inputStyle="inputStyle"
        // isDisabled={isDisabled}
        hasErrored={hasErrored}
        errorStyle={{
          border: '1px solid #C7000033',
          '&::active': {
            border: '1px solid #C70000!important'
          }
        }}
        isInputNum={true}
        isInputSecure={false}
        shouldAutoFocus
        onEnter={onEnter}
      />
    </Div>
  );
}
