# Jennifer Shi Personal Portfolio

A modern, interactive personal portfolio website showcasing my projects and interests! Built with React and deployed on AWS with a fully automated CI/CD pipeline.

[![Live Site](https://img.shields.io/badge/Live-Portfolio-blue)](https://jennifershi.vercel.app/)
[![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-green)](https://github.com/jennifershi255/personal-portfolio/actions)

## ✨ Features
- **Interactive 3D Components**: WebGL-powered circular gallery and interactive globe using Three.js
- **Responsive Design**: Fully responsive across all devices with mobile-first approach
- **Smooth Animations**: Framer Motion animations and custom CSS effects
- **Travel Gallery**: Interactive 3D globe displaying travel destinations with photo galleries
- **Project Showcase**: Dynamic project cards with technology stack visualization
- **Automated Deployment**: Complete CI/CD pipeline with GitHub Actions
- **Cloud Infrastructure**: AWS-powered hosting with CloudFront CDN and ECS Fargate

## 🛠️ Tech Stack
### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **React Bootstrap** - UI components
- **Framer Motion** - Animation library
- **Three.js / React Three Fiber** - 3D graphics
- **OGL** - Lightweight WebGL library

### Backend & Infrastructure
- **Docker** - Containerization
- **NGINX** - Web server
- **AWS S3** - Static asset storage
- **AWS CloudFront** - CDN for global content delivery
- **AWS ECR** - Docker image registry
- **AWS ECS Fargate** - Serverless container orchestration

### DevOps
- **GitHub Actions** - CI/CD automation
- **Terraform** - Infrastructure as Code (IaC)

## 🏗️ Architecture


## 📁 Project Structure
```
personal-portfolio/
├── .github/
│   └── workflows/
│       └── main.yml          # CI/CD pipeline configuration
├── src/
│   ├── components/          
│   │   ├── About.jsx
│   │   ├── Banner.jsx
│   │   ├── CircularGallery.jsx
│   │   ├── Connect.jsx
│   │   ├── NavBar.jsx
│   │   ├── Projects.jsx
│   │   ├── Travel.jsx
│   │   └── TravelGlobe.jsx
│   ├── assets/              # Images, icons, and static files
│   ├── css/                 # Stylesheets
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                  # Public assets
├── terraform/               # Infrastructure as Code
├── Dockerfile              # Container configuration
├── nginx.conf              # NGINX server configuration
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

