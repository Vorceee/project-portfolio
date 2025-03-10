import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useGLTF } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import "./App.css";

function Planet({ onClick }: { onClick: () => void }) {
  const { scene } = useGLTF("models/mars.glb");
  const planetRef = useRef<THREE.Object3D | null>(null);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setPositionY(window.scrollY * 0.02); 
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.position.y = positionY;
      planetRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <primitive ref={planetRef} object={scene} scale={1.5} position={[-15, 0, -15]} onClick={onClick} />
      <pointLight position={[-15, 0, -10]} intensity={1.5} color="orange" distance={5} decay={2} />
    </>
  );
}

function InfoBox({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;

  return (
    <div className="info-box" onClick={onClose}>
      <h2>test</h2>
      <p>test</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default function App() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="space-container">
      <Canvas className="canvas">
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <Planet onClick={() => setShowInfo(true)} />
      </Canvas>
      <InfoBox show={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
}
