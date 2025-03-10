import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import "./App.css";

function Planet({ modelPath, position, lightColor, rotation, onClick }: { modelPath: string; position: [number, number, number]; lightColor: string; rotation: number; onClick: () => void }) {
  const { scene } = useGLTF(modelPath);
  const planetRef = useRef<THREE.Object3D | null>(null);
  const [offsetY, setOffsetY] = useState(position[1]);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(position[1] + window.scrollY * 0.02); // Adjust scroll factor for smooth movement
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [position]);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.position.y = offsetY;
      planetRef.current.rotation.y += rotation; // Slow rotation over time
    }
  });

  return (
    <>
      <primitive ref={planetRef} object={scene} scale={2} position={[position[0], offsetY, position[2]]} onClick={onClick} />
      <pointLight position={[position[0], offsetY, position[2] + 5]} intensity={1.5} color={lightColor} distance={5} decay={2} />
    </>
  );
}

function InfoBox({ show, title, description, onClose }: { show: boolean; title: string; description: string; onClose: () => void }) {
  if (!show) return null;

  return (
    <div className="info-box" onClick={onClose}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default function App() {
  const [info, setInfo] = useState<{ show: boolean; title: string; description: string }>({
    show: false,
    title: "",
    description: ""
  });

  return (
    <div className="space-container">
      <Canvas className="canvas">
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        
        <Planet 
          modelPath="models/planet.glb" 
          position={[-15, 0, -10]} 
          lightColor="blue"
          rotation={0.002} 
          onClick={() => setInfo({ show: true, title: "planet 1", description: "this is a test" })} 
        />
        
        <Planet 
          modelPath="models/planet-2.glb" 
          position={[15, -15, -15]} 
          lightColor="white" 
          rotation={-0.003}
          onClick={() => setInfo({ show: true, title: "Planet 2", description: "this is a test" })} 
        />
      </Canvas>
      <InfoBox show={info.show} title={info.title} description={info.description} onClose={() => setInfo({ show: false, title: "", description: "" })} />
    </div>
  );
}