import headshot from "../assets/img/journey/headshot.jpg";
import riptImg from "../assets/img/journey/ript.jpg";
import marketMatchImg from "../assets/img/journey/marketmatch.jpg";
import hockeyImg from "../assets/img/journey/hockey.jpg";
import italyCover from "../assets/img/journey/italy.jpg";
import newYorkCover from "../assets/img/journey/newyork.jpg";

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
      "CI/CD with GitHub Actions and Terraform onto AWS ECS Fargate, ECR and CloudFront.",
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

export const souvenirs = [
  { name: "Italy", image: italyCover, href: "https://youtu.be/tR-0iuq9yCQ?si=9Ym6neh0KDWA_efh" },
  { name: "New York", image: newYorkCover, href: "https://youtu.be/23AMHv1Rfi0?si=5nJpnSE03vHvIY52" },
];

export const sections = [
  { id: "check-in", label: "Check-in" },
  { id: "passport", label: "Passport" },
  { id: "layovers", label: "Experience" },
  { id: "destinations", label: "Projects" },
  { id: "arrivals", label: "Contact" },
];

// One ambient loop per stop; chords are MIDI note numbers.
export const playlist = [
  {
    id: "check-in",
    title: "Check-in",
    section: "check-in",
    code: "CHK",
    color: "#e8452c",
    notes: passenger.intro,
    chords: [[53, 57, 60, 64], [57, 60, 64, 67], [50, 57, 60, 65], [58, 62, 65, 69]],
  },
  {
    id: "passport",
    title: "Passport",
    section: "passport",
    code: "PSP",
    color: "#2f6b4f",
    notes: "Visa stamps for every role, plus special entries for the things outside work.",
    chords: [[46, 53, 58, 62], [43, 50, 55, 58], [48, 55, 60, 63], [41, 48, 53, 57]],
  },
  {
    id: "layovers",
    title: "Layovers",
    section: "layovers",
    code: "LAY",
    color: "#6a3d8f",
    notes: "Four stops so far, each with one thing worth carrying to the next.",
    chords: [[49, 56, 61, 65], [46, 53, 58, 61], [42, 49, 54, 58], [44, 51, 56, 60]],
  },
  ...projects.map((p, i) => ({
    id: p.id,
    title: p.name,
    section: "destinations",
    project: p.id,
    code: p.name.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase(),
    color: ["#2a4b8d", "#2f6b4f", "#b8862b", "#6a3d8f"][i % 4],
    notes: p.result,
    chords: [
      [[48, 55, 62, 64], [45, 52, 60, 64], [41, 48, 57, 60], [43, 50, 59, 62]],
      [[50, 57, 62, 66], [47, 54, 59, 62], [43, 50, 55, 59], [45, 52, 57, 61]],
      [[52, 59, 64, 67], [48, 55, 60, 64], [45, 52, 57, 60], [47, 54, 59, 62]],
      [[55, 62, 67, 71], [52, 59, 64, 67], [48, 55, 60, 64], [50, 57, 62, 66]],
    ][i % 4],
  })),
  {
    id: "arrivals",
    title: "Arrivals",
    section: "arrivals",
    code: "ARR",
    color: "#e8452c",
    notes: "Bags are on belt 1. Email, LinkedIn and GitHub are all waiting.",
    chords: [[53, 60, 65, 69], [50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64]],
  },
];
