import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useNavigate } from "react-router-dom";
import couple1 from '../assets/img/stephane_illana1.png';
import couple2 from '../assets/img/stephane_illana2.png';
import couple3 from '../assets/img/stephane_illana3.png';
import couple4 from '../assets/img/stephane_illana4.png';
import { planTables } from "../utils/PlanTables";
// Fonction pour créer une étiquette de texte en 3D
function createLabel(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 50;
  const ctx = canvas.getContext("2d");
  ctx.font = "bold 32px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 1, 1);
  return sprite;
}



export default function Salle({
  clignoter = false,
  tableAClignoter = null,
  onClignotementFini = () => {},
}) {
  const navigate = useNavigate();
  const mountRef = useRef();
  const tableRefs = useRef({});

  useEffect(() => {
    const width = Math.min(window.innerWidth, 1200);
    const height = Math.min(window.innerHeight * 0.8, 800);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd06c38);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 14, 32);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.4));

    const textureLoader = new THREE.TextureLoader();
    const floorTextures = [
      textureLoader.load(couple1),
      textureLoader.load(couple2),
      textureLoader.load(couple3),
      textureLoader.load(couple4),
    ];

    const sectionSize = 25;
    const sections = [
      { x: -12.5, z: -12.5 },
      { x: 12.5, z: -12.5 },
      { x: -12.5, z: 12.5 },
      { x: 12.5, z: 12.5 },
    ];

    sections.forEach((section, index) => {
      const texture = floorTextures[index];
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);

      const floorGeometry = new THREE.PlaneGeometry(sectionSize, sectionSize);
      const floorMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(section.x, 0, section.z);
      scene.add(floor);
    });

    const group = new THREE.Group();
    scene.add(group);

// Flèche de direction au centre (pointant vers négatif Z)
const direction = new THREE.Vector3(0, 0, -1);
direction.normalize();

const origin = new THREE.Vector3(0, 0.1, 25); // léger décalage en Y au-dessus du sol
const length = 10;
const color = 0xff0000;
const headLength = 1; // longueur de la tête un peu plus grande
const headWidth = 1;  // largeur plus grande (épaisseur)
const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color,headLength,headWidth);
group.add(arrowHelper);


    planTables.forEach(({ nom, x, z, rotation = 0 }) => {
      const table = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 1, 32),
        new THREE.MeshPhongMaterial({ color: 0xFFA500 })
      );
      table.position.set(x, 0.5, z);
      table.rotation.y = rotation;
      tableRefs.current[nom] = table;
      group.add(table);

      const label = createLabel(nom);
      label.position.set(x, 2, z);
      group.add(label);

      const nbChaises = 10;
      const radius = 1.8;
      for (let i = 0; i < nbChaises; i++) {
        const angle = (i / nbChaises) * Math.PI * 2;
        const cx = x + Math.cos(angle) * radius;
        const cz = z + Math.sin(angle) * radius;
        const chair = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 1, 0.5),
          new THREE.MeshPhongMaterial({ color: 0x405433 })
        );
        chair.position.set(cx, 0.5, cz);
        group.add(chair);
      }
    });

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;

    let frameId;
    let blinkFrame = 0;
    let blinking = false;
    let blinkTarget = null;
    let blinkOrigColor = null;

    if (
      clignoter &&
      tableAClignoter &&
      tableRefs.current[tableAClignoter]
    ) {
      blinking = true;
      blinkTarget = tableRefs.current[tableAClignoter];
      blinkOrigColor = blinkTarget.material.color.getHex();
      blinkFrame = 0;
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (blinking && blinkTarget) {
        blinkFrame++;
        if (blinkFrame < Math.exp(99999)) {
          if (Math.floor(blinkFrame / 10) % 2 === 0) {
            blinkTarget.material.color.set(0xffffff);
          } else {
            blinkTarget.material.color.set(blinkOrigColor);
          }
        } else {
          blinkTarget.material.color.set(blinkOrigColor);
          blinking = false;
          blinkTarget = null;
          blinkOrigColor = null;
          blinkFrame = 0;
          onClignotementFini();
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = Math.min(window.innerWidth, 1200);
      const newHeight = Math.min(window.innerHeight * 0.8, 800);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Sauvegarde la référence pour éviter problème null dans cleanup
    const currentMount = mountRef.current;

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [clignoter, tableAClignoter, onClignotementFini]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        height: "80vh",
        maxWidth: "1200px",
        maxHeight: "800px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 20px",
          backgroundColor: "#405433",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Retour
      </button>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
