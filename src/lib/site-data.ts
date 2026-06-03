export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  body: string[];
};

export const company = {
  name: "Annapurna Equipments",
  shortName: "AE",
  tagline: "Solar installation and related electrical work",
  location: "Sangli, Maharashtra",
  address: "Sambhaji Nagar, Sangalwadi, Sangli, Maharashtra 416416, India",
  phone: "+91 92721 12004",
  email: "annapurna024@rediffmail.com",
  instagram: "https://www.instagram.com/annapurnaequipments/",
  facebook: "https://www.facebook.com/people/Annapurna-equipments/61559061278424/",
  website: "http://www.annapurnasolar.com/",
  description:
    "Annapurna Equipments is a Sangli-based solar energy company handling solar installation, rooftop solar consultation and related electrical work.",
  images: [
    "https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/470473262_122154623306302042_7391578579620261232_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=yHRg01bRtnQQ7kNvwF2oTSu&_nc_oc=AdqN4laCPmOZA1BuKMTNWwg_Qnk0MB8bf8vs47d_MEV2MOLCxgPTdr7Gm1kT2_GAbR8&_nc_zt=23&_nc_ht=scontent-dub4-1.xx&_nc_gid=H0VAr-nObxiiIctsI-dzbA&_nc_ss=79289&oh=00_Af8fxKcHizTxbIS7WTj-YII6-W72TY2O-HPKJJfkCsyAVA&oe=6A24486E",
    "https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/471032018_122154790598302042_8633694310265787737_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8szo97kOeK0Q7kNvwGdN4aI&_nc_oc=AdrDyf816XqIOPBNSVylNk-RCKzhFToE0dOTojFyqJjUVQ7__92Z4arNJ4Z7lf0H3WI&_nc_zt=23&_nc_ht=scontent-dub4-1.xx&_nc_gid=L32ADSb8RkEpCqmHKWZLmg&_nc_ss=79289&oh=00_Af_g_IE-ovNWYUGA6J_G9DnriIjE4E72XdWFU3oKe2Ofzg&oe=6A243F4C",
    "https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/470601325_122154785192302042_1090409930155223375_n.jpg?stp=dst-jpg_s160x160_tt6&_nc_cat=103&ccb=1-7&_nc_sid=09d16d&_nc_ohc=CiPzvOiQmvUQ7kNvwHhAdAM&_nc_oc=AdpX5yQ16ZKY72QHCEpwHN2TNXWzO2fcHVligqLyEjvZqSEDJNQ_Sixo8-cf0OKZq0c&_nc_zt=23&_nc_ht=scontent-dub4-1.xx&_nc_gid=H0VAr-nObxiiIctsI-dzbA&_nc_ss=79289&oh=00_Af-1fC_mKsu4N8QIyVemmv90F_yQL2y7RkJL4l96nmh6pQ&oe=6A24500E",
  ],
};

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Our Offerings",
    items: [
      {
        label: "Homes",
        href: "/",
        description: "Save up to 90% on your home electricity bills.",
      },
      {
        label: "Housing Societies",
        href: "/housing-society/",
        description: "Reduce common-area power costs and add long-term value.",
      },
      {
        label: "Commercial",
        href: "/commercial/",
        description: "Power your business with green energy and save on costs.",
      },
    ],
  },
  {
    label: "Solar Solutions",
    items: [
      {
        label: "On Grid Solar",
        href: "/on-grid-solar/",
        description: "Grid-connected rooftop systems for everyday savings.",
      },
      {
        label: "Off Grid Solar",
        href: "/off-grid-solar/",
        description: "Battery-backed solar for independent power needs.",
      },
      {
        label: "Solar Calculator",
        href: "/solar-calculator/",
        description: "Estimate system size, investment, ROI and savings.",
      },
    ],
  },
  {
    label: "Cities",
    items: [
      { label: "Solar in Sangli", href: "/solar-in-sangli/" },
      { label: "Solar in Sangalwadi", href: "/solar-in-sangalwadi/" },
      { label: "Solar in Sambhaji Nagar", href: "/solar-in-sambhaji-nagar/" },
      { label: "Solar in Miraj", href: "/solar-in-miraj/" },
      { label: "Solar in Kolhapur", href: "/solar-in-kolhapur/" },
      { label: "Solar in Satara", href: "/solar-in-satara/" },
    ],
  },
  {
    label: "More",
    items: [
      { label: "About Us", href: "/about-us/" },
      { label: "Blog", href: "/blog/" },
      { label: "Careers", href: "/careers/" },
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms of Service", href: "/terms-of-service/" },
    ],
  },
];

export const serviceCities = [
  { city: "Sangli", state: "Maharashtra", pincodes: ["416416", "416415", "416410"] },
  { city: "Sangalwadi", state: "Maharashtra", pincodes: ["416416"] },
  { city: "Sambhaji Nagar", state: "Maharashtra", pincodes: ["416416"] },
  { city: "Miraj", state: "Maharashtra", pincodes: ["416410", "416414"] },
  { city: "Kolhapur", state: "Maharashtra", pincodes: ["416001", "416003", "416012"] },
  { city: "Satara", state: "Maharashtra", pincodes: ["415001", "415002"] },
];

export const trustCards = [
  {
    title: "Guaranteed Savings",
    text: "Clear solar estimates and practical installation guidance for long-term electricity savings.",
  },
  {
    title: "Hassle-free Process",
    text: "Installation, subsidy and service are handled directly by us. Zero middlemen.",
  },
  {
    title: "Storm-proof Structure",
    text: "WindPro Mount tested for 170 kmph storms and approved by IIT Bombay.",
  },
  {
    title: "Reliable After-sales Service",
    text: "Regular proactive maintenance keeps year-after-year performance steady.",
  },
];

export const homeFaqs = [
  {
    question: "What is Annapurna Equipments?",
    answer:
      "Annapurna Equipments is a Sangli-based solar energy company that handles solar installation and related electrical work for homes, housing societies and businesses.",
  },
  {
    question: "How much can I save with solar?",
    answer:
      "Most homeowners can reduce electricity bills by 80-90% from day one. Exact savings depend on electricity usage, roof area, city tariffs and system size.",
  },
  {
    question: "Do I need to pay a huge amount upfront?",
    answer:
      "Flexible EMI plans can make solar possible without a large initial investment. Subsidy and bill savings often offset a meaningful part of the monthly cost.",
  },
  {
    question: "How long does installation take?",
    answer:
      "After rooftop survey and design approval, a residential solar installation is typically completed in about one day, depending on site conditions and weather.",
  },
  {
    question: "What is the lifespan of a rooftop solar system?",
    answer:
      "A high-quality rooftop solar system lasts 25 years or more, with regular maintenance helping protect generation and savings.",
  },
];

export const societyFaqs = [
  {
    question: "How much can our society save with solar?",
    answer:
      "Housing societies can save up to 90% on common-area electricity bills, depending on sanctioned load, tariff and solar capacity.",
  },
  {
    question: "Is there a government subsidy for housing societies?",
    answer:
      "Societies can avail subsidy support under government schemes. The implementation team assists with documentation and submission.",
  },
  {
    question: "What approvals are required?",
    answer:
      "Most societies need management committee and AGM alignment before installation. Solar consultants can help prepare financial and technical notes.",
  },
];

export const commercialFaqs = [
  {
    question: "Can commercial rooftops use solar without net metering?",
    answer:
      "Yes. Behind-the-meter captive consumption systems are possible when generation is consumed within the business premises.",
  },
  {
    question: "How quickly do businesses break even?",
    answer:
      "Commercial solar projects often break even in two to four years, depending on tariff, capex or opex model, and available roof area.",
  },
  {
    question: "Are subsidies available for commercial entities?",
    answer:
      "Commercial entities generally do not receive residential subsidy, but they can benefit from lower energy costs and tax depreciation.",
  },
];

export const testimonials = [
  {
    quote:
      "My solar journey has been smooth and satisfying. Bills dropped from Rs. 18,000 to almost zero and generation is easy to track.",
    name: "Residential customer",
    meta: "Sangli",
  },
  {
    quote:
      "From consultation to installation, everything was smooth. The plant generates 22-24 units daily and bills are down by 70%.",
    name: "Homeowner",
    meta: "Maharashtra",
  },
  {
    quote:
      "The project was professionally executed with strong safety practices and timely communication throughout.",
    name: "Commercial client",
    meta: "Enterprise solar",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "does-your-solar-guarantee-power-production-and-savings",
    title: "Does your solar guarantee power production and savings?",
    category: "GoodZero - Guaranteed Savings",
    date: "1 August, 2024",
    readTime: "5 min",
    author: "Shreya Mishra",
    excerpt:
      "A practical guide to guaranteed solar savings, promised generation and what homeowners should ask before installing rooftop solar.",
    body: [
      "A rooftop solar plant should not be judged only by panels. Long-term savings depend on design quality, mounting structures, inverter performance and proactive maintenance.",
      "A guaranteed savings plan sets expected generation, monitors actual output and gives homeowners clarity on how the system performs over time.",
      "Before signing up, compare generation assumptions, service visits, replacement coverage and the process for resolving under-performance.",
    ],
  },
  {
    slug: "commercial-solar-panel-maintenance-guide",
    title: "Commercial Solar Panel Maintenance: Complete O&M Guide for Indian Businesses",
    category: "Commercial",
    date: "27 May, 2026",
    readTime: "44 min",
    author: "Anjaney Chaturvedi",
    excerpt:
      "How Indian businesses can keep solar assets productive with cleaning, inspections, safety checks and performance monitoring.",
    body: [
      "Commercial solar plants need disciplined operations and maintenance because small generation losses multiply across large capacities.",
      "A good O&M program includes periodic cleaning, thermal inspections, inverter checks, cable inspections and performance benchmarking.",
      "Businesses should track generation against expected output and act early when soiling, shading or equipment issues appear.",
    ],
  },
  {
    slug: "uttarakhand-solar-subsidy-guide",
    title: "2026 Guide on Uttarakhand Solar Subsidy: How to Apply and Cost Included",
    category: "PM Surya Ghar Subsidy",
    date: "23 May, 2026",
    readTime: "13 min",
    author: "Anshuman Sharma",
    excerpt:
      "Understand subsidy slabs, application steps and the documents required for a residential rooftop solar project.",
    body: [
      "Residential solar subsidy depends on system size, consumer eligibility and portal approval.",
      "The process usually includes feasibility, vendor selection, installation, net metering and final subsidy disbursement.",
      "A managed solar provider can reduce paperwork effort by coordinating documentation and status tracking.",
    ],
  },
  {
    slug: "solar-panel-wattage",
    title: "What is Solar Panel Wattage and How Does it Differ from Solar Panel Output?",
    category: "Solar Panel & Types",
    date: "12 April, 2026",
    readTime: "9 min",
    author: "Shreya Mishra",
    excerpt:
      "Learn how panel wattage, real-world generation and installation quality affect rooftop solar performance.",
    body: [
      "Solar panel wattage is the rated power under standard test conditions. Actual output varies with sunlight, temperature, orientation and losses.",
      "The right rooftop system balances panel capacity, inverter sizing, shadow-free area and expected household consumption.",
      "A site survey and generation estimate are essential before choosing a system size.",
    ],
  },
];

export const secondaryPages: Record<string, { title: string; description: string; sections: string[] }> = {
  "about-us": {
    title: "We make rooftop solar with integrity",
    description:
      "A team of engineers, MBAs, scientists and creative thinkers accelerating rooftop solar adoption in India.",
    sections: [
      "Our vision is to make clean energy affordable and accessible.",
      "Our mission is to make the solar generation industry more organised.",
      "Our method is to infuse transparency, safety and trust into every rooftop project.",
    ],
  },
  "on-grid-solar": {
    title: "On-Grid Solar Systems",
    description:
      "Grid-connected rooftop solar systems that export excess power and reduce electricity bills through net metering.",
    sections: [
      "Best suited for homes, housing societies and businesses with reliable grid access.",
      "Includes solar panels, inverter, mounting structure, safety equipment and net-metering support.",
    ],
  },
  "off-grid-solar": {
    title: "Off-Grid Solar Systems",
    description:
      "Battery-backed solar systems designed for locations that need power independence or backup support.",
    sections: [
      "Useful for frequent power cuts, remote sites and critical backup needs.",
      "Capacity depends on daily consumption, battery autonomy and seasonal generation.",
    ],
  },
  careers: {
    title: "Careers at Annapurna Equipments",
    description:
      "Join the mission to make rooftop solar accessible, trusted and beautifully executed across India.",
    sections: [
      "We look for builders across sales, operations, engineering, design, finance and customer success.",
      "Open roles can be connected to this page when the hiring backend is available.",
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "This page outlines how enquiry and calculator data is collected for consultation, serviceability and support.",
    sections: [
      "Lead data is used to contact customers, assess solar feasibility and improve service quality.",
      "Production deployments should connect this page to the approved legal policy text.",
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    description:
      "Use of the website, calculator estimates and consultation forms is subject to standard service terms.",
    sections: [
      "Calculator results are indicative and final project economics may vary by city, tariff, roof and components.",
      "Production deployments should replace this scaffold with approved legal copy.",
    ],
  },
};

export const cityPages: Record<string, { city: string; state: string }> = Object.fromEntries(
  serviceCities.flatMap((entry) => {
    const slug = `solar-in-${entry.city.toLowerCase().replace(/\s+/g, "-").replace("delhi-ncr", "delhi")}`;
    return [[slug, { city: entry.city, state: entry.state }]];
  }),
);
