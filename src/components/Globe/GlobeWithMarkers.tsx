// components/GlobeWithMarkers.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { extend } from "@react-three/fiber";
import countries from "../../../data/globe.json";

extend({ ThreeGlobe: ThreeGlobe });

type Marker = {
  lat: number;
  lng: number;
  url: string;
  name: string;
  order: number;
};  

const MARKERS: Marker[] = [
  {
    lat: 12.9629,
    lng: 77.5775,
    url: "/country/india",
    name: "India",
    order: 1,
  },
  {
    lat: 35.8617,
    lng: 104.1954,
    url: "/country/china",
    name: "China",
    order: 2,
  },
  {
    lat: -14.235,
    lng: -51.9253,
    url: "/country/brazil",
    name: "Brazil",
    order: 3,
  },
  {
    lat: 37.0902,
    lng: -95.7129,
    url: "/country/usa",
    name: "USA",
    order: 4,
  },
  {
    lat: -25.2744,
    lng: 133.7751,
    url: "/country/australia",
    name: "Australia",
    order: 5,
  },
  {
    lat: 55.3781,
    lng: -3.4360,
    url: "/country/uk",
    name: "United Kingdom",
    order: 6,
  },
];

const BASE_RADIUS = 100; // Match three-globe radius

function latLngToVector3(lat: number, lng: number, radius: number) {
  // Match three-globe's coordinate system
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  
  const x = (radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

function MarkerPoint({ marker }: { marker: Marker }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const position = latLngToVector3(marker.lat, marker.lng, BASE_RADIUS);

  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log(`Clicked on ${marker.name}, navigating to ${marker.url}`);
    router.push(marker.url);
  };

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <sphereGeometry args={[hovered ? 1.5 : 1.2, 16, 16]} />
      <meshStandardMaterial
        color={hovered ? "#FFD700" : "#DAA520"}
        emissive={hovered ? "#FFD700" : "#DAA520"}
        emissiveIntensity={hovered ? 1.2 : 0.8}
      />
    </mesh>
  );
}

function GlobeWithCountries() {
  const globeRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      const globe = new ThreeGlobe();
      globeRef.current = globe;
      groupRef.current.add(globe);

      // Configure globe appearance
      const globeMaterial = globe.globeMaterial() as any;
      globeMaterial.color = new Color("#000000"); // Black background
      globeMaterial.emissive = new Color("#000000");
      globeMaterial.emissiveIntensity = 0.1;
      globeMaterial.shininess = 0.9;

      // Add country polygons with dots
      globe
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(4) // Higher resolution for more dots
        .hexPolygonMargin(0.3) // Less margin for denser dots
        .showAtmosphere(false)
        .hexPolygonColor(() => "rgba(255,250,205,0.9)"); // Light yellow dots

      setIsInitialized(true);
    }
  }, []);

  // Auto-rotate
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {isInitialized &&
        MARKERS.map((marker, idx) => <MarkerPoint key={idx} marker={marker} />)}
    </group>
  );
}

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[-400, 100, 400]} intensity={1} color="#ffffff" />
      <directionalLight position={[-200, 500, 200]} intensity={1} color="#ffffff" />
      <pointLight position={[-200, 500, 200]} intensity={0.8} color="#ffffff" />
      <GlobeWithCountries />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={300}
        maxDistance={300}
        autoRotate={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </>
  );
}

export default function GlobeWithMarkers() {
  const scene = new Scene();
  scene.fog = new Fog(0x000000, 400, 2000);

  return (
    <div className="w-full h-[50vw] bg-[#000000]">
      <Canvas
        scene={scene}
        camera={new PerspectiveCamera(50, 1.2, 180, 1800)}
        // gl={{ setClearColor: () => {}, antialias: true }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}