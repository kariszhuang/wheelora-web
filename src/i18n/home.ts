import type { LocaleCode } from "./locales";

export type DemoCopy = {
  caption: string;
  hint: string;
  myWheels: string;
  backToList: string;
  quickSpin: string;
  keepSpinning: string;
  spinWheel: string;
  spinAgain: string;
  wheelSpinning: string;
  result: string;
  tone: string;
  themeLabels: { minimal: string; dark: string; playful: string };
  wheel: { name: string; emoji: string; toneLabel: string; toneEmoji: string; prompt: string; options: { label: string; weight: number }[] };
};

export type HomeCopy = {
  title: string;
  description: string;
  nav: { demo: string; howItWorks: string; themes: string; join: string };
  language: string;
  brandTagline: string;
  skipToContent: string;
  hero: { eyebrow: string; lineOne: string; lineTwo: string; lede: string; tryDemo: string; joinList: string; openApp: string; appStore: string };
  demo: DemoCopy;
  proof: string[];
  how: { eyebrow: string; title: string; steps: { title: string; copy: string; alt: string }[] };
  features: { eyebrow: string; title: string; stories: { eyebrow: string; title: string; copy: string; alt: string }[] };
  themes: { eyebrow: string; title: string; copy: string };
  privacy: { eyebrow: string; title: string; copy: string; points: string[]; link: string; alt: string };
  plans: { eyebrow: string; title: string; copy: string; free: { name: string; title: string; points: string[] }; pro: { name: string; title: string; points: string[] } };
  waitlist: { eyebrow: string; title: string; copy: string; email: string; join: string; appTitle: string; appHeading: string; openApp: string; store: string; saving: string; success: string; error: string };
  footer: { tagline: string; links: string[] };
};

const en: HomeCopy = {
  title: "Wheelora™ | AI Decision Wheel for Everyday Choices",
  description: "Turn everyday indecision into one easy next move. Build editable wheels with AI, add optional weights, spin, share, and reuse your best decisions.",
  nav: { demo: "Live demo", howItWorks: "How it works", themes: "Themes", join: "Join waitlist" },
  language: "Language",
  brandTagline: "AI decision app",
  skipToContent: "Skip to content",
  hero: { eyebrow: "AI decision wheel for iPhone", lineOne: "Less circling.", lineTwo: "More doing.", lede: "Turn any choice into one clear next step.", tryDemo: "Try the live wheel", joinList: "Join the launch list", openApp: "Open Wheelora", appStore: "App Store" },
  demo: {
    caption: "Interactive demo", hint: "Tap the center to spin", myWheels: "My Wheels", backToList: "Go back to list", quickSpin: "Quick spin", keepSpinning: "Keep spinning", spinWheel: "Spin wheel", spinAgain: "Spin again", wheelSpinning: "Wheel spinning", result: "Spin for a decision", tone: "AI tone", themeLabels: { minimal: "Minimal", dark: "Dark", playful: "Playful" },
    wheel: { name: "Dinner Rescue", emoji: "🍜", toneLabel: "Friendly", toneEmoji: "😊", prompt: "Friendly tone: what should we eat tonight?", options: [
      { label: "Big noodle bowl comfort", weight: 9 }, { label: "Tacos and a short walk", weight: 8 }, { label: "Breakfast for dinner", weight: 7 }, { label: "Try the saved spot", weight: 5 }, { label: "Cheap tasty default", weight: 8 }, { label: "Cook once, leftovers tomorrow", weight: 6 },
    ] },
  },
  proof: ["AI-assisted", "Weighted spins", "Siri + Shortcuts", "Live share links"],
  how: {
    eyebrow: "How it works", title: "From stuck to decided.",
    steps: [
      { title: "Name the choice", copy: "Type it—or ask Siri.", alt: "Create Wheel screen with a Siri request for dinner ideas" },
      { title: "Shape the options", copy: "Edit every choice and weight.", alt: "AI tone editor showing six tone options" },
      { title: "Spin. Move on.", copy: "One result. One next step.", alt: "Dinner wheel with Soup dumplings selected" },
    ],
  },
  features: {
    eyebrow: "Built for real life", title: "Simple when it should be.",
    stories: [
      { eyebrow: "Multi-wheel planning", title: "Plan the whole thing.", copy: "Spin the place, activity, budget, and time together.", alt: "Weekend planning stack with wheels for location, vibe, and budget" },
      { eyebrow: "Home Screen widget", title: "Spin in one tap.", copy: "Keep a favorite wheel on your Home Screen.", alt: "Quick Spin Home Screen widget setup" },
      { eyebrow: "Share studio", title: "Share the actual wheel.", copy: "Send a result image or a live, spinnable link.", alt: "Share Studio with controls for a result image and live wheel link" },
    ],
  },
  themes: { eyebrow: "Ten visual themes", title: "Pick your mood.", copy: "Calm, playful, bold—or somewhere between." },
  privacy: { eyebrow: "Private by default", title: "Your choices stay yours.", copy: "Start locally. Sign in only when you want sync.", points: ["Guest mode", "Free sync", "Export or delete"], link: "Read the privacy policy", alt: "Privacy settings with data export, account deletion, and ad preferences" },
  plans: {
    eyebrow: "Start free", title: "Pay for more room—not basic use.", copy: "Create, spin, share, and sync for free.",
    free: { name: "Free", title: "Start, spin, sync.", points: ["Guest mode and local wheels", "Core AI allowance", "Signed-in sync and restore", "Minimal and Dark themes"] },
    pro: { name: "Wheelora Pro", title: "More room to decide.", points: ["100 AI decisions every day", "Room for hundreds of saved wheels", "Every theme included"] },
  },
  waitlist: { eyebrow: "Launching on iPhone first", title: "Be first to stop circling.", copy: "Join the list and we’ll email you when Wheelora is ready.", email: "Email address", join: "Join the list", appTitle: "Wheelora for iPhone", appHeading: "Ready to stop circling?", openApp: "Open Wheelora", store: "View on the App Store", saving: "Saving your spot…", success: "You’re on the list. We’ll be in touch.", error: "We couldn’t save that email right now. Please try again." },
  footer: { tagline: "Say it. Spin it. Move forward.", links: ["Product guide", "Developers", "FAQ", "Support", "Privacy", "Data deletion", "Terms"] },
};

const es: HomeCopy = {
  title: "Wheelora™ | Ruleta de decisiones con IA para cada día",
  description: "Convierte la indecisión cotidiana en un siguiente paso claro. Crea ruletas editables con IA, añade pesos opcionales, gira, comparte y reutiliza tus mejores decisiones.",
  nav: { demo: "Demo en vivo", howItWorks: "Cómo funciona", themes: "Temas", join: "Unirme a la lista" },
  language: "Idioma",
  brandTagline: "App de decisiones con IA",
  skipToContent: "Saltar al contenido",
  hero: { eyebrow: "Ruleta de decisiones con IA para iPhone", lineOne: "Menos vueltas.", lineTwo: "Más acción.", lede: "Convierte cualquier elección en un siguiente paso claro.", tryDemo: "Probar la ruleta", joinList: "Unirme a la lista", openApp: "Abrir Wheelora", appStore: "App Store" },
  demo: {
    caption: "Demo interactiva", hint: "Toca el centro para girar", myWheels: "Mis ruletas", backToList: "Volver a la lista", quickSpin: "Giro rápido", keepSpinning: "Seguir girando", spinWheel: "Girar la ruleta", spinAgain: "Girar de nuevo", wheelSpinning: "La ruleta está girando", result: "Gira para decidir", tone: "tono de IA", themeLabels: { minimal: "Minimal", dark: "Dark", playful: "Playful" },
    wheel: { name: "Rescate de cena", emoji: "🍜", toneLabel: "Amable", toneEmoji: "😊", prompt: "Tono amable: ¿qué cenamos esta noche?", options: [
      { label: "Un gran tazón de fideos", weight: 9 }, { label: "Tacos y un paseo corto", weight: 8 }, { label: "Desayuno para cenar", weight: 7 }, { label: "Prueba ese sitio guardado", weight: 5 }, { label: "Algo rico y económico", weight: 8 }, { label: "Cocina una vez, sobras mañana", weight: 6 },
    ] },
  },
  proof: ["Con ayuda de IA", "Giros ponderados", "Siri + Atajos", "Enlaces para compartir"],
  how: {
    eyebrow: "Cómo funciona", title: "De la duda a la decisión.",
    steps: [
      { title: "Nombra la elección", copy: "Escríbela o pídesela a Siri.", alt: "Pantalla Crear ruleta con una petición a Siri de ideas para cenar" },
      { title: "Da forma a las opciones", copy: "Edita cada opción y su peso.", alt: "Editor de tono de IA con seis opciones de tono" },
      { title: "Gira. Sigue adelante.", copy: "Un resultado. Un siguiente paso.", alt: "Ruleta de cena con dumplings de sopa seleccionados" },
    ],
  },
  features: {
    eyebrow: "Hecho para la vida real", title: "Simple cuando debe serlo.",
    stories: [
      { eyebrow: "Planificación con varias ruletas", title: "Organiza el plan completo.", copy: "Gira lugar, actividad, presupuesto y hora a la vez.", alt: "Plan de fin de semana con ruletas de lugar, ambiente y presupuesto" },
      { eyebrow: "Widget de pantalla de inicio", title: "Gira con un toque.", copy: "Mantén una ruleta favorita en tu pantalla de inicio.", alt: "Configuración del widget Giro rápido en la pantalla de inicio" },
      { eyebrow: "Estudio para compartir", title: "Comparte la ruleta real.", copy: "Envía una imagen del resultado o un enlace que se puede girar.", alt: "Estudio para compartir con controles para una imagen de resultado y un enlace de ruleta" },
    ],
  },
  themes: { eyebrow: "Diez temas visuales", title: "Elige tu estado de ánimo.", copy: "Tranquilo, divertido, audaz o algo intermedio." },
  privacy: { eyebrow: "Privado por defecto", title: "Tus elecciones siguen siendo tuyas.", copy: "Empieza en tu dispositivo. Inicia sesión solo si quieres sincronizar.", points: ["Modo invitado", "Sincronización gratis", "Exporta o elimina"], link: "Lee la política de privacidad", alt: "Ajustes de privacidad con exportación de datos, eliminación de cuenta y preferencias de anuncios" },
  plans: {
    eyebrow: "Empieza gratis", title: "Paga por más espacio, no por lo básico.", copy: "Crea, gira, comparte y sincroniza gratis.",
    free: { name: "Gratis", title: "Crea, gira y sincroniza.", points: ["Modo invitado y ruletas locales", "Asignación básica de IA", "Sincronización y restauración al iniciar sesión", "Temas Minimal y Dark"] },
    pro: { name: "Wheelora Pro", title: "Más espacio para decidir.", points: ["100 decisiones con IA cada día", "Espacio para cientos de ruletas guardadas", "Todos los temas incluidos"] },
  },
  waitlist: { eyebrow: "Primero en iPhone", title: "Sé de los primeros en dejar de dar vueltas.", copy: "Únete a la lista y te escribiremos cuando Wheelora esté lista.", email: "Correo electrónico", join: "Unirme a la lista", appTitle: "Wheelora para iPhone", appHeading: "¿Listo para dejar de dar vueltas?", openApp: "Abrir Wheelora", store: "Ver en App Store", saving: "Guardando tu lugar…", success: "Ya estás en la lista. Nos pondremos en contacto.", error: "No pudimos guardar ese correo ahora. Inténtalo de nuevo." },
  footer: { tagline: "Dilo. Gira. Avanza.", links: ["Guía del producto", "Desarrolladores", "Preguntas frecuentes", "Soporte", "Privacidad", "Eliminación de datos", "Términos"] },
};

const zhHans: HomeCopy = {
  title: "Wheelora™ | 日常选择的 AI 决策转盘",
  description: "把日常的犹豫变成清晰的下一步。用 AI 创建可编辑的转盘，设置可选权重，转动、分享并复用你最好的决定。",
  nav: { demo: "在线演示", howItWorks: "使用方式", themes: "主题", join: "加入候补名单" },
  language: "语言",
  brandTagline: "AI 决策应用",
  skipToContent: "跳到内容",
  hero: { eyebrow: "iPhone 上的 AI 决策转盘", lineOne: "少些纠结。", lineTwo: "多些行动。", lede: "把任何选择变成清晰的下一步。", tryDemo: "试试在线转盘", joinList: "加入候补名单", openApp: "打开 Wheelora", appStore: "App Store" },
  demo: {
    caption: "互动演示", hint: "轻点中心开始转动", myWheels: "我的转盘", backToList: "返回列表", quickSpin: "快速转动", keepSpinning: "继续转动", spinWheel: "转动转盘", spinAgain: "再转一次", wheelSpinning: "转盘正在转动", result: "转一下来决定", tone: "AI 语气", themeLabels: { minimal: "简约", dark: "深色", playful: "活泼" },
    wheel: { name: "晚餐救星", emoji: "🍜", toneLabel: "友好", toneEmoji: "😊", prompt: "友好语气：今晚吃什么？", options: [
      { label: "来一大碗暖心面", weight: 9 }, { label: "吃塔可，再散个步", weight: 8 }, { label: "晚餐吃早餐", weight: 7 }, { label: "试试收藏的那家", weight: 5 }, { label: "便宜又好吃的老选择", weight: 8 }, { label: "做一次，明天吃剩菜", weight: 6 },
    ] },
  },
  proof: ["AI 协助", "加权转动", "Siri + 快捷指令", "可分享链接"],
  how: {
    eyebrow: "使用方式", title: "从纠结到决定。",
    steps: [
      { title: "说出选择", copy: "输入它，或问问 Siri。", alt: "通过 Siri 请求晚餐建议的创建转盘界面" },
      { title: "整理选项", copy: "编辑每个选项和权重。", alt: "显示六种语气选项的 AI 语气编辑器" },
      { title: "转一下，继续走。", copy: "一个结果。一个下一步。", alt: "选中小笼包的晚餐转盘" },
    ],
  },
  features: {
    eyebrow: "为真实生活而做", title: "该简单时就简单。",
    stories: [
      { eyebrow: "多转盘规划", title: "把整件事都安排好。", copy: "同时转出地点、活动、预算和时间。", alt: "包含地点、氛围和预算转盘的周末规划组合" },
      { eyebrow: "主屏幕小组件", title: "一点就转。", copy: "把喜欢的转盘放在主屏幕上。", alt: "快速转动主屏幕小组件设置" },
      { eyebrow: "分享工作室", title: "分享真正的转盘。", copy: "发送结果图片，或可亲自转动的链接。", alt: "带结果图片和实时转盘链接控制项的分享工作室" },
    ],
  },
  themes: { eyebrow: "十款视觉主题", title: "选一种心情。", copy: "平静、活泼、大胆，或介于其间。" },
  privacy: { eyebrow: "默认保护隐私", title: "你的选择属于你。", copy: "先在本地开始。需要同步时再登录。", points: ["访客模式", "免费同步", "导出或删除"], link: "阅读隐私政策", alt: "含数据导出、账户删除和广告偏好的隐私设置" },
  plans: {
    eyebrow: "免费开始", title: "为更多空间付费，不为基本功能付费。", copy: "免费创建、转动、分享和同步。",
    free: { name: "免费版", title: "创建、转动、同步。", points: ["访客模式和本地转盘", "基础 AI 额度", "登录后同步与恢复", "简约和深色主题"] },
    pro: { name: "Wheelora Pro", title: "拥有更多决定空间。", points: ["每天 100 次 AI 决策", "可保存数百个转盘", "包含全部主题"] },
  },
  waitlist: { eyebrow: "首先在 iPhone 上推出", title: "率先告别纠结。", copy: "加入名单，Wheelora 准备好后我们会发邮件通知你。", email: "电子邮箱", join: "加入名单", appTitle: "iPhone 版 Wheelora", appHeading: "准备好不再纠结了吗？", openApp: "打开 Wheelora", store: "在 App Store 查看", saving: "正在为你保留名额…", success: "你已加入名单。我们会保持联系。", error: "现在无法保存该邮箱，请再试一次。" },
  footer: { tagline: "说出来。转一下。向前走。", links: ["产品指南", "开发者", "常见问题", "支持", "隐私", "删除数据", "条款"] },
};

const zhHant: HomeCopy = {
  title: "Wheelora™ | 日常選擇的 AI 決策轉盤",
  description: "把日常的猶豫變成清楚的下一步。用 AI 建立可編輯的轉盤，設定選填權重，轉動、分享並重複使用你最好的決定。",
  nav: { demo: "線上示範", howItWorks: "使用方式", themes: "主題", join: "加入候補名單" },
  language: "語言",
  brandTagline: "AI 決策應用程式",
  skipToContent: "跳至內容",
  hero: { eyebrow: "iPhone 上的 AI 決策轉盤", lineOne: "少些糾結。", lineTwo: "多些行動。", lede: "把任何選擇變成清楚的下一步。", tryDemo: "試試線上轉盤", joinList: "加入候補名單", openApp: "開啟 Wheelora", appStore: "App Store" },
  demo: {
    caption: "互動示範", hint: "輕點中心開始轉動", myWheels: "我的轉盤", backToList: "返回列表", quickSpin: "快速轉動", keepSpinning: "繼續轉動", spinWheel: "轉動轉盤", spinAgain: "再轉一次", wheelSpinning: "轉盤正在轉動", result: "轉一下來決定", tone: "AI 語氣", themeLabels: { minimal: "簡約", dark: "深色", playful: "活潑" },
    wheel: { name: "晚餐救星", emoji: "🍜", toneLabel: "友善", toneEmoji: "😊", prompt: "友善語氣：今晚吃什麼？", options: [
      { label: "來一大碗暖心麵", weight: 9 }, { label: "吃塔可，再散個步", weight: 8 }, { label: "晚餐吃早餐", weight: 7 }, { label: "試試收藏的那家", weight: 5 }, { label: "便宜又好吃的老選擇", weight: 8 }, { label: "做一次，明天吃剩菜", weight: 6 },
    ] },
  },
  proof: ["AI 協助", "加權轉動", "Siri + 捷徑", "可分享連結"],
  how: {
    eyebrow: "使用方式", title: "從猶豫到決定。",
    steps: [
      { title: "說出選擇", copy: "輸入它，或問問 Siri。", alt: "透過 Siri 要求晚餐建議的建立轉盤畫面" },
      { title: "整理選項", copy: "編輯每個選項和權重。", alt: "顯示六種語氣選項的 AI 語氣編輯器" },
      { title: "轉一下，繼續走。", copy: "一個結果。一個下一步。", alt: "選中小籠包的晚餐轉盤" },
    ],
  },
  features: {
    eyebrow: "為真實生活而做", title: "該簡單時就簡單。",
    stories: [
      { eyebrow: "多轉盤規劃", title: "把整件事都安排好。", copy: "同時轉出地點、活動、預算和時間。", alt: "包含地點、氛圍和預算轉盤的週末規劃組合" },
      { eyebrow: "主畫面小工具", title: "一點就轉。", copy: "把喜歡的轉盤放在主畫面上。", alt: "快速轉動主畫面小工具設定" },
      { eyebrow: "分享工作室", title: "分享真正的轉盤。", copy: "傳送結果圖片，或可親自轉動的連結。", alt: "帶結果圖片和即時轉盤連結控制項的分享工作室" },
    ],
  },
  themes: { eyebrow: "十款視覺主題", title: "選一種心情。", copy: "平靜、活潑、大膽，或介於其間。" },
  privacy: { eyebrow: "預設保護隱私", title: "你的選擇屬於你。", copy: "先在本機開始。需要同步時再登入。", points: ["訪客模式", "免費同步", "匯出或刪除"], link: "閱讀隱私權政策", alt: "含資料匯出、帳號刪除和廣告偏好的隱私設定" },
  plans: {
    eyebrow: "免費開始", title: "為更多空間付費，不為基本功能付費。", copy: "免費建立、轉動、分享和同步。",
    free: { name: "免費版", title: "建立、轉動、同步。", points: ["訪客模式和本機轉盤", "基本 AI 額度", "登入後同步與還原", "簡約和深色主題"] },
    pro: { name: "Wheelora Pro", title: "擁有更多決定空間。", points: ["每天 100 次 AI 決策", "可儲存數百個轉盤", "包含全部主題"] },
  },
  waitlist: { eyebrow: "首先在 iPhone 上推出", title: "率先告別糾結。", copy: "加入名單，Wheelora 準備好後我們會寄信通知你。", email: "電子郵件", join: "加入名單", appTitle: "iPhone 版 Wheelora", appHeading: "準備好不再糾結了嗎？", openApp: "開啟 Wheelora", store: "在 App Store 查看", saving: "正在為你保留名額…", success: "你已加入名單。我們會保持聯絡。", error: "現在無法儲存該電子郵件，請再試一次。" },
  footer: { tagline: "說出來。轉一下。向前走。", links: ["產品指南", "開發者", "常見問題", "支援", "隱私權", "刪除資料", "條款"] },
};

const ar: HomeCopy = {
  title: "Wheelora™ | عجلة قرارات بالذكاء الاصطناعي للاختيارات اليومية",
  description: "حوّل التردد اليومي إلى خطوة تالية واضحة. أنشئ عجلات قابلة للتعديل بالذكاء الاصطناعي، أضف أوزانًا اختيارية، ودوّر وشارك وكرر أفضل قراراتك.",
  nav: { demo: "تجربة مباشرة", howItWorks: "كيف تعمل", themes: "السمات", join: "انضم إلى القائمة" },
  language: "اللغة",
  brandTagline: "تطبيق قرارات بالذكاء الاصطناعي",
  skipToContent: "انتقل إلى المحتوى",
  hero: { eyebrow: "عجلة قرارات بالذكاء الاصطناعي لـ iPhone", lineOne: "دوران أقل.", lineTwo: "إنجاز أكثر.", lede: "حوّل أي اختيار إلى خطوة تالية واضحة.", tryDemo: "جرّب العجلة", joinList: "انضم إلى القائمة", openApp: "افتح Wheelora", appStore: "App Store" },
  demo: {
    caption: "تجربة تفاعلية", hint: "المس المركز لتدويرها", myWheels: "عجلاتي", backToList: "العودة إلى القائمة", quickSpin: "تدوير سريع", keepSpinning: "تابع التدوير", spinWheel: "دوّر العجلة", spinAgain: "دوّر مجددًا", wheelSpinning: "العجلة تدور", result: "دوّر لتقرر", tone: "— نبرة AI", themeLabels: { minimal: "بسيط", dark: "داكن", playful: "مرح" },
    wheel: { name: "إنقاذ العشاء", emoji: "🍜", toneLabel: "ودودة", toneEmoji: "😊", prompt: "بنبرة ودودة: ماذا نأكل الليلة؟", options: [
      { label: "طبق نودلز كبير ومريح", weight: 9 }, { label: "تاكو ومشوار قصير", weight: 8 }, { label: "فطور على العشاء", weight: 7 }, { label: "جرّب المكان المحفوظ", weight: 5 }, { label: "خيار لذيذ واقتصادي", weight: 8 }, { label: "اطبخ مرة وبقايا للغد", weight: 6 },
    ] },
  },
  proof: ["بمساعدة الذكاء الاصطناعي", "تدوير موزون", "Siri + الاختصارات", "روابط مشاركة مباشرة"],
  how: {
    eyebrow: "كيف تعمل", title: "من التردد إلى القرار.",
    steps: [
      { title: "سمِّ الاختيار", copy: "اكتبه أو اسأل Siri.", alt: "شاشة إنشاء عجلة مع طلب أفكار عشاء من Siri" },
      { title: "رتّب الخيارات", copy: "عدّل كل خيار ووزنه.", alt: "محرر نبرة الذكاء الاصطناعي يعرض ست نبرات" },
      { title: "دوّر وتابع.", copy: "نتيجة واحدة. خطوة واحدة تالية.", alt: "عجلة عشاء اختير فيها دامبلنغ الحساء" },
    ],
  },
  features: {
    eyebrow: "مصممة للحياة الواقعية", title: "بسيطة حين يجب أن تكون كذلك.",
    stories: [
      { eyebrow: "تخطيط متعدد العجلات", title: "خطط للأمر كله.", copy: "دوّر المكان والنشاط والميزانية والوقت معًا.", alt: "تخطيط عطلة نهاية الأسبوع بعجلات للمكان والأجواء والميزانية" },
      { eyebrow: "أداة الشاشة الرئيسية", title: "دوّر بلمسة واحدة.", copy: "احتفظ بعجلتك المفضلة على الشاشة الرئيسية.", alt: "إعداد أداة التدوير السريع للشاشة الرئيسية" },
      { eyebrow: "استوديو المشاركة", title: "شارك العجلة نفسها.", copy: "أرسل صورة النتيجة أو رابطًا قابلًا للتدوير.", alt: "استوديو المشاركة بعناصر تحكم لصورة نتيجة ورابط عجلة مباشر" },
    ],
  },
  themes: { eyebrow: "عشر سمات مرئية", title: "اختر مزاجك.", copy: "هادئ أو مرح أو جريء، أو شيء بين ذلك." },
  privacy: { eyebrow: "خاص افتراضيًا", title: "اختياراتك تبقى لك.", copy: "ابدأ محليًا. سجّل الدخول فقط عندما تريد المزامنة.", points: ["وضع الضيف", "مزامنة مجانية", "تصدير أو حذف"], link: "اقرأ سياسة الخصوصية", alt: "إعدادات الخصوصية مع تصدير البيانات وحذف الحساب وتفضيلات الإعلانات" },
  plans: {
    eyebrow: "ابدأ مجانًا", title: "ادفع لمساحة أكبر، لا للاستخدام الأساسي.", copy: "أنشئ ودوّر وشارك وزامن مجانًا.",
    free: { name: "مجاني", title: "أنشئ، دوّر، زامن.", points: ["وضع الضيف والعجلات المحلية", "حصة أساسية من الذكاء الاصطناعي", "مزامنة واستعادة بعد تسجيل الدخول", "سمتا البسيط والداكن"] },
    pro: { name: "Wheelora Pro", title: "مساحة أكبر للقرار.", points: ["100 قرار بالذكاء الاصطناعي كل يوم", "مساحة لمئات العجلات المحفوظة", "كل السمات مشمولة"] },
  },
  waitlist: { eyebrow: "ينطلق على iPhone أولًا", title: "كن أول من يتوقف عن الدوران.", copy: "انضم إلى القائمة وسنرسل لك بريدًا عند جاهزية Wheelora.", email: "البريد الإلكتروني", join: "انضم إلى القائمة", appTitle: "Wheelora لـ iPhone", appHeading: "مستعد للتوقف عن التردد؟", openApp: "افتح Wheelora", store: "شاهدها على App Store", saving: "نحفظ مكانك…", success: "أنت على القائمة. سنبقى على تواصل.", error: "تعذر حفظ هذا البريد الآن. حاول مرة أخرى." },
  footer: { tagline: "قلها. دوّرها. تقدّم.", links: ["دليل المنتج", "للمطورين", "الأسئلة الشائعة", "الدعم", "الخصوصية", "حذف البيانات", "الشروط"] },
};

const fr: HomeCopy = {
  title: "Wheelora™ | Roue de décision IA pour les choix du quotidien",
  description: "Transforme les hésitations du quotidien en une prochaine étape claire. Crée des roues modifiables avec l’IA, ajoute des pondérations, tourne, partage et réutilise tes meilleures décisions.",
  nav: { demo: "Démo en direct", howItWorks: "Comment ça marche", themes: "Thèmes", join: "Rejoindre la liste" },
  language: "Langue",
  brandTagline: "Application de décision IA",
  skipToContent: "Aller au contenu",
  hero: { eyebrow: "Roue de décision IA pour iPhone", lineOne: "Moins d’hésitation.", lineTwo: "Plus d’action.", lede: "Transforme chaque choix en une prochaine étape claire.", tryDemo: "Essayer la roue", joinList: "Rejoindre la liste", openApp: "Ouvrir Wheelora", appStore: "App Store" },
  demo: {
    caption: "Démo interactive", hint: "Touche le centre pour tourner", myWheels: "Mes roues", backToList: "Retour à la liste", quickSpin: "Tour rapide", keepSpinning: "Continuer à tourner", spinWheel: "Tourner la roue", spinAgain: "Tourner encore", wheelSpinning: "La roue tourne", result: "Tourne pour décider", tone: "ton IA", themeLabels: { minimal: "Minimal", dark: "Sombre", playful: "Ludique" },
    wheel: { name: "Sauvetage du dîner", emoji: "🍜", toneLabel: "Amical", toneEmoji: "😊", prompt: "Ton amical : qu’est-ce qu’on mange ce soir ?", options: [
      { label: "Un grand bol de nouilles réconfortant", weight: 9 }, { label: "Tacos et petite balade", weight: 8 }, { label: "Petit-déjeuner au dîner", weight: 7 }, { label: "Essayer l’adresse enregistrée", weight: 5 }, { label: "Le choix bon et pas cher", weight: 8 }, { label: "Cuisiner une fois, restes demain", weight: 6 },
    ] },
  },
  proof: ["Avec l’aide de l’IA", "Tours pondérés", "Siri + Raccourcis", "Liens de partage en direct"],
  how: {
    eyebrow: "Comment ça marche", title: "De l’hésitation à la décision.",
    steps: [
      { title: "Nomme le choix", copy: "Écris-le, ou demande à Siri.", alt: "Écran Créer une roue avec une demande Siri d’idées de dîner" },
      { title: "Façonne les options", copy: "Modifie chaque choix et son poids.", alt: "Éditeur de ton IA présentant six options de ton" },
      { title: "Tourne. Avance.", copy: "Un résultat. Une prochaine étape.", alt: "Roue du dîner avec des raviolis chinois sélectionnés" },
    ],
  },
  features: {
    eyebrow: "Pensé pour la vraie vie", title: "Simple quand il le faut.",
    stories: [
      { eyebrow: "Planification multi-roues", title: "Prévois tout le programme.", copy: "Tire le lieu, l’activité, le budget et l’heure ensemble.", alt: "Planification du week-end avec des roues pour le lieu, l’ambiance et le budget" },
      { eyebrow: "Widget d’écran d’accueil", title: "Tourne en un geste.", copy: "Garde une roue favorite sur ton écran d’accueil.", alt: "Configuration du widget Tour rapide pour l’écran d’accueil" },
      { eyebrow: "Studio de partage", title: "Partage la vraie roue.", copy: "Envoie une image du résultat ou un lien qu’on peut faire tourner.", alt: "Studio de partage avec des commandes pour une image de résultat et un lien de roue en direct" },
    ],
  },
  themes: { eyebrow: "Dix thèmes visuels", title: "Choisis ton ambiance.", copy: "Calme, ludique, audacieuse — ou entre les deux." },
  privacy: { eyebrow: "Privé par défaut", title: "Tes choix restent les tiens.", copy: "Commence en local. Connecte-toi seulement si tu veux synchroniser.", points: ["Mode invité", "Synchronisation gratuite", "Exporter ou supprimer"], link: "Lire la politique de confidentialité", alt: "Réglages de confidentialité avec export des données, suppression du compte et préférences publicitaires" },
  plans: {
    eyebrow: "Commence gratuitement", title: "Paie pour plus d’espace, pas pour l’essentiel.", copy: "Crée, tourne, partage et synchronise gratuitement.",
    free: { name: "Gratuit", title: "Crée, tourne, synchronise.", points: ["Mode invité et roues locales", "Quota IA de base", "Synchronisation et restauration après connexion", "Thèmes Minimal et Sombre"] },
    pro: { name: "Wheelora Pro", title: "Plus de place pour décider.", points: ["100 décisions IA chaque jour", "De la place pour des centaines de roues enregistrées", "Tous les thèmes inclus"] },
  },
  waitlist: { eyebrow: "D’abord sur iPhone", title: "Sois parmi les premiers à arrêter de tourner en rond.", copy: "Rejoins la liste et nous t’écrirons quand Wheelora sera prête.", email: "Adresse e-mail", join: "Rejoindre la liste", appTitle: "Wheelora pour iPhone", appHeading: "Prêt à arrêter de tourner en rond ?", openApp: "Ouvrir Wheelora", store: "Voir dans l’App Store", saving: "Nous réservons ta place…", success: "Tu es sur la liste. Nous te tiendrons au courant.", error: "Impossible d’enregistrer cet e-mail pour le moment. Réessaie." },
  footer: { tagline: "Dis-le. Tourne. Avance.", links: ["Guide produit", "Développeurs", "FAQ", "Assistance", "Confidentialité", "Suppression des données", "Conditions"] },
};

const de: HomeCopy = {
  title: "Wheelora™ | KI-Entscheidungsrad für den Alltag",
  description: "Mach aus alltäglichem Zögern einen klaren nächsten Schritt. Erstelle mit KI bearbeitbare Entscheidungsräder, gewichte Optionen, drehe, teile und nutze gute Entscheidungen erneut.",
  nav: { demo: "Live-Demo", howItWorks: "So funktioniert’s", themes: "Designs", join: "Auf die Warteliste" },
  language: "Sprache",
  brandTagline: "KI-App für Entscheidungen",
  skipToContent: "Zum Inhalt springen",
  hero: { eyebrow: "KI-Entscheidungsrad für iPhone", lineOne: "Weniger grübeln.", lineTwo: "Mehr machen.", lede: "Mach aus jeder Wahl einen klaren nächsten Schritt.", tryDemo: "Live-Rad testen", joinList: "Auf die Warteliste", openApp: "Wheelora öffnen", appStore: "App Store" },
  demo: {
    caption: "Interaktive Demo", hint: "Zum Drehen die Mitte antippen", myWheels: "Meine Räder", backToList: "Zurück zur Liste", quickSpin: "Schnell drehen", keepSpinning: "Weiterdrehen", spinWheel: "Rad drehen", spinAgain: "Noch einmal drehen", wheelSpinning: "Das Rad dreht sich", result: "Drehen und entscheiden", tone: "KI-Ton", themeLabels: { minimal: "Minimal", dark: "Dunkel", playful: "Verspielt" },
    wheel: { name: "Abendessen-Retter", emoji: "🍜", toneLabel: "Freundlich", toneEmoji: "😊", prompt: "Freundlicher Ton: Was gibt’s heute Abend?", options: [
      { label: "Eine große Schüssel Nudeln", weight: 9 }, { label: "Tacos und eine kleine Runde", weight: 8 }, { label: "Frühstück zum Abendessen", weight: 7 }, { label: "Den gespeicherten Laden testen", weight: 5 }, { label: "Günstig und immer lecker", weight: 8 }, { label: "Einmal kochen, morgen Reste", weight: 6 },
    ] },
  },
  proof: ["KI-unterstützt", "Gewichtete Drehungen", "Siri + Kurzbefehle", "Teilbare Live-Links"],
  how: {
    eyebrow: "So funktioniert’s", title: "Vom Grübeln zur Entscheidung.",
    steps: [
      { title: "Entscheidung benennen", copy: "Eintippen oder Siri fragen.", alt: "Bildschirm zum Erstellen eines Rads mit einer Siri-Anfrage nach Ideen fürs Abendessen" },
      { title: "Optionen gestalten", copy: "Jede Auswahl und Gewichtung anpassen.", alt: "KI-Ton-Editor mit sechs Tonoptionen" },
      { title: "Drehen. Weitermachen.", copy: "Ein Ergebnis. Ein nächster Schritt.", alt: "Abendessen-Rad mit ausgewählten Suppen-Dumplings" },
    ],
  },
  features: {
    eyebrow: "Fürs echte Leben", title: "Einfach, wenn es einfach sein soll.",
    stories: [
      { eyebrow: "Planen mit mehreren Rädern", title: "Den ganzen Plan festlegen.", copy: "Ort, Aktivität, Budget und Zeit gemeinsam drehen.", alt: "Wochenendplanung mit Rädern für Ort, Stimmung und Budget" },
      { eyebrow: "Home-Bildschirm-Widget", title: "Mit einem Tipp drehen.", copy: "Ein Lieblingsrad direkt auf dem Home-Bildschirm behalten.", alt: "Einrichtung des Schnell-drehen-Widgets auf dem Home-Bildschirm" },
      { eyebrow: "Teilen-Studio", title: "Das echte Rad teilen.", copy: "Ergebnisbild oder direkt drehbaren Link senden.", alt: "Teilen-Studio mit Optionen für Ergebnisbild und Live-Link" },
    ],
  },
  themes: { eyebrow: "Zehn visuelle Designs", title: "Passend zu deiner Stimmung.", copy: "Ruhig, verspielt, markant – oder irgendwo dazwischen." },
  privacy: { eyebrow: "Standardmäßig privat", title: "Deine Entscheidungen bleiben deine.", copy: "Lokal loslegen. Nur zum Synchronisieren anmelden.", points: ["Gastmodus", "Kostenlose Synchronisierung", "Exportieren oder löschen"], link: "Datenschutzerklärung lesen", alt: "Datenschutzeinstellungen mit Datenexport, Kontolöschung und Werbeoptionen" },
  plans: {
    eyebrow: "Kostenlos starten", title: "Für mehr Platz zahlen, nicht für Grundfunktionen.", copy: "Kostenlos erstellen, drehen, teilen und synchronisieren.",
    free: { name: "Kostenlos", title: "Erstellen, drehen, synchronisieren.", points: ["Gastmodus und lokale Räder", "KI-Grundkontingent", "Synchronisierung und Wiederherstellung nach Anmeldung", "Designs Minimal und Dunkel"] },
    pro: { name: "Wheelora Pro", title: "Mehr Platz zum Entscheiden.", points: ["100 KI-Entscheidungen pro Tag", "Platz für Hunderte gespeicherte Räder", "Alle Designs enthalten"] },
  },
  waitlist: { eyebrow: "Zuerst fürs iPhone", title: "Raus aus der Grübelschleife.", copy: "Trag dich ein. Wir mailen dir, sobald Wheelora bereit ist.", email: "E-Mail-Adresse", join: "Eintragen", appTitle: "Wheelora fürs iPhone", appHeading: "Bereit, nicht länger zu grübeln?", openApp: "Wheelora öffnen", store: "Im App Store ansehen", saving: "Dein Platz wird gespeichert…", success: "Du bist auf der Liste. Wir melden uns.", error: "Diese E-Mail konnte gerade nicht gespeichert werden. Versuch es noch einmal." },
  footer: { tagline: "Sag es. Dreh. Mach weiter.", links: ["Produktguide", "Entwickler", "FAQ", "Support", "Datenschutz", "Daten löschen", "Bedingungen"] },
};

const it: HomeCopy = {
  title: "Wheelora™ | Ruota decisionale con IA per le scelte di ogni giorno",
  description: "Trasforma l’indecisione quotidiana in un prossimo passo chiaro. Crea ruote modificabili con l’IA, aggiungi pesi facoltativi, gira, condividi e riusa le decisioni migliori.",
  nav: { demo: "Demo live", howItWorks: "Come funziona", themes: "Temi", join: "Lista d’attesa" },
  language: "Lingua",
  brandTagline: "App decisionale con IA",
  skipToContent: "Vai al contenuto",
  hero: { eyebrow: "Ruota decisionale con IA per iPhone", lineOne: "Meno indecisione.", lineTwo: "Più azione.", lede: "Trasforma ogni scelta in un prossimo passo chiaro.", tryDemo: "Prova la ruota", joinList: "Unisciti alla lista", openApp: "Apri Wheelora", appStore: "App Store" },
  demo: {
    caption: "Demo interattiva", hint: "Tocca il centro per girare", myWheels: "Le mie ruote", backToList: "Torna all’elenco", quickSpin: "Giro rapido", keepSpinning: "Continua a girare", spinWheel: "Gira la ruota", spinAgain: "Gira di nuovo", wheelSpinning: "La ruota sta girando", result: "Gira per decidere", tone: "tono IA", themeLabels: { minimal: "Minimal", dark: "Scuro", playful: "Giocoso" },
    wheel: { name: "Cena salvata", emoji: "🍜", toneLabel: "Amichevole", toneEmoji: "😊", prompt: "Tono amichevole: cosa mangiamo stasera?", options: [
      { label: "Una bella ciotola di noodles", weight: 9 }, { label: "Tacos e una passeggiata", weight: 8 }, { label: "Colazione per cena", weight: 7 }, { label: "Prova il posto salvato", weight: 5 }, { label: "La scelta buona ed economica", weight: 8 }, { label: "Cucina una volta, avanzi domani", weight: 6 },
    ] },
  },
  proof: ["Con l’aiuto dell’IA", "Giri ponderati", "Siri + Comandi Rapidi", "Link live da condividere"],
  how: {
    eyebrow: "Come funziona", title: "Dal dubbio alla decisione.",
    steps: [
      { title: "Dai un nome alla scelta", copy: "Scrivila oppure chiedi a Siri.", alt: "Schermata Crea ruota con una richiesta a Siri di idee per cena" },
      { title: "Definisci le opzioni", copy: "Modifica ogni scelta e il suo peso.", alt: "Editor del tono IA con sei opzioni" },
      { title: "Gira. Vai avanti.", copy: "Un risultato. Un prossimo passo.", alt: "Ruota della cena con ravioli in brodo selezionati" },
    ],
  },
  features: {
    eyebrow: "Pensata per la vita vera", title: "Semplice quando serve.",
    stories: [
      { eyebrow: "Pianificazione con più ruote", title: "Organizza tutto.", copy: "Gira insieme luogo, attività, budget e orario.", alt: "Piano per il weekend con ruote per luogo, atmosfera e budget" },
      { eyebrow: "Widget schermata Home", title: "Gira con un tocco.", copy: "Tieni una ruota preferita sulla schermata Home.", alt: "Configurazione del widget Giro rapido sulla schermata Home" },
      { eyebrow: "Studio di condivisione", title: "Condividi la ruota vera.", copy: "Invia l’immagine del risultato o un link che si può girare.", alt: "Studio di condivisione con controlli per immagine del risultato e link live" },
    ],
  },
  themes: { eyebrow: "Dieci temi visivi", title: "Scegli l’atmosfera.", copy: "Calma, giocosa, decisa o una via di mezzo." },
  privacy: { eyebrow: "Privata per impostazione predefinita", title: "Le tue scelte restano tue.", copy: "Inizia in locale. Accedi solo quando vuoi sincronizzare.", points: ["Modalità ospite", "Sincronizzazione gratuita", "Esporta o elimina"], link: "Leggi l’informativa sulla privacy", alt: "Impostazioni privacy con esportazione dati, eliminazione account e preferenze annunci" },
  plans: {
    eyebrow: "Inizia gratis", title: "Paga per più spazio, non per le funzioni base.", copy: "Crea, gira, condividi e sincronizza gratis.",
    free: { name: "Gratis", title: "Crea, gira, sincronizza.", points: ["Modalità ospite e ruote locali", "Quota IA di base", "Sincronizzazione e ripristino dopo l’accesso", "Temi Minimal e Scuro"] },
    pro: { name: "Wheelora Pro", title: "Più spazio per decidere.", points: ["100 decisioni IA al giorno", "Spazio per centinaia di ruote salvate", "Tutti i temi inclusi"] },
  },
  waitlist: { eyebrow: "Prima su iPhone", title: "Smetti per primo di girare in tondo.", copy: "Unisciti alla lista e ti scriveremo quando Wheelora sarà pronta.", email: "Indirizzo email", join: "Unisciti alla lista", appTitle: "Wheelora per iPhone", appHeading: "Pronto a smettere di girare in tondo?", openApp: "Apri Wheelora", store: "Vedi su App Store", saving: "Stiamo salvando il tuo posto…", success: "Sei nella lista. Ti terremo aggiornato.", error: "Non riusciamo a salvare questa email ora. Riprova." },
  footer: { tagline: "Dillo. Gira. Vai avanti.", links: ["Guida al prodotto", "Sviluppatori", "FAQ", "Assistenza", "Privacy", "Eliminazione dati", "Termini"] },
};

const nl: HomeCopy = {
  title: "Wheelora™ | AI-keuzewiel voor alledaagse keuzes",
  description: "Maak van dagelijkse twijfel één duidelijke volgende stap. Bouw met AI bewerkbare keuzewielen, voeg optionele weging toe, draai, deel en hergebruik je beste beslissingen.",
  nav: { demo: "Live demo", howItWorks: "Zo werkt het", themes: "Thema’s", join: "Op de wachtlijst" },
  language: "Taal",
  brandTagline: "AI-app voor beslissingen",
  skipToContent: "Ga naar de inhoud",
  hero: { eyebrow: "AI-keuzewiel voor iPhone", lineOne: "Minder twijfelen.", lineTwo: "Meer doen.", lede: "Maak van elke keuze één duidelijke volgende stap.", tryDemo: "Probeer het wiel", joinList: "Op de wachtlijst", openApp: "Open Wheelora", appStore: "App Store" },
  demo: {
    caption: "Interactieve demo", hint: "Tik op het midden om te draaien", myWheels: "Mijn keuzewielen", backToList: "Terug naar de lijst", quickSpin: "Snel draaien", keepSpinning: "Blijf draaien", spinWheel: "Draai het wiel", spinAgain: "Draai opnieuw", wheelSpinning: "Het wiel draait", result: "Draai om te kiezen", tone: "AI-toon", themeLabels: { minimal: "Minimal", dark: "Donker", playful: "Speels" },
    wheel: { name: "Dinerredder", emoji: "🍜", toneLabel: "Vriendelijk", toneEmoji: "😊", prompt: "Vriendelijke toon: wat eten we vanavond?", options: [
      { label: "Een grote kom noedels", weight: 9 }, { label: "Taco’s en een kort rondje", weight: 8 }, { label: "Ontbijt als avondeten", weight: 7 }, { label: "Probeer die opgeslagen plek", weight: 5 }, { label: "Goedkoop en altijd lekker", weight: 8 }, { label: "Eén keer koken, morgen restjes", weight: 6 },
    ] },
  },
  proof: ["Met hulp van AI", "Gewogen draaien", "Siri + Opdrachten", "Deelbare live-links"],
  how: {
    eyebrow: "Zo werkt het", title: "Van vastzitten naar kiezen.",
    steps: [
      { title: "Noem de keuze", copy: "Typ hem in of vraag het Siri.", alt: "Scherm om een keuzewiel te maken met een Siri-vraag om ideeën voor het avondeten" },
      { title: "Bepaal de opties", copy: "Pas elke keuze en weging aan.", alt: "AI-tooneditor met zes toonopties" },
      { title: "Draai. Ga verder.", copy: "Eén uitkomst. Eén volgende stap.", alt: "Dinerwiel waarop soepdumplings zijn gekozen" },
    ],
  },
  features: {
    eyebrow: "Voor het echte leven", title: "Eenvoudig wanneer dat nodig is.",
    stories: [
      { eyebrow: "Plannen met meerdere wielen", title: "Plan het hele uitje.", copy: "Draai tegelijk voor plek, activiteit, budget en tijd.", alt: "Weekendplanning met wielen voor locatie, sfeer en budget" },
      { eyebrow: "Beginschermwidget", title: "Draai met één tik.", copy: "Zet een favoriet wiel op je beginscherm.", alt: "Instelling van de Snel draaien-widget voor het beginscherm" },
      { eyebrow: "Deelstudio", title: "Deel het echte wiel.", copy: "Stuur een resultaatfoto of een link die anderen kunnen draaien.", alt: "Deelstudio met opties voor een resultaatfoto en live wiellink" },
    ],
  },
  themes: { eyebrow: "Tien visuele thema’s", title: "Kies je sfeer.", copy: "Rustig, speels, krachtig of iets ertussenin." },
  privacy: { eyebrow: "Standaard privé", title: "Jouw keuzes blijven van jou.", copy: "Begin lokaal. Log pas in als je wilt synchroniseren.", points: ["Gastmodus", "Gratis synchronisatie", "Exporteren of verwijderen"], link: "Lees het privacybeleid", alt: "Privacy-instellingen met gegevensexport, accountverwijdering en advertentievoorkeuren" },
  plans: {
    eyebrow: "Begin gratis", title: "Betaal voor meer ruimte, niet voor de basis.", copy: "Maak, draai, deel en synchroniseer gratis.",
    free: { name: "Gratis", title: "Maak, draai, synchroniseer.", points: ["Gastmodus en lokale wielen", "Basisquotum voor AI", "Synchronisatie en herstel na inloggen", "Thema’s Minimal en Donker"] },
    pro: { name: "Wheelora Pro", title: "Meer ruimte om te kiezen.", points: ["100 AI-beslissingen per dag", "Ruimte voor honderden opgeslagen wielen", "Alle thema’s inbegrepen"] },
  },
  waitlist: { eyebrow: "Eerst op iPhone", title: "Stop als eerste met rondjes denken.", copy: "Schrijf je in. We mailen je zodra Wheelora klaar is.", email: "E-mailadres", join: "Schrijf me in", appTitle: "Wheelora voor iPhone", appHeading: "Klaar om niet langer rondjes te denken?", openApp: "Open Wheelora", store: "Bekijk in de App Store", saving: "Je plek wordt opgeslagen…", success: "Je staat op de lijst. We houden je op de hoogte.", error: "Dit e-mailadres kon nu niet worden opgeslagen. Probeer het opnieuw." },
  footer: { tagline: "Zeg het. Draai. Ga verder.", links: ["Productgids", "Ontwikkelaars", "Veelgestelde vragen", "Support", "Privacy", "Gegevens verwijderen", "Voorwaarden"] },
};

const ru: HomeCopy = {
  title: "Wheelora™ | ИИ-колесо решений для повседневных задач",
  description: "Превращайте повседневные сомнения в понятный следующий шаг. Создавайте редактируемые колёса с помощью ИИ, задавайте веса, крутите, делитесь и возвращайтесь к удачным решениям.",
  nav: { demo: "Демо", howItWorks: "Как это работает", themes: "Темы", join: "Лист ожидания" },
  language: "Язык",
  brandTagline: "Приложение для решений с ИИ",
  skipToContent: "Перейти к содержанию",
  hero: { eyebrow: "ИИ-колесо решений для iPhone", lineOne: "Меньше сомнений.", lineTwo: "Больше действий.", lede: "Превратите любой выбор в понятный следующий шаг.", tryDemo: "Попробовать колесо", joinList: "В лист ожидания", openApp: "Открыть Wheelora", appStore: "App Store" },
  demo: {
    caption: "Интерактивное демо", hint: "Нажмите на центр, чтобы крутить", myWheels: "Мои колёса", backToList: "Назад к списку", quickSpin: "Быстро крутить", keepSpinning: "Крутить дальше", spinWheel: "Крутить колесо", spinAgain: "Крутить ещё раз", wheelSpinning: "Колесо вращается", result: "Крутите и решайте", tone: "тон ИИ", themeLabels: { minimal: "Минимализм", dark: "Тёмная", playful: "Игривая" },
    wheel: { name: "Спасаем ужин", emoji: "🍜", toneLabel: "Дружелюбный", toneEmoji: "😊", prompt: "Дружелюбный тон: что съесть сегодня вечером?", options: [
      { label: "Большая тарелка лапши", weight: 9 }, { label: "Тако и короткая прогулка", weight: 8 }, { label: "Завтрак на ужин", weight: 7 }, { label: "Попробовать сохранённое место", weight: 5 }, { label: "Недорого и всегда вкусно", weight: 8 }, { label: "Приготовить раз, доесть завтра", weight: 6 },
    ] },
  },
  proof: ["С помощью ИИ", "Взвешенный выбор", "Siri + Команды", "Живые ссылки"],
  how: {
    eyebrow: "Как это работает", title: "От сомнений к решению.",
    steps: [
      { title: "Назовите выбор", copy: "Введите его или спросите Siri.", alt: "Экран создания колеса с запросом Siri об идеях для ужина" },
      { title: "Настройте варианты", copy: "Измените каждый вариант и его вес.", alt: "Редактор тона ИИ с шестью вариантами" },
      { title: "Крутите. Двигайтесь дальше.", copy: "Один результат. Один следующий шаг.", alt: "Колесо ужина с выбранными суповыми пельменями" },
    ],
  },
  features: {
    eyebrow: "Для реальной жизни", title: "Просто, когда это важно.",
    stories: [
      { eyebrow: "Планирование несколькими колёсами", title: "Соберите весь план.", copy: "Выберите место, занятие, бюджет и время за один раз.", alt: "План выходных с колёсами места, настроения и бюджета" },
      { eyebrow: "Виджет главного экрана", title: "Один тап — и колесо крутится.", copy: "Держите любимое колесо на главном экране.", alt: "Настройка виджета быстрого вращения на главном экране" },
      { eyebrow: "Студия публикации", title: "Поделитесь самим колесом.", copy: "Отправьте картинку результата или ссылку, которую можно крутить.", alt: "Студия публикации с настройками картинки результата и живой ссылки" },
    ],
  },
  themes: { eyebrow: "Десять визуальных тем", title: "Выберите настроение.", copy: "Спокойное, игривое, смелое — или что-то среднее." },
  privacy: { eyebrow: "Приватность по умолчанию", title: "Ваш выбор остаётся вашим.", copy: "Начните локально. Войдите, только если нужна синхронизация.", points: ["Гостевой режим", "Бесплатная синхронизация", "Экспорт или удаление"], link: "Прочитать политику конфиденциальности", alt: "Настройки приватности с экспортом данных, удалением аккаунта и рекламными предпочтениями" },
  plans: {
    eyebrow: "Начните бесплатно", title: "Платите за большее пространство, а не за основы.", copy: "Создавайте, крутите, делитесь и синхронизируйте бесплатно.",
    free: { name: "Бесплатно", title: "Создавайте, крутите, синхронизируйте.", points: ["Гостевой режим и локальные колёса", "Базовый лимит ИИ", "Синхронизация и восстановление после входа", "Темы «Минимализм» и «Тёмная»"] },
    pro: { name: "Wheelora Pro", title: "Больше места для решений.", points: ["100 ИИ-решений каждый день", "Сотни сохранённых колёс", "Все темы включены"] },
  },
  waitlist: { eyebrow: "Сначала на iPhone", title: "Перестаньте ходить по кругу.", copy: "Запишитесь, и мы напишем, когда Wheelora будет готова.", email: "Электронная почта", join: "Записаться", appTitle: "Wheelora для iPhone", appHeading: "Готовы перестать ходить по кругу?", openApp: "Открыть Wheelora", store: "Посмотреть в App Store", saving: "Сохраняем ваше место…", success: "Вы в списке. Мы сообщим о запуске.", error: "Сейчас не удалось сохранить адрес. Попробуйте ещё раз." },
  footer: { tagline: "Скажите. Крутите. Двигайтесь дальше.", links: ["О продукте", "Разработчикам", "Вопросы и ответы", "Поддержка", "Конфиденциальность", "Удаление данных", "Условия"] },
};

const ja: HomeCopy = {
  title: "Wheelora™ | 毎日の選択を助けるAI決定ルーレット",
  description: "日々の迷いを、わかりやすい次の一歩に変えましょう。AIで編集できるルーレットを作り、必要に応じて重みを付け、回して共有し、良い決め方を何度でも使えます。",
  nav: { demo: "ライブデモ", howItWorks: "使い方", themes: "テーマ", join: "ウェイトリスト" },
  language: "言語",
  brandTagline: "AI決定アプリ",
  skipToContent: "本文へ移動",
  hero: { eyebrow: "iPhone向けAI決定ルーレット", lineOne: "迷う時間を減らす。", lineTwo: "動く時間を増やす。", lede: "どんな選択も、わかりやすい次の一歩に。", tryDemo: "ルーレットを試す", joinList: "ウェイトリストに登録", openApp: "Wheeloraを開く", appStore: "App Store" },
  demo: {
    caption: "操作できるデモ", hint: "中央をタップして回す", myWheels: "マイルーレット", backToList: "一覧に戻る", quickSpin: "クイックスピン", keepSpinning: "さらに回す", spinWheel: "ルーレットを回す", spinAgain: "もう一度回す", wheelSpinning: "ルーレットが回転中", result: "回して決める", tone: "AIトーン", themeLabels: { minimal: "ミニマル", dark: "ダーク", playful: "プレイフル" },
    wheel: { name: "夕食レスキュー", emoji: "🍜", toneLabel: "親しみやすい", toneEmoji: "😊", prompt: "親しみやすいトーン：今夜は何を食べる？", options: [
      { label: "ほっとする大盛り麺", weight: 9 }, { label: "タコスと少し散歩", weight: 8 }, { label: "夕食に朝ごはん", weight: 7 }, { label: "保存したお店に行く", weight: 5 }, { label: "安くておいしい定番", weight: 8 }, { label: "多めに作って明日も食べる", weight: 6 },
    ] },
  },
  proof: ["AIがお手伝い", "重み付き抽選", "Siri + ショートカット", "共有できるライブリンク"],
  how: {
    eyebrow: "使い方", title: "迷いから決定へ。",
    steps: [
      { title: "決めたいことを入力", copy: "入力するか、Siriに話しかけます。", alt: "Siriに夕食の候補を頼むルーレット作成画面" },
      { title: "選択肢を整える", copy: "各候補と重みを編集します。", alt: "6種類のAIトーンを表示した編集画面" },
      { title: "回して、次へ。", copy: "結果はひとつ。次の一歩もひとつ。", alt: "小籠包が選ばれた夕食ルーレット" },
    ],
  },
  features: {
    eyebrow: "日常で使いやすく", title: "必要なときに、ちゃんとシンプル。",
    stories: [
      { eyebrow: "複数ルーレットで計画", title: "予定をまとめて決める。", copy: "場所、過ごし方、予算、時間を一緒に決められます。", alt: "場所、雰囲気、予算のルーレットを重ねた週末プラン" },
      { eyebrow: "ホーム画面ウィジェット", title: "1タップで回す。", copy: "お気に入りのルーレットをホーム画面に置けます。", alt: "クイックスピンのホーム画面ウィジェット設定" },
      { eyebrow: "共有スタジオ", title: "ルーレットごと共有。", copy: "結果画像、または相手も回せるリンクを送れます。", alt: "結果画像とライブリンクを設定できる共有スタジオ" },
    ],
  },
  themes: { eyebrow: "10種類のビジュアルテーマ", title: "気分に合わせて選ぶ。", copy: "落ち着き、遊び心、大胆さ。その間も選べます。" },
  privacy: { eyebrow: "初期設定からプライベート", title: "選択は、あなたのもの。", copy: "まずは端末内で。同期したいときだけサインイン。", points: ["ゲストモード", "無料同期", "エクスポートまたは削除"], link: "プライバシーポリシーを読む", alt: "データの書き出し、アカウント削除、広告設定があるプライバシー画面" },
  plans: {
    eyebrow: "無料でスタート", title: "基本機能ではなく、必要な容量にだけ課金。", copy: "作成、抽選、共有、同期は無料です。",
    free: { name: "無料", title: "作って、回して、同期。", points: ["ゲストモードと端末内ルーレット", "基本のAI利用枠", "サインイン後の同期と復元", "ミニマルとダークのテーマ"] },
    pro: { name: "Wheelora Pro", title: "もっと余裕を持って決める。", points: ["毎日100回のAI決定", "数百件のルーレットを保存", "すべてのテーマを利用可能"] },
  },
  waitlist: { eyebrow: "まずはiPhoneから", title: "迷い続ける時間を終わらせよう。", copy: "登録すると、Wheeloraの準備ができたときにメールでお知らせします。", email: "メールアドレス", join: "登録する", appTitle: "iPhone版Wheelora", appHeading: "そろそろ迷うのをやめませんか？", openApp: "Wheeloraを開く", store: "App Storeで見る", saving: "登録しています…", success: "登録できました。準備ができたらお知らせします。", error: "現在このメールアドレスを登録できません。もう一度お試しください。" },
  footer: { tagline: "話す。回す。前に進む。", links: ["製品ガイド", "開発者向け", "よくある質問", "サポート", "プライバシー", "データ削除", "利用規約"] },
};

const ko: HomeCopy = {
  title: "Wheelora™ | 일상의 선택을 돕는 AI 결정 룰렛",
  description: "일상의 망설임을 분명한 다음 행동으로 바꿔 보세요. AI로 편집 가능한 룰렛을 만들고, 필요하면 가중치를 더해 돌리고 공유하며 좋은 결정을 다시 활용할 수 있습니다.",
  nav: { demo: "라이브 데모", howItWorks: "사용 방법", themes: "테마", join: "대기 명단" },
  language: "언어",
  brandTagline: "AI 결정 앱",
  skipToContent: "본문으로 이동",
  hero: { eyebrow: "iPhone용 AI 결정 룰렛", lineOne: "고민은 짧게.", lineTwo: "실행은 빠르게.", lede: "어떤 선택이든 분명한 다음 행동으로 바꿔 보세요.", tryDemo: "룰렛 체험하기", joinList: "대기 명단 등록", openApp: "Wheelora 열기", appStore: "App Store" },
  demo: {
    caption: "인터랙티브 데모", hint: "가운데를 눌러 돌리세요", myWheels: "내 룰렛", backToList: "목록으로 돌아가기", quickSpin: "빠르게 돌리기", keepSpinning: "계속 돌리기", spinWheel: "룰렛 돌리기", spinAgain: "다시 돌리기", wheelSpinning: "룰렛이 돌아가는 중", result: "돌려서 결정하기", tone: "AI 말투", themeLabels: { minimal: "미니멀", dark: "다크", playful: "플레이풀" },
    wheel: { name: "저녁 메뉴 구조대", emoji: "🍜", toneLabel: "친근한", toneEmoji: "😊", prompt: "친근한 말투: 오늘 저녁엔 뭘 먹을까요?", options: [
      { label: "든든한 국수 한 그릇", weight: 9 }, { label: "타코 먹고 가볍게 산책", weight: 8 }, { label: "저녁으로 아침 메뉴", weight: 7 }, { label: "저장해 둔 맛집 가기", weight: 5 }, { label: "저렴하고 맛있는 단골 메뉴", weight: 8 }, { label: "한 번 요리해 내일까지 먹기", weight: 6 },
    ] },
  },
  proof: ["AI 지원", "가중치 추첨", "Siri + 단축어", "공유 가능한 라이브 링크"],
  how: {
    eyebrow: "사용 방법", title: "막막함에서 결정까지.",
    steps: [
      { title: "결정할 일 적기", copy: "직접 입력하거나 Siri에게 말하세요.", alt: "Siri에게 저녁 메뉴 아이디어를 요청하는 룰렛 만들기 화면" },
      { title: "선택지 다듬기", copy: "각 선택지와 가중치를 수정하세요.", alt: "여섯 가지 AI 말투가 보이는 편집 화면" },
      { title: "돌리고, 다음으로.", copy: "결과 하나. 다음 행동 하나.", alt: "샤오룽바오가 선택된 저녁 메뉴 룰렛" },
    ],
  },
  features: {
    eyebrow: "일상에 맞게 설계", title: "간단해야 할 때는 간단하게.",
    stories: [
      { eyebrow: "여러 룰렛으로 계획", title: "전체 일정을 한 번에.", copy: "장소, 활동, 예산, 시간을 함께 정하세요.", alt: "장소, 분위기, 예산 룰렛으로 구성된 주말 계획" },
      { eyebrow: "홈 화면 위젯", title: "한 번 눌러 돌리기.", copy: "즐겨 쓰는 룰렛을 홈 화면에 두세요.", alt: "빠른 돌리기 홈 화면 위젯 설정" },
      { eyebrow: "공유 스튜디오", title: "룰렛 그대로 공유.", copy: "결과 이미지나 직접 돌릴 수 있는 링크를 보내세요.", alt: "결과 이미지와 라이브 룰렛 링크를 설정하는 공유 스튜디오" },
    ],
  },
  themes: { eyebrow: "열 가지 비주얼 테마", title: "오늘의 분위기를 고르세요.", copy: "차분하게, 발랄하게, 대담하게. 그 사이도 좋습니다." },
  privacy: { eyebrow: "기본부터 비공개", title: "선택은 온전히 내 것으로.", copy: "기기에서 바로 시작하세요. 동기화가 필요할 때만 로그인하면 됩니다.", points: ["게스트 모드", "무료 동기화", "내보내기 또는 삭제"], link: "개인정보 처리방침 보기", alt: "데이터 내보내기, 계정 삭제, 광고 설정이 있는 개인정보 화면" },
  plans: {
    eyebrow: "무료로 시작", title: "기본 기능이 아닌, 더 필요한 공간에만 결제하세요.", copy: "만들기, 돌리기, 공유, 동기화는 무료입니다.",
    free: { name: "무료", title: "만들고, 돌리고, 동기화.", points: ["게스트 모드와 기기 내 룰렛", "기본 AI 이용량", "로그인 후 동기화와 복원", "미니멀 및 다크 테마"] },
    pro: { name: "Wheelora Pro", title: "결정을 위한 더 넉넉한 공간.", points: ["매일 AI 결정 100회", "수백 개의 룰렛 저장", "모든 테마 포함"] },
  },
  waitlist: { eyebrow: "iPhone에서 먼저 출시", title: "이제 고민을 끝내 보세요.", copy: "대기 명단에 등록하면 Wheelora가 준비되는 즉시 이메일로 알려 드립니다.", email: "이메일 주소", join: "대기 명단 등록", appTitle: "iPhone용 Wheelora", appHeading: "이제 고민을 끝낼 준비가 됐나요?", openApp: "Wheelora 열기", store: "App Store에서 보기", saving: "등록하는 중…", success: "등록되었습니다. 출시 소식을 알려 드릴게요.", error: "지금은 이메일을 등록할 수 없습니다. 다시 시도해 주세요." },
  footer: { tagline: "말하고. 돌리고. 앞으로.", links: ["제품 안내", "개발자", "자주 묻는 질문", "지원", "개인정보", "데이터 삭제", "이용약관"] },
};

const ptBR: HomeCopy = {
  title: "Wheelora™ | Roleta de decisões com IA para escolhas do dia a dia",
  description: "Transforme a indecisão do dia a dia em um próximo passo claro. Crie roletas editáveis com IA, adicione pesos opcionais, gire, compartilhe e reutilize suas melhores decisões.",
  nav: { demo: "Demo ao vivo", howItWorks: "Como funciona", themes: "Temas", join: "Lista de espera" },
  language: "Idioma",
  brandTagline: "App de decisões com IA",
  skipToContent: "Ir para o conteúdo",
  hero: { eyebrow: "Roleta de decisões com IA para iPhone", lineOne: "Menos enrolação.", lineTwo: "Mais ação.", lede: "Transforme qualquer escolha em um próximo passo claro.", tryDemo: "Testar a roleta", joinList: "Entrar na lista", openApp: "Abrir o Wheelora", appStore: "App Store" },
  demo: {
    caption: "Demo interativa", hint: "Toque no centro para girar", myWheels: "Minhas roletas", backToList: "Voltar para a lista", quickSpin: "Giro rápido", keepSpinning: "Continuar girando", spinWheel: "Girar a roleta", spinAgain: "Girar de novo", wheelSpinning: "A roleta está girando", result: "Gire para decidir", tone: "tom da IA", themeLabels: { minimal: "Minimalista", dark: "Escuro", playful: "Divertido" },
    wheel: { name: "Jantar resolvido", emoji: "🍜", toneLabel: "Amigável", toneEmoji: "😊", prompt: "Tom amigável: o que vamos comer hoje?", options: [
      { label: "Uma tigela caprichada de macarrão", weight: 9 }, { label: "Tacos e uma caminhada curta", weight: 8 }, { label: "Café da manhã no jantar", weight: 7 }, { label: "Experimentar o lugar salvo", weight: 5 }, { label: "O de sempre, barato e gostoso", weight: 8 }, { label: "Cozinhar hoje e repetir amanhã", weight: 6 },
    ] },
  },
  proof: ["Com ajuda da IA", "Giros ponderados", "Siri + Atalhos", "Links ao vivo para compartilhar"],
  how: {
    eyebrow: "Como funciona", title: "Da dúvida à decisão.",
    steps: [
      { title: "Diga o que precisa decidir", copy: "Digite ou peça para a Siri.", alt: "Tela Criar roleta com um pedido à Siri de ideias para o jantar" },
      { title: "Ajuste as opções", copy: "Edite cada escolha e seu peso.", alt: "Editor de tom da IA com seis opções" },
      { title: "Gire. Siga em frente.", copy: "Um resultado. Um próximo passo.", alt: "Roleta de jantar com bolinhos de sopa selecionados" },
    ],
  },
  features: {
    eyebrow: "Feito para a vida real", title: "Simples quando precisa ser.",
    stories: [
      { eyebrow: "Planejamento com várias roletas", title: "Resolva o plano inteiro.", copy: "Sorteie lugar, atividade, orçamento e horário juntos.", alt: "Planejamento de fim de semana com roletas de lugar, clima e orçamento" },
      { eyebrow: "Widget da Tela de Início", title: "Gire com um toque.", copy: "Deixe uma roleta favorita na Tela de Início.", alt: "Configuração do widget Giro rápido na Tela de Início" },
      { eyebrow: "Estúdio de compartilhamento", title: "Compartilhe a roleta de verdade.", copy: "Envie uma imagem do resultado ou um link que dá para girar.", alt: "Estúdio de compartilhamento com controles de imagem do resultado e link ao vivo" },
    ],
  },
  themes: { eyebrow: "Dez temas visuais", title: "Escolha o clima.", copy: "Calmo, divertido, marcante ou algo no meio." },
  privacy: { eyebrow: "Privado por padrão", title: "Suas escolhas continuam sendo suas.", copy: "Comece no aparelho. Entre na conta só quando quiser sincronizar.", points: ["Modo visitante", "Sincronização grátis", "Exportar ou excluir"], link: "Ler a Política de Privacidade", alt: "Configurações de privacidade com exportação de dados, exclusão de conta e preferências de anúncios" },
  plans: {
    eyebrow: "Comece grátis", title: "Pague por mais espaço, não pelo básico.", copy: "Crie, gire, compartilhe e sincronize de graça.",
    free: { name: "Grátis", title: "Crie, gire, sincronize.", points: ["Modo visitante e roletas no aparelho", "Cota básica de IA", "Sincronização e restauração após entrar", "Temas Minimalista e Escuro"] },
    pro: { name: "Wheelora Pro", title: "Mais espaço para decidir.", points: ["100 decisões com IA por dia", "Espaço para centenas de roletas salvas", "Todos os temas incluídos"] },
  },
  waitlist: { eyebrow: "Primeiro no iPhone", title: "Pare de ficar dando voltas.", copy: "Entre na lista e a gente avisa por e-mail quando o Wheelora estiver pronto.", email: "E-mail", join: "Entrar na lista", appTitle: "Wheelora para iPhone", appHeading: "Pronto para parar de dar voltas?", openApp: "Abrir o Wheelora", store: "Ver na App Store", saving: "Guardando seu lugar…", success: "Você está na lista. A gente avisa quando chegar a hora.", error: "Não foi possível salvar este e-mail agora. Tente de novo." },
  footer: { tagline: "Fale. Gire. Siga em frente.", links: ["Guia do produto", "Desenvolvedores", "Perguntas frequentes", "Suporte", "Privacidade", "Excluir dados", "Termos"] },
};

const ptPT: HomeCopy = {
  title: "Wheelora™ | Roleta de decisões com IA para escolhas do dia a dia",
  description: "Transforma a indecisão do dia a dia num próximo passo claro. Cria roletas editáveis com IA, adiciona pesos opcionais, gira, partilha e volta a usar as melhores decisões.",
  nav: { demo: "Demonstração", howItWorks: "Como funciona", themes: "Temas", join: "Lista de espera" },
  language: "Idioma",
  brandTagline: "Aplicação de decisões com IA",
  skipToContent: "Saltar para o conteúdo",
  hero: { eyebrow: "Roleta de decisões com IA para iPhone", lineOne: "Menos indecisão.", lineTwo: "Mais ação.", lede: "Transforma qualquer escolha num próximo passo claro.", tryDemo: "Experimentar a roleta", joinList: "Entrar na lista", openApp: "Abrir o Wheelora", appStore: "App Store" },
  demo: {
    caption: "Demonstração interativa", hint: "Toca no centro para girar", myWheels: "As minhas roletas", backToList: "Voltar à lista", quickSpin: "Giro rápido", keepSpinning: "Continuar a girar", spinWheel: "Girar a roleta", spinAgain: "Girar novamente", wheelSpinning: "A roleta está a girar", result: "Gira para decidir", tone: "tom da IA", themeLabels: { minimal: "Minimalista", dark: "Escuro", playful: "Divertido" },
    wheel: { name: "Jantar resolvido", emoji: "🍜", toneLabel: "Amigável", toneEmoji: "😊", prompt: "Tom amigável: o que comemos esta noite?", options: [
      { label: "Uma grande taça de noodles", weight: 9 }, { label: "Tacos e um passeio curto", weight: 8 }, { label: "Pequeno-almoço ao jantar", weight: 7 }, { label: "Experimentar o sítio guardado", weight: 5 }, { label: "A opção boa e económica", weight: 8 }, { label: "Cozinhar uma vez, sobras amanhã", weight: 6 },
    ] },
  },
  proof: ["Com ajuda da IA", "Giros ponderados", "Siri + Atalhos", "Ligações em direto para partilhar"],
  how: {
    eyebrow: "Como funciona", title: "Da dúvida à decisão.",
    steps: [
      { title: "Dá um nome à escolha", copy: "Escreve-a ou pede à Siri.", alt: "Ecrã Criar roleta com um pedido à Siri de ideias para o jantar" },
      { title: "Ajusta as opções", copy: "Edita cada escolha e o respetivo peso.", alt: "Editor de tom da IA com seis opções" },
      { title: "Gira. Segue em frente.", copy: "Um resultado. Um próximo passo.", alt: "Roleta de jantar com dumplings de sopa selecionados" },
    ],
  },
  features: {
    eyebrow: "Feito para a vida real", title: "Simples quando deve ser.",
    stories: [
      { eyebrow: "Planeamento com várias roletas", title: "Planeia tudo.", copy: "Sorteia em conjunto o lugar, a atividade, o orçamento e a hora.", alt: "Planeamento de fim de semana com roletas de lugar, ambiente e orçamento" },
      { eyebrow: "Widget do ecrã principal", title: "Gira com um toque.", copy: "Mantém uma roleta favorita no ecrã principal.", alt: "Configuração do widget Giro rápido no ecrã principal" },
      { eyebrow: "Estúdio de partilha", title: "Partilha a própria roleta.", copy: "Envia uma imagem do resultado ou uma ligação que se pode girar.", alt: "Estúdio de partilha com controlos para imagem do resultado e ligação em direto" },
    ],
  },
  themes: { eyebrow: "Dez temas visuais", title: "Escolhe o ambiente.", copy: "Calmo, divertido, arrojado ou algures no meio." },
  privacy: { eyebrow: "Privado por predefinição", title: "As tuas escolhas continuam a ser tuas.", copy: "Começa no dispositivo. Inicia sessão apenas quando quiseres sincronizar.", points: ["Modo de convidado", "Sincronização gratuita", "Exportar ou eliminar"], link: "Ler a Política de Privacidade", alt: "Definições de privacidade com exportação de dados, eliminação de conta e preferências de anúncios" },
  plans: {
    eyebrow: "Começa grátis", title: "Paga por mais espaço, não pelo essencial.", copy: "Cria, gira, partilha e sincroniza gratuitamente.",
    free: { name: "Grátis", title: "Cria, gira, sincroniza.", points: ["Modo de convidado e roletas locais", "Limite base de IA", "Sincronização e restauro após iniciar sessão", "Temas Minimalista e Escuro"] },
    pro: { name: "Wheelora Pro", title: "Mais espaço para decidir.", points: ["100 decisões com IA por dia", "Espaço para centenas de roletas guardadas", "Todos os temas incluídos"] },
  },
  waitlist: { eyebrow: "Primeiro no iPhone", title: "Deixa de andar às voltas.", copy: "Entra na lista e enviamos-te um e-mail quando o Wheelora estiver pronto.", email: "Endereço de e-mail", join: "Entrar na lista", appTitle: "Wheelora para iPhone", appHeading: "Pronto para deixar de andar às voltas?", openApp: "Abrir o Wheelora", store: "Ver na App Store", saving: "A guardar o teu lugar…", success: "Já estás na lista. Avisamos-te quando estiver pronto.", error: "Não foi possível guardar este e-mail agora. Tenta novamente." },
  footer: { tagline: "Diz. Gira. Avança.", links: ["Guia do produto", "Programadores", "Perguntas frequentes", "Apoio", "Privacidade", "Eliminar dados", "Termos"] },
};

const hi: HomeCopy = {
  title: "Wheelora™ | रोज़मर्रा के चुनावों के लिए AI फ़ैसला व्हील",
  description: "रोज़ की उलझन को अगले साफ़ कदम में बदलें। AI से ऐसे व्हील बनाएँ जिन्हें बदला जा सके, चाहें तो वज़न जोड़ें, घुमाएँ, साझा करें और अच्छे फ़ैसलों को फिर इस्तेमाल करें।",
  nav: { demo: "लाइव डेमो", howItWorks: "यह कैसे काम करता है", themes: "थीम", join: "वेटलिस्ट में जुड़ें" },
  language: "भाषा",
  brandTagline: "AI फ़ैसला ऐप",
  skipToContent: "मुख्य सामग्री पर जाएँ",
  hero: { eyebrow: "iPhone के लिए AI फ़ैसला व्हील", lineOne: "कम सोच-विचार।", lineTwo: "ज़्यादा काम।", lede: "किसी भी चुनाव को अगले साफ़ कदम में बदलें।", tryDemo: "व्हील आज़माएँ", joinList: "वेटलिस्ट में जुड़ें", openApp: "Wheelora खोलें", appStore: "App Store" },
  demo: {
    caption: "इंटरैक्टिव डेमो", hint: "घुमाने के लिए बीच में टैप करें", myWheels: "मेरे व्हील", backToList: "सूची पर वापस जाएँ", quickSpin: "झटपट घुमाएँ", keepSpinning: "घुमाते रहें", spinWheel: "व्हील घुमाएँ", spinAgain: "फिर घुमाएँ", wheelSpinning: "व्हील घूम रहा है", result: "घुमाएँ और तय करें", tone: "AI अंदाज़", themeLabels: { minimal: "मिनिमल", dark: "डार्क", playful: "मज़ेदार" },
    wheel: { name: "डिनर का हल", emoji: "🍜", toneLabel: "दोस्ताना", toneEmoji: "😊", prompt: "दोस्ताना अंदाज़: आज रात क्या खाएँ?", options: [
      { label: "सुकून वाला बड़ा नूडल बाउल", weight: 9 }, { label: "टैको और थोड़ी सैर", weight: 8 }, { label: "डिनर में नाश्ता", weight: 7 }, { label: "सेव की हुई जगह आज़माएँ", weight: 5 }, { label: "सस्ता और स्वादिष्ट भरोसेमंद विकल्प", weight: 8 }, { label: "एक बार पकाएँ, कल भी खाएँ", weight: 6 },
    ] },
  },
  proof: ["AI की मदद", "वज़न के हिसाब से चुनाव", "Siri + Shortcuts", "साझा करने योग्य लाइव लिंक"],
  how: {
    eyebrow: "यह कैसे काम करता है", title: "उलझन से फ़ैसले तक।",
    steps: [
      { title: "चुनाव का नाम दें", copy: "लिखें या Siri से पूछें।", alt: "डिनर के सुझाव के लिए Siri अनुरोध वाला व्हील बनाने का स्क्रीन" },
      { title: "विकल्प सँवारें", copy: "हर विकल्प और उसका वज़न बदलें।", alt: "छह AI अंदाज़ दिखाता हुआ एडिटर" },
      { title: "घुमाएँ। आगे बढ़ें।", copy: "एक नतीजा। एक अगला कदम।", alt: "सूप डम्पलिंग चुना हुआ डिनर व्हील" },
    ],
  },
  features: {
    eyebrow: "असल ज़िंदगी के लिए", title: "जहाँ ज़रूरत हो, वहाँ आसान।",
    stories: [
      { eyebrow: "कई व्हील से योजना", title: "पूरी योजना तय करें।", copy: "जगह, गतिविधि, बजट और समय एक साथ चुनें।", alt: "जगह, माहौल और बजट वाले व्हील की सप्ताहांत योजना" },
      { eyebrow: "होम स्क्रीन विजेट", title: "एक टैप में घुमाएँ।", copy: "पसंदीदा व्हील को होम स्क्रीन पर रखें।", alt: "क्विक स्पिन होम स्क्रीन विजेट सेटअप" },
      { eyebrow: "शेयर स्टूडियो", title: "असल व्हील साझा करें।", copy: "नतीजे की तस्वीर या खुद घुमाया जा सकने वाला लिंक भेजें।", alt: "नतीजे की तस्वीर और लाइव व्हील लिंक वाला शेयर स्टूडियो" },
    ],
  },
  themes: { eyebrow: "दस विज़ुअल थीम", title: "अपना मूड चुनें।", copy: "शांत, मज़ेदार, दमदार—या इनके बीच का कुछ।" },
  privacy: { eyebrow: "शुरू से निजी", title: "आपके चुनाव आपके ही रहें।", copy: "डिवाइस पर शुरू करें। सिंक चाहिए तभी साइन इन करें।", points: ["गेस्ट मोड", "मुफ़्त सिंक", "एक्सपोर्ट या डिलीट"], link: "प्राइवेसी पॉलिसी पढ़ें", alt: "डेटा एक्सपोर्ट, अकाउंट डिलीट और विज्ञापन पसंद वाली प्राइवेसी सेटिंग" },
  plans: {
    eyebrow: "मुफ़्त शुरू करें", title: "बुनियादी इस्तेमाल के लिए नहीं, ज़्यादा जगह के लिए भुगतान करें।", copy: "मुफ़्त में बनाएँ, घुमाएँ, साझा करें और सिंक करें।",
    free: { name: "मुफ़्त", title: "बनाएँ, घुमाएँ, सिंक करें।", points: ["गेस्ट मोड और डिवाइस पर व्हील", "बुनियादी AI सीमा", "साइन इन के बाद सिंक और रीस्टोर", "मिनिमल और डार्क थीम"] },
    pro: { name: "Wheelora Pro", title: "फ़ैसलों के लिए ज़्यादा जगह।", points: ["हर दिन 100 AI फ़ैसले", "सैकड़ों सेव किए व्हील की जगह", "सभी थीम शामिल"] },
  },
  waitlist: { eyebrow: "पहले iPhone पर", title: "बार-बार सोचने से आगे बढ़ें।", copy: "वेटलिस्ट में जुड़ें। Wheelora तैयार होते ही हम ईमेल करेंगे।", email: "ईमेल पता", join: "वेटलिस्ट में जुड़ें", appTitle: "iPhone के लिए Wheelora", appHeading: "सोचते रहने के बजाय आगे बढ़ने को तैयार?", openApp: "Wheelora खोलें", store: "App Store पर देखें", saving: "आपकी जगह सेव हो रही है…", success: "आप वेटलिस्ट में हैं। हम आपको खबर देंगे।", error: "अभी यह ईमेल सेव नहीं हो सका। फिर कोशिश करें।" },
  footer: { tagline: "कहें। घुमाएँ। आगे बढ़ें।", links: ["प्रोडक्ट गाइड", "डेवलपर", "आम सवाल", "सहायता", "प्राइवेसी", "डेटा डिलीट करें", "शर्तें"] },
};

const id: HomeCopy = {
  title: "Wheelora™ | Roda keputusan AI untuk pilihan sehari-hari",
  description: "Ubah keraguan sehari-hari menjadi satu langkah berikutnya yang jelas. Buat roda yang dapat diedit dengan AI, tambahkan bobot bila perlu, putar, bagikan, dan gunakan kembali keputusan terbaikmu.",
  nav: { demo: "Demo langsung", howItWorks: "Cara kerja", themes: "Tema", join: "Daftar tunggu" },
  language: "Bahasa",
  brandTagline: "Aplikasi keputusan AI",
  skipToContent: "Langsung ke isi",
  hero: { eyebrow: "Roda keputusan AI untuk iPhone", lineOne: "Kurangi keraguan.", lineTwo: "Mulai bergerak.", lede: "Ubah pilihan apa pun menjadi langkah berikutnya yang jelas.", tryDemo: "Coba rodanya", joinList: "Gabung daftar tunggu", openApp: "Buka Wheelora", appStore: "App Store" },
  demo: {
    caption: "Demo interaktif", hint: "Ketuk bagian tengah untuk memutar", myWheels: "Roda saya", backToList: "Kembali ke daftar", quickSpin: "Putar cepat", keepSpinning: "Putar lagi", spinWheel: "Putar roda", spinAgain: "Putar sekali lagi", wheelSpinning: "Roda sedang berputar", result: "Putar untuk memilih", tone: "gaya AI", themeLabels: { minimal: "Minimal", dark: "Gelap", playful: "Ceria" },
    wheel: { name: "Penyelamat makan malam", emoji: "🍜", toneLabel: "Ramah", toneEmoji: "😊", prompt: "Gaya ramah: makan apa malam ini?", options: [
      { label: "Semangkuk mi hangat", weight: 9 }, { label: "Taco lalu jalan sebentar", weight: 8 }, { label: "Menu sarapan untuk makan malam", weight: 7 }, { label: "Coba tempat yang disimpan", weight: 5 }, { label: "Pilihan hemat yang selalu enak", weight: 8 }, { label: "Masak sekali, besok tinggal makan", weight: 6 },
    ] },
  },
  proof: ["Dibantu AI", "Putaran berbobot", "Siri + Pintasan", "Tautan langsung untuk dibagikan"],
  how: {
    eyebrow: "Cara kerja", title: "Dari bingung menjadi yakin.",
    steps: [
      { title: "Tulis pilihannya", copy: "Ketik atau tanyakan ke Siri.", alt: "Layar Buat roda dengan permintaan ide makan malam kepada Siri" },
      { title: "Atur opsinya", copy: "Edit setiap pilihan dan bobotnya.", alt: "Editor gaya AI dengan enam pilihan gaya" },
      { title: "Putar. Lanjutkan.", copy: "Satu hasil. Satu langkah berikutnya.", alt: "Roda makan malam dengan dumpling kuah terpilih" },
    ],
  },
  features: {
    eyebrow: "Dibuat untuk kehidupan nyata", title: "Sederhana saat memang harus sederhana.",
    stories: [
      { eyebrow: "Rencana dengan beberapa roda", title: "Tentukan seluruh rencana.", copy: "Putar lokasi, aktivitas, anggaran, dan waktu sekaligus.", alt: "Rencana akhir pekan dengan roda lokasi, suasana, dan anggaran" },
      { eyebrow: "Widget Layar Utama", title: "Putar dengan satu ketukan.", copy: "Simpan roda favorit di Layar Utama.", alt: "Pengaturan widget Putar cepat di Layar Utama" },
      { eyebrow: "Studio berbagi", title: "Bagikan roda aslinya.", copy: "Kirim gambar hasil atau tautan yang dapat diputar.", alt: "Studio berbagi dengan kontrol gambar hasil dan tautan roda langsung" },
    ],
  },
  themes: { eyebrow: "Sepuluh tema visual", title: "Pilih suasananya.", copy: "Tenang, ceria, berani, atau di antaranya." },
  privacy: { eyebrow: "Privat sejak awal", title: "Pilihanmu tetap milikmu.", copy: "Mulai di perangkat. Masuk hanya saat ingin menyinkronkan.", points: ["Mode tamu", "Sinkronisasi gratis", "Ekspor atau hapus"], link: "Baca Kebijakan Privasi", alt: "Pengaturan privasi dengan ekspor data, penghapusan akun, dan preferensi iklan" },
  plans: {
    eyebrow: "Mulai gratis", title: "Bayar untuk ruang tambahan, bukan fitur dasar.", copy: "Buat, putar, bagikan, dan sinkronkan secara gratis.",
    free: { name: "Gratis", title: "Buat, putar, sinkronkan.", points: ["Mode tamu dan roda lokal", "Kuota AI dasar", "Sinkronisasi dan pemulihan setelah masuk", "Tema Minimal dan Gelap"] },
    pro: { name: "Wheelora Pro", title: "Lebih banyak ruang untuk memilih.", points: ["100 keputusan AI setiap hari", "Ruang untuk ratusan roda tersimpan", "Semua tema tersedia"] },
  },
  waitlist: { eyebrow: "Hadir lebih dulu di iPhone", title: "Berhenti berputar-putar.", copy: "Gabung daftar tunggu. Kami akan mengirim email saat Wheelora siap.", email: "Alamat email", join: "Gabung daftar", appTitle: "Wheelora untuk iPhone", appHeading: "Siap berhenti berputar-putar?", openApp: "Buka Wheelora", store: "Lihat di App Store", saving: "Menyimpan tempatmu…", success: "Kamu sudah masuk daftar. Kami akan mengabarimu.", error: "Email ini belum dapat disimpan. Coba lagi." },
  footer: { tagline: "Ucapkan. Putar. Lanjutkan.", links: ["Panduan produk", "Pengembang", "Tanya jawab", "Dukungan", "Privasi", "Hapus data", "Ketentuan"] },
};

const vi: HomeCopy = {
  title: "Wheelora™ | Vòng quay quyết định AI cho lựa chọn hằng ngày",
  description: "Biến sự phân vân hằng ngày thành một bước tiếp theo rõ ràng. Tạo vòng quay có thể chỉnh sửa bằng AI, thêm trọng số khi cần, quay, chia sẻ và dùng lại những quyết định hiệu quả.",
  nav: { demo: "Bản dùng thử", howItWorks: "Cách hoạt động", themes: "Giao diện", join: "Danh sách chờ" },
  language: "Ngôn ngữ",
  brandTagline: "Ứng dụng quyết định AI",
  skipToContent: "Chuyển đến nội dung",
  hero: { eyebrow: "Vòng quay quyết định AI cho iPhone", lineOne: "Bớt đắn đo.", lineTwo: "Bắt tay làm.", lede: "Biến mọi lựa chọn thành một bước tiếp theo rõ ràng.", tryDemo: "Thử vòng quay", joinList: "Vào danh sách chờ", openApp: "Mở Wheelora", appStore: "App Store" },
  demo: {
    caption: "Bản dùng thử tương tác", hint: "Chạm vào giữa để quay", myWheels: "Vòng quay của tôi", backToList: "Quay lại danh sách", quickSpin: "Quay nhanh", keepSpinning: "Quay tiếp", spinWheel: "Quay vòng quay", spinAgain: "Quay lại", wheelSpinning: "Vòng quay đang chạy", result: "Quay để quyết định", tone: "giọng AI", themeLabels: { minimal: "Tối giản", dark: "Tối", playful: "Vui nhộn" },
    wheel: { name: "Cứu nguy bữa tối", emoji: "🍜", toneLabel: "Thân thiện", toneEmoji: "😊", prompt: "Giọng thân thiện: tối nay ăn gì?", options: [
      { label: "Một tô mì thật ấm bụng", weight: 9 }, { label: "Taco rồi đi dạo một chút", weight: 8 }, { label: "Ăn sáng cho bữa tối", weight: 7 }, { label: "Thử quán đã lưu", weight: 5 }, { label: "Món quen ngon và tiết kiệm", weight: 8 }, { label: "Nấu một lần, mai ăn tiếp", weight: 6 },
    ] },
  },
  proof: ["Có AI hỗ trợ", "Quay theo trọng số", "Siri + Phím tắt", "Liên kết trực tiếp để chia sẻ"],
  how: {
    eyebrow: "Cách hoạt động", title: "Từ phân vân đến quyết định.",
    steps: [
      { title: "Gọi tên lựa chọn", copy: "Nhập vào hoặc hỏi Siri.", alt: "Màn hình Tạo vòng quay với yêu cầu Siri gợi ý bữa tối" },
      { title: "Chỉnh các phương án", copy: "Sửa từng lựa chọn và trọng số.", alt: "Trình chỉnh giọng AI với sáu lựa chọn" },
      { title: "Quay. Đi tiếp.", copy: "Một kết quả. Một bước tiếp theo.", alt: "Vòng quay bữa tối chọn món tiểu long bao" },
    ],
  },
  features: {
    eyebrow: "Dành cho đời sống thực", title: "Đơn giản đúng lúc.",
    stories: [
      { eyebrow: "Lập kế hoạch bằng nhiều vòng quay", title: "Chốt cả kế hoạch.", copy: "Quay địa điểm, hoạt động, ngân sách và thời gian cùng lúc.", alt: "Kế hoạch cuối tuần với vòng quay địa điểm, không khí và ngân sách" },
      { eyebrow: "Tiện ích Màn hình chính", title: "Một chạm là quay.", copy: "Đặt vòng quay yêu thích trên Màn hình chính.", alt: "Thiết lập tiện ích Quay nhanh trên Màn hình chính" },
      { eyebrow: "Studio chia sẻ", title: "Chia sẻ đúng vòng quay.", copy: "Gửi ảnh kết quả hoặc liên kết mà người khác có thể quay.", alt: "Studio chia sẻ với tùy chọn ảnh kết quả và liên kết vòng quay trực tiếp" },
    ],
  },
  themes: { eyebrow: "Mười giao diện trực quan", title: "Chọn đúng tâm trạng.", copy: "Nhẹ nhàng, vui nhộn, táo bạo hoặc ở giữa." },
  privacy: { eyebrow: "Riêng tư theo mặc định", title: "Lựa chọn của bạn vẫn là của bạn.", copy: "Bắt đầu ngay trên thiết bị. Chỉ đăng nhập khi muốn đồng bộ.", points: ["Chế độ khách", "Đồng bộ miễn phí", "Xuất hoặc xóa"], link: "Đọc Chính sách quyền riêng tư", alt: "Cài đặt quyền riêng tư với xuất dữ liệu, xóa tài khoản và tùy chọn quảng cáo" },
  plans: {
    eyebrow: "Bắt đầu miễn phí", title: "Chỉ trả phí khi cần thêm chỗ, không phải cho tính năng cơ bản.", copy: "Tạo, quay, chia sẻ và đồng bộ miễn phí.",
    free: { name: "Miễn phí", title: "Tạo, quay, đồng bộ.", points: ["Chế độ khách và vòng quay trên thiết bị", "Hạn mức AI cơ bản", "Đồng bộ và khôi phục sau khi đăng nhập", "Giao diện Tối giản và Tối"] },
    pro: { name: "Wheelora Pro", title: "Nhiều chỗ hơn để quyết định.", points: ["100 quyết định AI mỗi ngày", "Lưu hàng trăm vòng quay", "Bao gồm mọi giao diện"] },
  },
  waitlist: { eyebrow: "Ra mắt trước trên iPhone", title: "Đừng mãi nghĩ vòng quanh.", copy: "Vào danh sách chờ. Chúng tôi sẽ gửi email khi Wheelora sẵn sàng.", email: "Địa chỉ email", join: "Vào danh sách", appTitle: "Wheelora cho iPhone", appHeading: "Sẵn sàng ngừng đắn đo?", openApp: "Mở Wheelora", store: "Xem trên App Store", saving: "Đang giữ chỗ cho bạn…", success: "Bạn đã vào danh sách. Chúng tôi sẽ báo tin.", error: "Hiện chưa thể lưu email này. Hãy thử lại." },
  footer: { tagline: "Nói ra. Quay. Tiến tới.", links: ["Hướng dẫn sản phẩm", "Nhà phát triển", "Câu hỏi thường gặp", "Hỗ trợ", "Quyền riêng tư", "Xóa dữ liệu", "Điều khoản"] },
};

const th: HomeCopy = {
  title: "Wheelora™ | วงล้อตัดสินใจ AI สำหรับตัวเลือกในทุกวัน",
  description: "เปลี่ยนความลังเลในแต่ละวันให้เป็นก้าวต่อไปที่ชัดเจน สร้างวงล้อที่แก้ไขได้ด้วย AI เพิ่มน้ำหนักตัวเลือกได้ตามต้องการ แล้วหมุน แชร์ และนำการตัดสินใจดี ๆ กลับมาใช้ซ้ำ",
  nav: { demo: "ทดลองสด", howItWorks: "วิธีใช้งาน", themes: "ธีม", join: "เข้าร่วมรายชื่อรอ" },
  language: "ภาษา",
  brandTagline: "แอปช่วยตัดสินใจด้วย AI",
  skipToContent: "ข้ามไปยังเนื้อหา",
  hero: { eyebrow: "วงล้อตัดสินใจ AI สำหรับ iPhone", lineOne: "คิดวนให้น้อยลง", lineTwo: "ลงมือให้มากขึ้น", lede: "เปลี่ยนทุกตัวเลือกให้เป็นก้าวต่อไปที่ชัดเจน", tryDemo: "ลองหมุนวงล้อ", joinList: "เข้าร่วมรายชื่อรอ", openApp: "เปิด Wheelora", appStore: "App Store" },
  demo: {
    caption: "เดโมแบบโต้ตอบ", hint: "แตะตรงกลางเพื่อหมุน", myWheels: "วงล้อของฉัน", backToList: "กลับไปยังรายการ", quickSpin: "หมุนด่วน", keepSpinning: "หมุนต่อ", spinWheel: "หมุนวงล้อ", spinAgain: "หมุนอีกครั้ง", wheelSpinning: "วงล้อกำลังหมุน", result: "หมุนเพื่อตัดสินใจ", tone: "โทน AI", themeLabels: { minimal: "มินิมอล", dark: "มืด", playful: "สนุกสนาน" },
    wheel: { name: "มื้อเย็นทันใจ", emoji: "🍜", toneLabel: "เป็นกันเอง", toneEmoji: "😊", prompt: "โทนเป็นกันเอง: คืนนี้กินอะไรดี?", options: [
      { label: "บะหมี่ชามใหญ่แสนอุ่นใจ", weight: 9 }, { label: "ทาโก้แล้วเดินเล่นสักหน่อย", weight: 8 }, { label: "อาหารเช้าเป็นมื้อเย็น", weight: 7 }, { label: "ลองร้านที่บันทึกไว้", weight: 5 }, { label: "เมนูประจำ อร่อยและประหยัด", weight: 8 }, { label: "ทำครั้งเดียว พรุ่งนี้กินต่อ", weight: 6 },
    ] },
  },
  proof: ["AI ช่วยคิด", "หมุนตามน้ำหนัก", "Siri + คำสั่งลัด", "ลิงก์สดที่แชร์ได้"],
  how: {
    eyebrow: "วิธีใช้งาน", title: "จากลังเลสู่คำตอบ",
    steps: [
      { title: "ตั้งชื่อสิ่งที่ต้องเลือก", copy: "พิมพ์หรือถาม Siri", alt: "หน้าสร้างวงล้อพร้อมคำขอไอเดียมื้อเย็นจาก Siri" },
      { title: "จัดตัวเลือกให้ลงตัว", copy: "แก้ไขแต่ละตัวเลือกและน้ำหนัก", alt: "ตัวแก้ไขโทน AI ที่มีหกตัวเลือก" },
      { title: "หมุน แล้วไปต่อ", copy: "หนึ่งคำตอบ หนึ่งก้าวต่อไป", alt: "วงล้อมื้อเย็นที่เลือกเสี่ยวหลงเปา" },
    ],
  },
  features: {
    eyebrow: "สร้างมาเพื่อชีวิตจริง", title: "เรียบง่ายในเวลาที่ควรเรียบง่าย",
    stories: [
      { eyebrow: "วางแผนด้วยหลายวงล้อ", title: "จัดทั้งแผนให้ลงตัว", copy: "หมุนเลือกสถานที่ กิจกรรม งบประมาณ และเวลาไปพร้อมกัน", alt: "แผนสุดสัปดาห์พร้อมวงล้อสถานที่ บรรยากาศ และงบประมาณ" },
      { eyebrow: "วิดเจ็ตหน้าจอโฮม", title: "แตะครั้งเดียวก็หมุน", copy: "วางวงล้อโปรดไว้บนหน้าจอโฮม", alt: "การตั้งค่าวิดเจ็ตหมุนด่วนบนหน้าจอโฮม" },
      { eyebrow: "สตูดิโอแชร์", title: "แชร์ตัววงล้อได้เลย", copy: "ส่งภาพผลลัพธ์หรือลิงก์ที่อีกฝ่ายหมุนเองได้", alt: "สตูดิโอแชร์พร้อมตัวเลือกภาพผลลัพธ์และลิงก์วงล้อสด" },
    ],
  },
  themes: { eyebrow: "สิบธีมภาพ", title: "เลือกอารมณ์ที่ใช่", copy: "สงบ สนุก เด่นชัด หรืออยู่ตรงกลาง" },
  privacy: { eyebrow: "เป็นส่วนตัวตั้งแต่เริ่ม", title: "ตัวเลือกของคุณยังเป็นของคุณ", copy: "เริ่มบนอุปกรณ์ได้เลย เข้าสู่ระบบเมื่ออยากซิงค์เท่านั้น", points: ["โหมดผู้เยี่ยมชม", "ซิงค์ฟรี", "ส่งออกหรือลบ"], link: "อ่านนโยบายความเป็นส่วนตัว", alt: "การตั้งค่าความเป็นส่วนตัวพร้อมส่งออกข้อมูล ลบบัญชี และตั้งค่าโฆษณา" },
  plans: {
    eyebrow: "เริ่มฟรี", title: "จ่ายเมื่ออยากได้พื้นที่เพิ่ม ไม่ใช่เพื่อฟังก์ชันพื้นฐาน", copy: "สร้าง หมุน แชร์ และซิงค์ได้ฟรี",
    free: { name: "ฟรี", title: "สร้าง หมุน ซิงค์", points: ["โหมดผู้เยี่ยมชมและวงล้อบนอุปกรณ์", "โควตา AI พื้นฐาน", "ซิงค์และกู้คืนหลังเข้าสู่ระบบ", "ธีมมินิมอลและมืด"] },
    pro: { name: "Wheelora Pro", title: "พื้นที่ตัดสินใจที่มากขึ้น", points: ["ตัดสินใจด้วย AI 100 ครั้งต่อวัน", "เก็บวงล้อได้หลายร้อยรายการ", "รวมทุกธีม"] },
  },
  waitlist: { eyebrow: "เปิดตัวบน iPhone ก่อน", title: "หยุดคิดวน แล้วก้าวต่อไป", copy: "เข้าร่วมรายชื่อรอ แล้วเราจะส่งอีเมลเมื่อ Wheelora พร้อม", email: "อีเมล", join: "เข้าร่วมรายชื่อ", appTitle: "Wheelora สำหรับ iPhone", appHeading: "พร้อมหยุดคิดวนหรือยัง?", openApp: "เปิด Wheelora", store: "ดูบน App Store", saving: "กำลังบันทึกที่ของคุณ…", success: "คุณอยู่ในรายชื่อแล้ว เราจะแจ้งข่าวให้ทราบ", error: "ยังบันทึกอีเมลนี้ไม่ได้ โปรดลองอีกครั้ง" },
  footer: { tagline: "พูดออกมา หมุน แล้วก้าวต่อ", links: ["คู่มือผลิตภัณฑ์", "นักพัฒนา", "คำถามที่พบบ่อย", "ฝ่ายช่วยเหลือ", "ความเป็นส่วนตัว", "ลบข้อมูล", "ข้อกำหนด"] },
};

const tr: HomeCopy = {
  title: "Wheelora™ | Günlük seçimler için yapay zekâ destekli karar çarkı",
  description: "Günlük kararsızlığı net bir sonraki adıma dönüştür. Yapay zekâyla düzenlenebilir çarklar oluştur, istersen seçenekleri ağırlıklandır, çevir, paylaş ve iyi kararlarını yeniden kullan.",
  nav: { demo: "Canlı demo", howItWorks: "Nasıl çalışır", themes: "Temalar", join: "Bekleme listesi" },
  language: "Dil",
  brandTagline: "Yapay zekâ karar uygulaması",
  skipToContent: "İçeriğe geç",
  hero: { eyebrow: "iPhone için yapay zekâ karar çarkı", lineOne: "Daha az kararsızlık.", lineTwo: "Daha çok hareket.", lede: "Her seçimi net bir sonraki adıma dönüştür.", tryDemo: "Çarkı dene", joinList: "Bekleme listesine katıl", openApp: "Wheelora’yı aç", appStore: "App Store" },
  demo: {
    caption: "Etkileşimli demo", hint: "Çevirmek için ortaya dokun", myWheels: "Çarklarım", backToList: "Listeye dön", quickSpin: "Hızlı çevir", keepSpinning: "Çevirmeye devam et", spinWheel: "Çarkı çevir", spinAgain: "Yeniden çevir", wheelSpinning: "Çark dönüyor", result: "Çevir ve karar ver", tone: "yapay zekâ tonu", themeLabels: { minimal: "Minimal", dark: "Koyu", playful: "Eğlenceli" },
    wheel: { name: "Akşam yemeği kurtarıcısı", emoji: "🍜", toneLabel: "Samimi", toneEmoji: "😊", prompt: "Samimi ton: bu akşam ne yiyelim?", options: [
      { label: "Kocaman, sıcacık bir noodle kâsesi", weight: 9 }, { label: "Tako ve kısa bir yürüyüş", weight: 8 }, { label: "Akşam yemeğinde kahvaltı", weight: 7 }, { label: "Kaydettiğin yeri dene", weight: 5 }, { label: "Ucuz ve lezzetli klasik", weight: 8 }, { label: "Bir kez pişir, yarın da ye", weight: 6 },
    ] },
  },
  proof: ["Yapay zekâ destekli", "Ağırlıklı seçim", "Siri + Kestirmeler", "Paylaşılabilir canlı bağlantılar"],
  how: {
    eyebrow: "Nasıl çalışır", title: "Kararsızlıktan karara.",
    steps: [
      { title: "Seçimini adlandır", copy: "Yaz veya Siri’ye sor.", alt: "Siri’den akşam yemeği fikirleri isteyen çark oluşturma ekranı" },
      { title: "Seçenekleri düzenle", copy: "Her seçeneği ve ağırlığını değiştir.", alt: "Altı ton seçeneği gösteren yapay zekâ ton düzenleyicisi" },
      { title: "Çevir. Devam et.", copy: "Tek sonuç. Tek sonraki adım.", alt: "Çorbalı mantının seçildiği akşam yemeği çarkı" },
    ],
  },
  features: {
    eyebrow: "Gerçek hayat için", title: "Gerektiği kadar basit.",
    stories: [
      { eyebrow: "Birden fazla çarkla planlama", title: "Tüm planı belirle.", copy: "Yer, etkinlik, bütçe ve zamanı birlikte seç.", alt: "Yer, atmosfer ve bütçe çarklarından oluşan hafta sonu planı" },
      { eyebrow: "Ana Ekran araç takımı", title: "Tek dokunuşla çevir.", copy: "Sevdiğin çarkı Ana Ekran’da tut.", alt: "Hızlı çevir Ana Ekran araç takımı kurulumu" },
      { eyebrow: "Paylaşım stüdyosu", title: "Çarkın kendisini paylaş.", copy: "Sonuç görseli veya başkasının da çevirebileceği bir bağlantı gönder.", alt: "Sonuç görseli ve canlı çark bağlantısı seçenekli paylaşım stüdyosu" },
    ],
  },
  themes: { eyebrow: "On görsel tema", title: "Havana uygun olanı seç.", copy: "Sakin, eğlenceli, iddialı veya arada bir yerde." },
  privacy: { eyebrow: "Başlangıçtan itibaren gizli", title: "Seçimlerin sana kalır.", copy: "Cihazında başla. Yalnızca eşitlemek istediğinde giriş yap.", points: ["Misafir modu", "Ücretsiz eşitleme", "Dışa aktar veya sil"], link: "Gizlilik Politikasını oku", alt: "Veri dışa aktarma, hesap silme ve reklam tercihleri içeren gizlilik ayarları" },
  plans: {
    eyebrow: "Ücretsiz başla", title: "Temel kullanım için değil, daha fazla alan için öde.", copy: "Ücretsiz oluştur, çevir, paylaş ve eşitle.",
    free: { name: "Ücretsiz", title: "Oluştur, çevir, eşitle.", points: ["Misafir modu ve cihazdaki çarklar", "Temel yapay zekâ kotası", "Giriş yaptıktan sonra eşitleme ve geri yükleme", "Minimal ve Koyu temalar"] },
    pro: { name: "Wheelora Pro", title: "Karar vermek için daha çok alan.", points: ["Her gün 100 yapay zekâ kararı", "Yüzlerce kayıtlı çark için alan", "Tüm temalar dâhil"] },
  },
  waitlist: { eyebrow: "Önce iPhone’da", title: "Aynı yerde dönüp durmayı bırak.", copy: "Listeye katıl; Wheelora hazır olduğunda sana e-posta gönderelim.", email: "E-posta adresi", join: "Listeye katıl", appTitle: "iPhone için Wheelora", appHeading: "Dönüp durmayı bırakmaya hazır mısın?", openApp: "Wheelora’yı aç", store: "App Store’da görüntüle", saving: "Yerin ayrılıyor…", success: "Listedesin. Hazır olduğunda haber vereceğiz.", error: "Bu e-posta şu anda kaydedilemedi. Tekrar dene." },
  footer: { tagline: "Söyle. Çevir. İlerle.", links: ["Ürün rehberi", "Geliştiriciler", "Sık sorulan sorular", "Destek", "Gizlilik", "Verileri sil", "Koşullar"] },
};

const pl: HomeCopy = {
  title: "Wheelora™ | Koło decyzyjne AI do codziennych wyborów",
  description: "Zamień codzienne wahanie w jeden jasny następny krok. Twórz z AI edytowalne koła, dodawaj opcjonalne wagi, kręć, udostępniaj i wracaj do sprawdzonych decyzji.",
  nav: { demo: "Demo na żywo", howItWorks: "Jak to działa", themes: "Motywy", join: "Lista oczekujących" },
  language: "Język",
  brandTagline: "Aplikacja do decyzji z AI",
  skipToContent: "Przejdź do treści",
  hero: { eyebrow: "Koło decyzyjne AI na iPhone’a", lineOne: "Mniej wahania.", lineTwo: "Więcej działania.", lede: "Zamień każdy wybór w jasny następny krok.", tryDemo: "Wypróbuj koło", joinList: "Dołącz do listy", openApp: "Otwórz Wheelora", appStore: "App Store" },
  demo: {
    caption: "Interaktywne demo", hint: "Dotknij środka, aby zakręcić", myWheels: "Moje koła", backToList: "Wróć do listy", quickSpin: "Szybki obrót", keepSpinning: "Kręć dalej", spinWheel: "Zakręć kołem", spinAgain: "Zakręć ponownie", wheelSpinning: "Koło się kręci", result: "Zakręć i zdecyduj", tone: "ton AI", themeLabels: { minimal: "Minimalny", dark: "Ciemny", playful: "Zabawny" },
    wheel: { name: "Ratunek na kolację", emoji: "🍜", toneLabel: "Przyjazny", toneEmoji: "😊", prompt: "Przyjazny ton: co jemy dziś wieczorem?", options: [
      { label: "Duża miska kojącego makaronu", weight: 9 }, { label: "Tacos i krótki spacer", weight: 8 }, { label: "Śniadanie na kolację", weight: 7 }, { label: "Wypróbuj zapisane miejsce", weight: 5 }, { label: "Tani i smaczny pewniak", weight: 8 }, { label: "Ugotuj raz, jutro zjedz resztę", weight: 6 },
    ] },
  },
  proof: ["Wsparcie AI", "Losowanie z wagami", "Siri + Skróty", "Linki na żywo do udostępniania"],
  how: {
    eyebrow: "Jak to działa", title: "Od wahania do decyzji.",
    steps: [
      { title: "Nazwij wybór", copy: "Wpisz go lub poproś Siri.", alt: "Ekran tworzenia koła z prośbą do Siri o pomysły na kolację" },
      { title: "Dopasuj opcje", copy: "Edytuj każdą możliwość i jej wagę.", alt: "Edytor tonu AI z sześcioma opcjami" },
      { title: "Zakręć. Działaj dalej.", copy: "Jeden wynik. Jeden następny krok.", alt: "Koło kolacji z wybranymi pierożkami w bulionie" },
    ],
  },
  features: {
    eyebrow: "Stworzone do prawdziwego życia", title: "Proste wtedy, kiedy trzeba.",
    stories: [
      { eyebrow: "Planowanie kilkoma kołami", title: "Ułóż cały plan.", copy: "Wylosuj razem miejsce, aktywność, budżet i godzinę.", alt: "Plan weekendu z kołami miejsca, nastroju i budżetu" },
      { eyebrow: "Widżet ekranu początkowego", title: "Zakręć jednym dotknięciem.", copy: "Trzymaj ulubione koło na ekranie początkowym.", alt: "Konfiguracja widżetu szybkiego obrotu na ekranie początkowym" },
      { eyebrow: "Studio udostępniania", title: "Udostępnij prawdziwe koło.", copy: "Wyślij obraz wyniku lub link, którym można zakręcić.", alt: "Studio udostępniania z opcjami obrazu wyniku i linku na żywo" },
    ],
  },
  themes: { eyebrow: "Dziesięć motywów", title: "Wybierz swój klimat.", copy: "Spokojny, zabawny, odważny albo coś pośrodku." },
  privacy: { eyebrow: "Prywatność od początku", title: "Twoje wybory zostają Twoje.", copy: "Zacznij lokalnie. Zaloguj się dopiero, gdy zechcesz synchronizować.", points: ["Tryb gościa", "Bezpłatna synchronizacja", "Eksport lub usunięcie"], link: "Przeczytaj Politykę prywatności", alt: "Ustawienia prywatności z eksportem danych, usunięciem konta i preferencjami reklam" },
  plans: {
    eyebrow: "Zacznij za darmo", title: "Płać za więcej miejsca, nie za podstawy.", copy: "Twórz, kręć, udostępniaj i synchronizuj bezpłatnie.",
    free: { name: "Bezpłatnie", title: "Twórz, kręć, synchronizuj.", points: ["Tryb gościa i koła lokalne", "Podstawowy limit AI", "Synchronizacja i przywracanie po zalogowaniu", "Motywy Minimalny i Ciemny"] },
    pro: { name: "Wheelora Pro", title: "Więcej miejsca na decyzje.", points: ["100 decyzji AI dziennie", "Miejsce na setki zapisanych kół", "Wszystkie motywy w zestawie"] },
  },
  waitlist: { eyebrow: "Najpierw na iPhone’a", title: "Przestań kręcić się w kółko.", copy: "Dołącz do listy. Napiszemy, gdy Wheelora będzie gotowa.", email: "Adres e-mail", join: "Dołącz do listy", appTitle: "Wheelora na iPhone’a", appHeading: "Gotowi, by przestać kręcić się w kółko?", openApp: "Otwórz Wheelora", store: "Zobacz w App Store", saving: "Zapisujemy Twoje miejsce…", success: "Jesteś na liście. Damy znać o starcie.", error: "Nie udało się teraz zapisać tego adresu. Spróbuj ponownie." },
  footer: { tagline: "Powiedz. Zakręć. Działaj.", links: ["Przewodnik po produkcie", "Dla deweloperów", "Najczęstsze pytania", "Pomoc", "Prywatność", "Usuń dane", "Warunki"] },
};

// Translations are added only after full copy review. Falling back to English keeps
// unpublished locale routes out of the build instead of indexing mixed-language pages.
export const HOME_COPY: Partial<Record<LocaleCode, HomeCopy>> = { en, "zh-Hans": zhHans, "zh-Hant": zhHant, es, fr, de, ja, ko, "pt-BR": ptBR, "pt-PT": ptPT, it, nl, ru, ar, hi, id, vi, th, tr, pl };

export function getHomeCopy(locale: LocaleCode): HomeCopy | undefined {
  return HOME_COPY[locale];
}
