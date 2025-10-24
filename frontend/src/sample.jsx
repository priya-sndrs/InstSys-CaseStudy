import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Sample() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current || mountRef.current.hasChildNodes()) return;

    const texture = new THREE.TextureLoader().load("./images/meshTexture.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    const current = mountRef.current;
    const width = current.clientWidth;
    const height = current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
    camera.position.z = 100;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor("#333333");

    current.appendChild(renderer.domElement);
    const geometry = new THREE.IcosahedronGeometry(70, 10);
    const material = new THREE.MeshLambertMaterial({
      color: 0x404040,
      wireframe: true,
      texture: true
    });

    const sphere = new THREE.Mesh(geometry, material);

    const light = new THREE.DirectionalLight("#ffffff", 1);
    light.position.set(50, 100, 50);
    const ambient = new THREE.AmbientLight("#ffffff", 0.1);
    scene.add(ambient)
    scene.add(light);
    scene.add(sphere);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen p-2 gap-2 bg-white">
      <div className="flex justify-center w-full p-2 rounded-2xl bg-gray-200">
        <span className="text-gray-600">
          This is a developer page / testing ground
        </span>
      </div>

      <div className="flex-1 bg-gray-200 rounded-2xl" ref={mountRef}></div>
    </div>
  );
}
