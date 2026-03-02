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
  PerspectiveCamera
} from "@react-three/drei";
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
  role: "Full-Stack Developer & Graphic Designer",
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

  useFrame((state) => {
    const s = scroll.offset;
    // Fade out and tilt as we scroll away
    group.current.position.z = -s * 15;
    group.current.rotation.x = -s * Math.PI / 4;
    group.current.scale.setScalar(1 - s * 0.6);
  });

  return (
    <group ref={group} {...props} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Float rotationIntensity={0.2} floatIntensity={0.5} speed={2}>
        {/* MacBook Body */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[4, 0.1, 2.8]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Screen */}
        <group position={[0, 0, -1.4]} rotation={[-Math.PI / 12, 0, 0]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[4, 2.8, 0.05]} />
            <meshStandardMaterial color="#111" metalness={1} roughness={0} />
          </mesh>

          <Html
            transform
            distanceFactor={1.5}
            position={[0, 1.4, 0.03]}
            occlude
          >
            <div className={`transition-all duration-700 w-[1024px] h-[716px] bg-black overflow-hidden rounded-md border-[6px] border-[#111] ${hovered ? 'scale-100' : 'scale-[0.98]'}`}>
               <iframe
                src={url}
                className="w-full h-full border-none"
                title="Estate Hub"
               />
               {!hovered && <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none" />}
            </div>
          </Html>
        </group>
        <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={15} blur={1.5} far={4.5} />
      </Float>
    </group>
  );
}

function ProjectCard({ project, index, ...props }) {
  const [hovered, setHovered] = useState(false);
  const scroll = useScroll();
  const mesh = useRef();

  useFrame((state) => {
    const s = scroll.offset;
    const projectCount = PROJECTS.length;
    // Calculate focus based on scroll
    const step = 1 / projectCount;
    const start = (index + 1) * step - step * 0.4; // Small offset tweak
    const dist = Math.abs(s - start);

    // Smoothly scale and pop out when centered
    const focus = Math.max(0, 1 - dist * 4);
    mesh.current.scale.lerp(new THREE.Vector3().setScalar(0.7 + focus * 0.5), 0.1);
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
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh ref={mesh} castShadow>
          <boxGeometry args={[3.8, 2.6, 0.05]} />
          <meshStandardMaterial color="#080808" metalness={0.8} roughness={0.1} />
          <Html
            transform
            distanceFactor={2.6}
            position={[0, 0, 0.04]}
            className="pointer-events-none select-none"
          >
            <div className={`transition-all duration-500 w-[440px] h-[300px] p-10 flex flex-col justify-between bg-zinc-950/70 text-white rounded-3xl border border-white/5 backdrop-blur-2xl ${hovered ? 'border-cyan-500/50 scale-[1.02]' : ''}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-3xl font-black tracking-tighter text-white/95">{project.title}</h3>
                  <div className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 transition-colors ${hovered ? 'bg-cyan-500/20' : ''}`}>
                    <ExternalLink size={16} className="text-cyan-400" />
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium line-clamp-3">{project.description}</p>
                {project.slogan && <p className="text-[10px] font-bold italic text-cyan-400/80 uppercase tracking-[0.2em]">{project.slogan}</p>}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {project.tech.map(t => (
                  <span key={t} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] text-zinc-500">
                    {t}
                  </span>
                ))}
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
  const scroll = useScroll();
  const projectsGroup = useRef();

  useFrame((state) => {
    const offset = scroll.offset;
    // Move whole group up as we scroll
    projectsGroup.current.position.y = offset * (PROJECTS.length * 12);
  });

  return (
    <>
      <Background />

      <group ref={projectsGroup}>
        {/* Centerpiece Section */}
        <group position={[0, 0, 0]}>
          <MacBook url={PROJECTS[0].url} position={[0, -0.8, 0]} />
          <Text
            position={[0, 4.2, -5]}
            fontSize={1}
            color="white"
            fontWeight="900"
            letterSpacing={-0.1}
          >
            {PROFILE.name.toUpperCase()}
          </Text>
          <Text
            position={[0, 3.2, -5]}
            fontSize={0.15}
            color="#555"
            letterSpacing={0.5}
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
            position={[i % 2 === 0 ? 3.8 : -3.8, - (i + 1) * 12, -1]}
          />
        ))}

        {/* Final Contact Section */}
        <group position={[0, - PROJECTS.length * 12, 0]}>
             <Text
              fontSize={1.4}
              color="white"
              fontWeight="900"
              letterSpacing={-0.08}
              position={[0, 2, 0]}
             >
                LET'S CREATE.
             </Text>
             <Text
              fontSize={0.12}
              color="#444"
              position={[0, 0.5, 0]}
              letterSpacing={0.6}
              fontWeight="bold"
             >
                READY TO BRING YOUR VISION TO LIFE
             </Text>

             {/* Glow core */}
             <Float speed={4} rotationIntensity={2}>
               <mesh position={[0, -2, -2]}>
                 <sphereGeometry args={[0.4, 32, 32]} />
                 <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={5} />
               </mesh>
             </Float>
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
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-12 sm:p-20 text-white overflow-hidden">
      <header className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <h1 className="text-3xl font-black tracking-tighter italic leading-none group-hover:text-cyan-400 transition-colors duration-500">AS.</h1>
          <span className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-600 mt-2">Design & Code</span>
        </div>
        <nav className="hidden lg:flex gap-20 text-[10px] uppercase tracking-[0.5em] font-black text-zinc-600">
          <a href="#" className="hover:text-white transition-all duration-700 hover:tracking-[0.7em]">Works</a>
          <a href="#" className="hover:text-white transition-all duration-700 hover:tracking-[0.7em]">About</a>
          <a href={PROFILE.socials.email} className="hover:text-white transition-all duration-700 hover:tracking-[0.7em]">Contact</a>
        </nav>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 pointer-events-auto backdrop-blur-xl"
        >
           <Menu size={20} className={menuOpen ? 'text-cyan-400' : 'text-white'} />
        </button>
      </header>

      <div className="flex flex-col items-start gap-10 max-w-lg pointer-events-auto">
         <div className="space-y-4">
           <div className="flex items-center gap-4">
             <div className="w-8 h-[1px] bg-cyan-500" />
             <p className="text-[11px] uppercase tracking-[0.6em] font-black text-cyan-500 animate-pulse">Open for collaboration</p>
           </div>
           <h2 className="text-xl font-medium text-zinc-400 leading-snug tracking-tight">I design and develop immersive 3D digital experiences for modern brands.</h2>
         </div>
         <div className="flex gap-4">
            <a href={PROFILE.socials.email} className="px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-cyan-400 hover:scale-105 transition-all duration-500">Get in touch</a>
            <a href="#works" className="px-8 py-3 bg-transparent border border-white/20 text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white/5 transition-all duration-500">View projects</a>
         </div>
      </div>

      <footer className="flex justify-between items-end pointer-events-auto">
        <div className="flex gap-12">
          <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-zinc-700 hover:text-white transition-all duration-700">
            <Github size={22}/>
            <span className="text-[9px] uppercase tracking-[0.3em] font-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">Github</span>
          </a>
          <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" className="group flex items-center gap-4 text-zinc-700 hover:text-white transition-all duration-700">
            <Linkedin size={22}/>
            <span className="text-[9px] uppercase tracking-[0.3em] font-black opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">LinkedIn</span>
          </a>
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
             <p className="text-xs uppercase tracking-[0.4em] font-black text-white">Lagos, NG</p>
           </div>
           <div className="h-px w-20 bg-zinc-800" />
           <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-700">© 2025 All Rights Reserved</p>
        </div>
      </footer>

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
    </div>
  );
}

/* -------------------- Main Component -------------------- */

export default function App() {
  return (
    <div className="w-full h-screen bg-[#010101] font-['Inter',sans-serif] selection:bg-cyan-500/40 overflow-hidden">
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
