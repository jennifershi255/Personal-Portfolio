import headshot from "../assets/img/journey/headshot.jpg";
import riptImg from "../assets/img/journey/ript.jpg";
import marketMatchImg from "../assets/img/journey/marketmatch.jpg";
import hockeyImg from "../assets/img/journey/hockey.jpg";
import ipadImg from "../assets/img/journey/bag/ipad.webp";
import ipadPhoto from "../assets/img/journey/bag/ipad-photo.webp";
import headphonesImg from "../assets/img/journey/bag/headphones.webp";
import headphonesPhoto from "../assets/img/journey/bag/headphones-photo.webp";
import jellycatImg from "../assets/img/journey/bag/jellycat.webp";
import foodPhoto from "../assets/img/journey/bag/food-photo.jpg";
import playlistCoverImg from "../assets/img/journey/playlist-cover.jpg";

export const contact = {
  email: "j286shi@uwaterloo.ca",
  linkedin: "https://www.linkedin.com/in/jennifershi255",
  github: "https://github.com/jennifershi255",
};

export const passenger = {
  firstName: "Jennifer",
  lastName: "Shi",
  flight: "JS 255",
  photo: headshot,
  intro:
    "CS & Finance at the University of Waterloo. Currently a Data Engineer Intern at Wealthsimple.",
  from: { code: "WAT", city: "Waterloo, ON", detail: "CS & Finance · UWaterloo" },
  to: { code: "SWE", city: "Software · Data · AI", detail: "Engineering roles" },
  departs: "Sep 2024",
  arrives: "May 2029",
  seat: "3A",
  seatNote: "right by the window",
  boarding: "Now boarding",
  ticker: ["SOFTWARE ENGINEER", "DATA ENGINEER", "FINANCE + CS"],
  hobbies: "swimming, dance, playing instruments, reading, baking, travelling",
};

export const projects = [
  {
    id: "ript",
    name: "ript",
    tagline: "AI personal trainer",
    result: "Real-time form feedback from your camera at 30+ FPS and under 100 ms.",
    origin: "Getting feedback on your form usually means paying for a personal trainer.",
    destination:
      "A web coach that tracks 33 body landmarks live and flags form issues as you move.",
    log: [
      "Led a team of 4 through the build.",
      "MediaPipe pose tracking at 30+ FPS with sub-100 ms latency.",
      "Node.js backend with JWT authentication, Gemini API for coaching cues.",
    ],
    flightTime: "Hackathon build",
    crew: "Team of 4 · lead",
    stack: ["MediaPipe", "React", "Node.js", "MongoDB", "Gemini API"],
    links: [{ label: "Devpost", href: "https://devpost.com/software/ript-9nq3iz" }],
    image: riptImg,
  },
  {
    id: "marketmatch",
    name: "MarketMatch",
    tagline: "Portfolio optimizer",
    result: "Builds a stock portfolio that tracks the S&P 500 or TSX 60, deployed with zero downtime.",
    origin: "Picking a set of stocks that behaves like an index is mostly guesswork.",
    destination:
      "A platform that scores and combines stocks to match index performance, with dashboards and PDF reports.",
    log: [
      "Multi-factor scoring and constraint modeling on historical data.",
      "Interactive comparison dashboard and automated PDF reporting.",
      "CI/CD with GitHub Actions and Terraform onto Fargate, ECR and CloudFront.",
    ],
    stack: ["Python", "Flask", "React", "NumPy", "AWS", "Terraform", "Docker"],
    links: [{ label: "GitHub", href: "https://github.com/jennifershi255/MarketMatch" }],
    image: marketMatchImg,
  },
  {
    id: "hockey",
    name: "Hockey Goal Model",
    tagline: "Machine learning",
    result: "Predicts which shots become goals, trained on 120,000+ shots.",
    origin: "Which shots in hockey actually turn into goals?",
    destination: "A model that estimates goal probability from shot distance, angle and type.",
    log: [
      "Cleaned and analyzed 120,000+ shot records.",
      "Engineered distance, angle and shot-type features.",
      "Trained and evaluated scikit-learn models in Jupyter.",
    ],
    stack: ["Python", "scikit-learn", "pandas", "Jupyter"],
    links: [{ label: "GitHub", href: "https://github.com/jennifershi255/Hockey-Goal-MLM" }],
    image: hockeyImg,
  },
];

// Ordered oldest to newest; the last one is the current stop.
export const roles = [
  {
    id: "airfairness",
    company: "Airfairness",
    title: "Software Engineer Intern",
    start: "May 2025",
    end: "Sep 2025",
    stay: "4 months",
    learned: "Owning a product end to end, from API design to the inbox it reads from.",
    highlight: "Shipped an AI flight-compensation platform that cut manual verification by 95%.",
    ink: "#2a4b8d",
    shape: "circle",
  },
  {
    id: "deloitte",
    company: "Deloitte",
    title: "Data Analyst Intern",
    start: "Jan 2026",
    end: "Apr 2026",
    stay: "4 months",
    learned: "Ask questions early: a misunderstood requirement costs far more than a short delay.",
    highlight: "Built SQL workflows for banking rules, working with the Big Five banks in Canada.",
    ink: "#2f6b4f",
    shape: "rect",
  },
  {
    id: "uw-research",
    company: "University of Waterloo",
    title: "Undergraduate Research Assistant",
    start: "Apr 2026",
    end: "Sep 2026",
    stay: "5 months",
    learned: "How to ask a question of 60,000 models and actually trust the answer.",
    highlight: "Research on link prediction for cold-start model recommendations.",
    ink: "#6a3d8f",
    shape: "oval",
  },
  {
    id: "wealthsimple",
    company: "Wealthsimple",
    title: "Data & AI Engineer Intern",
    start: "Sep 2026",
    end: "Present",
    stay: "Current stop",
    learned: "An agent is only as good as your understanding of the workflow it replaces.",
    highlight: "Built an AI agent that diagnoses failing data pipelines and automatically opens tested fix PRs.",
    ink: "#c2401f",
    shape: "rect",
  },
];

export const specialEntries = [
  { label: "Kumon Assistant", note: "Job", ink: "#e8452c" },
  { label: "Lifeguard", note: "Job", ink: "#2f6b4f" },
  { label: "Technova", note: "Finance lead", ink: "#6a3d8f" },
  { label: "Blueprint", note: "Developer", ink: "#2a4b8d" },
  { label: "WAT.AI", note: "Developer", ink: "#2f6b4f" },
];

export const languages = [
  {
    title: "Languages & frameworks",
    items: ["Python", "Java", "C", "C++", "SQL", "JavaScript", "TypeScript", "React", "Node.js", "Flask", "FastAPI"],
  },
  {
    title: "Tools & databases",
    items: ["PostgreSQL", "Redis", "SQLite", "MongoDB", "Docker", "AWS", "Git", "Linux", "Bash"],
  },
  {
    title: "Data & machine learning",
    items: ["PyTorch", "TensorFlow", "pandas", "NumPy", "Databricks", "Kubernetes", "MediaPipe", "Matplotlib"],
  },
];

// Bag check. `box` places the item inside the backpack (viewBox 400 x 520) and should
// match the image's aspect ratio. `material` sets its x-ray colour: organic (orange),
// inorganic (green), metal (blue). Images need a transparent background. An optional
// `photo` replaces the image in the item's popup, cropped to fill it; `photoPosition`
// (CSS object-position) picks which part of the photo stays in view.
export const bagItems = [
  {
    id: "ipad",
    name: "iPad",
    material: "metal",
    kind: "Electronics",
    body: "I love watching Netflix on my iPad during flights. Currently watching The Mentalist :)",
    image: ipadImg,
    photo: ipadPhoto,
    box: { x: 292, y: 150, w: 94, h: 134 },
    tilt: -7,
  },
  {
    id: "book",
    name: "Books",
    material: "organic",
    kind: "Paper",
    body: "I love reading to pass the time on flights.",
    bodyLink: { label: "Check out my Goodreads!", href: "https://www.goodreads.com/jennifershi" },
    photo: "/images/new_york/lg/373f122d4a057a33dba71ec1b6373f09.jpg",
    box: { x: 386, y: 192, w: 64, h: 98 },
    tilt: 76,
  },
  {
    id: "headphones",
    name: "Headphones",
    material: "inorganic",
    kind: "Electronics",
    body: "Rarely off. Something is always playing while I work, and I play a few instruments myself. (check out the music feature in the bottom right corner to see what I'm listening to!)",
    image: headphonesImg,
    photo: headphonesPhoto,
    photoPosition: "50% 78%",
    box: { x: 228, y: 120, w: 82, h: 108 },
    tilt: 8,
  },
  {
    id: "jellycat",
    name: "Stuffies",
    material: "organic",
    kind: "Plush",
    body: "Always need an emotional support animal. I love jellycats <3",
    image: jellycatImg,
    box: { x: 478, y: 122, w: 126, h: 122 },
    tilt: -9,
  },
  {
    id: "food",
    name: "Food",
    material: "organic",
    kind: "Snack",
    body: "I love food. I'm not picky and will eat anything.",
    photo: foodPhoto,
    photoPosition: "42% 58%",
    box: { x: 438, y: 230, w: 68, h: 96 },
    tilt: 12,
  },
];

export const sections = [
  { id: "check-in", label: "Check-in" },
  { id: "passport", label: "Passport" },
  { id: "security", label: "Bag check" },
  { id: "layovers", label: "Experience" },
  { id: "destinations", label: "Projects" },
  { id: "arrivals", label: "Contact" },
];

export const playlistCover = playlistCoverImg;

// Cabin playlist. Swap these placeholders for real tracks:
// title, artist, album, artwork (image url), src (audio url), duration (seconds).
export const playlist = [
  {
    id: "stranger",
    title: "stranger",
    artist: "Olivia Rodrigo",
    album: "GUTS (spilled)",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/08/9e/07/089e0799-b405-9e69-b648-e6a19df9879c/24UMGIM30485.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3f/2c/94/3f2c9448-5581-c4fa-1e21-8ffe4ec6c079/mzaf_14126863622900479277.plus.aac.p.m4a",
    duration: 193,
  },
  {
    id: "cant-be-moved",
    title: "The Man Who Can't Be Moved",
    artist: "The Script",
    album: "The Script",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/17/06/81/1706814a-d412-9c54-008f-36475e4785b5/mzm.zwddzkpt.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bc/db/8b/bcdb8b07-df98-6ce0-71f7-5f28af758d03/mzaf_7954318052370447652.plus.aac.p.m4a",
    duration: 241,
  },
  {
    id: "peter",
    title: "Peter",
    artist: "Taylor Swift",
    album: "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/86/59/a486593a-53c9-1c2a-5122-8f25339f7359/24UMGIM44778.rgb.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/95/0d/5f/950d5fc4-1b36-587d-18d8-9d0321f03c50/mzaf_6013794920239683432.plus.aac.p.m4a",
    duration: 284,
  },
  {
    id: "love-lost",
    title: "Love Lost",
    artist: "Mac Miller",
    album: "I Love Life, Thank You",
    artwork: "https://cdn-images.dzcdn.net/images/cover/7fcf2282f0c695708dedfbdb972daf25/1000x1000-000000-80-0-0.jpg",
    src: "",
    deezerId: 3596368942,
    duration: 163,
  },
  {
    id: "altitude",
    title: "Altitude",
    artist: "Sydney Ross Mitchell",
    album: "Pure Bliss Forever",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4d/ec/05/4dec0568-737f-18c4-6934-7ff186263718/417747.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f4/ad/3d/f4ad3d85-f6ef-7dfc-44f3-9a8dd05724b0/mzaf_277447919524081337.plus.aac.p.m4a",
    duration: 172,
  },
  {
    id: "ldn",
    title: "LDN",
    artist: "Lily Allen",
    album: "Alright, Still",
    artwork: "https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/bb/d8/3c/bbd83c7f-1e44-8be8-a359-7a89a7a60f94/dj.hjabuthf.jpg/600x600bb.jpg",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ab/c7/75/abc775ae-6864-ea3c-3ae6-ce12b20ce0d2/mzaf_2923566243302932857.plus.aac.p.m4a",
    duration: 192,
  },
];
