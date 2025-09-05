'use client';

import { useState, useEffect } from 'react';
import { detectUserLocation, getLanguageByCountry } from '@/lib/i18n';

export default function TestIP() {
  const [ipInfo, setIpInfo] = useState<{
    ip?: string;
    country_code?: string;
    country_name?: string;
    region?: string;
    city?: string;
  } | null>(null);
  const [countryCode, setCountryCode] = useState<string>('');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testDetection() {
      try {
        // 获取完整的IP信息
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setIpInfo(data);
        }

        // 使用我们的检测函数
        const detectedCountry = await detectUserLocation();
        setCountryCode(detectedCountry);
        
        const language = getLanguageByCountry(detectedCountry);
        setDetectedLanguage(language);
      } catch (error) {
        console.error('Detection error:', error);
      } finally {
        setLoading(false);
      }
    }

    testDetection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">IP Location & Language Detection Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detection Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Detection Results</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Country Code:</span>
                <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  {countryCode}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Detected Language:</span>
                <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {detectedLanguage}
                </span>
              </div>
            </div>
          </div>

          {/* Language Logic */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Language Logic</h2>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>Chinese (zh):</strong> CN, TW
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong>English (en):</strong> All others (including HK, MO)
              </div>
            </div>
          </div>

          {/* Full IP Info */}
          {ipInfo && (
            <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-purple-600">Full IP Information</h2>
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(ipInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh Test
          </button>
        </div>
      </div>
    </div>
  );
}
