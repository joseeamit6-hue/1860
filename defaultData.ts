import { CMSData } from "../types";

export const DEFAULT_CMS_DATA: CMSData = {
  settings: {
    siteName: "Amit Joshi",
    connectTextEN: "Connect with me",
    connectTextNP: "मलाई सम्पर्क गर्नुहोस्",
    faviconUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    nepaliFlagUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg",
    headerBgUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&h=400&fit=crop",
    temporaryMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.316259495145!2d85.291113!3d27.7089559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1565575845!2sKathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2snp!4v1690000000000!5m2!1sen!2snp",
    permanentMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.6462140411!2d80.5222018!3d29.273641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a3f20ba8f3e5db%3A0xc665796a71391696!2sDarchula%20District%2C%20Nepal!5e0!3m2!1sen!2snp!4v1690000000001!5m2!1sen!2snp",
    adminPasswordHash: "123456", // simplified password for demonstration / fallback config
    whatsappNumber: "9779848722222", // Amit Joshi's sample whatsapp
    contactEmail: "amitjoci28@gmail.com",
    customPopupActive: true,
    customPopupTitleEN: "🚀 Special Announcement!",
    customPopupTitleNP: "🚀 विशेष घोषणा!",
    customPopupTextEN: "Welcome to my personal cyber-portfolio! Feel free to explore my custom tools and leave suggestions.",
    customPopupTextNP: "मेरो व्यक्तिगत साइबर-पोर्टफोलियोमा स्वागत छ! मेरा अनुकूलित उपकरणहरू अन्वेषण गर्न र सुझावहरू दिन नहिचकिचाउनुहोस्।",
    customPopupImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
  },
  sliders: [
    {
      id: "slide-1",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop",
      titleEN: "Hello, I'm Amit Joshi",
      titleNP: "नमस्कार, म अमित जोशी",
      subtitleEN: "Full-Stack Web Architect & Tech Activist",
      subtitleNP: "फुल-स्ट्याक वेब आर्किटेक्ट र प्रविधि कार्यकर्ता"
    },
    {
      id: "slide-2",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop",
      titleEN: "Empowering Communities Through Tech",
      titleNP: "प्रविधि मार्फत समुदायलाई सशक्त बनाउँदै",
      subtitleEN: "Creating free-to-use digital utilities and localized tools",
      subtitleNP: "नि:शुल्क प्रयोग गर्न सकिने डिजिटल उपयोगिता र स्थानीयकृत उपकरणहरू सिर्जना गर्दै"
    },
    {
      id: "slide-3",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&h=900&fit=crop",
      titleEN: "Bespoke Cyber-Security Solutions",
      titleNP: "विशेष साइबर सुरक्षा समाधानहरू",
      subtitleEN: "Securing applications and digital spaces with high performance",
      subtitleNP: "उच्च प्रदर्शनका साथ एप्लिकेसन र डिजिटल स्पेस सुरक्षित गर्दै"
    }
  ],
  socials: [
    {
      id: "soc-fb",
      name: "Facebook",
      biographyEN: "Catch my personal updates and daily thoughts on my Facebook profile.",
      biographyNP: "मेरो फेसबुक प्रोफाइलमा मेरो व्यक्तिगत अपडेट र दैनिक विचारहरू हेर्नुहोस्।",
      iconName: "facebook",
      redirectUrl: "https://facebook.com/amit.joshi"
    },
    {
      id: "soc-ig",
      name: "Instagram",
      biographyEN: "A gallery of my travels, tech workspace, and local project diaries.",
      biographyNP: "मेरो यात्रा, प्रविधि कार्यस्थल, र स्थानीय परियोजना डायरीहरूको ग्यालेरी।",
      iconName: "instagram",
      redirectUrl: "https://instagram.com/amit.joshi"
    },
    {
      id: "soc-tt",
      name: "TikTok",
      biographyEN: "Watch micro-tutorials on frontend code and computer tips.",
      biographyNP: "फ्रन्टएन्ड कोड र कम्प्युटर सुझावहरूमा माइक्रो-ट्यूटोरियलहरू हेर्नुहोस्।",
      iconName: "tiktok",
      redirectUrl: "https://tiktok.com/@amit.joshi"
    },
    {
      id: "soc-wa",
      name: "WhatsApp",
      biographyEN: "Chat with me directly for service requests or rapid counseling.",
      biographyNP: "सेवा अनुरोध वा द्रुत परामर्शको लागि मलाई सिधै च्याट गर्नुहोस्।",
      iconName: "whatsapp",
      redirectUrl: "https://wa.me/9779848722222"
    },
    {
      id: "soc-mail",
      name: "Email",
      biographyEN: "Drop me an email for professional consultations or project proposals.",
      biographyNP: "व्यावसायिक परामर्श वा परियोजना प्रस्तावहरूको लागि मलाई इमेल पठाउनुहोस्।",
      iconName: "mail",
      redirectUrl: "mailto:amitjoci28@gmail.com"
    }
  ],
  initiatives: {
    facebookEmbedUrl: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Famitjoci28&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true",
    titleEN: "Sankalpa Tech Initiative",
    titleNP: "सङ्कल्प प्रविधि पहल",
    introEN: "Sankalpa Tech is focused on bringing digital awareness, security protocols, and free utilities to remote regions of Nepal.",
    introNP: "सङ्कल्प प्रविधि नेपालका दुर्गम क्षेत्रहरूमा डिजिटल सचेतना, सुरक्षा प्रोटोकल र नि:शुल्क उपयोगिताहरू पुर्‍याउन केन्द्रित छ।",
    detailsEN: "Founded by Amit Joshi, the Sankalpa Tech Initiative helps bridge the digital divide. We host training sessions on cybersecurity, digital literacy, and full-stack software development. Additionally, we create free, open-source localized digital forms and date convertors to empower rural Nepalese administrations.",
    detailsNP: "अमित जोशीद्वारा स्थापित, सङ्कल्प प्रविधि पहलले डिजिटल खाडललाई कम गर्न मद्दत गर्दछ। हामी साइबर सुरक्षा, डिजिटल साक्षरता, र फुल-स्ट्याक सफ्टवेयर विकासमा प्रशिक्षण सत्रहरू आयोजना गर्छौं। थप रूपमा, हामी ग्रामीण नेपाली प्रशासनहरूलाई सशक्त बनाउन नि:शुल्क, खुला स्रोत स्थानीयकृत डिजिटल फारमहरू र मिति रूपान्तरणहरू सिर्जना गर्छौं।",
    followUrl: "https://facebook.com/amitjoci28"
  },
  blogs: {
    iframeUrl: "https://blog.amitjoshi.info.np"
  },
  educations: [
    {
      id: "edu-1",
      institutionEN: "Tribhuvan University",
      institutionNP: "त्रिभुवन विश्वविद्यालय",
      shortIntroEN: "Bachelor of Science in Computer Science & Information Technology (B.Sc. CSIT)",
      shortIntroNP: "कम्प्युटर विज्ञान र सूचना प्रविधिमा स्नातक (B.Sc. CSIT)",
      detailsEN: "Graduated with honors, focusing on Advanced Algorithms, Cryptography, and Distributed Web Engineering. Authored a thesis on local language query optimization in databases.",
      detailsNP: "डाटाबेसमा स्थानीय भाषा क्वेरी अप्टिमाइजेसनमा थीसिस लेख्दै, उन्नत एल्गोरिदम, क्रिप्टोग्राफी, र वितरित वेब इन्जिनियरिङमा केन्द्रित भई सम्मानका साथ स्नातक उत्तीर्ण।",
      redirectUrl: "https://tu.edu.np"
    },
    {
      id: "edu-2",
      institutionEN: "Sankalpa Secondary School",
      institutionNP: "सङ्कल्प माध्यमिक विद्यालय",
      shortIntroEN: "Higher Secondary (10+2) Science Stream",
      shortIntroNP: "उच्च माध्यमिक (१०+२) विज्ञान संकाय",
      detailsEN: "Completed secondary education with top honors in Computer Science and Mathematics. Promoted regional coding championships.",
      detailsNP: "कम्प्युटर विज्ञान र गणितमा शीर्ष सम्मानका साथ माध्यमिक शिक्षा पूरा। क्षेत्रीय कोडिङ च्याम्पियनशिपहरू प्रवर्द्धन गरे।",
      redirectUrl: "https://sankalpaschool.edu.np"
    }
  ],
  tools: [
    {
      id: "tool-1",
      titleEN: "Bikram Sambat Date Converter",
      titleNP: "विक्रम संवत मिति रूपान्तरक",
      shortIntroEN: "Convert dates seamlessly between Gregorian (AD) and Nepali (BS) calendars.",
      shortIntroNP: "ग्रेगोरियन (AD) र नेपाली (BS) पात्रोहरू बीच निर्बाध रूपमा मितिहरू रूपान्तरण गर्नुहोस्।",
      logoUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=100&h=100&fit=crop",
      redirectUrl: "https://blog.amitjoshi.info.np/date-converter"
    },
    {
      id: "tool-2",
      titleEN: "Nepali Unicode Converter",
      titleNP: "नेपाली युनिकोड रूपान्तरक",
      shortIntroEN: "Type in Romanized English and convert instantly into high-quality Nepali Unicode.",
      shortIntroNP: "रोमनाइज्ड अंग्रेजीमा टाइप गर्नुहोस् र तुरुन्तै उच्च गुणस्तरको नेपाली युनिकोडमा रूपान्तरण गर्नुहोस्।",
      logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&h=100&fit=crop",
      redirectUrl: "https://blog.amitjoshi.info.np/unicode"
    },
    {
      id: "tool-3",
      titleEN: "Local Government Form Filler",
      titleNP: "स्थानीय सरकार फारम भर्ने उपकरण",
      shortIntroEN: "A digital wizard that helps citizens draft citizenship, vital registrations and license applications.",
      shortIntroNP: "एक डिजिटल विजार्ड जसले नागरिकहरूलाई नागरिकता, महत्त्वपूर्ण दर्ता र इजाजतपत्र आवेदनहरू मस्यौदा गर्न मद्दत गर्दछ।",
      logoUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=100&h=100&fit=crop",
      redirectUrl: "https://blog.amitjoshi.info.np/form-filler"
    }
  ],
  interests: [
    {
      id: "int-1",
      titleEN: "Ethical Hacking & Web Auditing",
      titleNP: "नैतिक ह्याकिङ र वेब अडिटिङ",
      shortIntroEN: "Discovering software security leaks and protecting public databases.",
      shortIntroNP: "सफ्टवेयर सुरक्षा चुहावट पत्ता लगाउने र सार्वजनिक डाटाबेस सुरक्षित गर्ने।",
      detailsEN: "I conduct white-hat security diagnostics on Nepali web resources to ensure citizen records are locked against malicious actors.",
      detailsNP: "म नेपाली वेब स्रोतहरूमा व्हाइट-ह्याट सुरक्षा निदान सञ्चालन गर्छु ताकि नागरिक रेकर्डहरू दुर्भावनापूर्ण अभिनेताहरू विरुद्ध लक गरिएको छ भनेर सुनिश्चित गर्न सकियोस्।",
      logoUrl: "ShieldAlert"
    },
    {
      id: "int-2",
      titleEN: "Cyber-Volunteerism",
      titleNP: "साइबर-स्वयंसेवा",
      shortIntroEN: "Teaching computer networks and online safety to secondary school pupils.",
      shortIntroNP: "माध्यमिक विद्यालयका विद्यार्थीहरूलाई कम्प्युटर नेटवर्क र अनलाइन सुरक्षा सिकाउने।",
      detailsEN: "Participating in community campaigns to raise digital hygiene awareness and prevent social media fraud.",
      detailsNP: "डिजिटल स्वच्छता सचेतना जगाउन र सामाजिक सञ्जाल ठगी रोक्न सामुदायिक अभियानहरूमा भाग लिने।",
      logoUrl: "Users"
    }
  ],
  services: [
    {
      id: "srv-1",
      titleEN: "E-Governance Form Advisory",
      titleNP: "ई-गभर्नेन्स फारम सल्लाहकार",
      shortIntroEN: "Comprehensive aid for drafting official government forms and administrative paperwork.",
      shortIntroNP: "आधिकारिक सरकारी फारमहरू र प्रशासनिक कागजी कार्यहरू मस्यौदा गर्न व्यापक सहायता।",
      detailsEN: "Complete navigation for digital registration procedures, vital stat document filling, and driving permit entries. Get professional support step-by-step.",
      detailsNP: "डिजिटल दर्ता प्रक्रियाहरू, महत्त्वपूर्ण तथ्याङ्क कागजात भर्ने, र ड्राइभिङ अनुमति प्रविष्टिहरूको लागि पूर्ण नेभिगेसन। चरण-दर-चरण व्यावसायिक समर्थन प्राप्त गर्नुहोस्।",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
      redirectUrl: "https://amitjoshi.info.np/service/forms",
      helpWhatsappMessageEN: "Hello Amit, I need your professional guidance with filling a Government Registration form. Could you help?",
      helpWhatsappMessageNP: "नमस्कार अमित, मलाई सरकारी दर्ता फारम भर्न तपाईंको व्यावसायिक मार्गदर्शन चाहिन्छ। मलाई मद्दत गर्न सक्नुहुन्छ?"
    },
    {
      id: "srv-2",
      titleEN: "Bespoke Web Development",
      titleNP: "अनुकूलित वेब विकास",
      shortIntroEN: "Ultra-fast, fully responsive single-page applications optimized for localized deployments.",
      shortIntroNP: "स्थानीयकृत डिप्लोइमेन्टका लागि अनुकूलित अति-द्रुत, पूर्ण उत्तरदायी एकल-पृष्ठ एप्लिकेसनहरू।",
      detailsEN: "Crafted in modern React, Tailwind, and Node.js. Tailored for community portals, local directories, and dynamic blogs with lightweight backends.",
      detailsNP: "आधुनिक React, Tailwind, र Node.js मा निर्मित। हल्का ब्याकइन्ड भएका सामुदायिक पोर्टलहरू, स्थानीय डाइरेक्टरीहरू, र गतिशील ब्लगहरूका लागि उपयुक्त।",
      imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
      redirectUrl: "https://amitjoshi.info.np/service/web",
      helpWhatsappMessageEN: "Hello Amit, I am interested in building a high-speed React/Tailwind website. Please provide custom templates.",
      helpWhatsappMessageNP: "नमस्कार अमित, म उच्च गतिको React/Tailwind वेबसाइट निर्माण गर्न इच्छुक छु। कृपया मलाई सहयोग गर्नुहोस्।"
    }
  ],
  adminLog: {
    lastLoggedInEmail: "amitjoci28@gmail.com",
    lastLoggedInTime: "2026-07-17 12:45 PM",
    previousLoggedInTime: "2026-07-16 09:30 AM",
    lastModification: "Seeded initial cyber-portfolio template.",
    viewerCount: 142
  }
};
