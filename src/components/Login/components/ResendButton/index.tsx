import { Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ResendOTPProps {
  onResend: () => void;
  cooldownTime?: number;
}

const ResendOTP: React.FC<ResendOTPProps> = ({ onResend, cooldownTime = 30 }) => {
  const [timeLeft, setTimeLeft] = useState(cooldownTime);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timeLeft > 0) {
      setIsButtonDisabled(true);
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  const handleResendClick = () => {
    if (isButtonDisabled) return;
    onResend();
    setTimeLeft(cooldownTime);
  };

  return (
    <div>
      <Button variant="text" onClick={handleResendClick}>
        <Typography
          sx={{
            color: '#00855b',
            fontSize: '12px',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            opacity: isButtonDisabled ? '50%' : 'none',
            textTransform: 'capitalize',
            fontFamily: 'SofiaPro',
            fontWeight: '600'
          }}
        >
          {isButtonDisabled ? `Resend OTP (${timeLeft}s)` : 'Resend OTP'}
        </Typography>
      </Button>
    </div>
  );
};

export default ResendOTP;
