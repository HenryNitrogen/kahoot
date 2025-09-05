'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, CheckCircle, Clock, Star } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface Redemption {
  id: string;
  planType: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  redeemCode: {
    code: string;
    duration: number;
  };
}

export default function RedeemPage() {
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const { translations, loading: i18nLoading } = useTranslations();

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // 获取用户信息
      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        loadRedemptions();
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    }
  };

  const loadRedemptions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/redeem', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRedemptions(data.redemptions);
      }
    } catch (error) {
      console.error('Load redemptions error:', error);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!redeemCode.trim()) {
      setMessage(translations.enterRedeemCode);
      setMessageType('error');
      return;
    }

    setIsRedeeming(true);
    setMessage('');
    setMessageType('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: redeemCode.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`${translations.redeemSuccess}！已获得${data.redemption.planType === 'pro' ? translations.proVersion : translations.premiumVersion}权限`);
        setMessageType('success');
        setRedeemCode('');
        loadRedemptions();
        
        // 3秒后跳转到控制台
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setMessage(data.error || translations.registrationFailed);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(translations.networkError);
      setMessageType('error');
      console.error('Redeem error:', error);
    } finally {
      setIsRedeeming(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getPlanDisplayName = (planType: string) => {
    return planType === 'pro' ? translations.proVersion : translations.premiumVersion;
  };

  const getPlanColor = (planType: string) => {
    return planType === 'pro' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Gift className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">{translations.redeemCenter}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{translations.welcome}, {user.name}</span>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {translations.back}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 兑换表单 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{translations.redeemCode}</h2>
          
          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <label htmlFor="redeemCode" className="block text-sm font-medium text-gray-700 mb-2">
                {translations.redeemCode}
              </label>
              <div className="flex space-x-4">
                <input
                  id="redeemCode"
                  type="text"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  placeholder={translations.enterRedeemCode}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={isRedeeming}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isRedeeming ? translations.redeeming : translations.redeem}
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center">
                  {messageType === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <Gift className="h-5 w-5 mr-2" />
                  )}
                  {message}
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{translations.redeemInstructionsTitle}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {translations.redeemInstruction1}</li>
              <li>• {translations.redeemInstruction2}</li>
              <li>• {translations.redeemInstruction3}</li>
              <li>• {translations.redeemInstruction4}</li>
            </ul>
          </div>
        </div>

        {/* 兑换记录 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{translations.redeemHistory}</h2>
          
          {redemptions.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{translations.noRedeemHistory}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {redemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPlanColor(redemption.planType)}`}>
                          {getPlanDisplayName(redemption.planType)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {translations.redeemCode}: {redemption.redeemCode.code}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{translations.startTime}:</span>
                          <p className="font-medium">{formatDate(redemption.startDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.endTime}:</span>
                          <p className="font-medium">{formatDate(redemption.endDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.remainingDays}:</span>
                          <p className="font-medium">{getDaysRemaining(redemption.endDate)} {translations.days}</p>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {redemption.isActive && getDaysRemaining(redemption.endDate) > 0 ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">{translations.active}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-5 w-5 mr-1" />
                          <span className="text-sm font-medium">{translations.expired}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
