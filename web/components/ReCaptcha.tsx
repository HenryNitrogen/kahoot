'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [hasError, setHasError] = useState(false);
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
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">reCAPTCHA not configured. Please contact administrator.</p>
      </div>
    );
  }

  const handleChange = (token: string | null) => {
    setHasError(false);
    onVerify(token);
  };

  const handleExpired = () => {
    onVerify(null);
    if (onExpired) {
      onExpired();
    }
  };

  const handleError = (error?: any) => {
    setHasError(true);
    onVerify(null);
    console.error('reCAPTCHA error occurred:', error);
    console.error('Site key being used:', siteKey);
    console.error('Make sure the site key is for reCAPTCHA v2 (not v3) and the domain is correctly configured');
  };

  // If there's an error, show a fallback message
  if (hasError) {
    return (
      <div className={`recaptcha-container ${className}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm mb-2">reCAPTCHA verification failed to load.</p>
          <button
            onClick={() => {
              setHasError(false);
              // For development, allow bypass
              if (process.env.NODE_ENV === 'development') {
                onVerify('development-bypass-token');
              }
            }}
            className="text-blue-600 hover:text-blue-700 text-sm underline"
          >
            Retry reCAPTCHA
          </button>
        </div>
      </div>
    );
  }

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
