import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Mail, ExternalLink } from 'lucide-react'
import CircularGallery from './CircularGallery.jsx'
import './index.css'

type Lang = 'en' | 'zh'

// ─── Animation helpers ────────────────────────────────────────────────────────

const easeSmooth = [0.25, 0.1, 0.25, 1] as const

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = '', style }: {
  children: React.ReactNode; delay?: number; duration?: number
  x?: number; y?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: easeSmooth }}>
      {children}
    </motion.div>
  )
}

// ─── Magnet ───────────────────────────────────────────────────────────────────

function Magnet({ children, padding = 100, strength = 4, className = '' }: {
  children: React.ReactNode; padding?: number; strength?: number; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
    const dx = e.clientX - cx, dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const threshold = Math.max(rect.width, rect.height) / 2 + padding
    if (dist < threshold) {
      ref.current.style.transform = `translate3d(${dx / strength}px,${dy / strength}px,0)`
      ref.current.style.transition = 'transform 0.3s ease-out'
    } else {
      ref.current.style.transform = 'translate3d(0,0,0)'
      ref.current.style.transition = 'transform 0.6s ease-in-out'
    }
  }, [padding, strength])
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])
  return <div ref={ref} className={className} style={{ willChange: 'transform' }}>{children}</div>
}

// ─── Scroll char reveal ───────────────────────────────────────────────────────

function AnimatedText({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.2'] })
  const chars = text.split('')
  return (
    <p ref={ref} className={className} aria-label={text} style={{ position: 'relative', color: 'var(--text)', ...style }}>
      {chars.map((ch, i) => {
        const s = i / chars.length, e = Math.min(s + 0.06, 1)
        return <AnimChar key={i} ch={ch} progress={scrollYProgress} start={s} end={e} />
      })}
    </p>
  )
}
function AnimChar({ ch, progress, start, end }: {
  ch: string; progress: ReturnType<typeof useScroll>['scrollYProgress']; start: number; end: number
}) {
  const opacity = useTransform(progress, [start, end], [0.18, 1])
  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span style={{ opacity: 0, userSelect: 'none' }}>{ch}</span>
      <motion.span style={{ opacity, position: 'absolute', left: 0, top: 0 }}>{ch}</motion.span>
    </span>
  )
}

// ─── LangToggle ───────────────────────────────────────────────────────────────

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center rounded-full p-0.5"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
      {(['en', 'zh'] as Lang[]).map(l => (
        <button key={l} onClick={() => setLang(l)} className="rounded-full transition-all duration-200"
          style={{ padding: '5px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            background: lang === l ? 'var(--text)' : 'transparent',
            color: lang === l ? '#0C0C0C' : 'var(--text-muted)' }}>
          {l === 'en' ? 'EN' : '中'}
        </button>
      ))}
    </div>
  )
}

// ─── Contact Button ───────────────────────────────────────────────────────────

function ContactBtn({ label }: { label: string }) {
  return (
    <a href="#contact"
      className="inline-flex items-center gap-2.5 rounded-full uppercase tracking-widest text-white font-medium transition-opacity hover:opacity-80"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid rgba(255,255,255,0.4)', outlineOffset: '-3px',
        padding: '12px 28px', fontSize: 13,
      }}>
      {label}
    </a>
  )
}

// ─── Content ─────────────────────────────────────────────────────────────────

const C = {
  en: {
    nav: { name: 'Haizhi Yang', role: 'M.Sc. · Class of 2026 · Tongji', links: ['About','Education','Experience','Ventures'] as const, cta: 'Contact Me' },
    hero: {
      navLinks: ['About', 'Education', 'Experience', 'Ventures'],
      heading1: 'Hi,',
      heading2: "I'm Hazel.",
      portrait: 'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.webp',
      desc: "a master's graduate driven by building bold ideas and delivering end-to-end",
      cta: 'Contact Me',
    },
    about: {
      heading: 'About me',
      body: "Engineering undergrad, management master's — plus two ventures and internships across enterprise software, consumer tech, and finance. I'm the kind of person who picks up gaps before being asked, pushes for process where there's chaos, and sees things through to delivery. I work comfortably across cultures and functions, with a year of fully English-speaking operations spanning six countries. Data-driven by instinct, collaborative by habit, and stubborn about outcomes.",
      cta: 'Contact Me',
    },
    education: {
      label: 'EDUCATION',
      badge: 'Engineering × Management',
      badgeSub: 'A rare combination — technical depth meets strategic breadth.',
      schools: [
        { degree: 'M.Sc. Business Management', school: 'Tongji University', period: '2023 – 2026', type: 'Master' },
        { degree: 'B.Eng. Project Management', school: 'CSUST', period: '2017 – 2021', type: 'Bachelor' },
      ],
      highlights: [
        { category: 'Scholarships & Honours', icon: 'award', items: [
          { title: 'National Scholarship', desc: 'Top academic honour — awarded to <1% of graduate students. 2024.', img: '/education/award-national.webp' },
        ]},
        { category: 'International Academic Exchange', icon: 'globe', items: [
          { title: 'USA', desc: 'AIB conference — academic paper accepted, invited to present.', img: '/education/usa-conference.webp' },
          { title: 'USA 2', desc: 'AIB conference — academic paper accepted, invited to present.', img: '/education/usa-conference-2.webp' },
          { title: 'South Korea', desc: 'International symposium — cross-cultural academic collaboration.', img: '/education/Korea-conference.webp' },
          { title: 'South Korea 2', desc: 'International symposium — cross-cultural academic collaboration.', img: '/education/Korea-conference-2.webp' },
          { title: 'Malaysia', desc: 'Regional academic exchange and joint-program activities.', img: '/education/Malaysia-conference.webp' },
        ]},
        { category: 'Teaching Assistantships', icon: 'book', items: [
          { title: 'Teaching Assistant', desc: 'Undergraduate, international student and MBA courses.', img: '/education/TA.webp' },
        ]},
      ],
    },
    experience: {
      label: 'EXPERIENCE',
      items: [
        { company: 'SAP', role: 'Bid & Proposal Management Intern', period: 'June 2025 – Present', tag: 'Enterprise Software · APAC', color: '#0070F3',
          keywords: ['50+ APAC Bids', 'Greater China', 'AI Platform'],
          bullets: [
            'Managed 50+ SAP cloud solution bids across SEA (6 countries), Australia, and NZ — fully English-speaking multinational environment.',
            "Built Greater China proposal coverage from the ground up as the team's sole China-based member.",
            'Developed a full-stack proposal automation platform on SAP BTP (SAP CAP + Node.js + SAP AI Core / Azure OpenAI) — now the operational foundation for the APAC-to-Global Bid Manager team.',
          ],
          project: { title: 'Proposal Automation Platform', desc: 'AI-powered full-stack app that generates customized proposal documents from RFP inputs. Handles Word/PPT generation, brand compliance, and 9-palette color switching.', tech: ['SAP BTP','SAP CAP','Node.js','Azure OpenAI','Cloud Foundry'], imgs: ['/experience/sap-project-1.webp','/experience/sap-project-2.webp','/experience/sap-project-3.webp'] },
        },
        { company: 'Xiaomi', role: 'Commercial Sales Operations Intern', period: 'Sep 2024 – Apr 2025', tag: 'Consumer Tech · E-Commerce', color: '#FF6900',
          keywords: ['+52% Revenue', '¥200K Daily Spend', 'VIPPush'],
          bullets: [
            'Executed ad strategies for 11.11, 12.12, and CNY campaigns — drove 52% revenue growth for brand clients.',
            'Monitored delivery data in real time, coordinated across Product, Design, Media, and Legal teams.',
            'Negotiated and launched VIPPush commercial project — achieved ¥200K daily ad spend.',
          ], project: null,
        },
        { company: 'BOCI China', role: 'Strategy & Planning Intern', period: 'Jul – Sep 2024', tag: 'Investment Banking · Strategy', color: '#4A90D9',
          keywords: ['50+ Market Reports', '98% Efficiency', 'Data Automation'],
          bullets: [
            'Produced 50+ daily market reports and 10+ weekly summaries tracking macro, equity/bond markets, and policy.',
            'Built data automation tools connecting Tonghuashun, Excel, and Word — increased team output efficiency by 98%.',
            'Conducted competitor analysis to support strategic planning decisions.',
          ], project: null,
        },
      ],
    },
    ventures: {
      label: 'VENTURES',
      heading1: 'Two businesses.', heading2: 'Both profitable.',
      items: [
        { name: 'Yiben Education', role: 'Founder', period: '2018 – 2020', tag: 'EdTech · Social Enterprise',
          desc: "Built a K-12 tutoring institution from scratch — combining educational access with student employment. 100+ students, 5 cohorts, 1:35 ROI. Deliberately shut down to pursue graduate studies.",
          stats: [{ val: '100+', label: 'Students' },{ val: '60%', label: 'Renewal Rate' },{ val: '1:35', label: 'ROI' }],
          galleryItems: [
            { image: '/ventures/edu-poster-1.webp', text: 'Launch Poster' },
            { image: '/ventures/edu-poster-2.webp', text: 'Poster 2' },
            { image: '/ventures/edu-classroom-1.webp', text: 'Classroom' },
            { image: '/ventures/edu-classroom-2.webp', text: 'Classroom 2' },
            { image: '/ventures/edu-classroom-3.webp', text: 'Classroom 3' },
            { image: '/ventures/edu-classroom-4.webp', text: 'Classroom 4' },
            { image: '/ventures/edu-students-1.webp', text: 'Students' },
            { image: '/ventures/edu-students-2.webp', text: 'Students 2' },
          ],
        },
        { name: 'Plushie Apparel Shop', role: 'Founder', period: 'Feb – Sep 2022', tag: 'E-Commerce · Product Design',
          desc: "Spotted an underserved niche in the Weibo/Weidian plushie community. Designed, pattern-cut, and manufactured clothing from scratch. Used a new-listing exploit to drive traffic. 60% gross margin in 3 months.",
          stats: [{ val: '10+', label: 'Products' },{ val: '300', label: 'Top Unit Sales' },{ val: '60%', label: 'Gross Margin' }],
          galleryItems: [
            { image: '/ventures/doll-design-1.webp', text: 'Product Design' },
            { image: '/ventures/doll-design-2.webp', text: 'Design 2' },
            { image: '/ventures/doll-design-3.webp', text: 'Design 3' },
            { image: '/ventures/doll-design-4.webp', text: 'Design 4' },
            { image: '/ventures/doll-design-5.webp', text: 'Design 5' },
            { image: '/ventures/doll-design-6.webp', text: 'Design 6' },
            { image: '/ventures/doll-design-7.webp', text: 'Design 7' },
            { image: '/ventures/doll-design-8.webp', text: 'Design 8' },
            { image: '/ventures/doll-customer-1.webp', text: 'Customer Photos' },
            { image: '/ventures/doll-customer-2.webp', text: 'Customer Photos 2' },
          ],
        },
      ],
    },
    contact: { label: "LET'S WORK TOGETHER", heading: "Let's build something.", desc: 'Open to full-time roles in enterprise software, business development, and product management.', emailLabel: 'EMAIL', linkedinLabel: 'LINKEDIN' },
    footer: 'Built with React · SAP BTP',
  },
  zh: {
    nav: { name: '杨海芝', role: '学硕 · 2026届 · 同济大学', links: ['关于我','教育背景','实习经历','创业项目'] as const, cta: '联系我' },
    hero: {
      navLinks: ['关于', '教育', '经历', '创业'],
      heading1: '你好，',
      heading2: '我是杨海芝。',
      portrait: 'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.webp',
      desc: '',
      cta: '联系我',
    },
    about: {
      heading: '关于我',
      body: '工科本科加管理学硕，两段创业，跨了企业软件、消费科技和金融好几个行业的实习。我习惯在没人管的地方主动补位，在乱的地方推动标准化，然后把事情做完。跨部门、跨文化的协调对我来说是日常，一年全英文在东南亚多国办公也让我在沟通上多了点底气。数据驱动，逻辑清晰，执行上比较较真。',
      cta: '联系我',
    },
    education: {
      label: '教育背景',
      badge: '工科 × 管理',
      badgeSub: '少见的复合背景，连接技术深度与战略视野。',
      schools: [
        { degree: '企业管理（管理学学位）', school: '同济大学', period: '2023 – 2026', type: '硕士' },
        { degree: '工程管理（工学学位）', school: '长沙理工大学', period: '2017 – 2021', type: '本科' },
      ],
      highlights: [
        { category: '奖学金与荣誉', icon: 'award', items: [
          { title: '国家奖学金', desc: '中国最高学业荣誉，授予不足1%的研究生。2024年。', img: '/education/award-national.webp' },
        ]},
        { category: '国际学术交流', icon: 'globe', items: [
          { title: '美国', desc: 'AIB 国际商务学会——论文接收，受邀汇报。', img: '/education/usa-conference.webp' },
          { title: '美国2', desc: 'AIB 国际商务学会——论文接收，受邀汇报。', img: '/education/usa-conference-2.webp' },
          { title: '韩国', desc: '国际研讨会——跨文化学术合作。', img: '/education/Korea-conference.webp' },
          { title: '韩国2', desc: '国际研讨会——跨文化学术合作。', img: '/education/Korea-conference-2.webp' },
          { title: '马来西亚', desc: '区域学术交流及联合项目活动。', img: '/education/Malaysia-conference.webp' },
        ]},
        { category: '助教经历', icon: 'book', items: [
          { title: '助教', desc: '本科生、留学生及MBA课程助教。', img: '/education/TA.webp' },
        ]},
      ],
    },
    experience: {
      label: '实习经历',
      items: [
        { company: '思爱普 SAP', role: '投标项目经理实习生', period: '2025.06 – 至今', tag: '企业软件 · 亚太区', color: '#0070F3',
          keywords: ['50+亚太投标', '大中华区拓展', 'AI平台开发'],
          bullets: [
            '全英文工作环境，负责东南亚六国及澳新地区 50+ SAP 云解决方案投标项目的端到端交付。',
            '作为团队唯一驻中国成员，从零开拓大中华区投标业务，搭建与销售、售前及合作伙伴的协作机制。',
            '独立开发投标提案自动化平台（SAP BTP + SAP CAP + Node.js + SAP AI Core），现为亚太至全球 Bid Manager 团队核心工作基础。',
          ],
          project: { title: '投标提案自动化平台', desc: '基于 AI 的全栈应用，根据 RFP 输入自动生成定制化提案文档，支持 Word/PPT 生成、品牌合规及9套配色切换。', tech: ['SAP BTP','SAP CAP','Node.js','Azure OpenAI','Cloud Foundry'], imgs: ['/experience/sap-project-1.webp','/experience/sap-project-2.webp','/experience/sap-project-3.webp'] },
        },
        { company: '小米科技', role: '商业化销售运营实习生', period: '2024.09 – 2025.04', tag: '消费科技 · 电商', color: '#FF6900',
          keywords: ['营收增长52%', '日消耗20万', 'VIPPush'],
          bullets: [
            '策划双11、双12及年货节大促策略，全程负责广告上线，达成品牌客户收入增长52%。',
            '实时监测广告投放数据，与产品、设计、媒介及法务团队跨职能协作优化投放效果。',
            '推进VIPPush专项，开展竞品调研及多轮价格谈判，上线后日消耗达20万元。',
          ], project: null,
        },
        { company: '中银证券', role: '战略规划部实习生', period: '2024.07 – 2024.09', tag: '投资银行 · 战略', color: '#4A90D9',
          keywords: ['50+市场报告', '效率提升98%', '数据自动化'],
          bullets: [
            '全面跟踪宏观经济、市场动态及政策变化，累计撰写50+篇日报及10+份周报。',
            '独立设计跨平台数据互通工具，打通同花顺、Excel及Word数据流，团队输出效率提升98%。',
            '开展竞争对手分析与行业政策研究，输出多份研究报告，纳入部门决策参考。',
          ], project: null,
        },
      ],
    },
    ventures: {
      label: '创业经历',
      heading1: '两段创业。', heading2: '都实现了盈利。',
      items: [
        { name: '一本教育', role: '创始人', period: '2018 – 2020', tag: '教育 · 社会企业',
          desc: '在家乡独立创办 K-12 课外辅导机构，将教育普惠与大学生实践结合。5期累计服务100+名学生，投入产出比1:35。为继续深造，主动选择关闭。',
          stats: [{ val: '100+', label: '服务学生' },{ val: '60%', label: '续费率' },{ val: '1:35', label: '投入产出比' }],
          galleryItems: [
            { image: '/ventures/edu-poster-1.webp', text: '招生海报' },
            { image: '/ventures/edu-poster-2.webp', text: '招生海报2' },
            { image: '/ventures/edu-classroom-1.webp', text: '课堂照片' },
            { image: '/ventures/edu-classroom-2.webp', text: '课堂照片2' },
            { image: '/ventures/edu-classroom-3.webp', text: '课堂照片3' },
            { image: '/ventures/edu-classroom-4.webp', text: '课堂照片4' },
            { image: '/ventures/edu-students-1.webp', text: '学生' },
            { image: '/ventures/edu-students-2.webp', text: '学生2' },
          ],
        },
        { name: '棉花娃娃服饰店', role: '店主', period: '2022.02 – 2022.09', tag: '电商 · 产品设计',
          desc: '在微博超话和微店社区发现细分市场机会。独立完成产品调研、设计、打版和制作，利用微店上新区规则持续引流。3个月毛利率60%。',
          stats: [{ val: '10+', label: '上线商品' },{ val: '300', label: '单品最高销量' },{ val: '60%', label: '毛利率' }],
          galleryItems: [
            { image: '/ventures/doll-design-1.webp', text: '产品设计' },
            { image: '/ventures/doll-design-2.webp', text: '产品设计2' },
            { image: '/ventures/doll-design-3.webp', text: '产品设计3' },
            { image: '/ventures/doll-design-4.webp', text: '产品设计4' },
            { image: '/ventures/doll-design-5.webp', text: '产品设计5' },
            { image: '/ventures/doll-design-6.webp', text: '产品设计6' },
            { image: '/ventures/doll-design-7.webp', text: '产品设计7' },
            { image: '/ventures/doll-design-8.webp', text: '产品设计8' },
            { image: '/ventures/doll-customer-1.webp', text: '买家秀' },
            { image: '/ventures/doll-customer-2.webp', text: '买家秀2' },
          ],
        },
      ],
    },
    contact: { label: '期待合作', heading: '期待与你共创。', desc: '正在寻找企业软件、商业拓展或产品管理方向的全职机会，欢迎交流。', emailLabel: '邮箱', linkedinLabel: 'LinkedIn' },
    footer: '基于 React · SAP BTP 构建',
  },
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ lang, setLang, t }: { lang: Lang; setLang: (l: Lang) => void; t: { name: string; role: string; links: readonly string[]; cta: string } }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  const anchors = ['about','education','experience','ventures','contact']
  return (
    <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeSmooth }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500"
      style={{ background: scrolled ? 'rgba(12,12,12,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none' }}>
      {/* Center: nav links */}
      <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {t.links.map((link, i) => (
          <a key={link} href={`#${anchors[i]}`}
            className="text-sm md:text-base font-medium uppercase tracking-wider transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--text)' }}>
            {link}
          </a>
        ))}
      </div>
      {/* Right: lang toggle + contact button → #contact */}
      <div className="flex items-center gap-3 ml-auto">
        <LangToggle lang={lang} setLang={setLang} />
        <a href="#contact"
          className="inline-flex items-center gap-2.5 rounded-full uppercase tracking-widest text-white font-medium transition-opacity hover:opacity-80"
          style={{
            background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
            boxShadow: '0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1',
            outline: '2px solid rgba(255,255,255,0.4)', outlineOffset: '-3px',
            padding: '10px 24px', fontSize: 12,
          }}>
          {t.cta}
        </a>
      </div>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ t }: { t: typeof C['en']['hero'] }) {
  return (
    <section className="h-screen flex flex-col relative" style={{ overflow: 'clip', background: '#0C0C0C' }}>
      {/* Giant heading — two lines */}
      <div className="px-6 md:px-10 mt-32 sm:mt-36 md:mt-40">
        <div style={{ overflow: 'hidden', paddingTop: '0.12em', marginTop: '-0.12em' }}>
          <FadeIn y={40} delay={0.1}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[11vw] sm:text-[12vw] md:text-[13vw] lg:text-[14vw]">
              {t.heading1}
            </h1>
          </FadeIn>
        </div>
        <div style={{ overflow: 'hidden', paddingTop: '0.12em', marginTop: '-0.12em' }}>
          <FadeIn y={40} delay={0.25}>
            <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[11vw] sm:text-[12vw] md:text-[13vw] lg:text-[14vw]">
              {t.heading2}
            </h1>
          </FadeIn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-auto flex justify-start items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
        <FadeIn y={20} delay={0.35}>
          <p className="font-light uppercase tracking-wide leading-snug max-w-[200px] sm:max-w-[280px] md:max-w-[340px]"
            style={{ color: 'var(--text)', fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            {t.desc}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About({ t }: { t: typeof C['en']['about'] }) {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20"
      style={{ background: '#0C0C0C' }}>
      {/* Corner decorations */}
      <FadeIn x={-80} y={0} delay={0.1} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn x={-80} y={0} delay={0.25} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="" className="w-[100px] sm:w-[140px] md:w-[180px]" />
      </FadeIn>
      <FadeIn x={80} y={0} delay={0.15} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn x={80} y={0} delay={0.3} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="" className="w-[130px] sm:w-[170px] md:w-[220px]" />
      </FadeIn>

      {/* Content */}
      <div className="flex flex-col items-center text-center gap-6 sm:gap-8 md:gap-10 relative z-10">
        <div style={{ overflow: 'hidden', paddingTop: '0.1em', marginTop: '-0.1em' }}>
          <FadeIn y={40} delay={0}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(2rem, 8vw, 100px)' }}>
              {t.heading}
            </h2>
          </FadeIn>
        </div>
        <AnimatedText text={t.body}
          className="font-medium leading-relaxed max-w-[480px]"
          style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', color: 'var(--text)' } as React.CSSProperties} />
      </div>

      <div className="mt-10 sm:mt-12 md:mt-14 relative z-10">
        <Magnet><ContactBtn label={t.cta} /></Magnet>
      </div>
    </section>
  )
}

// ─── Education ────────────────────────────────────────────────────────────────

function Education({ t }: { t: typeof C['en']['education'] }) {
  return (
    <section id="education" className="rounded-t-[40px] md:rounded-t-[60px] py-24 md:py-32 px-6 md:px-10" style={{ background: 'var(--surface)' }}>
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={0}>
          <p className="uppercase mb-4" style={{ fontSize: 11, letterSpacing: '0.25em', color: 'var(--text-muted)' }}>{t.label}</p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h2 className="hero-heading mb-12 md:mb-16" style={{ fontSize: 'clamp(3rem, 10vw, 140px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            {t.badge}
          </h2>
        </FadeIn>

        {/* Degree row */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            {t.schools.map((s, i) => (
              <div key={i} className="flex-1 rounded-2xl p-6" style={{ background: i === 0 ? 'var(--copper)' : 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold mb-3"
                  style={{ background: i === 0 ? 'rgba(0,0,0,0.2)' : 'var(--surface)', color: 'var(--text)' }}>{s.type}</span>
                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{s.school}</p>
                <p style={{ fontSize: 13, color: 'rgba(215,226,234,0.55)', marginTop: 4 }}>{s.degree} · {s.period}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Gallery — all highlights */}
        <div style={{ height: 460, position: 'relative', borderRadius: 20, overflow: 'hidden', background: 'var(--surface-2)' }}>
          <CircularGallery
            items={t.highlights.flatMap(cat => cat.items.map(item => ({ image: item.img, text: item.title })))}
            bend={2} textColor="var(--copper)" borderRadius={0.08} scrollSpeed={2} scrollEase={0.04}
          />
        </div>
      </div>
    </section>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExpCardContent({ exp, index }: { exp: typeof C['en']['experience']['items'][0]; index: number }) {
  const [imgIdx, setImgIdx] = useState(0)

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(20px,2.5vw,36px)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-end gap-4">
          <span className="hero-heading font-black" style={{ fontSize: 'clamp(2.5rem, 6vw, 80px)', lineHeight: 0.85 }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="pb-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ background: exp.color }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{exp.tag}</span>
            </div>
            <p style={{ fontSize: 'clamp(14px,1.6vw,20px)', fontWeight: 700, color: 'var(--text)' }}>{exp.company}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{exp.role} · {exp.period}</p>
          </div>
        </div>
        <div className="hidden md:flex flex-wrap gap-2 pt-1">
          {exp.keywords.map(kw => (
            <span key={kw} className="rounded-full" style={{ background: 'rgba(215,226,234,0.06)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11, padding: '4px 10px' }}>{kw}</span>
          ))}
        </div>
      </div>

      {/* Bullets */}
      <ul className="space-y-3 mb-6" style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
        {exp.bullets.map((b, j) => (
          <li key={j} className="flex gap-3" style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75 }}>
            <span style={{ color: 'var(--copper)', flexShrink: 0, marginTop: 7, fontSize: 8 }}>◆</span>{b}
          </li>
        ))}
      </ul>

      {/* Project */}
      {exp.project && (
        <div className="rounded-2xl p-5" style={{ background: '#0C0C0C', border: '1px solid var(--border)' }}>
          <p className="uppercase mb-1" style={{ fontSize: 10, letterSpacing: '0.15em', color: 'var(--copper)' }}>Project</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{exp.project.title}</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 10 }}>{exp.project.desc}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {exp.project.tech.map(tech => (
              <span key={tech} className="rounded-full" style={{ background: 'rgba(215,226,234,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 11, padding: '3px 10px' }}>{tech}</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {exp.project.imgs.map((src, i) => (
              <div key={i} onClick={() => setImgIdx(i)} className="rounded-xl overflow-hidden cursor-pointer"
                style={{ border: `2px solid ${imgIdx === i ? 'var(--copper)' : 'transparent'}`, aspectRatio: '16/10' }}>
                <img src={src} alt="" className="interactive w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img src={exp.project.imgs[imgIdx]} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  )
}

function Experience({ t }: { t: typeof C['en']['experience'] }) {
  return (
    <section id="experience" className="rounded-t-[40px] md:rounded-t-[60px] py-24 px-6 md:px-10" style={{ background: '#0C0C0C' }}>
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={0}>
          <p className="uppercase mb-6" style={{ fontSize: 11, letterSpacing: '0.25em', color: 'var(--text-muted)' }}>{t.label}</p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <h2 className="hero-heading mb-10" style={{ fontSize: 'clamp(3rem, 10vw, 140px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Experience.
          </h2>
        </FadeIn>
        <div className="flex flex-col gap-4">
          {t.items.map((exp, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <ExpCardContent exp={exp} index={i} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Ventures ─────────────────────────────────────────────────────────────────

function Ventures({ t }: { t: typeof C['en']['ventures'] }) {
  return (
    <section id="ventures" className="rounded-t-[40px] md:rounded-t-[60px] -mt-10 relative z-20 py-24 md:py-32 px-6 md:px-10" style={{ background: 'var(--surface)' }}>
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={0}>
          <p className="uppercase mb-4" style={{ fontSize: 11, letterSpacing: '0.25em', color: 'var(--text-muted)' }}>{t.label}</p>
        </FadeIn>
        <div className="mb-14" style={{ fontSize: 'clamp(3rem, 9vw, 120px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          <div style={{ overflow: 'hidden', paddingTop: '0.1em', marginTop: '-0.1em' }}><FadeIn y={28} delay={0.05}><span className="hero-heading block">{t.heading1}</span></FadeIn></div>
          <div style={{ overflow: 'hidden', paddingTop: '0.1em', marginTop: '-0.1em' }}><FadeIn y={28} delay={0.15}><span className="hero-heading block">{t.heading2}</span></FadeIn></div>
        </div>

        {t.items.map((v, vi) => (
          <FadeIn key={vi} delay={vi * 0.1} className="mb-20 last:mb-0">
            <div className="grid md:grid-cols-2 gap-10 items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 11, color: 'var(--copper)', letterSpacing: '0.12em' }}>{v.tag}</span>
                  <span style={{ color: 'var(--border)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.period}</span>
                </div>
                <h3 style={{ fontSize: 30, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{v.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>{v.role}</p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 18 }}>{v.desc}</p>
                <div className="flex gap-8">
                  {v.stats.map((s, si) => (
                    <div key={si}>
                      <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{s.val}</p>
                      <p style={{ fontSize: 10, color: 'var(--copper)', letterSpacing: '0.12em', marginTop: 2 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ height: 220, background: 'var(--surface-2)' }}>
                <img src={v.galleryItems[0]?.image} alt={v.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div style={{ height: 460, position: 'relative', borderRadius: 20, overflow: 'hidden', background: 'var(--surface-2)' }}>
              <CircularGallery items={v.galleryItems} bend={2} textColor="#C09060" borderRadius={0.08} scrollSpeed={2} scrollEase={0.04} />
            </div>
            {vi < t.items.length - 1 && <div className="mt-16" style={{ borderBottom: '1px solid var(--border)' }} />}
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact({ t }: { t: typeof C['en']['contact'] }) {
  return (
    <section id="contact" className="rounded-t-[40px] md:rounded-t-[60px] -mt-10 relative z-30 py-28 md:py-36 px-6 md:px-10 text-center" style={{ background: '#0C0C0C', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-2xl mx-auto">
        <FadeIn delay={0}>
          <p className="uppercase mb-6" style={{ fontSize: 11, letterSpacing: '0.25em', color: 'var(--text-muted)' }}>{t.label}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="hero-heading mb-6" style={{ fontSize: 'clamp(2.2rem, 7vw, 100px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            {t.heading}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mb-12 mx-auto" style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: 400 }}>{t.desc}</p>
        </FadeIn>
        <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="mailto:yanghardhz@163.com"
            className="flex items-center gap-3 rounded-2xl px-8 py-5 transition-all duration-200 group"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--copper)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <Mail size={16} style={{ color: 'var(--copper)' }} />
            <div className="text-left">
              <p style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 2 }}>{t.emailLabel}</p>
              <p style={{ fontSize: 14, fontWeight: 500 }}>yanghardhz@163.com</p>
            </div>
            <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <motion.a href="https://www.linkedin.com/in/hazel-yang-155605372" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-2xl px-8 py-5" style={{ background: 'var(--text)', color: '#0C0C0C', fontSize: 14, fontWeight: 600 }}>
            {t.linkedinLabel} <ExternalLink size={14} />
          </motion.a>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ t }: { t: string }) {
  return (
    <footer className="py-8 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ background: '#0C0C0C', borderTop: '1px solid var(--border)' }}>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>© 2026 Haizhi Yang · 杨海芝</p>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t}</p>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const c = C[lang]

  useEffect(() => {
    const prevent = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') e.preventDefault()
    }
    document.addEventListener('contextmenu', prevent)
    return () => document.removeEventListener('contextmenu', prevent)
  }, [])
  return (
    <AnimatePresence mode="wait">
      <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ background: '#0C0C0C', overflowX: 'clip' }}>
        <Navbar lang={lang} setLang={setLang} t={c.nav} />
        <Hero t={c.hero} />
        <About t={c.about} />
        <Education t={c.education} />
        <Experience t={c.experience} />
        <Ventures t={c.ventures} />
        <Contact t={c.contact} />
        <Footer t={c.footer} />
      </motion.div>
    </AnimatePresence>
  )
}
