'use client';

import { useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
  onExpired?: () => void;
  size?: 'compact' | 'normal' | 'invisible';
  theme?: 'light' | 'dark';
  className?: string;
}

export default function ReCaptcha({ 
  onVerify, 
  onExpired, 
  size = 'normal', 
  theme = 'light',
  className = ''
}: ReCaptchaProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    };
  }, []);

  if (!siteKey) {
    console.error('reCAPTCHA site key not found in environment variables');
    return null;
  }

  const handleChange = (token: string | null) => {
    onVerify(token);
  };

  const handleExpired = () => {
    onVerify(null);
    if (onExpired) {
      onExpired();
    }
  };

  const handleError = () => {
    onVerify(null);
    console.error('reCAPTCHA error occurred');
  };

  return (
    <div className={`recaptcha-container ${className}`}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleChange}
        onExpired={handleExpired}
        onError={handleError}
        size={size}
        theme={theme}
      />
    </div>
  );
}

export { ReCaptcha };
