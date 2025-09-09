'use client';

import { useState } from 'react';
import { MessageCircle, X, Mail, Send } from 'lucide-react';

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleContact = () => {
    console.log('Contact button clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  const sendEmail = () => {
    console.log('Send email clicked');
    window.open('mailto:henryni710@gmail.com?subject=Kahoot AI Helper 咨询&body=您好，我想咨询关于 Kahoot AI Helper 的问题：', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Contact Panel */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 overflow-hidden transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4 fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">联系我们</span>
              </div>
              <button
                onClick={toggleContact}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                需要帮助？
              </h3>
              <p className="text-gray-600 text-sm">
                有任何问题或建议，欢迎随时联系我们！
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Contact */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">邮箱联系</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  发送邮件到：
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <code className="text-sm text-blue-600 font-mono break-all">
                    henryni710@gmail.com
                  </code>
                </div>
              </div>

              {/* Quick Contact Button */}
              <button
                onClick={sendEmail}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
                <span>发送邮件</span>
              </button>

              {/* Contact Info */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  我们通常会在 24 小时内回复您的邮件
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleContact}
        className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center group relative ${
          isOpen ? 'rotate-180 scale-105' : 'hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-300" />
        ) : (
          <MessageCircle className="h-6 w-6 group-hover:animate-pulse transition-transform duration-300" />
        )}
      </button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-20 pointer-events-none"></div>
      )}
    </div>
  );
}
