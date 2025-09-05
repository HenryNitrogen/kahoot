'use client';

import { useEffect, useRef, useState } from 'react';

interface ReCaptchaEnterpriseProps {
  onVerify: (token: string | null) => void;
  onExpired?: () => void;
  action?: string;
  className?: string;
}

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        render: (container: string | Element, parameters: any) => number;
        execute: (widgetId?: number) => void;
        reset: (widgetId?: number) => void;
        getResponse: (widgetId?: number) => string;
      };
    };
  }
}

export default function ReCaptchaEnterprise({ 
  onVerify, 
  onExpired,
  action = 'LOGIN',
  className = ''
}: ReCaptchaEnterpriseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [widgetId, setWidgetId] = useState<number | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.error('reCAPTCHA site key not found');
      setHasError(true);
      return;
    }

    const loadRecaptcha = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="recaptcha/enterprise.js"]')) {
        if (typeof window.grecaptcha !== 'undefined') {
          initializeRecaptcha();
          return;
        }
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/enterprise.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeRecaptcha();
      };
      
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA Enterprise script');
        setHasError(true);
      };
      
      document.head.appendChild(script);
    };

    const initializeRecaptcha = () => {
      if (typeof window.grecaptcha !== 'undefined' && window.grecaptcha.enterprise) {
        window.grecaptcha.enterprise.ready(() => {
          if (containerRef.current) {
            try {
              const id = window.grecaptcha.enterprise.render(containerRef.current, {
                sitekey: siteKey,
                action: action,
                callback: (token: string) => {
                  console.log('reCAPTCHA Enterprise token received');
                  onVerify(token);
                },
                'expired-callback': () => {
                  console.log('reCAPTCHA Enterprise token expired');
                  onVerify(null);
                  if (onExpired) {
                    onExpired();
                  }
                },
                'error-callback': (error: any) => {
                  console.error('reCAPTCHA Enterprise error:', error);
                  setHasError(true);
                  onVerify(null);
                }
              });
              setWidgetId(id);
              setIsLoaded(true);
            } catch (error) {
              console.error('Error rendering reCAPTCHA Enterprise:', error);
              setHasError(true);
            }
          }
        });
      }
    };

    loadRecaptcha();

    return () => {
      // Cleanup
      if (widgetId !== null && typeof window.grecaptcha !== 'undefined') {
        try {
          window.grecaptcha.enterprise.reset(widgetId);
        } catch (error) {
          console.warn('Error resetting reCAPTCHA:', error);
        }
      }
    };
  }, [siteKey, action, onVerify, onExpired, widgetId]);

  if (!siteKey) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">reCAPTCHA not configured. Please contact administrator.</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`recaptcha-container ${className}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm mb-2">reCAPTCHA Enterprise verification failed to load.</p>
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
    <div className={`recaptcha-enterprise-container ${className}`}>
      <div ref={containerRef} />
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <p>reCAPTCHA Enterprise</p>
          <p>Site Key: ...{siteKey?.slice(-6)}</p>
          <p>Action: {action}</p>
          <p>Status: {isLoaded ? 'Loaded' : 'Loading...'}</p>
        </div>
      )}
    </div>
  );
}

export { ReCaptchaEnterprise };
