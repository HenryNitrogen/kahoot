'use client';

import { useState } from 'react';
import ReCaptcha from '@/components/ReCaptcha';
import ReCaptchaEnterprise from '@/components/ReCaptchaEnterprise';

export default function RecaptchaTest() {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [useEnterprise, setUseEnterprise] = useState(true);

  const testRecaptcha = async () => {
    if (!recaptchaToken) {
      setTestResult('Please complete reCAPTCHA first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recaptchaToken }),
      });

      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">reCAPTCHA Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Environment Info:</h2>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
            <p>Site Key: {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? 'Configured' : 'Missing'}</p>
            <p>Key ending: ...{process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.slice(-6)}</p>
            <p>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'Server-side'}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Version Selection:</h2>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => {
                setUseEnterprise(false);
                setRecaptchaToken(null);
              }}
              className={`px-4 py-2 rounded ${!useEnterprise ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              reCAPTCHA v2 (Standard)
            </button>
            <button
              onClick={() => {
                setUseEnterprise(true);
                setRecaptchaToken(null);
              }}
              className={`px-4 py-2 rounded ${useEnterprise ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              reCAPTCHA Enterprise
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">reCAPTCHA Component:</h2>
          {useEnterprise ? (
            <ReCaptchaEnterprise
              onVerify={(token) => {
                setRecaptchaToken(token);
                if (token) {
                  console.log('reCAPTCHA Enterprise token received:', token.substring(0, 50) + '...');
                }
              }}
              onExpired={() => {
                setRecaptchaToken(null);
                console.log('reCAPTCHA Enterprise expired');
              }}
              action="LOGIN"
            />
          ) : (
            <ReCaptcha
              onVerify={(token) => {
                setRecaptchaToken(token);
                if (token) {
                  console.log('reCAPTCHA v2 token received:', token.substring(0, 50) + '...');
                }
              }}
              onExpired={() => {
                setRecaptchaToken(null);
                console.log('reCAPTCHA expired');
              }}
            />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Token Status:</h2>
          <div className="bg-gray-100 p-3 rounded text-sm">
            {recaptchaToken ? (
              <div>
                <p className="text-green-600">✓ Token received</p>
                <p className="text-xs text-gray-600 mt-1 break-all">
                  {recaptchaToken.substring(0, 100)}...
                </p>
              </div>
            ) : (
              <p className="text-red-600">✗ No token</p>
            )}
          </div>
        </div>

        <button
          onClick={testRecaptcha}
          disabled={!recaptchaToken || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Server Verification'}
        </button>

        {testResult && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Result:</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-96">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
