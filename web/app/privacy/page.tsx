'use client';

import { useLanguage } from '@/lib/useLanguage';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Users, Lock, Mail, FileText, AlertTriangle } from 'lucide-react';

export default function Privacy() {
  const { language } = useLanguage();

  const lastUpdated = language === 'zh' ? '2024年9月6日' : 'September 6, 2024';
  const appName = 'Kahoot AI Helper';
  const websiteUrl = 'https://kahoot.henryni.cn';
  const contactEmail = 'henryni.cn or henryni710@gmail.com';

  const sections = {
    zh: [
      {
        id: 'overview',
        title: '隐私政策概述',
        icon: <Shield className="h-6 w-6" />,
        content: [
          `欢迎使用${appName}！我们深知您对隐私的重视，本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。`,
          `${appName}是一款Chrome浏览器扩展程序，旨在为Kahoot游戏提供AI驱动的答题辅助功能。为了提供这些服务，我们需要收集和处理某些信息。`,
          `使用我们的服务即表示您同意本隐私政策的条款。如果您不同意本政策，请不要使用我们的服务。`
        ]
      },
      {
        id: 'collection',
        title: '我们收集的信息',
        icon: <Database className="h-6 w-6" />,
        content: [
          '**账户信息**：',
          '• 用户名、邮箱地址和加密后的密码',
          '• 注册时间和最后登录时间',
          '• 订阅计划类型（免费版、高级版、专业版）',
          '',
          '**使用数据**：',
          '• AI答题请求的次数和频率',
          '• 题目内容和您的答题选择（仅用于提供答案建议）',
          '• 扩展程序的使用统计信息',
          '• 错误日志和性能数据',
          '',
          '**技术信息**：',
          '• 浏览器类型和版本信息',
          '• 设备操作系统信息',
          '• IP地址（仅用于安全和防滥用目的）',
          '• 扩展程序版本号',
          '',
          '**支付信息**：',
          '• 通过第三方支付处理商处理的支付交易信息',
          '• 我们不直接存储您的信用卡或银行账户信息'
        ]
      },
      {
        id: 'usage',
        title: '信息使用方式',
        icon: <Eye className="h-6 w-6" />,
        content: [
          '我们使用收集的信息用于以下目的：',
          '',
          '**核心服务提供**：',
          '• 验证用户身份和管理账户',
          '• 为Kahoot题目提供AI答案建议',
          '• 监控和限制使用配额',
          '• 处理订阅和付费服务',
          '',
          '**服务改进**：',
          '• 分析使用模式以改进AI算法准确性',
          '• 优化扩展程序性能和用户体验',
          '• 开发新功能和服务',
          '',
          '**安全和合规**：',
          '• 检测和防止滥用或欺诈行为',
          '• 确保服务的安全性和稳定性',
          '• 遵守法律法规要求',
          '',
          '**用户支持**：',
          '• 响应用户询问和技术支持请求',
          '• 发送重要的服务通知'
        ]
      },
      {
        id: 'sharing',
        title: '信息共享',
        icon: <Users className="h-6 w-6" />,
        content: [
          '我们承诺不会出售、出租或以其他方式商业化您的个人信息。我们仅在以下情况下共享您的信息：',
          '',
          '**服务提供商**：',
          '• AI服务提供商（用于生成答案建议）',
          '• 云服务提供商（用于数据存储和处理）',
          '• 支付处理商（用于处理订阅付款）',
          '• 分析服务提供商（用于改进服务质量）',
          '',
          '**法律要求**：',
          '• 遵守适用的法律、法规或法院命令',
          '• 保护我们的权利、财产或安全',
          '• 防止或调查可能的违法行为',
          '',
          '**业务转让**：',
          '• 在合并、收购或资产出售的情况下，您的信息可能会被转让给继承实体'
        ]
      },
      {
        id: 'storage',
        title: '数据存储与安全',
        icon: <Lock className="h-6 w-6" />,
        content: [
          '**数据存储**：',
          '• 您的数据主要存储在安全的云服务器上',
          '• 我们使用工业标准的加密技术保护数据传输和存储',
          '• 敏感信息（如密码）经过加密处理',
          '',
          '**安全措施**：',
          '• 实施访问控制和身份验证',
          '• 定期进行安全审计和漏洞扫描',
          '• 员工接受数据保护培训',
          '• 建立事件响应和数据泄露通知程序',
          '',
          '**数据保留**：',
          '• 账户信息：在账户有效期间保留',
          '• 使用数据：保留12个月用于服务改进',
          '• 日志数据：保留90天用于故障排除',
          '• 您可以随时要求删除您的账户和相关数据'
        ]
      },
      {
        id: 'rights',
        title: '您的权利',
        icon: <FileText className="h-6 w-6" />,
        content: [
          '根据适用的数据保护法律，您享有以下权利：',
          '',
          '**访问权**：',
          '• 请求查看我们收集的关于您的个人信息',
          '• 获取数据处理目的和法律依据的信息',
          '',
          '**更正权**：',
          '• 更正不准确或不完整的个人信息',
          '• 通过账户设置页面更新您的信息',
          '',
          '**删除权**：',
          '• 请求删除您的个人信息',
          '• 在某些情况下我们可能需要保留某些信息以遵守法律义务',
          '',
          '**限制处理权**：',
          '• 在特定情况下限制我们处理您的信息',
          '',
          '**数据可携权**：',
          '• 以结构化、常用和机器可读的格式获取您的数据',
          '',
          '**反对权**：',
          '• 反对基于合法利益的数据处理',
          '• 随时取消营销通信',
          '',
          '要行使这些权利，请通过以下方式联系我们：',
          `• 邮箱：${contactEmail}`,
          '• 在线联系表单：通过我们的网站'
        ]
      },
      {
        id: 'cookies',
        title: 'Cookies和追踪技术',
        icon: <AlertTriangle className="h-6 w-6" />,
        content: [
          '我们使用以下技术来增强您的体验：',
          '',
          '**必要Cookies**：',
          '• 维持用户登录状态',
          '• 记住用户偏好设置',
          '• 确保网站安全性',
          '',
          '**分析Cookies**：',
          '• Google Analytics（可选）',
          '• 收集匿名使用统计信息',
          '• 帮助我们改进服务质量',
          '',
          '**本地存储**：',
          '• 浏览器本地存储用于缓存用户设置',
          '• 提高扩展程序响应速度',
          '',
          '您可以通过浏览器设置管理Cookie偏好，但请注意禁用某些Cookie可能影响服务功能。'
        ]
      },
      {
        id: 'thirdparty',
        title: '第三方服务',
        icon: <Mail className="h-6 w-6" />,
        content: [
          '我们的服务集成了以下第三方服务，它们有各自的隐私政策：',
          '',
          '**OpenAI / Claude AI**：',
          '• 用于生成智能答案建议',
          '• 隐私政策：请查看相应AI服务提供商的政策',
          '',
          '**Google reCAPTCHA**：',
          '• 用于防止垃圾注册和滥用',
          '• 隐私政策：https://policies.google.com/privacy',
          '',
          '**支付处理商**：',
          '• PayPal、Stripe等支付服务',
          '• 请查看相应支付服务的隐私政策',
          '',
          '**云服务提供商**：',
          '• Vercel、Railway等托管服务',
          '• 用于网站托管和数据存储',
          '',
          '我们鼓励您查看这些第三方服务的隐私政策，了解它们如何处理您的信息。'
        ]
      },
      {
        id: 'international',
        title: '国际数据传输',
        icon: <Database className="h-6 w-6" />,
        content: [
          '由于我们使用全球云服务，您的数据可能会传输到您所在司法管辖区以外的国家/地区进行处理和存储。',
          '',
          '**传输保障**：',
          '• 我们确保数据传输符合适用的数据保护法律',
          '• 使用标准合同条款和其他适当保障措施',
          '• 仅向提供充分数据保护的国家/地区传输数据',
          '',
          '**主要数据存储位置**：',
          '• 美国（云服务提供商数据中心）',
          '• 欧盟（符合GDPR要求的数据中心）',
          '',
          '如果您对数据传输有疑问，请联系我们了解更多详情。'
        ]
      },
      {
        id: 'minors',
        title: '未成年人隐私',
        icon: <Users className="h-6 w-6" />,
        content: [
          '我们的服务主要面向13岁及以上的用户。',
          '',
          '**年龄限制**：',
          '• 13岁以下儿童不得使用我们的服务',
          '• 我们不会故意收集13岁以下儿童的个人信息',
          '',
          '**家长监护**：',
          '• 13-18岁用户应在家长或监护人同意下使用服务',
          '• 家长可以联系我们查看、更正或删除未成年子女的信息',
          '',
          '**发现违规**：',
          '• 如果我们发现收集了13岁以下儿童的信息，将立即删除',
          '• 如果您是家长并发现此类情况，请立即联系我们',
          '',
          '我们建议家长监督未成年子女的在线活动，确保他们安全使用互联网服务。'
        ]
      },
      {
        id: 'updates',
        title: '隐私政策更新',
        icon: <FileText className="h-6 w-6" />,
        content: [
          '我们可能会不时更新本隐私政策，以反映我们实践的变化或法律要求的变化。',
          '',
          '**通知方式**：',
          '• 重大变更：通过邮件或网站通知提前30天通知',
          '• 一般更新：在网站上发布更新版本',
          '• 继续使用服务表示接受更新后的政策',
          '',
          '**生效日期**：',
          '• 更新后的隐私政策将在发布日期生效',
          '• 我们建议您定期查看本页面了解最新政策',
          '',
          '**历史版本**：',
          '• 我们保留以前版本的隐私政策供参考',
          '• 如需查看历史版本，请联系我们'
        ]
      },
      {
        id: 'contact',
        title: '联系我们',
        icon: <Mail className="h-6 w-6" />,
        content: [
          '如果您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：',
          '',
          '**联系信息**：',
          `• 邮箱：${contactEmail}`,
          `• 网站：${websiteUrl}`,
          '• 在线支持：通过我们网站的联系表单',
          '',
          '**响应时间**：',
          '• 一般询问：3-5个工作日内回复',
          '• 隐私权利请求：30天内处理',
          '• 紧急安全问题：24小时内响应',
          '',
          '**数据保护官**：',
          '• 如适用，您也可以联系我们的数据保护官',
          `• DPO邮箱：henryni711@gmail.com`,
          '',
          '我们致力于及时、专业地处理您的隐私相关问题。'
        ]
      }
    ],
    en: [
      {
        id: 'overview',
        title: 'Privacy Policy Overview',
        icon: <Shield className="h-6 w-6" />,
        content: [
          `Welcome to ${appName}! We understand the importance of your privacy, and this Privacy Policy explains how we collect, use, store, and protect your personal information.`,
          `${appName} is a Chrome browser extension designed to provide AI-powered answering assistance for Kahoot games. To provide these services, we need to collect and process certain information.`,
          `By using our services, you agree to the terms of this Privacy Policy. If you do not agree with this policy, please do not use our services.`
        ]
      },
      {
        id: 'collection',
        title: 'Information We Collect',
        icon: <Database className="h-6 w-6" />,
        content: [
          '**Account Information**:',
          '• Username, email address, and encrypted password',
          '• Registration time and last login time',
          '• Subscription plan type (Free, Premium, Pro)',
          '',
          '**Usage Data**:',
          '• Number and frequency of AI answer requests',
          '• Question content and your answer choices (only used to provide answer suggestions)',
          '• Extension usage statistics',
          '• Error logs and performance data',
          '',
          '**Technical Information**:',
          '• Browser type and version information',
          '• Device operating system information',
          '• IP address (used only for security and anti-abuse purposes)',
          '• Extension version number',
          '',
          '**Payment Information**:',
          '• Payment transaction information processed through third-party payment processors',
          '• We do not directly store your credit card or bank account information'
        ]
      },
      {
        id: 'usage',
        title: 'How We Use Information',
        icon: <Eye className="h-6 w-6" />,
        content: [
          'We use the information we collect for the following purposes:',
          '',
          '**Core Service Provision**:',
          '• Authenticate users and manage accounts',
          '• Provide AI answer suggestions for Kahoot questions',
          '• Monitor and limit usage quotas',
          '• Process subscriptions and paid services',
          '',
          '**Service Improvement**:',
          '• Analyze usage patterns to improve AI algorithm accuracy',
          '• Optimize extension performance and user experience',
          '• Develop new features and services',
          '',
          '**Security and Compliance**:',
          '• Detect and prevent abuse or fraudulent behavior',
          '• Ensure service security and stability',
          '• Comply with legal and regulatory requirements',
          '',
          '**User Support**:',
          '• Respond to user inquiries and technical support requests',
          '• Send important service notifications'
        ]
      },
      {
        id: 'sharing',
        title: 'Information Sharing',
        icon: <Users className="h-6 w-6" />,
        content: [
          'We commit to not selling, renting, or otherwise commercializing your personal information. We only share your information in the following circumstances:',
          '',
          '**Service Providers**:',
          '• AI service providers (for generating answer suggestions)',
          '• Cloud service providers (for data storage and processing)',
          '• Payment processors (for handling subscription payments)',
          '• Analytics service providers (for improving service quality)',
          '',
          '**Legal Requirements**:',
          '• Comply with applicable laws, regulations, or court orders',
          '• Protect our rights, property, or safety',
          '• Prevent or investigate possible illegal activities',
          '',
          '**Business Transfers**:',
          '• In case of merger, acquisition, or asset sale, your information may be transferred to the successor entity'
        ]
      },
      {
        id: 'storage',
        title: 'Data Storage & Security',
        icon: <Lock className="h-6 w-6" />,
        content: [
          '**Data Storage**:',
          '• Your data is primarily stored on secure cloud servers',
          '• We use industry-standard encryption technologies to protect data transmission and storage',
          '• Sensitive information (such as passwords) is encrypted',
          '',
          '**Security Measures**:',
          '• Implement access controls and authentication',
          '• Regularly conduct security audits and vulnerability scans',
          '• Staff receive data protection training',
          '• Establish incident response and data breach notification procedures',
          '',
          '**Data Retention**:',
          '• Account information: Retained during account validity period',
          '• Usage data: Retained for 12 months for service improvement',
          '• Log data: Retained for 90 days for troubleshooting',
          '• You may request deletion of your account and related data at any time'
        ]
      },
      {
        id: 'rights',
        title: 'Your Rights',
        icon: <FileText className="h-6 w-6" />,
        content: [
          'Under applicable data protection laws, you have the following rights:',
          '',
          '**Right of Access**:',
          '• Request to view personal information we have collected about you',
          '• Obtain information about data processing purposes and legal basis',
          '',
          '**Right of Rectification**:',
          '• Correct inaccurate or incomplete personal information',
          '• Update your information through account settings page',
          '',
          '**Right of Erasure**:',
          '• Request deletion of your personal information',
          '• In some cases we may need to retain certain information to comply with legal obligations',
          '',
          '**Right to Restrict Processing**:',
          '• Restrict our processing of your information under specific circumstances',
          '',
          '**Right to Data Portability**:',
          '• Obtain your data in a structured, commonly used, and machine-readable format',
          '',
          '**Right to Object**:',
          '• Object to data processing based on legitimate interests',
          '• Withdraw from marketing communications at any time',
          '',
          'To exercise these rights, please contact us through:',
          `• Email: ${contactEmail}`,
          '• Online contact form: Through our website'
        ]
      },
      {
        id: 'cookies',
        title: 'Cookies and Tracking Technologies',
        icon: <AlertTriangle className="h-6 w-6" />,
        content: [
          'We use the following technologies to enhance your experience:',
          '',
          '**Essential Cookies**:',
          '• Maintain user login status',
          '• Remember user preference settings',
          '• Ensure website security',
          '',
          '**Analytics Cookies**:',
          '• Google Analytics (optional)',
          '• Collect anonymous usage statistics',
          '• Help us improve service quality',
          '',
          '**Local Storage**:',
          '• Browser local storage for caching user settings',
          '• Improve extension response speed',
          '',
          'You can manage cookie preferences through your browser settings, but please note that disabling certain cookies may affect service functionality.'
        ]
      },
      {
        id: 'thirdparty',
        title: 'Third-Party Services',
        icon: <Mail className="h-6 w-6" />,
        content: [
          'Our service integrates the following third-party services, each with their own privacy policies:',
          '',
          '**OpenAI / Claude AI**:',
          '• Used for generating intelligent answer suggestions',
          '• Privacy Policy: Please refer to the respective AI service provider\'s policies',
          '',
          '**Google reCAPTCHA**:',
          '• Used to prevent spam registration and abuse',
          '• Privacy Policy: https://policies.google.com/privacy',
          '',
          '**Payment Processors**:',
          '• PayPal, Stripe, and other payment services',
          '• Please refer to the respective payment service privacy policies',
          '',
          '**Cloud Service Providers**:',
          '• Vercel, Railway, and other hosting services',
          '• Used for website hosting and data storage',
          '',
          'We encourage you to review the privacy policies of these third-party services to understand how they handle your information.'
        ]
      },
      {
        id: 'international',
        title: 'International Data Transfers',
        icon: <Database className="h-6 w-6" />,
        content: [
          'As we use global cloud services, your data may be transferred to countries/regions outside your jurisdiction for processing and storage.',
          '',
          '**Transfer Safeguards**:',
          '• We ensure data transfers comply with applicable data protection laws',
          '• Use standard contractual clauses and other appropriate safeguards',
          '• Only transfer data to countries/regions providing adequate data protection',
          '',
          '**Primary Data Storage Locations**:',
          '• United States (cloud service provider data centers)',
          '• European Union (GDPR-compliant data centers)',
          '',
          'If you have questions about data transfers, please contact us for more details.'
        ]
      },
      {
        id: 'minors',
        title: 'Minors\' Privacy',
        icon: <Users className="h-6 w-6" />,
        content: [
          'Our service is primarily intended for users aged 13 and above.',
          '',
          '**Age Restrictions**:',
          '• Children under 13 are not permitted to use our services',
          '• We do not knowingly collect personal information from children under 13',
          '',
          '**Parental Supervision**:',
          '• Users aged 13-18 should use the service with parental or guardian consent',
          '• Parents may contact us to view, correct, or delete their minor child\'s information',
          '',
          '**Violation Discovery**:',
          '• If we discover we have collected information from children under 13, we will delete it immediately',
          '• If you are a parent and discover such a situation, please contact us immediately',
          '',
          'We recommend that parents supervise their minor children\'s online activities to ensure safe use of internet services.'
        ]
      },
      {
        id: 'updates',
        title: 'Privacy Policy Updates',
        icon: <FileText className="h-6 w-6" />,
        content: [
          'We may update this Privacy Policy from time to time to reflect changes in our practices or changes in legal requirements.',
          '',
          '**Notification Methods**:',
          '• Material changes: 30-day advance notice via email or website notification',
          '• General updates: Publishing updated version on website',
          '• Continued use of the service indicates acceptance of the updated policy',
          '',
          '**Effective Date**:',
          '• Updated Privacy Policy will be effective on the publication date',
          '• We recommend that you regularly review this page for the latest policy',
          '',
          '**Historical Versions**:',
          '• We retain previous versions of the Privacy Policy for reference',
          '• To view historical versions, please contact us'
        ]
      },
      {
        id: 'contact',
        title: 'Contact Us',
        icon: <Mail className="h-6 w-6" />,
        content: [
          'If you have any questions, comments, or complaints about this Privacy Policy, please contact us through:',
          '',
          '**Contact Information**:',
          `• Email: ${contactEmail}`,
          `• Website: ${websiteUrl}`,
          '• Online Support: Through our website contact form',
          '',
          '**Response Time**:',
          '• General inquiries: Reply within 3-5 business days',
          '• Privacy rights requests: Processed within 30 days',
          '• Emergency security issues: Response within 24 hours',
          '',
          '**Data Protection Officer**:',
          '• If applicable, you may also contact our Data Protection Officer',
          `• DPO Email: henryni711@gmail.com`,
          '',
          'We are committed to handling your privacy-related issues in a timely and professional manner.'
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
                  {language === 'zh' ? '隐私权政策' : 'Privacy Policy'}
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
                <Shield className="h-8 w-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {appName} {language === 'zh' ? '隐私权政策' : 'Privacy Policy'}
                </h2>
                <p className="text-purple-200">
                  {language === 'zh' 
                    ? '保护您的隐私是我们的首要任务' 
                    : 'Protecting your privacy is our top priority'
                  }
                </p>
              </div>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/20">
              <p className="text-white/90 leading-relaxed">
                {language === 'zh' 
                  ? `本隐私政策适用于 ${appName} Chrome扩展程序和相关在线服务。我们致力于透明地说明我们如何收集、使用和保护您的个人信息。请仔细阅读本政策，了解您的权利和我们的义务。`
                  : `This Privacy Policy applies to the ${appName} Chrome extension and related online services. We are committed to transparently explaining how we collect, use, and protect your personal information. Please read this policy carefully to understand your rights and our obligations.`
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
                  ? '如果您对本隐私政策有任何疑问，请随时联系我们。'
                  : 'If you have any questions about this Privacy Policy, please feel free to contact us.'
                }
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
                <a 
                  href={`mailto:${contactEmail}`}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>{language === 'zh' ? '联系我们' : 'Contact Us'}</span>
                </a>
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
