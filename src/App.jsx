import React, { useEffect, useState, useMemo, Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  Html,
  Text,
  ScrollControls,
  Scroll,
  useScroll,
  MeshDistortMaterial,
  Stars,
  Sparkles,
  PerspectiveCamera,
  useProgress
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import {
  Github,
  Linkedin,
  Mail,
  Menu,
  ChevronRight,
  ExternalLink,
  Phone
} from "lucide-react";

/* -------------------- Images -------------------- */
import myPic from "./assets/my_pic.jpeg";
import suitesImg from "./assets/Suites.png";
import ymchImg from "./assets/YMCH.png";

/* -------------------- Data -------------------- */
const PROFILE = {
  name: "Ayomipo Soyinka",
  role: "Digital Architect & Full-Stack Developer",
  blurb: "I bridge the gap between high-end design and robust engineering. Specialized in building immersive, performant web experiences with a focus on clean architecture and sophisticated UI.",
  location: "Lagos, Nigeria",
  photo: myPic,
  socials: {
    github: "https://github.com/AY-CODED",
    linkedin: "https://www.linkedin.com/in/ayomipo-soyinka-208156335/",
    website: "https://my-portfolio-mauve-six-31.vercel.app/",
    email: "mailto:ayomiposoyinka@gmail.com",
    phone: "tel:+2349048582274",
  },
};

const PROJECTS = [
  {
    title: "Estate Hub",
    description: "A premium real estate platform featuring seamless property browsing and management.",
    tech: ["React", "Three.js", "Tailwind CSS"],
    url: "https://estate-hub-silk.vercel.app/",
    isCenterpiece: true,
  },
  {
    title: "ProjectBuddy AI",
    description: "An 'Agentic' Project Management System. An autonomous AI Worker designed to help users complete their projects.",
    slogan: "Trello tells you what to do. ProjectBuddy AI helps you finish it.",
    tech: ["React", "C#", "ASP.NET Core", "SQL Server", "MongoDB"],
    url: "https://project-buddy-ai.vercel.app/",
    image: null,
  },
  {
    title: "Suites",
    description: "A modern hotel website with elegant design and seamless booking navigation.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    image: suitesImg,
    url: "https://suites-hotel.vercel.app/",
  },
  {
    title: "YMCH Foundation",
    description: "A nonprofit organization dedicated to youth mentorship and community health.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    image: ymchImg,
    url: "https://www.ymchfoundation.org/",
  },
];

/* -------------------- 3D Components -------------------- */

function MacBook({ url, ...props }) {
  const [hovered, setHovered] = useState(false);
  const scroll = useScroll();
  const group = useRef();
  const { viewport } = useThree();

  // Responsive scale based on viewport width
  const responsiveScale = Math.min(viewport.width / 10, 1);

  useFrame((state) => {
    const s = scroll.offset;
    // Fade out and tilt as we scroll away
    group.current.position.z = -s * 25;
    group.current.rotation.x = -s * Math.PI / 3;
    group.current.position.y = props.position[1] - s * 5;
    group.current.scale.setScalar(responsiveScale * (1 - s * 0.8));
  });

  return (
    <group ref={group} {...props} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Float rotationIntensity={0.1} floatIntensity={0.2} speed={1.5}>
        {/* MacBook Body */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[4, 0.1, 2.8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.2} />
        </mesh>

        {/* Screen */}
        <group position={[0, 0, -1.4]} rotation={[-Math.PI / 15, 0, 0]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[4.05, 2.85, 0.05]} />
            <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
          </mesh>

          <Html
            transform
            distanceFactor={1.5}
            position={[0, 1.4, 0.035]}
            portal={{ current: document.body }}
          >
            <div
              className={`transition-all duration-1000 w-[1024px] h-[716px] bg-black overflow-hidden rounded-sm border-[4px] border-[#080808] shadow-2xl pointer-events-auto ${hovered ? 'scale-100 opacity-100' : 'scale-[0.99] opacity-90'}`}
              onPointerOver={() => setHovered(true)}
            >
               <iframe
                src={url}
                className="w-full h-full border-none"
                title="Estate Hub"
                loading="lazy"
               />
               {!hovered && <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />}
            </div>
          </Html>
        </group>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4.5} />
      </Float>
    </group>
  );
}

function ProjectCard({ project, index, ...props }) {
  const [hovered, setHovered] = useState(false);
  const scroll = useScroll();
  const mesh = useRef();
  const { viewport } = useThree();

  const responsiveScale = Math.min(viewport.width / 10, 1);

  useFrame((state) => {
    const s = scroll.offset;
    const projectCount = PROJECTS.length;
    // Calculate focus based on scroll
    const step = 1 / projectCount;
    const start = (index + 1) * step - step * 0.4; // Small offset tweak
    const dist = Math.abs(s - start);

    // Smoothly scale and pop out when centered
    const focus = Math.max(0, 1 - dist * 4);
    mesh.current.scale.lerp(new THREE.Vector3().setScalar(responsiveScale * (0.7 + focus * 0.5)), 0.1);
    mesh.current.position.z = focus * 2.5;
    mesh.current.rotation.y = (index % 2 === 0 ? -0.25 : 0.25) * (1 - focus);
  });

  return (
    <group
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => window.open(project.url, "_blank")}
    >
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.1}>
        <mesh ref={mesh} castShadow>
          <boxGeometry args={[4, 2.8, 0.05]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />

          <mesh position={[0, 0, 0.03]}>
             <boxGeometry args={[4.1, 2.9, 0.01]} />
             <meshStandardMaterial color="white" transparent opacity={0.05} metalness={1} roughness={0} />
          </mesh>

          <Html
            transform
            distanceFactor={2.8}
            position={[0, 0, 0.06]}
            className="pointer-events-none select-none"
          >
            <div className={`relative overflow-hidden transition-all duration-700 w-[500px] h-[350px] flex flex-col justify-between bg-zinc-950/40 text-white rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] ${hovered ? 'border-white/20 translate-y-[-10px]' : ''}`}>

              {project.image && (
                <div className="absolute inset-0 z-0 opacity-30 overflow-hidden">
                   <img src={project.image} alt="" className="w-full h-full object-cover grayscale" />
                </div>
              )}

              <div className="relative z-10 p-12 space-y-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-4xl font-serif italic tracking-tight text-[#f8f8f8]">{project.title}</h3>
                    <div className={`p-3 rounded-full bg-white/5 border border-white/10 transition-all duration-500 ${hovered ? 'bg-white/10 scale-110' : ''}`}>
                      <ExternalLink size={18} className="text-white/70" />
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] font-sans text-zinc-300 leading-[1.8] font-light tracking-wide line-clamp-3">{project.description}</p>
                  {project.slogan && <p className="mt-2 text-[10px] font-sans font-medium italic text-zinc-500 uppercase tracking-[0.3em]">{project.slogan}</p>}
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] font-sans font-semibold uppercase tracking-[0.15em] text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
}

function Rig() {
  return useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(state.mouse.x * 0.5, state.mouse.y * 0.5, 8), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}

function Background() {
  return (
    <>
      <color attach="background" args={["#010101"]} />
      <fog attach="fog" args={["#010101", 5, 25]} />

      <ambientLight intensity={0.6} />
      <spotLight position={[20, 30, 20]} angle={0.25} penumbra={1} intensity={2.5} castShadow />
      <pointLight position={[-20, -20, -20]} intensity={1.5} color="#0044ff" />

      <Stars radius={150} depth={80} count={8000} factor={8} saturation={0} fade speed={1.5} />
      <Sparkles count={100} scale={15} size={1.5} speed={0.6} opacity={0.4} color="#fff" />

      <Environment preset="night" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[-10, 5, -12]}>
          <icosahedronGeometry args={[2.5, 10]} />
          <MeshDistortMaterial color="#050505" speed={3} distort={0.4} metalness={1} roughness={0} />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[12, -6, -10]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[4, 0.015, 16, 100]} />
          <meshStandardMaterial color="#111" metalness={1} roughness={0} />
        </mesh>
      </Float>
    </>
  );
}

function Scene() {
  const [hovered, setHovered] = useState(false);
  const scroll = useScroll();
  const projectsGroup = useRef();
  const { viewport } = useThree();
  const isMobile = viewport.width < 6;

  useFrame((state) => {
    const offset = scroll.offset;
    // Smoother interpolation for section transitions
    projectsGroup.current.position.y = THREE.MathUtils.lerp(
      projectsGroup.current.position.y,
      offset * (PROJECTS.length * 12),
      0.1
    );
  });

  return (
    <>
      <Background />

      <group ref={projectsGroup}>
        {/* Hero Section */}
        <group position={[0, 0, 0]}>
          <MacBook url={PROJECTS[0].url} position={[0, -1, 0]} />
          <Text
            position={[0, isMobile ? 3.5 : 4.5, -5]}
            fontSize={isMobile ? 0.7 : 1.4}
            color="#f8f8f8"
            font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZtu_9z92UM01_YfS_Y9p_E71N0mNlX7S5yS4A.woff"
            fontWeight="900"
            letterSpacing={-0.02}
            maxWidth={viewport.width * 0.8}
            textAlign="center"
          >
            {PROFILE.name.toUpperCase()}
          </Text>
          <Text
            position={[0, isMobile ? 2.8 : 3.5, -5]}
            fontSize={isMobile ? 0.12 : 0.18}
            color="#666"
            letterSpacing={0.4}
            fontWeight="bold"
          >
            {PROFILE.role.toUpperCase()}
          </Text>
        </group>

        {/* Project Cards */}
        {PROJECTS.slice(1).map((project, i) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={i}
            position={[
              isMobile ? 0 : (i % 2 === 0 ? 4 : -4),
              - (i + 1) * 12,
              -1
            ]}
          />
        ))}

        {/* Contact Section */}
        <group position={[0, - PROJECTS.length * 12, 0]}>
           <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
             <Text
              fontSize={isMobile ? 0.8 : 1.5}
              color="#f8f8f8"
              font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZtu_9z92UM01_YfS_Y9p_E71N0mNlX7S5yS4A.woff"
              fontWeight="900"
              letterSpacing={-0.02}
              position={[0, 2, 0]}
             >
                Let's Converse.
             </Text>
           </Float>

           <Text
            fontSize={0.15}
            color="#666"
            position={[0, 0.5, 0]}
            letterSpacing={0.5}
            fontWeight="bold"
           >
              CRAFTING LUXURY DIGITAL EXPERIENCES
           </Text>

           <mesh
            position={[0, -2, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => window.location.href = PROFILE.socials.email}
           >
              <sphereGeometry args={[1.5, 64, 64]} />
              <MeshDistortMaterial
                color={hovered ? "#fff" : "#111"}
                speed={2}
                distort={0.4}
                radius={1}
                metalness={1}
                roughness={0.1}
              />
              <Html center position={[0, 0, 0]}>
                 <div className={`transition-opacity duration-500 flex flex-col items-center gap-4 pointer-events-none ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                    <Mail size={32} className="text-black" />
                    <span className="text-black font-bold text-xs uppercase tracking-widest">Email Me</span>
                 </div>
              </Html>
           </mesh>
        </group>
      </group>

      <Rig />
    </>
  );
}

/* -------------------- UI Components -------------------- */

function Overlay() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-10 sm:p-20 text-white overflow-y-auto sm:overflow-hidden">
      <header className="flex justify-between items-start pointer-events-none mb-20 sm:mb-0">
        <div className="flex flex-col group cursor-pointer pointer-events-auto" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <h1 className="text-3xl sm:text-4xl font-serif italic leading-none transition-all duration-700">AS.</h1>
          <span className="text-[9px] uppercase tracking-[0.4em] font-medium text-zinc-500 mt-2">Digital Architect</span>
        </div>

        <div className="flex items-center gap-12 sm:gap-20">
          <nav className="hidden lg:flex gap-16 text-[10px] uppercase tracking-[0.4em] font-semibold text-zinc-500">
            <button className="hover:text-white transition-all duration-500 pointer-events-auto uppercase">Curated Works</button>
            <a href="#" className="hover:text-white transition-all duration-500 pointer-events-auto">Process</a>
            <a href={PROFILE.socials.email} className="hover:text-white transition-all duration-500 pointer-events-auto">Inquire</a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 pointer-events-auto backdrop-blur-3xl"
          >
             <Menu size={20} className="text-white/80" />
          </button>
        </div>
      </header>

      <div className="flex flex-col items-start gap-12 max-w-xl pointer-events-none mb-10 mt-[45vh] sm:mt-0">
         <div className="space-y-6">
           <div className="flex items-center gap-4">
             <div className="w-10 h-[1px] bg-zinc-700" />
             <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-zinc-400">Selected Works 2024—25</p>
           </div>
           <h2 className="text-3xl sm:text-4xl font-serif italic text-[#f8f8f8] leading-tight tracking-tight">
             Design that speaks, <br/>
             <span className="text-zinc-500">technology that performs.</span>
           </h2>
           <p className="text-sm sm:text-base font-light text-zinc-400 leading-[1.8] max-w-sm tracking-wide">
             Crafting high-end immersive experiences for brands that value aesthetic precision and technical excellence.
           </p>
         </div>
         <div className="flex flex-col sm:flex-row gap-6 pointer-events-auto">
            <a href={PROFILE.socials.email} className="px-10 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-zinc-200 transition-all duration-500">
              Start a Project
            </a>
            <a href="#works" className="px-10 py-4 bg-transparent border border-white/10 text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-white/5 transition-all duration-500">
              Explore Portfolio
            </a>
         </div>
      </div>

      <footer className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-0 pointer-events-none">
        <div className="flex gap-10 sm:gap-12 pointer-events-auto">
          <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-zinc-700 hover:text-white transition-all duration-700">
            <Github size={20}/>
            <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden sm:inline">Github</span>
          </a>
          <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-zinc-700 hover:text-white transition-all duration-700">
            <Linkedin size={20}/>
            <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden sm:inline">LinkedIn</span>
          </a>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-3 pointer-events-none">
           <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
             <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white">Lagos, NG</p>
           </div>
           <div className="h-px w-20 bg-zinc-800" />
           <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-zinc-700">© 2025 All Rights Reserved</p>
        </div>
      </footer>

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}

/* -------------------- UI Components -------------------- */

function Loader() {
  const { progress } = useProgress();
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#010101]"
    >
      <div className="relative flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-serif italic text-white mb-8"
        >
          AS.
        </motion.h1>
        <div className="w-48 h-[1px] bg-zinc-800 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-white origin-left"
            style={{ scaleX: progress / 100 }}
          />
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-[9px] uppercase tracking-[0.4em] text-zinc-500 font-bold"
        >
          Loading Architecture {Math.round(progress)}%
        </motion.span>
      </div>
    </motion.div>
  );
}

/* -------------------- Main Component -------------------- */

export default function App() {
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setLoading(false), 1500);
    }
  }, [progress]);

  return (
    <div className="w-full h-screen bg-[#010101] font-['Inter',sans-serif] selection:bg-cyan-500/40 overflow-hidden">
      <AnimatePresence>
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      <div className="h-[50vh] sm:h-screen w-full fixed top-0 left-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 8], fov: 32 }}
          gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
        >
          <Suspense fallback={null}>
            <ScrollControls pages={PROJECTS.length + 0.8} damping={0.15}>
              <Scene />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
      <Overlay />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');

        body {
          margin: 0;
          background: #010101;
          color: white;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
        }

        canvas {
          touch-action: none;
        }

        * {
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        ::selection {
          background: rgba(6, 182, 212, 0.4);
          color: white;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}} />
    </div>
  );
}
