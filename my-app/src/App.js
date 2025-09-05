import React, { useState, useRef, useEffect, useMemo } from "react";

const h = React.createElement;

// Helpers
const isLocalhost = () => ['localhost','127.0.0.1','[::1]'].includes((typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : '');
const validateEmail = (s) => /.+@.+\..+/.test(s);
const validatePhone = (s) => /^[6-9][0-9]{9}$/.test(s); // Indian numbers only
function describeMediaError(e) {
  const name = e?.name || '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') return 'Permission denied. Please allow camera access in your browser settings.';
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'No camera detected. Attach a camera or use the upload fallback.';
  if (name === 'NotReadableError' || name === 'TrackStartError') return 'Camera is in use by another application. Close other apps and retry.';
  if (name === 'OverconstrainedError') return 'Camera constraints not satisfied. Try default settings.';
  if (name === 'SecurityError') return 'Browser blocked camera due to insecure context. Use HTTPS or localhost.';
  return 'Unable to access camera.';
}

const RAW_COURSES = [
  // Design/Web/Media
  { name: 'Graphic Designing', duration: '4 Months', fee: '₹15,000', description: 'Sketching, Photoshop, Corel Draw, Illustrator & InDesign.', category: 'Design', keywords: 'graphics design photoshop illustrator indesign coreldraw portfolio' },
  { name: 'Web Technologies', duration: '4 Months', fee: '₹20,000', description: 'HTML, CSS, JavaScript, Python, Django & Project-based learning.', category: 'Web', keywords: 'web html css javascript python django fullstack project' },
  { name: 'Website Designing & Development', duration: '1 Year', fee: '₹65,000', description: 'Photoshop, Animate, XD, HTML, CSS, JS, PHP, WordPress & Projects.', category: 'Web', keywords: 'website frontend backend php wordpress html css javascript' },
  { name: 'Multimedia & Animation', duration: '1 Year', fee: '₹65,000', description: 'Photoshop, MAYA, 3D StudioMax, After Effects, Premiere.', category: 'Media', keywords: 'multimedia animation maya 3dsmax vfx after effects premiere' },

  // Digital Marketing
  { name: 'Digital Marketing', duration: '3 Months (Weekend)', fee: '₹25,000', description: 'Google Ads, Facebook, LinkedIn, Instagram, SEO, Content, Email, Affiliate, Analytics.', category: 'Marketing', keywords: 'digital marketing seo sem google ads social media content email affiliate analytics' },

  // IT Diplomas/Certs
  { name: 'Advance Diploma in Software Technology (DAST)', duration: '2 Years', fee: '₹48,000 (installments)', description: 'Comprehensive software foundations: programming, DB, projects; industry-oriented.', category: 'IT', keywords: 'software diploma programming database projects career it' },
  { name: 'DOEACC O Level', duration: '1 Year', fee: '₹20,000', description: 'Nationally recognized foundation in IT: programming & computing fundamentals.', category: 'IT', keywords: 'doeacc o level nielit foundation it programming' },

  // Networking/Sysadmin
  { name: 'Advanced Diploma in Computer Hardware & Networking (ADCHN)', duration: '15 Months', fee: '₹32,000', description: 'PC hardware, OS, networks, troubleshooting; service-ready skills.', category: 'IT', keywords: 'hardware networking adchn troubleshooting pc os' },
  { name: 'Computer Hardware & Networking (CHN)', duration: '1 Year', fee: '₹24,000', description: 'Hardware assembly, OS, networking concepts; field service basics.', category: 'IT', keywords: 'chn computer hardware networking field service' },
  { name: 'Advanced Networking', duration: '6 Months', fee: '₹15,000', description: 'Routing/switching fundamentals and practical networking labs.', category: 'IT', keywords: 'advanced networking routing switching labs' },
  { name: 'MCP + CCNA', duration: '120 Hours', fee: '₹8,000', description: 'Microsoft Certified Professional + Cisco CCNA prep.', category: 'IT', keywords: 'mcp ccna microsoft cisco network admin' },
  { name: 'CCNA', duration: '80 Hours', fee: '₹6,000', description: 'Cisco Certified Network Associate preparation course.', category: 'IT', keywords: 'ccna networking cisco routing switching' },
  { name: 'Linux Administration', duration: '80 Hours', fee: '₹6,000', description: 'Linux server administration essentials for IT roles.', category: 'IT', keywords: 'linux admin server sysadmin' },

  // Programming/DB/Cloud/Mobile
  { name: 'Python Programming', duration: '80 Hours', fee: '₹6,000', description: 'Core Python for scripting, apps, and backend workflows.', category: 'IT', keywords: 'python programming scripting backend' },
  { name: 'Core Java', duration: '60 Hours', fee: '₹6,000', description: 'Java fundamentals, OOP, collections, and core APIs.', category: 'IT', keywords: 'java core oop collections' },
  { name: 'Advanced Java', duration: '60 Hours', fee: '₹7,000', description: 'Advanced Java topics for enterprise development.', category: 'IT', keywords: 'advanced java enterprise' },
  { name: '.NET Technologies', duration: '120 Hours', fee: '₹12,000', description: 'Microsoft .NET application development track.', category: 'IT', keywords: '.net c# microsoft development' },
  { name: 'C/C++ & OOP', duration: '60 Hours', fee: '₹5,000', description: 'C and C++ programming with object-oriented concepts.', category: 'IT', keywords: 'c c++ cpp oop programming' },
  { name: 'SQL Server', duration: '40 Hours', fee: '₹5,000', description: 'Relational databases, T-SQL, and administration basics.', category: 'IT', keywords: 'sql server database tsql' },
  { name: 'Oracle Developer/DBA', duration: '60 Hours', fee: '₹6,000', description: 'Oracle DB developer and DBA essential skills.', category: 'IT', keywords: 'oracle developer dba database' },
  { name: 'Cloud Computing', duration: '40 Hours', fee: '₹8,000', description: 'Cloud concepts and services; hands-on orientation.', category: 'IT', keywords: 'cloud computing' },
  { name: 'Big Data / Hadoop', duration: '2 Months', fee: '₹10,000', description: 'Big data fundamentals and Hadoop ecosystem overview.', category: 'IT', keywords: 'big data hadoop' },
  { name: 'Android App Development', duration: '100 Hours', fee: '₹12,000', description: 'Android fundamentals for mobile app development.', category: 'IT', keywords: 'android mobile app development' },
  { name: 'Advanced Excel & VBA', duration: '40 Hours', fee: '₹6,000', description: 'Excel power tools, automation with VBA macros.', category: 'IT', keywords: 'excel vba automation' },

  // Government trade
  { name: 'NCVT COPA (Computer Operator & Programming Assistant)', duration: '1 Year', fee: '₹10,200', description: 'Govt trade: operator & programming fundamentals; merit-based intake.', category: 'IT', keywords: 'ncvt copa operator programming government trade' },

  // Projects
  { name: 'Project Training (B.Tech/BCA/MCA)', duration: '40–120 Hours', fee: '₹5,000', description: 'Guided industrial projects aligned to academics.', category: 'IT', keywords: 'project training btech bca mca industry' },

  // Web/Multi specializations
  { name: 'Graphics for Webpage Designing', duration: '6 Months', fee: '₹25,000', description: 'Graphics + basic web: Photoshop, CorelDraw, Illustrator, InDesign, HTML, CSS + project.', category: 'Web', keywords: 'graphics web photoshop illustrator html css project' },
  { name: 'Graphics & Web Designer', duration: '8 Months', fee: '₹38,000', description: 'Photoshop, XD, HTML, CSS, Sass, Bootstrap, JS, jQuery, AngularJS, MySQL, WordPress + project.', category: 'Web', keywords: 'graphics web designer xd bootstrap javascript angular wordpress' },
  { name: 'Advance Web Technologies (PHP Track)', duration: '8 Months', fee: '₹38,000', description: 'Photoshop, HTML, CSS, JS, Ajax, MySQL, Core & Advanced PHP + project.', category: 'Web', keywords: 'php mysql ajax javascript web advanced' },
  { name: '2D Animation & Character Motion Artist', duration: '5 Months', fee: '₹25,000', description: 'Adobe Animate, Photoshop, Illustrator, After Effects + project.', category: 'Media', keywords: '2d animation character motion after effects animate' },
  { name: '3D Interior & Walkthrough Designers', duration: '6 Months', fee: '₹35,000', description: 'Photoshop, 3D Studio Max, V-Ray, After Effects + project.', category: 'Media', keywords: '3d interior walkthrough 3dsmax vray after effects' },
  { name: 'Advance Diploma in Multimedia & Animation', duration: '15 Months', fee: '₹75,000', description: 'Photoshop, MAYA, 3D Studio Max, V-Ray, After Effects, Premiere Pro + project.', category: 'Media', keywords: 'multimedia animation maya 3dsmax vfx diploma' },
  { name: 'Digital Movie Editing & VFX', duration: '3 Months', fee: '₹18,000', description: 'Photoshop, Premiere Pro, After Effects + project.', category: 'Media', keywords: 'video editing vfx premiere after effects' },

  // Embedded/Automation/IoT
  { name: 'Internet of Things (IoT)', duration: '4 Months', fee: '₹20,000', description: 'Raspberry Pi, 8051, Arduino, Linux, Python, Cloud & IoT projects.', category: 'Embedded', keywords: 'iot arduino raspberry pi linux python cloud embedded' },
  { name: 'Arduino Board Based Advanced Embedded System', duration: '3 Months', fee: '₹18,000', description: 'Embedded development using Arduino, sensors, actuators and projects.', category: 'Embedded', keywords: 'arduino embedded sensors actuators' },
  { name: 'Industrial Automation Specialist', duration: '4 Months', fee: '₹25,000', description: 'PLC, HMI, SCADA, VFD, sensors and industrial control systems.', category: 'Automation', keywords: 'plc hmi scada vfd industrial automation' },
  { name: 'Advanced Industrial Automation with Mechatronics', duration: '6 Months', fee: '₹30,000', description: 'Mechatronics integration with PLC/Robotics and automation systems.', category: 'Automation', keywords: 'mechatronics robotics automation plc' },

  // Hardware repair / Foundation IT
  { name: 'Laptop Repairing', duration: '120 Hours', fee: '₹8,000', description: 'Laptop diagnostics, component & board-level basics, OS reinstallation.', category: 'IT', keywords: 'laptop repairing hardware diagnostics os' },
  { name: 'Mobile Repairing', duration: '80 Hours', fee: '₹7,000', description: 'Smartphone hardware & software repair training.', category: 'IT', keywords: 'mobile repairing smartphone hardware software' },
  { name: 'MS Office & Internet', duration: '60 Hours', fee: '₹4,000', description: 'Office productivity: Word, Excel, PowerPoint, email & internet basics.', category: 'IT', keywords: 'ms office internet excel word powerpoint' },
  { name: 'Diploma in Computer Applications (DCA)', duration: '6 Months', fee: '₹15,000', description: 'Foundational computing applications and productivity toolkit.', category: 'IT', keywords: 'dca computer applications foundation' },

  // Entrepreneur/NSIC
  { name: 'NSIC Incubation (Incubator Program)', duration: '6 Months', fee: 'Variable / Contact NSIC', description: 'Incubation support, mentoring, infrastructure and market connect.', category: 'Entrepreneurship', keywords: 'incubation startup mentor infrastructure' },
  { name: 'NSIC Incubator Courses (Entrepreneurship)', duration: '2 Months', fee: '₹15,000', description: 'Business operations, finance, marketing & scaling for startups.', category: 'Entrepreneurship', keywords: 'entrepreneurship business finance marketing scaling' },

  // Short-term
  { name: 'Short-term Certificate Courses', duration: '1 Day - 2 Weeks', fee: '₹500 - ₹5,000', description: 'Skill-focused short courses for rapid upskilling.', category: 'Short', keywords: 'short-term certificate skill upskilling' },

  // Electrical Maintenance legacy
  { name: 'Electrical Maintenance', duration: '3 Months', fee: '₹22,000', description: 'Industrial electrical systems installation, troubleshooting & safety.', category: 'Electrical', keywords: 'electrical maintenance industrial safety' },

  // Electronics & Electrical (expanded)
  { name: 'Industrial Automation (Module-1): Allen Bradley (PLC & SCADA)', duration: '1 Month', fee: '₹5,000', description: 'Allen Bradley PLC & SCADA fundamentals; digital I/O and basic programming.', category: 'Automation', keywords: 'plc scada allen bradley ab digital io programming' },
  { name: 'Industrial Automation (Module-2): AB PLC/SCADA/VFD & Delta PLC/SCADA/HMI', duration: '2 Months', fee: '₹10,000', description: 'Allen Bradley + Delta PLC, SCADA, HMI; includes VFD exposure and labs.', category: 'Automation', keywords: 'plc scada vfd delta hmi ab labs' },
  { name: 'Industrial Automation (Module-3): Delta PLC/SCADA/HMI/VFD, Intouch SCADA, Mitsubishi PLC & HMI', duration: '2 Months', fee: '₹12,000', description: 'Delta/Mitsubishi PLC & HMI; Intouch SCADA; advanced digital I/O practice.', category: 'Automation', keywords: 'delta mitsubishi plc hmi intouch scada vfd' },
  { name: 'Advance Industrial Automation', duration: 'Varies', fee: 'Contact', description: 'Multi-brand PLC/SCADA/HMI/VFD (Delta/Mitsubishi/Siemens/Allen Bradley) advanced labs.', category: 'Automation', keywords: 'siemens allen bradley delta mitsubishi advanced plc scada hmi vfd' },
  { name: 'Advance Industrial Automation with Mechatronics (Robotics/DCS)', duration: '6 Months', fee: '₹30,000', description: 'DCS (Siemens), vision system, pick & place robot, palletizing cell, ABB welding robot.', category: 'Automation', keywords: 'mechatronics robotics dcs siemens abb welding robot vision palletizing' },
  { name: 'Advance Diploma Program in Embedded System', duration: '6 Months', fee: '₹30,000', description: 'Power Electronics; 8051/AVR/ARM/PIC (any three), Arduino, IoT; projects.', category: 'Embedded', keywords: 'embedded 8051 avr arm pic arduino power electronics iot' },
  { name: 'Embedded System with Arduino', duration: '2 Months', fee: '₹12,000', description: '8051 + Arduino fundamentals and interfacing for embedded projects.', category: 'Embedded', keywords: 'embedded 8051 arduino interfacing projects' },
  { name: 'Advance Embedded System with Arduino', duration: '3 Months', fee: '₹18,000', description: '8051 + AVR + Arduino; layered microcontroller pathway with projects.', category: 'Embedded', keywords: 'embedded avr 8051 arduino microcontroller projects' },
  { name: 'Advance Embedded System with PCB & Circuit Designing', duration: '3–4 Months', fee: '₹18,000–₹20,000', description: '8051/Arduino/Raspberry Pi plus PCB layout & circuit design workflow.', category: 'Embedded', keywords: 'pcb circuit design proteus kicad raspberry pi 8051 arduino' },
  { name: 'PCB Design, Analysis & Manufacturing (Proteus & KiCAD)', duration: '6 Weeks', fee: '₹10,000', description: 'Proteus/KiCAD design, analysis, and manufacturing techniques.', category: 'Electronics', keywords: 'pcb proteus kicad manufacturing analysis' },
  { name: 'Industrial Training in PCB & Circuit Designing (Proteus)', duration: '1 Month', fee: '₹5,000', description: 'Hands-on PCB & circuit design practice using Proteus.', category: 'Electronics', keywords: 'pcb proteus circuit design industrial training' },
  { name: 'Power Electronics (Active/Passive Components)', duration: '1 Month', fee: '₹5,000', description: 'Component behavior and power device basics for ECE/ELE/Instrumentation.', category: 'Electronics', keywords: 'power electronics components devices ece ele instrumentation' },
  { name: 'Internet of Things (IoT) – Electronics Track', duration: '2 Months', fee: '₹12,000', description: 'Raspberry Pi, Linux, Python, protocols, cloud, 8051, Arduino, sensors.', category: 'Embedded', keywords: 'iot raspberry pi linux python protocols cloud 8051 arduino sensors' },
  { name: 'Advance Diploma in Electrician', duration: '12 Months', fee: '₹28,000', description: '1/3-phase, AC/DC, wiring systems, earthing, MCB/MCCB/RCCB, PF, DG, motors, panels, transformers, solar, LED, CCTV.', category: 'Electrical', keywords: 'electrician wiring earthing mcb mccb rccb power factor dg motors panels transformers solar led cctv' },
  { name: 'Industrial Electrical Panels & Wiring System', duration: '3 Months', fee: '₹10,000', description: 'Panel building, wiring systems, safety standards; industry labs.', category: 'Electrical', keywords: 'electrical panels wiring safety standards' },
  { name: 'Industrial Circuit & Power House Maintenance', duration: '3 Months', fee: '₹10,000', description: 'DG, transformer, busbar, capacitor panel, substation; maintenance.', category: 'Electrical', keywords: 'power house maintenance dg transformer busbar capacitor substation' },
  { name: 'CCTV Installation & Repair', duration: '2 Months', fee: '₹12,000', description: 'CCTV system setup, installation, troubleshooting, maintenance.', category: 'Electronics', keywords: 'cctv installation repair maintenance' },
  { name: 'LED Bulb Manufacturing & Repair', duration: '2 Months', fee: '₹10,000', description: 'LED bulb technology, assembly, testing, and repair.', category: 'Electronics', keywords: 'led bulb manufacturing testing repair' },
  { name: 'Entrepreneurship Development Programme on Solar Energy', duration: '3 Days', fee: '₹6,500', description: 'Solar PV fundamentals and entrepreneurship orientation.', category: 'Energy', keywords: 'solar pv entrepreneurship' },

  // NEW: Beauty & Fashion (added)
  { name: 'Garment Designing and Boutique Management', duration: '3 Months', fee: '₹12,000', description: 'End-to-end boutique operations paired with garment design fundamentals for small business readiness.', category: 'Beauty & Fashion', keywords: 'boutique management garment designing fashion retail operations small business' },
  { name: 'Pattern Making', duration: '3 Months', fee: '₹12,000', description: 'Paper pattern making for garments: measurement, drafting, fit corrections, and cutting plans.', category: 'Beauty & Fashion', keywords: 'pattern making paper pattern drafting tailoring garments cutting fit' },
  { name: 'Dress Making', duration: '1 Month', fee: '₹1,500', description: 'Dress construction basics: seams, hems, darts, closures, fitting and finishing techniques.', category: 'Beauty & Fashion', keywords: 'dress making stitching tailoring fitting finishing seams hems closures' },
  { name: 'Quilting Work', duration: '1 Month', fee: '₹1,500', description: 'Quilting techniques, material selection, stitch patterns, binding and product finishing.', category: 'Beauty & Fashion', keywords: 'quilting stitching patterns binding materials home boutique products' },
  { name: 'Advanced Beauty Care', duration: '3 Months', fee: '₹15,000', description: 'Advanced cosmetology: facials, skin/hair care services, hygiene and client consultation.', category: 'Beauty & Fashion', keywords: 'beauty cosmetology advanced facial skin care hair care hygiene salon' },
  { name: 'Professional Make-up', duration: '6 Weeks', fee: '₹10,000', description: 'Professional makeup techniques for events and bridal work; tools, looks, and hygiene.', category: 'Beauty & Fashion', keywords: 'makeup professional bridal looks tools techniques hygiene' },
  { name: 'Bridal Make-up', duration: '3 Weeks', fee: '₹5,000', description: 'Professional makeup techniques for events and bridal work; tools, looks, and hygiene.', category: 'Beauty & Fashion', keywords: 'makeup professional bridal looks tools techniques hygiene' },
  { name: 'Hair Cutting', duration: '3 Weeks', fee: '₹1,500', description: 'Foundational hair cutting, sectioning, safety, and finishing methods for salon roles.', category: 'Beauty & Fashion', keywords: 'hair cutting salon basics sectioning finishing safety' },
];

const COURSES = Array.from(
  RAW_COURSES.reduce((map, c) => {
    if (!map.has(c.name)) map.set(c.name, c);
    return map;
  }, new Map())
  .values()
);

/**
 * HERO
 */
const HERO_IMAGES = [
  'https://www.nsic.co.in/images/photos/okhla/1.jpg',
  'https://www.nsic.co.in/mediarooms/2021325181514.jpg',
  'https://i.ytimg.com/vi/pf9H-3MorsY/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGUgUihBMA8=&rs=AOn4CLAogor2rZD068dj0z12AS38VpHh_Q'
];

// Detail bullets retained for richer panel
const COURSE_DETAILS = {
  'Graphic Designing': {
    summary: 'Intensive graphics course focusing on industry-standard tools and practical design workflows.',
    bullets: [
      'Tools: Photoshop, Corel Draw, Illustrator, InDesign.',
      'Output: Brand assets, print-ready layouts, UI assets, portfolio projects.',
      'Eligibility: 10th pass with basic computer knowledge.',
      'Emphasis: Practical training with hands-on lab sessions.'
    ]
  },
  'Web Technologies': {
    summary: 'Full-stack oriented web technologies track with modern languages and frameworks.',
    bullets: [
      'Stack: HTML, CSS, JavaScript, MySQL, Python, Django.',
      'Project-based learning with end-to-end web application workflow.',
      'Industry-oriented syllabus with practical exposure.'
    ]
  },
  'Website Designing & Development': {
    summary: 'Comprehensive website design and development diploma with front-end, CMS, and PHP.',
    bullets: [
      'Tools/Tech: Photoshop, Adobe Animate, Adobe XD, HTML, CSS, Sass, Bootstrap, JavaScript, jQuery, AngularJS.',
      'Back-end/CMS: MySQL, WordPress, Joomla, Ajax, Core & Advance PHP.',
      'Includes a guided capstone project; diploma-style structure.'
    ]
  },
  'Multimedia & Animation': {
    summary: 'Advanced multimedia and animation suite with 2D/3D, compositing, and editing.',
    bullets: [
      'Tools: Photoshop, MAYA, 3D Studio Max, V-Ray, After Effects, Premiere Pro.',
      'Focus: Modeling, animation, rendering, VFX, and post-production workflows.',
      'Project-centric with portfolio development.'
    ]
  },
  'Digital Marketing': {
    summary: 'Digital marketing program covering channels, tools, and campaign execution.',
    bullets: [
      'Topics: Google Ads, Facebook, LinkedIn, Instagram, Affiliate & Email Marketing.',
      'Core skills: SEO, Content Writing, analytics-driven optimization.',
      'Delivery: Practical, campaign-focused exercises.'
    ]
  }
};

/**
 * SMART RECOMMENDER
 */
function scoreCourse(c, prefs) {
  let score = 0;
  const hay = (c.name + ' ' + c.description + ' ' + (c.keywords || '') + ' ' + (c.category || '')).toLowerCase();
  const keywords = (prefs.interests || '').toLowerCase().split(/[, ]+/).filter(Boolean);
  keywords.forEach(k => { if (hay.includes(k)) score += 15; });

  const goal = (prefs.goal || '').toLowerCase();
  if (goal.includes('job') || goal.includes('placement')) {
    if (/web|website|digital|mobile|electrical|automation|multimedia|repair|it|software|network|embedded|electronics/i.test(hay)) score += 10;
  }
  if (goal.includes('business') || goal.includes('startup') || goal.includes('entrepreneur')) {
    if (/incubation|entrepreneur/i.test(hay)) score += 18;
    if (/digital marketing|website|web|wordpress|shop|solar/i.test(hay)) score += 8;
  }
  if (goal.includes('short') || goal.includes('quick') || goal.includes('fast') || goal.includes('crash')) {
    if (/short|1 day|weeks|2 months|3 months|4 months|80 hours|60 hours|40 hours|120 hours/i.test(hay)) score += 10;
  }

  if (prefs.maxMonths) {
    const m = /(\d+)\s*Month/i.exec(c.duration);
    const months = m ? parseInt(m[1], 10) : (c.duration.includes('Year') ? 12 : (c.duration.toLowerCase().includes('hours') ? 1 : 6));
    if (months <= prefs.maxMonths) score += 12; else score -= 8;
  }

  if (prefs.maxFee) {
    const feeNum = parseInt((c.fee || '').replace(/[^\d]/g, ''), 10) || 0;
    if (feeNum && feeNum <= prefs.maxFee) score += 12; else if (feeNum) score -= 6;
  }

  const bg = (prefs.background || '').toLowerCase();
  if (bg.includes('it') || bg.includes('tech') || bg.includes('engineering') || bg.includes('ece') || bg.includes('cse')) {
    if (/web|website|iot|arduino|automation|electrical|python|php|wordpress|java|linux|network|cloud|android|sql|oracle|excel|vba|pcb|power/i.test(hay)) score += 8;
  }
  if (bg.includes('arts') || bg.includes('design') || bg.includes('creative')) {
    if (/graphic|multimedia|animation|photoshop|illustrator|premiere|after effects|xd/i.test(hay)) score += 8;
  }

  return Math.max(0, score);
}

export default function NSICKiosk() {
  // states
  const [step, setStep] = useState(1); // 1:welcome 2:courses 3:form 4:photo 5:payment
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'' });
  const [cameraError, setCameraError] = useState('');
  const [captured, setCaptured] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // hero banner state
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  // payment state (Step 5)
  const [paymentMethod, setPaymentMethod] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');

  // SMART RECOMMENDER state (lives in Step 2 UI)
  const [prefs, setPrefs] = useState({
    goal: '',
    interests: '',
    maxMonths: '',
    maxFee: '',
    background: ''
  });
  const [showRec, setShowRec] = useState(true);

  // refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileRef = useRef(null);

  // Small test cases
  useEffect(() => {
    const tests = [
      { name: 'email valid', got: validateEmail('a@b.com'), want: true },
      { name: 'email invalid', got: validateEmail('a@b'), want: false },
      { name: 'phone valid', got: validatePhone('9876543210'), want: true },
      { name: 'phone invalid', got: validatePhone('98a6543210'), want: false }
    ];
    console.log('SELFTESTS', tests);
    return () => { stopCamera(); };
  }, []);

  // Hero auto-rotate
  useEffect(() => {
    if (heroPaused) return;
    const id = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [heroPaused]);

  // Enhanced smart search across fields
  const filteredCourses = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    if (!term) return COURSES;
    return COURSES.filter(c => {
      const blob = [
        c.name, c.description, c.duration, c.fee,
        c.category || '', c.keywords || ''
      ].join(' ').toLowerCase();
      return blob.includes(term);
    });
  }, [searchTerm]);

  // Compute recommendations (top 3)
  const recommendations = useMemo(() => {
    const mm = parseInt(prefs.maxMonths, 10) || undefined;
    const mf = parseInt(prefs.maxFee, 10) || undefined;
    const normalized = { ...prefs, maxMonths: mm, maxFee: mf };
    const scored = COURSES.map(c => ({ c, score: scoreCourse(c, normalized) }));
    scored.sort((a,b) => b.score - a.score);
    const top = scored.filter(x => x.score > 0).slice(0, 3).map(x => x.c.name);
    return top;
  }, [prefs]);

  function stopCamera() {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    } catch (e) {}
  }

  async function startCamera() {
    setCameraError('');
    stopCamera();

    if (!window.isSecureContext && !isLocalhost()) {
      setCameraError('Camera requires HTTPS or localhost. Please run on https:// or on localhost.');
      return null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API not available in this browser. Use the upload fallback.');
      return null;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideo = devices.some(d => d.kind === 'videoinput');
      if (!hasVideo) {
        setCameraError('No camera found on this device.');
        return null;
      }
    } catch (e) {}

    try {
      const constraints = { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        try { await videoRef.current.play(); } catch (e) {}
      }
      setCameraError('');
      return stream;
    } catch (e) {
      console.error('getUserMedia error', e);
      setCameraError(describeMediaError(e));
      return null;
    }
  }

  function capturePhoto() {
    const v = videoRef.current; const c = canvasRef.current;
    if (!v || !c) { setCameraError('Camera or canvas missing.'); return; }
    const w = v.videoWidth || 640; const h = v.videoHeight || 480;
    if (!w || !h) { setCameraError('Camera not ready. Please start camera and wait a moment.'); return; }
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.save(); ctx.translate(w,0); ctx.scale(-1,1);
    ctx.drawImage(v, 0, 0, w, h); ctx.restore();
    try { const data = c.toDataURL('image/jpeg', 0.9); setCaptured(data); }
    catch (e) { setCameraError('Failed to capture image.'); }
    stopCamera();
  }

  function onFileSelected(file) {
    setCameraError('');
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCaptured(String(reader.result));
    reader.onerror = () => setCameraError('Failed to read uploaded file.');
    reader.readAsDataURL(file);
  }

  async function submitApplication() {
  if (!selectedCourse) { alert('Please select a course.'); return; }
  if (!form.name || !validateEmail(form.email) || !validatePhone(form.phone) || !form.address) {
    alert('Please fill name, valid email, 10-digit phone, and address.'); 
    return;
  }
  if (!captured) { alert('Please capture or upload a photo before submitting.'); return; }

  const payload = {
    student: form,
    course: selectedCourse,
    photo: captured
  };

  try {
    const res = await fetch('http://localhost:5000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Server error');

    // got registration number from backend
    setRegistrationNo(data.registrationNo);
    alert('Application submitted successfully. Proceed to Payment.');
    setStep(5);
  } catch (e) {
    console.error(e);
    alert('Failed to submit. Please try again.');
  }
}


  // Payment handling - generate a random registration number
  async function confirmPayment() {
  if (!paymentMethod) { alert('Please select a payment method.'); return; }
  if (!registrationNo) { alert('Registration number missing. Please submit application again.'); return; }

  try {
    const res = await fetch(`http://localhost:5000/api/applications/${registrationNo}/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: paymentMethod })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Server error');

    alert('Payment method saved. Please keep your registration number safe.');
  } catch (e) {
    console.error(e);
    alert('Failed to save payment method. Try again.');
  }
}


  function resetAll() {
    setSelectedCourse(null);
    setForm({ name:'', email:'', phone:'', address:'' });
    setCaptured('');
    setPaymentMethod('');
    setRegistrationNo('');
    setSearchTerm('');
    setPrefs({ goal:'', interests:'', maxMonths:'', maxFee:'', background:'' });
    setStep(1);
  }

  function el(tag, props, ...children) { return h(tag, props, ...children); }

  // Used in Step 2 details panel
  function renderCourseDetails(name) {
    const d = COURSE_DETAILS[name];
    if (!d) return null;
    return el('div', { className: 'mt-2 text-left space-y-2' },
      el('div', { className: 'text-base font-semibold text-blue-900' }, 'Course details'),
      el('p', { className: 'text-sm leading-6 text-slate-700' }, d.summary),
      el('ul', { className: 'list-disc pl-5 text-[13px] leading-6 text-slate-700' },
        ...d.bullets.map((b, idx) => el('li', { key: idx }, b))
      ),
      el('p', { className: 'mt-2 text-slate-600 italic' }, 'Industry-oriented, practical curriculum delivered at NSIC Technical Services Centre, Okhla.')
    );
  }

  // Smart recommendation panel (Step 2) UI
  function renderRecPanel() {
    return el('div', { className: 'mb-4 p-4 rounded-xl border bg-slate-50' },
      el('div', { className: 'flex items-center justify-between mb-2' },
        el('div', { className: 'text-sm font-semibold text-blue-900' }, 'Smart course recommendations'),
        el('button', {
          className: 'text-xs px-2 py-1 rounded border',
          onClick: () => setShowRec(v => !v)
        }, showRec ? 'Hide' : 'Show')
      ),
      showRec && el('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm' },
        el('input', {
          className: 'border p-2 rounded',
          placeholder: 'Goal (e.g., Get a job / Start a business / Upskill)',
          value: prefs.goal,
          onChange: e => setPrefs({ ...prefs, goal: e.target.value })
        }),
        el('input', {
          className: 'border p-2 rounded',
          placeholder: 'Interests (e.g., web, python, design, automation)',
          value: prefs.interests,
          onChange: e => setPrefs({ ...prefs, interests: e.target.value })
        }),
        el('input', {
          className: 'border p-2 rounded',
          placeholder: 'Max months (e.g., 4)',
          inputMode: 'numeric',
          value: prefs.maxMonths,
          onChange: e => setPrefs({ ...prefs, maxMonths: e.target.value.replace(/[^\d]/g, '') })
        }),
        el('input', {
          className: 'border p-2 rounded',
          placeholder: 'Max fee (INR, e.g., 25000)',
          inputMode: 'numeric',
          value: prefs.maxFee,
          onChange: e => setPrefs({ ...prefs, maxFee: e.target.value.replace(/[^\d]/g, '') })
        }),
        el('input', {
          className: 'border p-2 rounded',
          placeholder: 'Background (e.g., IT, Arts, Engineering)',
          value: prefs.background,
          onChange: e => setPrefs({ ...prefs, background: e.target.value })
        }),
        el('div', { className: 'text-xs text-slate-500' },
          'Tip: Enter keywords like "python, wordpress, plc, maya" to refine suggestions.'
        )
      ),
      showRec && el('div', { className: 'mt-3' },
        recommendations.length
          ? el('div', null,
              el('div', { className: 'text-xs text-slate-600 mb-2' }, 'Top suggestions for the preferences provided:'),
              el('div', { className: 'flex flex-wrap gap-2' },
                ...recommendations.map((r, idx) =>
                  el('button', {
                    key: r,
                    className: `px-3 py-1 rounded-2xl border ${selectedCourse === r ? 'bg-blue-800 text-white' : 'bg-white hover:bg-slate-100'}`,
                    onClick: () => setSelectedCourse(r)
                  }, `${idx+1}. ${r}`)
                )
              )
            )
          : el('div', { className: 'text-xs text-slate-500' }, 'No suggestions yet. Add interests or adjust constraints.')
      )
    );
  }

  return el('div', { className: 'min-h-screen bg-slate-50 flex items-start justify-center p-6' },
    el('div', { className: 'w-full max-w-5xl' },
      el('header', { className: 'flex items-center justify-between mb-6' },
        el('div', { className: 'flex items-center gap-4' },
          el('div', {
className: 'h-20 w-20 rounded overflow-hidden bg-white border',
style: { backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAjG7PgP0EUdNN8qrz6ceKR9cXat7zKyw6Cw&s)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }
}),
          el('div', null,
            el('h1', { className: 'text-2xl font-semibold text-blue-800' }, 'NSIC Okhla Training Centre'),
            el('div', { className: 'text-sm text-slate-600' }, 'Self-service application')
          )
        ),
        el('div', { className: 'text-xs text-slate-500' }, 'Need help? Call: 011-26826801')
      ),

      el('div', { className: 'flex items-center gap-3 mb-4' },
        [1,2,3,4,5].map(i =>
          el('div', {
            key: i,
            className: `px-3 py-2 rounded-2xl ${i===step ? 'bg-blue-800 text-white' : i<step ? 'bg-green-600 text-white' : 'bg-white border'}`
          }, `Step ${i}`)
        )
      ),

      el('div', { className: 'bg-white p-6 rounded-xl shadow' },
        // Step 1
        step === 1 && el('div', { className: 'text-center py-12' },
          el('h2', { className: 'text-3xl font-bold text-blue-800 mb-3' }, 'Welcome to NSIC Okhla'),
          el('p', { className: 'text-slate-700 mb-6' }, 'Explore training programmes and apply.'),
          // Hero Banner above the button
          el('div', {
            className: 'mb-6 relative rounded-xl overflow-hidden border bg-slate-100',
            onMouseEnter: () => setHeroPaused(true),
            onMouseLeave: () => setHeroPaused(false)
          },
            el('div', { className: 'aspect-[16/9] w-full bg-black' },
              el('img', {
                src: HERO_IMAGES[heroIndex],
                alt: 'NSIC Okhla Hero',
                className: 'w-full h-full object-cover',
                onError: () => {
                  const next = (heroIndex + 1) % HERO_IMAGES.length;
                  setHeroIndex(next);
                }
              })
            ),
            el('div', { className: 'absolute bottom-2 left-0 right-0 flex justify-center gap-2' },
              HERO_IMAGES.map((_, i) =>
                el('button', {
                  key: `dot-${i}`,
                  className: `h-2 w-2 rounded-full ${i === heroIndex ? 'bg-white' : 'bg-white/50'} border border-white/70`,
                  onClick: () => setHeroIndex(i),
                  'aria-label': `Slide ${i+1}`
                })
              )
            ),
            el('button', {
              className: 'absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white grid place-items-center',
              onClick: () => setHeroIndex((heroIndex - 1 + HERO_IMAGES.length) % HERO_IMAGES.length),
              'aria-label': 'Previous slide'
            }, '‹'),
            el('button', {
              className: 'absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 text-white grid place-items-center',
              onClick: () => setHeroIndex((heroIndex + 1) % HERO_IMAGES.length),
              'aria-label': 'Next slide'
            }, '›')
          ),

          el('button', { className: 'px-6 py-3 rounded bg-blue-800 text-white', onClick: () => setStep(2) }, 'Get Started')
        ),

        // Step 2
        step === 2 && el('div', null, 
          el('div', { className: 'flex justify-between items-center mb-4' },
            el('h3', { className: 'text-xl font-semibold' }, 'Available courses'),
            el('input', { 
              type: 'text',
              placeholder: 'Search courses...',
              className: 'border p-2 rounded',
              value: searchTerm,
              onChange: e => setSearchTerm(e.target.value)
            })
          ),

          // Smart recommendations panel
          renderRecPanel(),

          el('div', { className: 'text-xs text-slate-500 mb-4' }, 'AI Suggestions: Start typing skills or topics to find matching courses.'),
          el('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' },
            filteredCourses.map(c =>
              el('div', {
                key: `${c.name}-${c.duration}-${c.fee}`,
                tabIndex: 0,
                onClick: () => setSelectedCourse(c.name),
                className: `p-4 rounded-xl border ${selectedCourse===c.name ? 'ring-2 ring-blue-600 bg-slate-50' : 'hover:bg-slate-50'} cursor-pointer relative`
              },
                el('div', { className: 'font-semibold text-lg text-blue-900' }, c.name),
                el('div', { className: 'text-xs text-slate-500 mt-0.5' }, c.category ? c.category : ''),
                el('div', { className: 'text-sm text-slate-600 mt-1' }, `${c.duration} • ${c.fee}`),

                // Hover overlay with expanded details when selected
                el('div', { className: 'absolute inset-0 opacity-0 hover:opacity-100 transition bg-white/95 p-4 overflow-auto' },
                  el('div', { className: 'font-bold text-blue-800 mb-1' }, c.name),
                  el('div', { className: 'text-xs text-slate-500 mb-1' }, c.category ? `Category: ${c.category}` : ''),
                  el('div', { className: 'text-sm mb-2' }, `Fee: ${c.fee}`),
                  el('div', { className: 'text-sm mb-2' }, `Duration: ${c.duration}`),
                  el('div', { className: 'text-sm mb-2' }, c.description),

                  selectedCourse === c.name && el('div', { className: 'mt-3 border-t pt-3' },
                    el('div', { className: 'text-sm text-blue-900 font-semibold mb-2' }, 'View details'),
                    el('div', { className: 'text-[13px] leading-6 text-slate-700' },
                      renderCourseDetails(c.name) ||
                      el('p', null, 'This course follows NSIC’s industry-oriented, practical curriculum structure with hands-on training at NTSC Okhla.')
                    )
                  )
                )
              )
            )
          ),
          el('div', { className: 'mt-6 flex justify-between' }, 
            el('button', { className: 'px-4 py-2 border rounded', onClick: () => setStep(1) }, 'Back'),
            el('button', {
              className: `px-6 py-2 rounded ${selectedCourse ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`,
              disabled: !selectedCourse,
              onClick: () => setStep(3)
            }, 'Next')
          )
        ),

        // Step 3
        step === 3 && el('div', null,
          el('h3', { className: 'text-xl font-semibold mb-3' }, 'Your Details'),
          el('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
            el('input', { value: form.name, onChange: e => setForm({ ...form, name: e.target.value }), placeholder: 'Full name', className: 'border p-2 rounded' }),
            el('input', { value: form.email, onChange: e => setForm({ ...form, email: e.target.value }), placeholder: 'Email', className: 'border p-2 rounded' }),
            el('input', { value: form.phone, onChange: e => setForm({ ...form, phone: e.target.value.replace(/[^0-9]/g,'') }), placeholder: 'Phone (10 digits)', className: 'border p-2 rounded' }),
            el('input', { value: form.address, onChange: e => setForm({ ...form, address: e.target.value }), placeholder: 'Address', className: 'border p-2 rounded' })
          ),
          el('div', { className: 'mt-6 flex justify-between' },
            el('button', { className: 'px-4 py-2 border rounded', onClick: () => setStep(2) }, 'Back'),
            el('button', { 
              className: 'px-6 py-2 rounded bg-blue-800 text-white',
              onClick: () => {
                if (!form.name.trim() || !validateEmail(form.email) || !validatePhone(form.phone) || !form.address.trim()) {
                  alert('Please complete all fields with valid details before proceeding.');
                  return;
                }
                setStep(4);
              }
            }, 'Next')
          )
        ),

        // Step 4
        step === 4 && el('div', null,
          el('h3', { className: 'text-xl font-semibold mb-3' }, 'Capture Photo'),
          el('div', { className: 'mb-3 text-sm text-slate-600' }, cameraError ? `Camera status: Error — ${cameraError}` : 'Camera status: Idle'),
          el('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4 items-start' },
            el('div', null,
              el('div', { className: 'bg-black h-64 w-full flex items-center justify-center rounded overflow-hidden relative' },
                el('video', { ref: videoRef, className: 'w-full h-full object-cover', autoPlay: true, playsInline: true, muted: true }),
                !streamRef.current && el('div', { className: 'absolute text-white' }, 'Camera is off')
              ),
              el('div', { className: 'mt-3 flex gap-2' },
                el('button', { className: 'px-4 py-2 rounded bg-blue-800 text-white', onClick: async () => { await startCamera(); } }, 'Start Camera'),
                el('button', { className: 'px-4 py-2 rounded bg-yellow-500 text-white', onClick: capturePhoto }, 'Capture'),
                el('button', { className: 'px-4 py-2 rounded border', onClick: stopCamera }, 'Stop'),
                el('button', { className: 'px-4 py-2 rounded border', onClick: () => fileRef.current && fileRef.current.click() }, 'Upload Photo'),
                el('input', { ref: fileRef, type: 'file', accept: 'image/*', className: 'hidden', onChange: e => {
                  const files = e && e.target && e.target.files;
                  const file = files && files.length ? files[0] : null;
                  onFileSelected(file);
                } })
              )
            ),
            el('div', null,
              el('div', { className: 'text-sm mb-2' }, el('strong', null, 'Preview')),
              captured
                ? el('img', { src: captured, alt: 'captured', className: 'w-full rounded border' })
                : el('div', { className: 'h-64 w-full rounded border bg-slate-50 grid place-items-center text-slate-400' }, 'No photo captured')
            )
          ),
          el('canvas', { ref: canvasRef, className: 'hidden' }),
          el('div', { className: 'mt-6 flex justify-between' },
            el('button', { className: 'px-4 py-2 border rounded', onClick: () => setStep(3) }, 'Back'),
            el('button', { className: 'px-6 py-2 rounded bg-green-600 text-white', onClick: submitApplication }, 'Submit Application')
          )
        ),

        // Step 5 - Payment and Registration
        step === 5 && el('div', null,
          el('h3', { className: 'text-xl font-semibold mb-3' }, 'Payment & Registration'),
          el('div', { className: 'text-slate-700 mb-4' },
            el('div', { className: 'mb-2' }, 'Please review your selected course and choose a payment method to complete registration.')
          ),

          el('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            // Left: Selected course summary
            el('div', { className: 'p-4 border rounded-xl bg-slate-50' },
              el('div', { className: 'font-semibold text-blue-900 mb-1' }, 'Selected Course'),
              selectedCourse
                ? (() => {
                    const c = COURSES.find(x => x.name === selectedCourse);
                    return el('div', null,
                      el('div', { className: 'text-lg font-semibold' }, c?.name || selectedCourse),
                      el('div', { className: 'text-sm text-slate-600 mt-1' }, `${c?.duration || ''}${c?.duration ? ' • ' : ''}${c?.fee || ''}`),
                      el('div', { className: 'text-sm text-slate-700 mt-2' }, c?.description || '')
                    );
                  })()
                : el('div', { className: 'text-sm text-slate-600' }, 'No course selected')
            ),

            // Right: Payment options
            el('div', { className: 'p-4 border rounded-xl' },
              el('div', { className: 'font-semibold text-blue-900 mb-2' }, 'Choose Payment Method'),
              el('div', { className: 'flex flex-col gap-2 text-sm' },
                el('label', { className: 'flex items-center gap-2 cursor-pointer' },
                  el('input', {
                    type: 'radio',
                    name: 'pay',
                    checked: paymentMethod === 'cash',
                    onChange: () => setPaymentMethod('cash')
                  }),
                  'Cash at Reception'
                ),
                el('label', { className: 'flex items-center gap-2 cursor-pointer' },
                  el('input', {
                    type: 'radio',
                    name: 'pay',
                    checked: paymentMethod === 'card',
                    onChange: () => setPaymentMethod('card')
                  }),
                  'Debit/Credit Card'
                ),
                el('label', { className: 'flex items-center gap-2 cursor-pointer' },
                  el('input', {
                    type: 'radio',
                    name: 'pay',
                    checked: paymentMethod === 'upi',
                    onChange: () => setPaymentMethod('upi')
                  }),
                  'UPI'
                )
              ),

              // Payment info hint
              el('div', { className: 'mt-3 text-xs text-slate-500' },
                paymentMethod === 'cash' && 'Please proceed to the reception to make payment and verify your details.',
                paymentMethod === 'card' && 'Card payments are accepted at the billing counter. Please keep your ID handy.',
                paymentMethod === 'upi' && 'UPI payments are accepted at the billing counter. A QR code will be provided.'
              ),

              el('div', { className: 'mt-4 flex gap-2' },
                el('button', {
                  className: `px-4 py-2 rounded ${paymentMethod ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`,
                  disabled: !paymentMethod,
                  onClick: confirmPayment
                }, registrationNo ? 'Re-generate Reg. No.' : 'Generate Reg. No.'),
                el('button', {
                  className: `px-4 py-2 rounded ${registrationNo ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`,
                  disabled: !registrationNo,
                  onClick: () => alert('Registration confirmed. Please keep your registration number safe.')
                }, 'Confirm')
              )
            )
          ),

          // Registration number display
          el('div', { className: 'mt-6 p-4 rounded-xl border bg-slate-50' },
            el('div', { className: 'text-sm text-slate-600 mb-1' }, 'Your Registration Number'),
            registrationNo
              ? el('div', { className: 'text-xl font-bold text-blue-800 tracking-wide' }, registrationNo)
              : el('div', { className: 'text-sm text-slate-400' }, 'Not generated yet')
          ),

          el('div', { className: 'mt-6 flex justify-between' },
            el('button', { className: 'px-4 py-2 border rounded', onClick: () => setStep(4) }, 'Back'),
            el('div', null,
              el('button', {
                className: `px-6 py-2 rounded mr-2 ${registrationNo ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`,
                disabled: !registrationNo,
                onClick: resetAll
              }, 'Finish'),
              el('button', {
                className: 'px-6 py-2 rounded border',
                onClick: () => { if (window.print) window.print(); }
              }, 'Print/Save')
            )
          )
        )
      )
    )
  );
}
