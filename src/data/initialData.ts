import { 
  ProfileData, 
  MetricItem, 
  ProjectItem, 
  ServiceItem, 
  ArticleItem, 
  MediaItem, 
  BuilderPage, 
  HeroConfig, 
  ShowcaseAppItem,
  ShowcaseBarConfig,
  CvResumeData,
  IntegratedSolutionItem
} from '../types';

export const initialProfile: ProfileData = {
  name: 'عبدالله المخلافي',
  englishName: 'Abdullah Almkhlafi',
  role: 'مطور حلول رقمية | مهتم بالذكاء الاصطناعي وتصميم التجارب',
  tagline: 'أبني منتجات رقمية تركّز على الإنسان، وأحوّل الأفكار المعقدة إلى تجارب بسيطة وذات أثر.',
  bio: 'أصمم حلولاً رقمية ذكية تجمع بين التفكير التقني العميق والتصميم الإبداعي الهادف لصناعة تجارب مؤثرة تتجاوز التوقعات.',
  longBio: 'مهندس برمجيات ومصمم تجارب مستخدم يتمتع بأكثر من عقد من الخبرة في بناء المنظومات الرقمية المتطورة. متخصص في هندسة تطبيقات الويب فائقة الأداء، تكامل حلول الذكاء الاصطناعي الحديثة، وتصميم واجهات استخدام فخمة تجمع بين المنطق البرمجي الدقيق والجماليات البصرية المريحة.',
  quote: 'التقنية ليست هدفاً، بل وسيلة لخلق قيمة تدوم.',
  logoUrl: '/brand-logo.jpg',
  logoHeight: 38,
  useImageLogo: true,
  avatarUrl: '',
  avatarZoom: 100,
  avatarAlign: 'center',
  email: 'a.almkhlafi77@gmail.com',
  phone: '+966 50 123 4567',
  whatsapp: '966501234567',
  location: 'الرياض، المملكة العربية السعودية',
  availableForHire: true,
  socials: {
    github: 'https://github.com/aalmkhlafi77-sudo',
    linkedin: '',
    x: '',
    email: 'mailto:a.almkhlafi77@gmail.com',
    facebook: 'https://www.facebook.com/bdallhhzaalmkhlafy',
    youtube: '',
    tiktok: '',
    snapchat: ''
  }
};

export const initialMetrics: MetricItem[] = [
  {
    id: 'm1',
    label: 'سنوات خبرة',
    value: '10+',
    iconName: 'Code2',
    subtext: 'في تطوير الحلول الرقمية'
  },
  {
    id: 'm2',
    label: 'مشروع منفذ',
    value: '25+',
    iconName: 'Layers',
    subtext: 'مشاريع مؤسسية وريادية'
  },
  {
    id: 'm3',
    label: 'مقال منشور',
    value: '15+',
    iconName: 'PenTool',
    subtext: 'في التقنية وتجربة المستخدم'
  },
  {
    id: 'm4',
    label: 'تقنية متقنة',
    value: '20+',
    iconName: 'Cpu',
    subtext: 'لغات وأطر عمل وحوسبة'
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 's1',
    title: 'تصميم الهوية البصرية',
    description: 'صياغة الهوية البصرية (الشعار، الألوان، الخطوط، وأدلة الهوية).',
    detailedDescription: 'بناء وصياغة هوية بصرية فريدة ومتكاملة تعكس جوهر علامتك التجارية ورؤيتها في السوق، مع تقديم كافة الملفات المصدرية وأدلة التطبيق الاحترافية.',
    deliverables: [
      'ابتكار وتصميم الشعار الرئيسي والفرعي بمختلف الصيغ الفيكتورية (AI, SVG, PNG).',
      'تحديد لوحة الألوان الأساسية والثانوية مع رموزها الرقمية والطباعية (HEX, RGB, CMYK).',
      'اختيار وتنسيق حزم الخطوط العربية والإنجليزية المعتمدة للتصميم والمراسلات.',
      'إعداد دليل الهوية البصرية المتكامل (Brand Guidelines) لضمان اتساق الاستخدام عبر كافة الوسائط.'
    ],
    type: 'service',
    iconName: 'Palette',
    category: 'تصميم الهوية البصرية',
    tags: ['الهوية البصرية', 'تصميم الشعار', 'أدلة الهوية', 'Brand Guidelines'],
    order: 1
  },
  {
    id: 's2',
    title: 'بناء مواقع إلكترونية',
    description: 'تطوير المنصات والمواقع الحديثة السريعة والمتجاوبة بأحدث التقنيات.',
    detailedDescription: 'هندسة وتطوير مواقع ومنصات إلكترونية عصرية متوافقة مع جميع مقاسات الشاشات والأجهزة، مدعومة بأحدث تقنيات الويب وسرعة استجابة فائقة.',
    deliverables: [
      'برمجة واجهات مستخدم متجاوبة (Responsive) وسريعة باستخدام React / Next.js / Tailwind.',
      'تهيئة وتوافق كامل مع محركات البحث (SEO) لرفع الظهور الرقمي في نتائج البحث.',
      'لوحات تحكم ديناميكية وإدارة محتوى سهلة وسلسة لإضافة وتحديث البيانات.',
      'تأمين متقدم وحماية البيانات مع ربط بوابات الدفع والنماذج الإلكترونية المعتمدة.'
    ],
    type: 'service',
    iconName: 'Globe',
    category: 'بناء مواقع إلكترونية',
    tags: ['React', 'Next.js', 'تصميم متجاوب', 'SEO', 'مواقع ويب'],
    order: 2
  },
  {
    id: 's3',
    title: 'صفحة تطبيقات شخصية (محفظة)',
    description: 'تصميم وبرمجة صفحات ومواقع تعريفية مصغرة ومعارض أعمال شخصية (Portfolio).',
    detailedDescription: 'تصميم وتطوير صفحات تعريفية ومعارض أعمال شخصية مخصصة للمهنيين ورواد الأعمال لإبراز الإنجازات والخبرات بلمسة فنية وتفاعلية راقية.',
    deliverables: [
      'تصميم واجهات شخصية مبتكرة تعكس المكانة المهنية والتخصص الدقيق.',
      'تنظيم وتوثيق معارض الأعمال والمشاريع السابقة بتفاعلية وسهولة تصفح.',
      'تضمين السيرة الذاتية التفاعلية مع إمكانية التحميل والطباعة والتخصيص.',
      'ربط شبكات التواصل الاجتماعي وأدوات التواصل المباشر (WhatsApp, Email).'
    ],
    type: 'service',
    iconName: 'User',
    category: 'صفحات وتطبيقات شخصية',
    tags: ['معرض أعمال', 'صفحة تعريفية', 'Portfolio', 'هوية شخصية'],
    order: 3
  },
  {
    id: 's4',
    title: 'تصميم انظمة ادارية ومالية',
    description: 'هندسة وبناء أنظمة مؤسسية متكاملة للعمليات والموارد والحسابات.',
    detailedDescription: 'بناء وهندسة أنظمة وحلول مؤسسية لإدارة دورات العمل، العمليات الداخلية، المحاسبة، والموارد البشرية لرفع كفاءة المنشأة وتقليل الهدر.',
    deliverables: [
      'تصميم لوحات تحكم تفاعلية (Dashboards) لمراقبة مؤشرات الأداء الحية (KPIs).',
      'أتمتة الدورات المستندية وسير العمليات وسندات الصرف والقبض والاعتمادات.',
      'ضبط سجلات العملاء، الموردين، وإدارة المخزون والمشتريات باحترافية.',
      'توليد التقارير المالية والإدارية الآلية لاتخاذ قرارات استراتيجية مدروسة.'
    ],
    type: 'service',
    iconName: 'BarChart3',
    category: 'تصميم أنظمة إدارية ومالية',
    tags: ['أنظمة ERP', 'لوحات التحكم', 'إدارة العمليات', 'Workflow'],
    order: 4
  },
  {
    id: 's5',
    title: 'استشارات محاسبية',
    description: 'تقديم استشارات محاسبية دقيقة لإعداد القوائم والتقارير المالية والتحليل المالي.',
    detailedDescription: 'حلول واستشارات محاسبية شاملة لمساعدة المنشآت على ضبط حساباتها، مطابقة القيود، وإعداد القوائم المالية وفق المعايير المعتمدة.',
    deliverables: [
      'فحص ومراجعة الحسابات وضبط شجرة الحسابات (Chart of Accounts) ومراكز التكلفة.',
      'إعداد القوائم المالية الختامية (المركز المالي، قائمة الدخل، والتدفقات النقدية).',
      'تحليل الأداء المالي واستخراج مؤشرات الربحية، السيولة، والكفاءة التشغيلية.',
      'وضع وتطبيق سياسات وإجراءات الرقابة الداخلية للحد من الأخطاء والمخاطر المالية.'
    ],
    type: 'consulting',
    iconName: 'Calculator',
    category: 'استشارات محاسبية',
    tags: ['التحليل المالي', 'إعداد القوائم', 'المحاسبة', 'التدقيق المالي'],
    order: 5
  },
  {
    id: 's6',
    title: 'استشارات اعمال',
    description: 'دراسة وتطوير النماذج التشغيلية وتقديم خطط نمو إستراتيجية.',
    detailedDescription: 'توجيه استراتيجي للمنشآت والشركات لتطوير النماذج التشغيلية، هيكلة التكاليف، واستكشاف فرص التوسع والنمو المستدام في السوق.',
    deliverables: [
      'دراسة وتحليل نموذج العمل التجاري (Business Model Canvas) وتطويره.',
      'تقييم العمليات التشغيلية وتحديد نقاط القوة وفرص التطوير وخفض التكاليف.',
      'صياغة خطط نمو استراتيجية قصيرة وطويلة المدى للمنشأة وتحديد الأولويات.',
      'تحسين كفاءة سلاسل الإمداد وإدارة فرق العمل لتحقيق أعلى معدلات إنتاجية.'
    ],
    type: 'consulting',
    iconName: 'Briefcase',
    category: 'استشارات أعمال',
    tags: ['تطوير الأعمال', 'خطط النمو', 'الاستراتيجية', 'نماذج التشغيل'],
    order: 6
  },
  {
    id: 's7',
    title: 'استشارات تتعلق بحلول الارضيات والمفروشات',
    description: 'استشارات هندسية وتصميمية متخصصة لاختيار وتوظيف أفضل حلول الأرضيات والمفروشات للمشاريع السكنية والتجارية.',
    detailedDescription: 'خبرات استشارية وفنية متخصصة في تقييم واختيار أنظمة الأرضيات والمفروشات المناسبة لكل مشروع من حيث الجودة، التحمل، والتصميم الجمالي.',
    deliverables: [
      'دراسة المواصفات الفنية لأنواع الأرضيات (باركيه، فينيل، سجاد، موكيت، بلاط متخصص).',
      'تقديم حلول متكاملة للمشاريع الفندقية، التجارية، والمباني السكنية الراقية.',
      'تقييم الموردين، حساب الكميات، وفحص معايير الجودة ومقاومة الاستخدام والحريق.',
      'تقديم توصيات دقيقة لطرق التركيب والعزل والصيانة الدورية للمواد.'
    ],
    type: 'consulting',
    iconName: 'Layers',
    category: 'استشارات الأرضيات والمفروشات',
    tags: ['حلول الأرضيات', 'المفروشات', 'التصميم الداخلي', 'مواصفات المشاريع'],
    order: 7
  },
  {
    id: 's8',
    title: 'استشارات ضريبة القيمة المضافة',
    description: 'إرشادات متخصصة للالتزام الضريبي، إعداد ومراجعة الإقرارات الضريبية وفق لوائح هيئة الزكاة والضريبة والجمارك.',
    detailedDescription: 'استشارات ضريبية متخصصة لضمان الامتثال التام للوائح والأنظمة، وتفادي الغرامات والمخالفات مع معالجة العمليات الضريبية بدقة.',
    deliverables: [
      'مراجعة وتدقيق المعاملات والفواتير الضريبية الإلكترونية (فاتورة ZATCA).',
      'إعداد وتقديم ومراجعة الإقرارات الضريبية الدورية لضريبة القيمة المضافة.',
      'معالجة ضريبة المدخلات والمخرجات وحساب الفروقات والخصومات بدقة.',
      'تقديم الاستشارات في الاعتراضات الضريبية والتسويات النظامية مع الهيئة.'
    ],
    type: 'consulting',
    iconName: 'ShieldCheck',
    category: 'استشارات ضريبة القيمة المضافة',
    tags: ['ضريبة القيمة المضافة', 'الامتثال الضريبي', 'الزكاة والضريبة', 'ZATCA'],
    order: 8
  },
  {
    id: 's9',
    title: 'تطبيقات تعمل على سطح المكتب',
    description: 'هندسة وتصميم واجهات وتطبيقات سطح المكتب (Desktop Apps) عالية الأداء لأنظمة ويندوز وماك لتجربة عمل احترافية.',
    detailedDescription: 'بناء وتطوير تطبيقات سطح مكتب مخصصة ومستقرة للأعمال التي تتطلب أداءً محلياً سريعاً أو اتصالات مباشرة بالأجهزة المكتبية وشبكات العمل الداخلية.',
    deliverables: [
      'تطوير تطبيقات عالية الكفاءة لأنظمة Windows و macOS باستخدام أحدث الأطر الحديثة.',
      'إمكانية العمل بدون اتصال بالإنترنت (Offline-First) والمزامنة عند توفر الاتصال.',
      'التكامل مع أجهزة نقاط البيع، الطابعات الحرارية، وقارئات الباركود والبطاقات.',
      'واجهات مستخدم حديثة وسلسة مصممة خصيصاً للمهام المكتبية والمهنية اليومية.'
    ],
    type: 'service',
    iconName: 'AppWindow',
    category: 'تطبيقات سطح المكتب',
    tags: ['Windows & Mac', 'Desktop UI', 'تطبيقات مكتبية', 'Cross-Platform'],
    order: 9
  }
];

export const initialProjects: ProjectItem[] = [
  {
    id: 'p1',
    title: 'منصة تحليلات الأعمال الذكية',
    category: 'أنظمة مؤسسية والذكاء الاصطناعي',
    description: 'منصة متكاملة لتحليل البيانات الضخمة واتخاذ القرارات الذكية في الوقت الفعلي بدقة غير مسبوقة.',
    fullDescription: 'نظام سحابي متكامل يخدم الإدارات التنفيذية في متابعة المؤشرات ومحاكاة السيناريوهات الاستراتيجية بالاعتماد على خوارزميات ذكاء اصطناعي تفاعلية.',
    year: '2024 - 2026',
    role: 'كبير مهندسي البرمجيات ومصمم التجربة',
    tools: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'D3.js'],
    challenge: 'معالجة وتصور كميات هائلة من البيانات المتدفقة في أجزاء من الثانية دون إبطاء واجهة المستخدم.',
    solution: 'تصميم معمارية تدفق بيانات غير متزامنة مع عزل المعالجات الحسابية في خيوط سحابية مستقلة ورسم بياني مرن.',
    results: 'تحسن بنسبة 65% في سرعة اتخاذ القرارات وانخفاض معدل زمن التحميل بنسبة 80%.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop'
    ],
    externalUrl: '',
    featured: true,
    published: true,
    order: 1
  },
  {
    id: 'p2',
    title: 'تطبيق إدارة المهام التفاعلي',
    category: 'تطبيقات الويب والإنتاجية',
    description: 'تطبيق يساعد الفرق على تنظيم المهام وتتبع الإنجاز ورفع الإنتاجية عبر بيئة عمل غامرة ومريحة.',
    fullDescription: 'أداة إنتاجية عصرية تجمع بين مرونة قوائم كانبان، تتبع الوقت، والمساعد الذكي لجدولة الأولويات تلقائياً.',
    year: '2024',
    role: 'مطور واجهات كاملة ومصمم النظام',
    tools: ['React Native', 'Tailwind', 'Express', 'SQLite'],
    challenge: 'تحقيق التزامن في الوقت الفعلي مع المحافظة على استهلاك منخفض للغاية لطاقة البطارية.',
    solution: 'استخدام بروتوكول خفيف للرسائل وتخزين محلي هجين يعمل دون اتصال بالإنترنت بكفاءة تامة.',
    results: 'أكثر من 50,000 مستخدم نشط يومياً مع تقييم 4.9 في متاجر التطبيقات.',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop'
    ],
    externalUrl: '',
    featured: true,
    published: true,
    order: 2
  },
  {
    id: 'p3',
    title: 'الموقع التعريفي والهوية الرقمية',
    category: 'تصميم الهوية والمواقع الفاخرة',
    description: 'موقع تعريفي عصري يعكس هوية العلامة التجارية باحترافية وتفاعل بصري دقيق مع تفاصيل معمارية راقية.',
    fullDescription: 'تجربة ويب تفاعلية تجمع بين التصميم المينيمالي الفخم، الرسوم المتدفقة، والمواد الزجاجية والمعدنية المصقولة.',
    year: '2024',
    role: 'المدير الإبداعي ومطور الفرونت إند',
    tools: ['Vite', 'React', 'Motion', 'Tailwind CSS'],
    challenge: 'إيجاد توازن مثالي بين الإبهار البصري والسرعة الفائقة لزمن تحميل الصفحة.',
    solution: 'استخدام أسلوب التعتيم الموجه وتحميل الأصول حسب موضع التمرير بدقة هندسية.',
    results: 'تحقيق 100/100 في معايير Google Lighthouse للأداء وسهولة الوصول.',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    externalUrl: '',
    featured: true,
    published: true,
    order: 3
  },
  {
    id: 'p4',
    title: 'نظام المحاسبة والفوترة الإلكترونية',
    category: 'أنظمة إدارية ومالية',
    description: 'نظام سحابي متوافق مع هيئة الزكاة والضريبة والجمارك (ZATCA) لإدارة الفواتير والقيود المحاسبية بدقة.',
    fullDescription: 'منظومة مالية متقدمة تدعم الفوترة الإلكترونية للمرحلتين الأولى والثانية مع إصدار التقارير والقوائم المالية وتحليل التدفقات النقدية.',
    year: '2024',
    role: 'مهندس الحلول المالية والمطور الرئيسي',
    tools: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    challenge: 'تحقيق متطلبات التشفير والتوقيع الرقمي للفوترة مع معالجة آلاف المعاملات في الثواني المعدودة.',
    solution: 'تضمين معمارية معالجة سحابية آمنة تعتمد على تشفير المعاملات وتوليد رموز QR مشفرة فورياً.',
    results: 'إصدار أكثر من 200,000 فاتورة معتمدة بدون أي تعارض نظامي.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
    ],
    externalUrl: '',
    featured: false,
    published: true,
    order: 4
  },
  {
    id: 'p5',
    title: 'منصة حلول الأرضيات والمفروشات الذكية',
    category: 'استشارات الأرضيات والمفروشات',
    description: 'منصة استشارية وتفاعلية لحساب كميات الأرضيات والمفروشات ومحاكاة الخامات للمشاريع الكبرى.',
    fullDescription: 'أداة هندسية تساعد مهندسي الديكور والمقاولين على اختيار مواصفات الأرضيات وتوقع التكاليف والمطابقة للمواصفات الفنية القياسية.',
    year: '2023 - 2024',
    role: 'استشاري تقني ومصمم تجربة المستخدم',
    tools: ['React', 'Three.js', 'Tailwind', 'Vite'],
    challenge: 'محاكاة الألوان والخامات بدقة بصرية وتحديد الهالك في القص والتركيب تلقائياً.',
    solution: 'بناء خوارزمية حسابية لهندسة المساحات وحساب الكميات بنسبة خطأ تقترب من الصفر.',
    results: 'تقليص هدر المواد بنسبة 18% في أكثر من 40 مشروعاً فندقياً وسكنياً.',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop'
    ],
    externalUrl: '',
    featured: false,
    published: true,
    order: 5
  },
  {
    id: 'p6',
    title: 'تطبيق سطح المكتب لإدارة المبيعات ونقاط البيع',
    category: 'تطبيقات سطح المكتب',
    description: 'تطبيق سطح مكتب سريع ومستقر يعمل بدون إنترنت لإدارة المبيعات وطباعة الفواتير والباركود.',
    fullDescription: 'تطبيق مخصص للمنشآت التجارية ونقاط البيع السريعة، يدعم الطابعات الحرارية وأدراج النقد والمزامنة الخلفية مع السحابة عند توفر الشبكة.',
    year: '2023',
    role: 'مطور تطبيقات Desktop ونظم إدارة المخزون',
    tools: ['Electron', 'React', 'SQLite', 'Node.js'],
    challenge: 'ضمان استمرارية البيع والطباعة الفورية حتى في حال انقطاع الشبكة كلياً.',
    solution: 'استخدام قاعدة بيانات محلية مدمجة مع نظام طابور مزامنة ذكي ينشط آلياً فور عودة الاتصال.',
    results: 'استقرار تشغيلي بنسبة 99.99% وزمن استجابة أقل من 50 مللي ثانية لكل عملية بيع.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1556742049-0a67c5574f73?q=80&w=1200&auto=format&fit=crop'
    ],
    externalUrl: '',
    featured: false,
    published: true,
    order: 6
  },
  {
    id: 'p7',
    title: 'بوابة الاستشارات الضريبية والزكوية',
    category: 'استشارات ضريبة القيمة المضافة',
    description: 'بوابة تفاعلية لمتابعة الفترات الضريبية وإعداد مسودات الإقرارات وحساب الاستقطاعات والخصومات.',
    fullDescription: 'نظام استشاري رقمي يربط المنشأة بالمستشارين الماليين لمراجعة مستندات الضرائب وتفادي الغرامات وتدقيق قيود الخصم الضريبي.',
    year: '2024',
    role: 'مستشار ومطور المنصة',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    challenge: 'تبسيط الإجراءات الضريبية المعقدة وعرض الموقف المالي بدقة للمدراء غير الماليين.',
    solution: 'تصميم لوحات مؤشرات تفاعلية تفصل ضريبة المدخلات والمخرجات وصافي الالتزام مع التنبيهات المبكرة.',
    results: 'امتثال ضريبي كامل بنسبة 100% لجميع المنشآت المستفيدة وتوفير 40 ساعة عمل شهرياً.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop'
    ],
    externalUrl: '',
    featured: false,
    published: true,
    order: 7
  }
];

export const initialArticles: ArticleItem[] = [
  {
    id: 'a1',
    title: 'كيف أبني منتجاً رقمياً يركّز على المستخدم؟',
    slug: 'user-centric-digital-products',
    excerpt: 'استراتيجيات عملية لصناعة تجارب رقمية بسيطة ومريحة تحقق احتياجات العميل الحقيقية وتلغي التعقيد التقني الزائد.',
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
    category: 'تجربة المستخدم',
    tags: ['تصميم', 'استراتيجية', 'UI/UX'],
    readTime: '5 دقائق قراءة',
    publishDate: '12 مايو 2024',
    status: 'published',
    seoTitle: 'كيف تبني منتجاً يركز على المستخدم | عبدالله المخلافي',
    seoDescription: 'دليل عملي لتصميم وبناء منتجات رقمية إنسانية ترتكز على تجربة المستخدم الفعالة.',
    blocks: [
      {
        id: 'b1',
        type: 'paragraph',
        content: 'في عالم تتسارع فيه التقنيات بوتيرة غير مسبوقة، يقع الكثير من المطورين في فخ بناء ميزات برمجية معقدة لا تخدم الهدف الأساسي للمستخدم. الهدف الحقيقي من أي منتج رقمي ليس استعراض القدرات البرمجية، بل حل مشكلة واقعية بأبسط شكل ممكن.'
      },
      {
        id: 'b2',
        type: 'quote',
        content: 'البساطة هي قمة التطور والذكاء الهندسي، وليست مجرد غياب للتعقيد.',
        meta: { author: 'ستيف جوبز' }
      },
      {
        id: 'b3',
        type: 'h2',
        content: 'المحاور الأساسية للتصميم الإنساني'
      },
      {
        id: 'b4',
        type: 'paragraph',
        content: 'يبدأ التصميم المرتكز على الإنسان بالاستماع الفعّال، وفهم رحلة المشاعر التي يمر بها المستخدم من اللحظة الأولى لدخوله إلى المنصة وحتى إتمام مهمته بنجاح وراحة بال.'
      },
      {
        id: 'b5',
        type: 'cta',
        content: 'هل تعمل على مشروع وتريد تحسين تجربة مستخدميه؟ تواصل معي لمناقشة أفكارك.',
        meta: { buttonText: 'ابدأ محادثة الآن', buttonLink: '#contact' }
      }
    ]
  },
  {
    id: 'a2',
    title: 'دور الذكاء الاصطناعي في تحسين كفاءة الأعمال',
    slug: 'ai-role-in-business-optimization',
    excerpt: 'كيف تتحول النماذج التوليدية من مجرد صيحة تقنية إلى محركات إنتاجية فعلية داخل بيئات العمل المعاصرة.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    category: 'الذكاء الاصطناعي',
    tags: ['AI', 'أتمتة', 'ابتكار'],
    readTime: '7 دقائق قراءة',
    publishDate: '28 أبريل 2024',
    status: 'published',
    seoTitle: 'دور الذكاء الاصطناعي في كفاءة الأعمال | عبدالله المخلافي',
    seoDescription: 'تحليل دقيق لأثر الذكاء الاصطناعي في تمكين المنظمات وتسريع وتيرة الابتكار.',
    blocks: [
      {
        id: 'b2_1',
        type: 'paragraph',
        content: 'لم يعد الذكاء الاصطناعي مقتصراً على مراكز الأبحاث؛ إنه اليوم الأداة الأقوى في يد رواد الأعمال والمطورين لأتمتة المهام الروتينية، واستخلاص الرؤى العميقة من بحار البيانات.'
      },
      {
        id: 'b2_2',
        type: 'quote',
        content: 'الذكاء الاصطناعي لن يستبدل الإنسان المبدع، لكن الإنسان المتمكن من الذكاء الاصطناعي سيتفوق على غيره.',
        meta: { author: 'مبدأ الابتكار الحديث' }
      }
    ]
  },
  {
    id: 'a3',
    title: 'مبادئ تصميم تجربة رقمية ناجحة ومستدامة',
    slug: 'principles-of-successful-ux',
    excerpt: 'عشر قواعد هندسية وجمالية تضمن بقاء تطبيقك محبباً لدى جمهورك ومقاوماً لتقلبات الموضة العابرة.',
    coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1000&auto=format&fit=crop',
    category: 'التصميم الرقمي',
    tags: ['Design Systems', 'UX', 'أفضل الممارسات'],
    readTime: '4 دقائق قراءة',
    publishDate: '10 مارس 2024',
    status: 'published',
    seoTitle: 'مبادئ تصميم تجربة رقمية ناجحة | عبدالله المخلافي',
    seoDescription: 'استكشف القواعد الذهبية لتصميم أنظمة تجربة المستخدم المستدامة.',
    blocks: [
      {
        id: 'b3_1',
        type: 'paragraph',
        content: 'الاتساق البصري وسرعة الاستجابة هما حجر الأساس لأي منتج ناجح. عندما يتوقع المستخدم سلوكاً معيناً ويجده فوراً، يتولد شعور الأمان والثقة في علامتك التجارية.'
      }
    ]
  },
  {
    id: 'a4',
    title: 'رحلتي في تصوير الطبيعة وتأمل التكوين البصري',
    slug: 'nature-photography-journey',
    excerpt: 'التصوير بالنسبة لي ليس مجرد التقاط صورة، بل هو طريقة لرؤية العالم والتواصل مع لحظات لا تتكرر، مما ينعكس مباشرة على دقة تصميمي للواجهات.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    category: 'إلهام وبصريات',
    tags: ['تصوير', 'طبيعة', 'إلهام'],
    readTime: '6 دقائق قراءة',
    publishDate: '18 مايو 2024',
    status: 'published',
    seoTitle: 'رحلتي في تصوير الطبيعة | عبدالله المخلافي',
    seoDescription: 'خواطر وتأملات بصرية حول التقاط الضوء والتكوين وكيف يثري التفكير الهندسي.',
    blocks: [
      {
        id: 'b4_1',
        type: 'paragraph',
        content: 'التصوير بالنسبة لي ليس مجرد التقاط صورة، بل هو طريقة لرؤية العالم والتواصل مع لحظات لا تتكرر. في هذا المقال أشارك بعض التجارب والنصائح التي تعلمتها خلال رحلاتي الاستكشافية في الجبال والوديان.'
      },
      {
        id: 'b4_2',
        type: 'quote',
        content: 'الطبيعة لا تتعجل، ومع ذلك فكل شيء يُنجَز.',
        meta: { author: 'لاو تزو' }
      },
      {
        id: 'b4_3',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        meta: { caption: 'شروق الشمس الذهبي فوق قمم الألب الشاهقة' }
      },
      {
        id: 'b4_4',
        type: 'table',
        content: 'الموقع | نوع التصوير | التوقيت | ملاحظات\nجبال الألب | مناظر طبيعية | الصيف | ضوء ذهبي رائع\nساحل عُمان | سواحل وغروب | الشتاء | أمواج هادئة\nصحراء الربع الخالي | صحراء وسماء | الربيع | سماء صافية'
      },
      {
        id: 'b4_5',
        type: 'cta',
        content: 'هل أعجبك المقال؟ اشترك لتصلك أحدث الرؤى والتجارب المصورة.',
        meta: { buttonText: 'اشترك الآن', buttonLink: '#contact' }
      }
    ]
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: 'med1',
    name: 'mountain-view.jpg',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    type: 'JPG',
    dimensions: '6000 × 4000',
    fileSize: '6.2 MB',
    addedDate: '2024/05/18',
    altText: 'منظر جبلي ساحر عند شروق الشمس مع ضوء ذهبي يضيء القمم والضباب في الوادي.',
    keywords: ['طبيعة', 'شروق ذهبي', 'جبال الألب', 'سحاب'],
    license: 'الاستخدام الشخصي والتجاري',
    adjustments: {
      brightness: 12,
      contrast: 18,
      saturation: 22,
      temperature: -4,
      sharpness: 15,
      opacity: 0,
      cropRatio: '3:2',
      rotate: 0,
      flipH: false,
      flipV: false,
      focalPoint: { x: 50, y: 40 }
    },
    versions: [
      {
        id: 'v3',
        timestamp: '2024/05/18 10:30',
        label: 'تم النشر في مقال رحلتي',
        adjustments: {
          brightness: 12,
          contrast: 18,
          saturation: 22,
          temperature: -4,
          sharpness: 15,
          opacity: 0,
          cropRatio: '3:2',
          rotate: 0,
          flipH: false,
          flipV: false,
          focalPoint: { x: 50, y: 40 }
        }
      },
      {
        id: 'v2',
        timestamp: '2024/05/17 18:45',
        label: 'تعديل الألوان والقص 3:2',
        adjustments: {
          brightness: 8,
          contrast: 12,
          saturation: 10,
          temperature: 0,
          sharpness: 10,
          opacity: 0,
          cropRatio: '3:2',
          rotate: 0,
          flipH: false,
          flipV: false,
          focalPoint: { x: 50, y: 40 }
        }
      },
      {
        id: 'v1',
        timestamp: '2024/05/16 09:15',
        label: 'النسخة الأصلية المرفوعة',
        adjustments: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          temperature: 0,
          sharpness: 0,
          opacity: 0,
          cropRatio: 'free',
          rotate: 0,
          flipH: false,
          flipV: false,
          focalPoint: { x: 50, y: 50 }
        }
      }
    ]
  },
  {
    id: 'med2',
    name: 'desert-rock.jpg',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    type: 'JPG',
    dimensions: '5400 × 3600',
    fileSize: '4.8 MB',
    addedDate: '2024/05/10',
    altText: 'تشكيلات صخرية شامخة في الصحراء العربية تحت أشعة الشمس الدافئة.',
    keywords: ['صحراء', 'صخور', 'تكوين', 'غروب'],
    license: 'الاستخدام الشخصي والتجاري',
    adjustments: {
      brightness: 5,
      contrast: 10,
      saturation: 15,
      temperature: 12,
      sharpness: 20,
      opacity: 0,
      cropRatio: '16:9',
      rotate: 0,
      flipH: false,
      flipV: false,
      focalPoint: { x: 50, y: 50 }
    },
    versions: []
  },
  {
    id: 'med3',
    name: 'coastal-sunrise.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    type: 'JPG',
    dimensions: '6000 × 4000',
    fileSize: '5.4 MB',
    addedDate: '2024/05/05',
    altText: 'شاطئ هادئ ومياه لازوردية صافية عند بزوغ الفجر.',
    keywords: ['بحر', 'شروق', 'صفاء', 'أمواج'],
    license: 'الاستخدام الشخصي والتجاري',
    adjustments: {
      brightness: 0,
      contrast: 5,
      saturation: 8,
      temperature: -8,
      sharpness: 10,
      opacity: 0,
      cropRatio: 'free',
      rotate: 0,
      flipH: false,
      flipV: false,
      focalPoint: { x: 50, y: 50 }
    },
    versions: []
  },
  {
    id: 'med4',
    name: 'architectural-arch.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    originalUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    type: 'JPG',
    dimensions: '4800 × 3200',
    fileSize: '3.9 MB',
    addedDate: '2024/04/28',
    altText: 'أقواس معمارية قديمة تعكس تناغم الضوء والظلال وتناسق الخطوط.',
    keywords: ['عمارة', 'أقواس', 'ضوء وظل', 'هندسة'],
    license: 'الاستخدام الشخصي والتجاري',
    adjustments: {
      brightness: 10,
      contrast: 15,
      saturation: -5,
      temperature: 4,
      sharpness: 15,
      opacity: 0,
      cropRatio: '1:1',
      rotate: 0,
      flipH: false,
      flipV: false,
      focalPoint: { x: 50, y: 50 }
    },
    versions: []
  }
];

export const initialPages: BuilderPage[] = [
  {
    id: 'page_home',
    slug: 'home',
    title: 'الصفحة الرئيسية',
    isHome: true,
    published: true,
    elements: [
      {
        id: 'el_hero',
        name: 'قسم البطل (Hero)',
        type: 'hero',
        visible: true,
        locked: false,
        content: {
          title: 'عبدالله المخلافي',
          subtitle: 'مطور حلول رقمية | مهتم بالذكاء الاصطناعي وتصميم التجارب',
          description: 'أبني منتجات رقمية تركّز على الإنسان، وأحوّل الأفكار المعقدة إلى تجارب بسيطة وذات أثر مستدام.',
          buttonText: 'استعرض أعمالي',
          buttonLink: '#projects'
        },
        layout: {
          paddingY: 'py-20 md:py-28',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_stats',
        name: 'شريط الإحصاءات والأرقام',
        type: 'stats',
        visible: true,
        locked: false,
        content: {
          title: 'إحصاءات الإنجاز'
        },
        layout: {
          paddingY: 'py-8',
          maxWidth: 'max-w-7xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_expertise',
        name: 'قسم الخبرات والتخصصات',
        type: 'expertise',
        visible: true,
        locked: false,
        content: {
          title: 'مجالات الخبرة والتخصص',
          subtitle: 'حلول متكاملة تدمج بين هندسة البرمجيات وأحدث تقنيات التصميم'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_projects',
        name: 'معرض الأعمال والمشاريع',
        type: 'projects',
        visible: true,
        locked: false,
        content: {
          title: 'أعمال مختارة',
          subtitle: 'مجموعة من المشاريع التي قمت بتطويرها وصياغة تجاربها بعناية فائقة'
        },
        layout: {
          paddingY: 'py-20',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_articles',
        name: 'المقالات والأفكار المنشورة',
        type: 'articles',
        visible: true,
        locked: false,
        content: {
          title: 'أحدث المقالات والرؤى',
          subtitle: 'كتابات وتأملات في مجالات التقنية، الذكاء الاصطناعي وتصميم المنتجات'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_quote',
        name: 'اقتباس وفلسفة العمل',
        type: 'quote',
        visible: true,
        locked: false,
        content: {
          quoteText: 'التقنية ليست هدفاً، بل وسيلة لخلق قيمة تدوم.'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-4xl',
          align: 'center'
        },
        style: {
          material: 'metal',
          glow: true
        },
        motion: {
          animationType: 'scale',
          duration: 0.7,
          delay: 0.2
        }
      },
      {
        id: 'el_contact',
        name: 'دعوة للتواصل والشراكة',
        type: 'contact',
        visible: true,
        locked: false,
        content: {
          title: 'هل لديك فكرة أو مشروع؟',
          subtitle: 'يسعدني دائماً التعاون في مشاريع طموحة وتقديم استشارات وحلول ذات أثر حقيقي.'
        },
        layout: {
          paddingY: 'py-20',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      }
    ]
  },
  {
    id: 'page_about',
    slug: 'about',
    title: 'من أنا والسيرة الذاتية',
    isHome: false,
    published: true,
    elements: [
      {
        id: 'el_about_hero',
        name: 'ترويسة السيرة الذاتية',
        type: 'heading',
        visible: true,
        locked: false,
        content: {
          title: 'السيرة الذاتية والمسيرة المهنية',
          subtitle: 'عن عبدالله المخلافي',
          description: 'رحلة تفوق عقد من الزمان في ابتكار المنظومات الرقمية وتصميم الواجهات الإنسانية.'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_about_image',
        name: 'الصورة الشخصية الرسمية',
        type: 'image',
        visible: true,
        locked: false,
        content: {
          title: 'عبدالله المخلافي - مطور حلول رقمية ومصمم تجارب',
          imageUrl: ''
        },
        layout: {
          paddingY: 'py-8',
          maxWidth: 'max-w-3xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'scale',
          duration: 0.6,
          delay: 0.2
        }
      },
      {
        id: 'el_about_bio',
        name: 'النبذة الشاملة والمسيرة',
        type: 'paragraph',
        visible: true,
        locked: false,
        content: {
          title: 'فلسفة البناء والابتكار التقني',
          description: 'مهندس برمجيات ومصمم تجارب مستخدم يتمتع بأكثر من عقد من الخبرة في بناء المنظومات الرقمية المتطورة. متخصص في هندسة تطبيقات الويب فائقة الأداء، تكامل حلول الذكاء الاصطناعي الحديثة، وتصميم واجهات استخدام فخمة تجمع بين المنطق البرمجي الدقيق والجماليات البصرية المريحة.'
        },
        layout: {
          paddingY: 'py-10',
          maxWidth: 'max-w-4xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_about_stats',
        name: 'شريط محطات الإنجاز',
        type: 'stats',
        visible: true,
        locked: false,
        content: {
          title: 'محطات الإنجاز'
        },
        layout: {
          paddingY: 'py-8',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_about_expertise',
        name: 'الخبرات والمهارات',
        type: 'expertise',
        visible: true,
        locked: false,
        content: {
          title: 'المهارات والقدرات الفنية'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_about_quote',
        name: 'اقتباس شخصي',
        type: 'quote',
        visible: true,
        locked: false,
        content: {
          quoteText: 'التقنية ليست هدفاً، بل وسيلة لخلق قيمة تدوم.'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-4xl',
          align: 'center'
        },
        style: {
          material: 'metal',
          glow: true
        },
        motion: {
          animationType: 'scale',
          duration: 0.6,
          delay: 0.2
        }
      }
    ]
  },
  {
    id: 'page_work',
    slug: 'work',
    title: 'أعمالي ومشاريعي',
    isHome: false,
    published: true,
    elements: [
      {
        id: 'el_work_heading',
        name: 'عنوان صفحة الأعمال',
        type: 'heading',
        visible: true,
        locked: false,
        content: {
          title: 'أعمال ومشاريع مختارة',
          subtitle: 'معرض الإنجازات البرمجية والتصميمية',
          description: 'مجموعة من الحلول الرقمية، الأنظمة السحابية، والواجهات المبتكرة التي صممتها ونفذتها وفق أعلى المعايير العالمية.'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_work_projects',
        name: 'معرض المشاريع الرئيسي',
        type: 'projects',
        visible: true,
        locked: false,
        content: {
          title: 'كافة المشاريع'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_work_contact',
        name: 'دعوة لبدء مشروع جديد',
        type: 'contact',
        visible: true,
        locked: false,
        content: {
          title: 'هل لديك مشروع قادم؟',
          subtitle: 'دعنا نحول فكرتك إلى منتج رقمي متكامل يلهم عملاءك.'
        },
        layout: {
          paddingY: 'py-20',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      }
    ]
  },
  {
    id: 'page_services',
    slug: 'services',
    title: 'الخدمات والاستشارات',
    isHome: false,
    published: true,
    elements: [
      {
        id: 'el_services_heading',
        name: 'عنوان صفحة الخدمات',
        type: 'heading',
        visible: true,
        locked: false,
        content: {
          title: 'الخدمات والاستشارات الرقمية',
          subtitle: 'حلول تقنية وهندسية متكاملة',
          description: 'نقدم منظومة شاملة من الخدمات البرمجية والاستشارية المصممة لتمكين أعمالك وتسريع نموك الرقمي.'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_services_grid',
        name: 'شبكة مجالات التخصص والخدمات',
        type: 'expertise',
        visible: true,
        locked: false,
        content: {
          title: 'حزم الخدمات المتاحة'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_services_stats',
        name: 'أرقام وجودة التنفيذ',
        type: 'stats',
        visible: true,
        locked: false,
        content: {
          title: 'مؤشرات الأداء'
        },
        layout: {
          paddingY: 'py-8',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_services_contact',
        name: 'طلب استشارة أو عرض سعر',
        type: 'contact',
        visible: true,
        locked: false,
        content: {
          title: 'احجز جلسة استشارية',
          subtitle: 'تواصل مباشرة لمناقشة المتطلبات الفنية والجدول الزمني لمشروعك.'
        },
        layout: {
          paddingY: 'py-20',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      }
    ]
  },
  {
    id: 'page_blog',
    slug: 'blog',
    title: 'المدونة والمقالات',
    isHome: false,
    published: true,
    elements: [
      {
        id: 'el_blog_heading',
        name: 'عنوان صفحة المدونة',
        type: 'heading',
        visible: true,
        locked: false,
        content: {
          title: 'المدونة والمقالات المعرفية',
          subtitle: 'رؤى وتحليلات في التقنية وتجربة المستخدم',
          description: 'كتابات وتأملات دورية حول الذكاء الاصطناعي، أفضل ممارسات هندسة البرمجيات، وتصميم التجارب الرقمية الحديثة.'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_blog_articles',
        name: 'شبكة المقالات المنشورة',
        type: 'articles',
        visible: true,
        locked: false,
        content: {
          title: 'أحدث المقالات'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-7xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_blog_quote',
        name: 'اقتباس ملهم',
        type: 'quote',
        visible: true,
        locked: false,
        content: {
          quoteText: 'المعرفة الحقيقية تكتمل عندما نشاركها مع المجتمع.'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-4xl',
          align: 'center'
        },
        style: {
          material: 'metal',
          glow: true
        },
        motion: {
          animationType: 'scale',
          duration: 0.6,
          delay: 0.2
        }
      }
    ]
  },
  {
    id: 'page_contact',
    slug: 'contact',
    title: 'تواصل معي',
    isHome: false,
    published: true,
    elements: [
      {
        id: 'el_contact_page_heading',
        name: 'عنوان صفحة التواصل',
        type: 'heading',
        visible: true,
        locked: false,
        content: {
          title: 'تواصل معي وابدأ محادثتك',
          subtitle: 'قنوات التواصل المباشر',
          description: 'سواء كنت ترغب في بناء منتج جديد، أو استشارة تقنية متخصصة، يسعدني دائماً التواصل معك.'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_contact_page_form',
        name: 'قسم ونموذج التواصل',
        type: 'contact',
        visible: true,
        locked: false,
        content: {
          title: 'أرسل رسالتك مباشرة'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      }
    ]
  },
  {
    id: 'page_privacy',
    slug: 'privacy',
    title: 'سياسة الخصوصية',
    isHome: false,
    published: true,
    elements: [
      {
        id: 'el_privacy_heading',
        name: 'عنوان سياسة الخصوصية',
        type: 'heading',
        visible: true,
        locked: false,
        content: {
          title: 'سياسة الخصوصية وحماية البيانات',
          subtitle: 'شروط الاستخدام والسرية',
          description: 'نحن ملتزمون بحماية خصوصيتك واحترام سرية كافة البيانات التي تشاركها معنا عبر هذا الموقع.'
        },
        layout: {
          paddingY: 'py-16',
          maxWidth: 'max-w-5xl',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.6,
          delay: 0.1
        }
      },
      {
        id: 'el_privacy_p1',
        name: 'بند جمع البيانات',
        type: 'paragraph',
        visible: true,
        locked: false,
        content: {
          title: '1. البيانات التي يتم جمعها',
          description: 'نقوم بجمع البيانات التي تقدمها طواعية عبر نماذج التواصل (مثل الاسم، البريد الإلكتروني، ورقم الهاتف) لغرض الرد على استفساراتك وتقديم الخدمات المطلوبة حصراً.'
        },
        layout: {
          paddingY: 'py-8',
          maxWidth: 'max-w-4xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.1
        }
      },
      {
        id: 'el_privacy_p2',
        name: 'بند سرية المعلومات',
        type: 'paragraph',
        visible: true,
        locked: false,
        content: {
          title: '2. سرية المعلومات وعدم المشاركة',
          description: 'لا نقوم ببيع أو تأجير أو مشاركة أي من بياناتك الشخصية مع أي أطراف ثالثة لأغراض تجارية تحت أي ظرف من الظروف.'
        },
        layout: {
          paddingY: 'py-8',
          maxWidth: 'max-w-4xl',
          align: 'start'
        },
        style: {
          material: 'glass',
          glow: false
        },
        motion: {
          animationType: 'fade-up',
          duration: 0.5,
          delay: 0.2
        }
      },
      {
        id: 'el_privacy_div',
        name: 'فاصل زخرفي',
        type: 'divider',
        visible: true,
        locked: false,
        content: {},
        layout: {
          paddingY: 'py-6',
          maxWidth: 'max-w-3xl',
          align: 'center'
        },
        style: {
          material: 'metal',
          glow: false
        },
        motion: {
          animationType: 'none',
          duration: 0.3,
          delay: 0
        }
      },
      {
        id: 'el_privacy_btn',
        name: 'زر العودة للرئيسية',
        type: 'button',
        visible: true,
        locked: false,
        content: {
          title: 'العودة للصفحة الرئيسية',
          buttonText: 'العودة للصفحة الرئيسية',
          buttonLink: '#hero'
        },
        layout: {
          paddingY: 'py-12',
          maxWidth: 'max-w-md',
          align: 'center'
        },
        style: {
          material: 'glass',
          glow: true
        },
        motion: {
          animationType: 'scale',
          duration: 0.5,
          delay: 0.2
        }
      }
    ]
  }
];

export const initialHeroConfig: HeroConfig = {
  preset: 'ai_forest',
  customImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
  lightingIntensity: 85, // 0 to 100
  overlayOpacity: 35, // 0 to 100
  blurAmount: 0, // 0 to 20px
  animationSpeed: 1.0, // 0.2x to 3.0x
  motionDuration: 16, // seconds
  motionStyle: 'flow_loop',
  repeatCount: 'infinite',
  particlesEnabled: true,
  codeSnippetEffect: true,
  ambientGlow: true
};

export const initialShowcaseBarConfig: ShowcaseBarConfig = {
  title: 'تطبيقات ومنصات قمت بتطويرها وإطلاقها',
  subtitle: 'منتجات برمجية وحلول حية تعمل بكفاءة في بيئات الإنتاج',
  enabled: true,
  layoutStyle: 'grid_bar',
  showBadge: true
};

export const initialShowcaseApps: ShowcaseAppItem[] = [
  {
    id: 'app_1',
    name: 'ركيزة للذكاء الاصطناعي',
    category: 'منصة ويب سحابية',
    description: 'نظام توليد وتحليل محتوى الأعمال بالذكاء الاصطناعي متعدد الوكلاء.',
    iconName: 'Brain',
    url: '',
    status: 'live',
    tags: ['Next.js', 'Gemini AI', 'Tailwind'],
    order: 1
  },
  {
    id: 'app_2',
    name: 'تطبيق إنجاز السحابي',
    category: 'تطبيق جوال وويب',
    description: 'إدارة متكاملة للفرق والمشاريع مع نظام تنبيهات وإشعارات ذكية.',
    iconName: 'Smartphone',
    url: '',
    status: 'live',
    tags: ['React Native', 'Node.js', 'Redis'],
    order: 2
  },
  {
    id: 'app_3',
    name: 'مدار للتحليلات الذكية',
    category: 'لوحة مؤشرات تنفيذية',
    description: 'تحليل البيانات الضخمة وبناء التقارير المالية والإدارية التفاعلية.',
    iconName: 'BarChart3',
    url: '',
    status: 'live',
    tags: ['D3.js', 'PostgreSQL', 'TypeScript'],
    order: 3
  },
  {
    id: 'app_4',
    name: 'بوابة الأفق المؤسسية',
    category: 'منظومة حوكمة وخدمات',
    description: 'أتمتة المعاملات والربط البيني الآمن للجهات والشركات.',
    iconName: 'Globe',
    url: '',
    status: 'live',
    tags: ['Cloud Run', 'Docker', 'GraphQL'],
    order: 4
  },
  {
    id: 'app_5',
    name: 'استوديو النماذج التفاعلي',
    category: 'أداة تطوير رقمية',
    description: 'بيئة اختبار وتوليد واجهات المستخدم بالذكاء الاصطناعي التوليدي.',
    iconName: 'Sparkles',
    url: '',
    status: 'beta',
    tags: ['React 19', 'Vite', 'Tailwind'],
    order: 5
  }
];

export const initialCvResumeData: CvResumeData = {
  summary: 'مهندس برمجيات ومصمم تجارب مستخدم يتمتع بأكثر من عقد من الخبرة في بناء المنظومات الرقمية المتطورة. متخصص في هندسة تطبيقات الويب والجوّال فائقة الأداء، تكامل حلول الذكاء الاصطناعي الحديثة، وتصميم واجهات استخدام تجمع بين المنطق البرمجي الدقيق والجماليات البصرية الراقية.',
  skills: [
    'React & React Native',
    'TypeScript & JavaScript',
    'Node.js & Express',
    'Gemini AI & LLMs Integration',
    'Tailwind CSS & Modern UI',
    'Cloud Run & Docker Architecture',
    'PostgreSQL & Firestore & Redis',
    'UI/UX & Design Systems',
    'API Architecture & Microservices',
    'Performance Optimization (Lighthouse 100)'
  ],
  experiences: [
    {
      id: 'exp_1',
      role: 'كبير مهندسي البرمجيات والحلول الرقمية',
      company: 'مجموعة التطوير التقني المتقدم',
      location: 'الرياض، المملكة العربية السعودية',
      startDate: '2021',
      endDate: 'حتى الآن',
      current: true,
      description: 'قيادة تصميم وتطوير المنصات الرقمية السحابية وتكامل وكلاء الذكاء الاصطناعي لرفع كفاءة الأعمال.',
      achievements: [
        'بناء معمارية معالجة بيانات غير متزامنة خفضت زمن الاستجابة بنسبة 70%.',
        'تأسيس Design System موحد اعتمدته أكثر من 5 فرق تطوير مختلفة.',
        'إطلاق 8 منصات وتطبيقات تجارية ناجحة تخدم آلاف المستخدمين النشطين.'
      ]
    },
    {
      id: 'exp_2',
      role: 'مطور واجهات كاملة ومصمم تجارب المستخدم (Full-Stack & UX)',
      company: 'حلول الابتكار والتحول الرقمي',
      location: 'الرياض',
      startDate: '2017',
      endDate: '2021',
      current: false,
      description: 'تطوير تطبيقات الويب والهواتف الذكية مع التركيز على الواجهات التفاعلية وسهولة الوصول والأمان.',
      achievements: [
        'تطوير نظام إدارة المهام والمشاريع التفاعلي بتقييم 4.9 في متاجر التطبيقات.',
        'إعادة هيكلة قواعد البيانات والخدمات مما قلل تكاليف الاستضافة السحابية بنسبة 40%.'
      ]
    },
    {
      id: 'exp_3',
      role: 'مطور برمجيات',
      company: 'الريادة لتقنية المعلومات',
      location: 'الرياض',
      startDate: '2014',
      endDate: '2017',
      current: false,
      description: 'بناء البوابات والمواقع الإلكترونية المخصصة وتطوير واجهات برمجة التطبيقات RESTful APIs.',
      achievements: []
    }
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'بكالوريوس في علوم الحاسب وهندسة البرمجيات',
      institution: 'جامعة الملك سعود',
      year: '2014',
      details: 'مرتبة الشرف مع التركيز على نظم المعلومات والخوارزميات الموزعة.'
    }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'Google Cloud Certified Professional Cloud Architect',
      issuer: 'Google Cloud',
      year: '2023'
    },
    {
      id: 'cert_2',
      name: 'Generative AI & LLM Systems Specialization',
      issuer: 'DeepLearning.AI',
      year: '2024'
    },
    {
      id: 'cert_3',
      name: 'Professional Scrum Master & Agile Leadership',
      issuer: 'Scrum.org',
      year: '2022'
    }
  ],
  languages: [
    { name: 'العربية', level: 'اللغة الأم (Native)' },
    { name: 'الإنجليزية', level: 'طلاقة مهنية كاملة (Full Professional)' }
  ],
  template: 'executive_gold',
  showPhoto: true,
  showContact: true,
  showProjects: true,
  showServices: true,
  showMetrics: true,
  accentColor: '#C5A059'
};

export const initialSolutions: IntegratedSolutionItem[] = [
  {
    id: 'sol_1',
    title: 'منظومة التحول الرقمي وأتمتة المنشآت',
    problemSolved: 'تشتت العمليات اليدوية، بطء إنجاز المعاملات، وفقدان البيانات الدقيقة بين الإدارات المختلفة.',
    includedServices: ['بناء مواقع إلكترونية', 'أنظمة وحلول مؤسسية (ERP/CRM)', 'استشارات الأنظمة المالية'],
    deliverables: [
      'هندسة وتدشين منصة سحابية مركزية مخصصة للعمليات الداخلية.',
      'لوحة مؤشرات أداء تفاعلية (Executive Dashboard) لمتابعة سير العمل لحظياً.',
      'أتمتة دورات الموافقات والمراسلات الرقمية وتكامل قواعد البيانات.',
      'تدريب الكوادر وتوثيق المعايير البرمجية والتشغيلية الكاملة.'
    ],
    targetAudience: 'الشركات الناشئة والمتوسطة، المكاتب المهنية، والمؤسسات الخدمية الساعية للكفاءة التشغيلية.',
    estimatedDuration: '4 إلى 8 أسابيع',
    iconName: 'Workflow',
    badge: 'الأكثر طلباً',
    detailsUrl: '#expertise',
    order: 1,
    featured: true
  },
  {
    id: 'sol_2',
    title: 'باقة الهوية الرقمية ومنصة الحضور المهني',
    problemSolved: 'ضعف التواجد الرقمي والتباين بين الهوية البصرية والموقع الإلكتروني مما يقلل من ثقة العملاء.',
    includedServices: ['تصميم الهوية البصرية', 'صفحة تطبيقات شخصية (محفظة)', 'بناء مواقع إلكترونية'],
    deliverables: [
      'ابتكار هوية بصرية كاملة (الشعار، الألوان، الخطوط، ودليل الاستخدام المعتمد).',
      'برمجة موقع إلكتروني فائق السرعة متوافق بالكامل مع الهواتف ومحركات البحث SEO.',
      'معرض أعمال تفاعلي مخصص لإبراز المشاريع والخدمات بأسلوب عصري جذاب.',
      'ربط منصات التواصل وأدوات التواصل المباشر (WhatsApp, Email, vCard).'
    ],
    targetAudience: 'المستشارون المستقلون، رواد الأعمال، والشركات المهنية الناشئة الراغبة في حضور استثنائي.',
    estimatedDuration: '2 إلى 3 أسابيع',
    iconName: 'Sparkles',
    badge: 'باقة متكاملة',
    detailsUrl: '#expertise',
    order: 2,
    featured: true
  },
  {
    id: 'sol_3',
    title: 'منظومة الاستشارات والحلول المالية الذكية',
    problemSolved: 'صعوبة تتبع التدفقات النقدية بدقة، تراكم القيود المحاسبية، وغياب رؤية مالية استراتيجية واضحة.',
    includedServices: ['استشارات الأنظمة المالية', 'استشارات محاسبية متخصصة', 'أنظمة وحلول مؤسسية (ERP/CRM)'],
    deliverables: [
      'إعادة هيكلة شجرة الحسابات ودورات القيود المحاسبية والمالية للمنشأة.',
      'أتمتة الفواتير الإلكترونية والربط مع بوابات الدفع والأنظمة الضريبية المعتمدة.',
      'بناء نماذج تقارير مالية تفاعلية لمراقبة السيولة وهوامش الأرباح دورياً.',
      'جلسات استشارية دورية لترشيد التكاليف وتطوير كفاءة رأس المال العامل.'
    ],
    targetAudience: 'المؤسسات التجارية، المتاجر الإلكترونية، والمشاريع متسارعة النمو.',
    estimatedDuration: '3 إلى 5 أسابيع',
    iconName: 'TrendingUp',
    badge: 'استراتيجي',
    detailsUrl: '#expertise',
    order: 3,
    featured: false
  },
  {
    id: 'sol_4',
    title: 'استشارات المشاريع المعمارية وحلول التأثيث المتخصص',
    problemSolved: 'هدر الميزانيات واختيار مواد تشطيب وتأثيث غير مطابقة للمواصفات الفنية والبيئية للمشاريع الكبرى.',
    includedServices: ['استشارات تتعلق بحلول الارضيات والمفروشات', 'تصميم الهوية البصرية'],
    deliverables: [
      'إعداد المواصفات الفنية وجداول الكميات (BOQ) للأرضيات والمفروشات العصرية.',
      'مطابقة واختيار المواد الفندقية والسكنية والتجارية مع أفضل المصانع والموردين.',
      'إشراف استشاري فني على مراحل التوريد والتركيب وضمان الجودة.',
      'تنسيق متكامل بين متطلبات التصميم الداخلي والهوية المعمارية للمشروع.'
    ],
    targetAudience: 'أصحاب المشاريع الفندقية، المجمعات السكنية الفاخرة، ومطورو العقارات التجارية.',
    estimatedDuration: 'بحسب نطاق المشروع',
    iconName: 'Compass',
    badge: 'تخصصي',
    detailsUrl: '#expertise',
    order: 4,
    featured: false
  }
];


