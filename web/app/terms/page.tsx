'use client';

import { useLanguage } from '@/lib/useLanguage';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Users, Zap, CreditCard, Ban } from 'lucide-react';

export default function Terms() {
  const { language } = useLanguage();

  const lastUpdated = language === 'zh' ? '2024年9月6日' : 'September 6, 2024';
  const appName = 'Kahoot AI Helper';
  const websiteUrl = 'https://kahoot.henryni.cn';
  const contactEmail = 'henryni710@gmail.com';

  const sections = {
    zh: [
      {
        id: 'acceptance',
        title: '条款接受',
        icon: <FileText className="h-6 w-6" />,
        content: [
          `欢迎使用${appName}！通过访问或使用我们的Chrome扩展程序和相关服务，您同意遵守并受本服务条款约束。`,
          `本服务条款构成您与我们之间具有法律约束力的协议。如果您不同意这些条款，请不要使用我们的服务。`,
          `我们保留随时修改这些条款的权利。重大变更将提前通知您，继续使用服务即表示接受修改后的条款。`
        ]
      },
      {
        id: 'description',
        title: '服务描述',
        icon: <Zap className="h-6 w-6" />,
        content: [
          `${appName}是一款Chrome浏览器扩展程序，为用户在Kahoot游戏中提供AI驱动的答题建议和辅助功能。`,
          '',
          '**主要功能包括**：',
          '• AI智能答题建议',
          '• 答题准确率分析',
          '• 使用统计和历史记录',
          '• 多种订阅计划选择',
          '',
          '**服务限制**：',
          '• 免费用户每日使用次数有限',
          '• 付费用户享有更高的使用配额',
          '• 服务可用性可能因维护而暂时中断',
          '• 我们不保证答案的100%准确性'
        ]
      },
      {
        id: 'registration',
        title: '用户注册与账户',
        icon: <Users className="h-6 w-6" />,
        content: [
          '**注册要求**：',
          '• 您必须年满13岁才能使用我们的服务',
          '• 提供准确、完整的注册信息',
          '• 保持账户信息的及时更新',
          '• 每人只能创建一个账户',
          '',
          '**账户安全**：',
          '• 您有责任保护账户密码的安全',
          '• 不得与他人共享账户凭据',
          '• 发现账户被盗用时应立即通知我们',
          '• 我们对未经授权的账户使用不承担责任',
          '',
          '**账户终止**：',
          '• 您可以随时删除自己的账户',
          '• 我们保留因违规行为终止账户的权利',
          '• 账户终止后，相关数据将按照隐私政策处理'
        ]
      },
      {
        id: 'usage',
        title: '使用规则',
        icon: <Shield className="h-6 w-6" />,
        content: [
          '**允许的使用**：',
          '• 将扩展程序用于个人学习和教育目的',
          '• 遵守Kahoot平台的使用条款',
          '• 合理使用AI答题功能',
          '• 尊重其他用户和服务提供商',
          '',
          '**禁止的行为**：',
          '• 恶意攻击或试图破坏服务',
          '• 使用自动化工具或机器人',
          '• 尝试逆向工程或破解软件',
          '• 侵犯他人的知识产权',
          '• 传播恶意软件或病毒',
          '• 进行任何非法活动',
          '',
          '**违规后果**：',
          '• 警告或临时暂停服务',
          '• 永久禁止使用服务',
          '• 法律追究（如适用）'
        ]
      },
      {
        id: 'subscription',
        title: '订阅与付费',
        icon: <CreditCard className="h-6 w-6" />,
        content: [
          '**订阅计划**：',
          '• 免费版：有限的daily使用次数',
          '• 高级版：扩展的使用配额和功能',
          '• 专业版：无限使用和优先支持',
          '',
          '**付费条款**：',
          '• 所有费用以美元计价',
          '• 订阅自动续费，除非提前取消',
          '• 退款政策：符合条件的情况下提供退款',
          '• 价格可能会有变动，现有用户有30天过渡期',
          '',
          '**兑换码**：',
          '• 兑换码一经使用不可逆转',
          '• 兑换码有效期以发放时说明为准',
          '• 不得转售或商业化兑换码',
          '',
          '**取消与退款**：',
          '• 可随时取消订阅，服务至当前计费周期结束',
          '• 特殊情况下可申请部分退款',
          '• 违规账户不享有退款权利'
        ]
      },
      {
        id: 'intellectual',
        title: '知识产权',
        icon: <Scale className="h-6 w-6" />,
        content: [
          '**我们的权利**：',
          `• ${appName}的所有代码、设计和内容均受版权保护`,
          '• 商标和服务标记归我们所有',
          '• 您获得的是使用许可，而非所有权',
          '• 禁止复制、修改或分发我们的软件',
          '',
          '**用户内容**：',
          '• 您保留对自己创建内容的权利',
          '• 授予我们使用您内容改进服务的权利',
          '• 您的内容不得侵犯他人权利',
          '',
          '**第三方权利**：',
          '• 尊重Kahoot和其他平台的知识产权',
          '• 不得使用服务侵犯第三方权利',
          '• AI服务提供商拥有其技术的相关权利'
        ]
      },
      {
        id: 'disclaimers',
        title: '免责声明',
        icon: <AlertTriangle className="h-6 w-6" />,
        content: [
          '**服务性质**：',
          '• 服务按"现状"提供，不提供任何明示或暗示的保证',
          '• 我们不保证服务的连续性、及时性或无错误',
          '• AI答案仅供参考，不保证准确性',
          '',
          '**使用风险**：',
          '• 您承担使用服务的所有风险',
          '• 我们不对因使用服务导致的任何损失承担责任',
          '• 包括但不限于学业成绩、账户封禁等后果',
          '',
          '**第三方服务**：',
          '• 我们不对集成的第三方服务承担责任',
          '• 第三方服务的条款和政策单独适用',
          '• 我们不保证第三方服务的可用性'
        ]
      },
      {
        id: 'limitation',
        title: '责任限制',
        icon: <Ban className="h-6 w-6" />,
        content: [
          '**损害限制**：',
          '• 在法律允许的最大范围内，我们的责任限制如下',
          '• 对于间接、特殊、偶然或后果性损害不承担责任',
          '• 总责任不超过您在过去12个月内支付的费用',
          '',
          '**不可抗力**：',
          '• 对于超出合理控制范围的事件不承担责任',
          '• 包括自然灾害、战争、政府行为等',
          '• 网络攻击、服务器故障等技术问题',
          '',
          '**赔偿**：',
          '• 您同意就因违规使用导致的索赔对我们进行赔偿',
          '• 包括但不限于法律费用和损害赔偿'
        ]
      },
      {
        id: 'termination',
        title: '服务终止',
        icon: <Ban className="h-6 w-6" />,
        content: [
          '**终止权利**：',
          '• 我们保留随时终止或暂停服务的权利',
          '• 您可以随时停止使用服务并删除账户',
          '• 终止不影响已产生的权利和义务',
          '',
          '**终止原因**：',
          '• 违反本服务条款',
          '• 长期未使用账户',
          '• 技术或商业原因',
          '• 法律要求',
          '',
          '**终止后果**：',
          '• 立即停止访问所有服务功能',
          '• 数据将按照隐私政策处理',
          '• 未使用的付费服务可能无法退款'
        ]
      },
      {
        id: 'governing',
        title: '适用法律',
        icon: <Scale className="h-6 w-6" />,
        content: [
          '**管辖法律**：',
          '• 本协议受中华人民共和国法律管辖',
          '• 不适用法律冲突原则',
          '',
          '**争议解决**：',
          '• 双方应首先通过友好协商解决争议',
          '• 协商不成的，可向有管辖权的人民法院提起诉讼',
          '• 仲裁条款（如适用）将单独说明',
          '',
          '**可分割性**：',
          '• 如条款某部分被认定无效，其余部分仍然有效',
          '• 无效条款将被最接近原意的有效条款替代'
        ]
      },
      {
        id: 'contact',
        title: '联系信息',
        icon: <FileText className="h-6 w-6" />,
        content: [
          '如果您对本服务条款有任何疑问或需要支持，请联系我们：',
          '',
          '**联系方式**：',
          `• 邮箱：${contactEmail}`,
          `• 网站：${websiteUrl}`,
          '• 在线客服：通过网站联系表单',
          '',
          '**营业时间**：',
          '• 周一至周五：9:00-18:00（北京时间）',
          '• 紧急技术问题：24小时响应',
          '',
          '感谢您选择我们的服务！'
        ]
      }
    ],
    en: [
      {
        id: 'acceptance',
        title: 'Acceptance of Terms',
        icon: <FileText className="h-6 w-6" />,
        content: [
          `Welcome to ${appName}! By accessing or using our Chrome extension and related services, you agree to be bound by these Terms of Service.`,
          `These Terms of Service constitute a legally binding agreement between you and us. If you do not agree to these terms, please do not use our services.`,
          `We reserve the right to modify these terms at any time. Material changes will be notified in advance, and continued use of the service indicates acceptance of the modified terms.`
        ]
      },
      {
        id: 'description',
        title: 'Service Description',
        icon: <Zap className="h-6 w-6" />,
        content: [
          `${appName} is a Chrome browser extension that provides AI-driven answer suggestions and assistance features for users in Kahoot games.`,
          '',
          '**Main features include**:',
          '• AI smart answer suggestions',
          '• Answer accuracy analysis',
          '• Usage statistics and history',
          '• Multiple subscription plan options',
          '',
          '**Service limitations**:',
          '• Free users have limited daily usage',
          '• Paid users enjoy higher usage quotas',
          '• Service availability may be temporarily interrupted for maintenance',
          '• We do not guarantee 100% answer accuracy'
        ]
      },
      {
        id: 'registration',
        title: 'User Registration & Accounts',
        icon: <Users className="h-6 w-6" />,
        content: [
          '**Registration requirements**:',
          '• You must be at least 13 years old to use our services',
          '• Provide accurate and complete registration information',
          '• Keep account information updated in a timely manner',
          '• Each person may only create one account',
          '',
          '**Account security**:',
          '• You are responsible for protecting your account password',
          '• Do not share account credentials with others',
          '• Notify us immediately if you discover account theft',
          '• We are not responsible for unauthorized account use',
          '',
          '**Account termination**:',
          '• You may delete your account at any time',
          '• We reserve the right to terminate accounts for violations',
          '• After account termination, related data will be handled according to the privacy policy'
        ]
      },
      {
        id: 'usage',
        title: 'Usage Rules',
        icon: <Shield className="h-6 w-6" />,
        content: [
          '**Permitted use**:',
          '• Use the extension for personal learning and educational purposes',
          '• Comply with Kahoot platform terms of service',
          '• Reasonable use of AI answer features',
          '• Respect other users and service providers',
          '',
          '**Prohibited activities**:',
          '• Malicious attacks or attempts to damage the service',
          '• Using automated tools or bots',
          '• Attempting to reverse engineer or crack software',
          '• Infringing on others\' intellectual property',
          '• Spreading malware or viruses',
          '• Engaging in any illegal activities',
          '',
          '**Violation consequences**:',
          '• Warning or temporary service suspension',
          '• Permanent ban from using the service',
          '• Legal action (if applicable)'
        ]
      },
      {
        id: 'subscription',
        title: 'Subscription & Payment',
        icon: <CreditCard className="h-6 w-6" />,
        content: [
          '**Subscription plans**:',
          '• Free version: Limited daily usage',
          '• Premium version: Extended usage quotas and features',
          '• Pro version: Unlimited usage and priority support',
          '',
          '**Payment terms**:',
          '• All fees are priced in USD',
          '• Subscriptions auto-renew unless cancelled in advance',
          '• Refund policy: Refunds provided under qualifying circumstances',
          '• Prices may change, existing users have a 30-day transition period',
          '',
          '**Redeem codes**:',
          '• Redeem codes cannot be reversed once used',
          '• Redeem code validity period as specified at time of issuance',
          '• Redeem codes may not be resold or commercialized',
          '',
          '**Cancellation & refunds**:',
          '• May cancel subscription at any time, service continues until end of current billing cycle',
          '• Partial refunds may be requested under special circumstances',
          '• Violating accounts are not entitled to refunds'
        ]
      },
      {
        id: 'intellectual',
        title: 'Intellectual Property',
        icon: <Scale className="h-6 w-6" />,
        content: [
          '**Our rights**:',
          `• All code, design, and content of ${appName} are protected by copyright`,
          '• Trademarks and service marks belong to us',
          '• You receive a usage license, not ownership',
          '• Copying, modifying, or distributing our software is prohibited',
          '',
          '**User content**:',
          '• You retain rights to content you create',
          '• Grant us rights to use your content to improve services',
          '• Your content must not infringe on others\' rights',
          '',
          '**Third-party rights**:',
          '• Respect intellectual property of Kahoot and other platforms',
          '• Do not use services to infringe on third-party rights',
          '• AI service providers own rights related to their technology'
        ]
      },
      {
        id: 'disclaimers',
        title: 'Disclaimers',
        icon: <AlertTriangle className="h-6 w-6" />,
        content: [
          '**Service nature**:',
          '• Services are provided "as is" without any express or implied warranties',
          '• We do not guarantee service continuity, timeliness, or error-free operation',
          '• AI answers are for reference only, accuracy not guaranteed',
          '',
          '**Usage risks**:',
          '• You assume all risks of using the service',
          '• We are not liable for any losses resulting from service use',
          '• Including but not limited to academic performance, account bans, etc.',
          '',
          '**Third-party services**:',
          '• We are not responsible for integrated third-party services',
          '• Third-party service terms and policies apply separately',
          '• We do not guarantee third-party service availability'
        ]
      },
      {
        id: 'limitation',
        title: 'Limitation of Liability',
        icon: <Ban className="h-6 w-6" />,
        content: [
          '**Damage limitations**:',
          '• To the maximum extent permitted by law, our liability is limited as follows',
          '• Not liable for indirect, special, incidental, or consequential damages',
          '• Total liability does not exceed fees paid by you in the past 12 months',
          '',
          '**Force majeure**:',
          '• Not liable for events beyond reasonable control',
          '• Including natural disasters, wars, government actions, etc.',
          '• Network attacks, server failures, and other technical issues',
          '',
          '**Indemnification**:',
          '• You agree to indemnify us for claims resulting from violation of use',
          '• Including but not limited to legal fees and damages'
        ]
      },
      {
        id: 'termination',
        title: 'Service Termination',
        icon: <Ban className="h-6 w-6" />,
        content: [
          '**Termination rights**:',
          '• We reserve the right to terminate or suspend services at any time',
          '• You may stop using services and delete your account at any time',
          '• Termination does not affect rights and obligations already incurred',
          '',
          '**Termination reasons**:',
          '• Violation of these Terms of Service',
          '• Long-term unused accounts',
          '• Technical or business reasons',
          '• Legal requirements',
          '',
          '**Termination consequences**:',
          '• Immediate cessation of access to all service features',
          '• Data will be handled according to privacy policy',
          '• Unused paid services may not be refundable'
        ]
      },
      {
        id: 'governing',
        title: 'Governing Law',
        icon: <Scale className="h-6 w-6" />,
        content: [
          '**Governing law**:',
          '• This agreement is governed by the laws of the People\'s Republic of China',
          '• Conflict of laws principles do not apply',
          '',
          '**Dispute resolution**:',
          '• Parties should first resolve disputes through friendly negotiation',
          '• If negotiation fails, may file lawsuit with competent people\'s court',
          '• Arbitration clauses (if applicable) will be specified separately',
          '',
          '**Severability**:',
          '• If any part of the terms is deemed invalid, the remainder remains valid',
          '• Invalid terms will be replaced by valid terms closest to the original intent'
        ]
      },
      {
        id: 'contact',
        title: 'Contact Information',
        icon: <FileText className="h-6 w-6" />,
        content: [
          'If you have any questions about these Terms of Service or need support, please contact us:',
          '',
          '**Contact methods**:',
          `• Email: ${contactEmail}`,
          `• Website: ${websiteUrl}`,
          '• Online customer service: Through website contact form',
          '',
          '**Business hours**:',
          '• Monday to Friday: 9:00-18:00 (Beijing Time)',
          '• Emergency technical issues: 24-hour response',
          '',
          'Thank you for choosing our service!'
        ]
      }
    ]
  };

  const currentSections = sections[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative min-h-screen">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Link 
                href="/" 
                className="flex items-center space-x-3 text-white hover:text-purple-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{language === 'zh' ? '返回首页' : 'Back to Home'}</span>
              </Link>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-white">
                  {language === 'zh' ? '服务条款' : 'Terms of Service'}
                </h1>
                <p className="text-purple-200 text-sm mt-1">
                  {language === 'zh' ? `最后更新：${lastUpdated}` : `Last Updated: ${lastUpdated}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Introduction */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <FileText className="h-8 w-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {appName} {language === 'zh' ? '服务条款' : 'Terms of Service'}
                </h2>
                <p className="text-purple-200">
                  {language === 'zh' 
                    ? '使用我们服务的法律协议' 
                    : 'Legal agreement for using our services'
                  }
                </p>
              </div>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
              <p className="text-white/90 leading-relaxed">
                {language === 'zh' 
                  ? `本服务条款规定了您使用 ${appName} Chrome扩展程序和相关服务的条件。请仔细阅读这些条款，因为它们包含重要的法律信息，包括争议解决条款。使用我们的服务即表示您同意这些条款。`
                  : `These Terms of Service govern your use of the ${appName} Chrome extension and related services. Please read these terms carefully as they contain important legal information, including dispute resolution clauses. By using our services, you agree to these terms.`
                }
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              {language === 'zh' ? '目录' : 'Table of Contents'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentSections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-purple-200 hover:text-white"
                >
                  <span className="text-purple-400">{section.icon}</span>
                  <span className="text-sm">{section.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {currentSections.map((section, index) => (
              <div 
                key={section.id}
                id={section.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  {section.content.map((paragraph, pIndex) => {
                    if (paragraph === '') {
                      return <br key={pIndex} />;
                    }
                    if (paragraph.startsWith('**') && paragraph.endsWith('**:')) {
                      return (
                        <h4 key={pIndex} className="text-purple-300 font-semibold mt-4 mb-2">
                          {paragraph.slice(2, -3)}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('•')) {
                      return (
                        <li key={pIndex} className="text-white/90 ml-4 mb-1">
                          {paragraph.slice(2)}
                        </li>
                      );
                    }
                    return (
                      <p key={pIndex} className="text-white/90 mb-3 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-12 border border-white/20">
            <div className="text-center">
              <p className="text-purple-200 mb-4">
                {language === 'zh' 
                  ? '感谢您使用我们的服务。如有任何疑问，请随时联系我们。'
                  : 'Thank you for using our service. If you have any questions, please feel free to contact us.'
                }
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
                <a 
                  href={`mailto:${contactEmail}`}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>{language === 'zh' ? '联系我们' : 'Contact Us'}</span>
                </a>
                <Link 
                  href="/privacy"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors border border-white/20"
                >
                  <Shield className="h-4 w-4" />
                  <span>{language === 'zh' ? '隐私政策' : 'Privacy Policy'}</span>
                </Link>
                <Link 
                  href="/"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors border border-white/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{language === 'zh' ? '返回首页' : 'Back to Home'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
