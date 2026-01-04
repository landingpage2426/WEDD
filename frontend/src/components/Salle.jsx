import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  editable = false,
}) {
  const navigate = useNavigate();
  const mountRef = useRef();
  const tableRefs = useRef({});
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const selectedTableRef = useRef(null);
  const tableGroupsRef = useRef({});
  const isDraggingRef = useRef(false);
  const planeRef = useRef(null);
  const chairRefsRef = useRef({});
  const sceneInitializedRef = useRef(false);
  const tablesGroupRef = useRef(null);
  
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const [isEditing, setIsEditing] = useState(editable || (isAuthenticated() && window.location.pathname === '/salle/edit'));
  const [tablesData, setTablesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [tableFormData, setTableFormData] = useState({ nom: "", nbChaises: 10 });
  const [showEditInstructions, setShowEditInstructions] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colors, setColors] = useState({
    floor: '#e8e8e8',
    table: '#FFA500',
    chair: '#405433'
  });
  const floorRef = useRef(null);
  
  // Détection de la taille d'écran pour le responsive (doit être avant tout return conditionnel)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fonction pour charger la disposition depuis l'API
  const loadRoomLayout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const defaultTables = planTables.map(t => ({ ...t, nbChaises: t.nbChaises || 10 }));
        setTablesData(defaultTables);
        setLoading(false);
        return defaultTables;
      }

      const response = await axios.get(`${apiUrl}/api/room-layout`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data.layout && response.data.layout.tables) {
        const tables = response.data.layout.tables.map(t => ({ ...t, nbChaises: t.nbChaises || 10 }));
        setTablesData(tables);
        
        // Charger les couleurs personnalisées si elles existent
        if (response.data.layout.colors) {
          setColors({
            floor: response.data.layout.colors.floor || '#e8e8e8',
            table: response.data.layout.colors.table || '#FFA500',
            chair: response.data.layout.colors.chair || '#405433'
          });
        }
        
        return tables;
      }
      const defaultTables = planTables.map(t => ({ ...t, nbChaises: t.nbChaises || 10 }));
      setTablesData(defaultTables);
      return defaultTables;
    } catch (error) {
      console.error('Erreur lors du chargement de la disposition:', error);
      const defaultTables = planTables.map(t => ({ ...t, nbChaises: t.nbChaises || 10 }));
      setTablesData(defaultTables);
      return defaultTables;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour sauvegarder la disposition
  const saveRoomLayout = async (tables, customColors = null, showMessage = true) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        if (showMessage) {
          setMessage("Vous devez être connecté pour sauvegarder");
          setTimeout(() => setMessage(""), 3000);
        }
        return;
      }

      // Toujours inclure les couleurs (soit celles passées en paramètre, soit celles de l'état actuel)
      const payload = { 
        tables,
        colors: customColors || colors
      };

      const response = await axios.put(
        `${apiUrl}/api/room-layout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (showMessage) {
        setMessage("Disposition sauvegardée avec succès !");
        setTimeout(() => setMessage(""), 3000);
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (showMessage) {
        setMessage("Erreur lors de la sauvegarde");
        setTimeout(() => setMessage(""), 3000);
      }
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Fonction pour convertir une couleur hex en nombre
  const hexToNumber = (hex) => {
    return parseInt(hex.replace('#', ''), 16);
  };

  // Fonction pour créer une table dans la scène
  const createTableInScene = useCallback((scene, group, { nom, x, z, rotation = 0, nbChaises = 10 }) => {
    const tableGroup = new THREE.Group();
    
    const tableColor = isEditing && selectedTableRef.current === nom ? 0x00ff00 : hexToNumber(colors.table);
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 1, 32),
      new THREE.MeshPhongMaterial({ 
        color: tableColor
      })
    );
    table.position.set(0, 0.5, 0);
    table.rotation.y = 0;
    table.userData = { nom, isTable: true };
    tableRefs.current[nom] = table;
    tableGroup.add(table);

    const label = createLabel(nom);
    label.position.set(0, 2, 0);
    tableGroup.add(label);

    const radius = 1.8;
    const chairs = [];
    const chairColor = hexToNumber(colors.chair);
    for (let i = 0; i < nbChaises; i++) {
      const angle = (i / nbChaises) * Math.PI * 2;
      const cx = Math.cos(angle) * radius;
      const cz = Math.sin(angle) * radius;
      const chair = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1, 0.5),
        new THREE.MeshPhongMaterial({ color: chairColor })
      );
      chair.position.set(cx, 0.5, cz);
      tableGroup.add(chair);
      chairs.push(chair);
    }
    chairRefsRef.current[nom] = chairs;

    tableGroup.position.set(x, 0, z);
    tableGroup.rotation.y = rotation;
    tableGroup.userData = { nom, isTableGroup: true, nbChaises };
    tableGroupsRef.current[nom] = tableGroup;
    group.add(tableGroup);
    
    return tableGroup;
  }, [isEditing, colors]);

  // Fonction pour mettre à jour le nombre de chaises d'une table
  const updateTableChairs = useCallback((tableGroup, newNbChaises) => {
    const nom = tableGroup.userData.nom;
    const oldChairs = chairRefsRef.current[nom] || [];
    
    // Supprimer les anciennes chaises
    oldChairs.forEach(chair => {
      tableGroup.remove(chair);
      chair.geometry.dispose();
      chair.material.dispose();
    });

    // Créer les nouvelles chaises
    const radius = 1.8;
    const chairs = [];
    const chairColor = hexToNumber(colors.chair);
    for (let i = 0; i < newNbChaises; i++) {
      const angle = (i / newNbChaises) * Math.PI * 2;
      const cx = Math.cos(angle) * radius;
      const cz = Math.sin(angle) * radius;
      const chair = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 1, 0.5),
        new THREE.MeshPhongMaterial({ color: chairColor })
      );
      chair.position.set(cx, 0.5, cz);
      tableGroup.add(chair);
      chairs.push(chair);
    }
    chairRefsRef.current[nom] = chairs;
    tableGroup.userData.nbChaises = newNbChaises;
  }, [colors]);

  // Fonction pour obtenir les positions actuelles des tables
  const getCurrentTablePositions = useCallback(() => {
    const positions = [];
    Object.keys(tableGroupsRef.current).forEach(nom => {
      const tableGroup = tableGroupsRef.current[nom];
      if (tableGroup) {
        const tableData = tablesData.find(t => t.nom === nom) || {};
        positions.push({
          nom: nom,
          x: tableGroup.position.x,
          z: tableGroup.position.z,
          rotation: tableGroup.rotation.y,
          nbChaises: tableGroup.userData.nbChaises || tableData.nbChaises || 10,
          w: tableData.w,
          h: tableData.h,
        });
      }
    });
    return positions;
  }, [tablesData]);

  // Charger la disposition au montage
  useEffect(() => {
    loadRoomLayout();
  }, []);

  // Gérer le resize pour le responsive
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonction pour mettre à jour les couleurs dans la scène
  const updateColorsInScene = useCallback(() => {
    // Mettre à jour le fond de la scène
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(colors.floor || '#f5f5f5');
    }

    // Mettre à jour le sol
    if (floorRef.current) {
      floorRef.current.material.color.set(hexToNumber(colors.floor));
    }

    // Mettre à jour toutes les tables
    Object.keys(tableRefs.current).forEach(nom => {
      const table = tableRefs.current[nom];
      if (table && selectedTableRef.current !== nom) {
        table.material.color.set(hexToNumber(colors.table));
      }
    });

    // Mettre à jour toutes les chaises
    Object.keys(chairRefsRef.current).forEach(nom => {
      const chairs = chairRefsRef.current[nom] || [];
      const chairColor = hexToNumber(colors.chair);
      chairs.forEach(chair => {
        chair.material.color.set(chairColor);
      });
    });
  }, [colors]);

  // Mettre à jour les couleurs quand elles changent
  useEffect(() => {
    if (sceneInitializedRef.current) {
      updateColorsInScene();
    }
  }, [colors, updateColorsInScene]);

  // Initialiser la scène une seule fois
  useEffect(() => {
    if (loading || tablesData.length === 0 || sceneInitializedRef.current) return;

    // Calcul responsive de la taille
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const width = isMobile 
      ? Math.min(window.innerWidth * 0.95, 600)
      : isTablet 
        ? Math.min(window.innerWidth * 0.9, 900)
        : Math.min(window.innerWidth * 0.9, 1200);
    const height = isMobile
      ? Math.min(window.innerHeight * 0.7, 500)
      : isTablet
        ? Math.min(window.innerHeight * 0.75, 700)
        : Math.min(window.innerHeight * 0.8, 800);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.floor || '#f5f5f5');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 14, 32);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.4));

    // Sol simple avec une couleur unie
    const floorSize = 50;
    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorColor = hexToNumber(colors.floor);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: floorColor,
      side: THREE.DoubleSide,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    scene.add(floor);
    floorRef.current = floor;

    const group = new THREE.Group();
    group.name = "tablesGroup";
    scene.add(group);
    tablesGroupRef.current = group;

    // Flèche de direction
    const direction = new THREE.Vector3(0, 0, -1);
    direction.normalize();
    const origin = new THREE.Vector3(0, 0.1, 25);
    const length = 10;
    const color = 0xff0000;
    const headLength = 1;
    const headWidth = 1;
    const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color, headLength, headWidth);
    group.add(arrowHelper);

    // Plan invisible pour le raycasting en mode édition
    if (isEditing) {
      const planeGeometry = new THREE.PlaneGeometry(100, 100);
      const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = 0;
      scene.add(plane);
      planeRef.current = plane;
    }

    // Créer les tables
    const currentTables = tablesData.length > 0 ? tablesData : planTables;
    currentTables.forEach((table) => {
      createTableInScene(scene, group, table);
    });

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    if (isEditing) {
      controls.enableRotate = true;
      controls.enablePan = true;
      controls.enableZoom = true;
    }
    controlsRef.current = controls;

    let frameId;
    let blinkFrame = 0;
    let blinking = false;
    let blinkTarget = null;
    let blinkOrigColor = null;
    let blinkScale = 1;
    let blinkDirection = 1;

    // Le clignotement sera géré dans la boucle d'animation

    // Fonction utilitaire pour obtenir les coordonnées depuis un événement (souris ou tactile)
    const getEventCoordinates = (event) => {
      let clientX, clientY;
      
      if (event.touches && event.touches.length > 0) {
        // Événement tactile
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        // Événement souris
        clientX = event.clientX;
        clientY = event.clientY;
      }
      
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1
      };
    };

    // Fonction pour démarrer le drag
    const startDrag = (coords) => {
      if (!isEditing) return false;

      mouseRef.current.x = coords.x;
      mouseRef.current.y = coords.y;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      // Chercher dans les groupes de tables et leurs enfants (table, chaises, label)
      const tableGroupsArray = Object.values(tableGroupsRef.current);
      const intersects = raycasterRef.current.intersectObjects(tableGroupsArray, true);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        let tableGroup = null;

        if (intersected.userData.isTableGroup) {
          tableGroup = intersected;
        } else if (intersected.parent && intersected.parent.userData.isTableGroup) {
          tableGroup = intersected.parent;
        }

        if (tableGroup) {
          selectedTableRef.current = tableGroup.userData.nom;
          isDraggingRef.current = true;
          controls.enabled = false;

          const table = tableRefs.current[tableGroup.userData.nom];
          if (table) {
            table.material.color.set(0x00ff00);
          }
          return true;
        }
      }
      return false;
    };

    // Fonction pour mettre à jour le drag
    const updateDrag = (coords) => {
      if (!isEditing || !isDraggingRef.current || !selectedTableRef.current) return;

      mouseRef.current.x = coords.x;
      mouseRef.current.y = coords.y;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      if (planeRef.current) {
        const intersects = raycasterRef.current.intersectObject(planeRef.current);
        if (intersects.length > 0) {
          const point = intersects[0].point;
          const tableGroup = tableGroupsRef.current[selectedTableRef.current];
          if (tableGroup) {
            tableGroup.position.x = point.x;
            tableGroup.position.z = point.z;
          }
        }
      }
    };

    // Fonction pour terminer le drag
    const endDrag = () => {
      if (!isEditing) return;

      if (isDraggingRef.current && selectedTableRef.current) {
        const table = tableRefs.current[selectedTableRef.current];
        if (table) {
          table.material.color.set(hexToNumber(colors.table));
        }
        isDraggingRef.current = false;
        selectedTableRef.current = null;
        controls.enabled = true;
      }
    };

    // Gestion du drag & drop en mode édition - Événements souris
    const onMouseDown = (event) => {
      const coords = getEventCoordinates(event);
      startDrag(coords);
    };

    // Throttle pour améliorer les performances
    let lastMoveTime = 0;
    const onMouseMove = (event) => {
      // Throttle à 60fps max
      const now = performance.now();
      if (now - lastMoveTime < 16) return;
      lastMoveTime = now;

      const coords = getEventCoordinates(event);
      updateDrag(coords);
    };

    const onMouseUp = () => {
      endDrag();
    };

    // Gestion du double-tap pour mobile
    let lastTapTime = 0;
    let lastTapCoords = null;
    const DOUBLE_TAP_DELAY = 300; // ms
    const DOUBLE_TAP_DISTANCE = 50; // pixels

    // Gestion du drag & drop en mode édition - Événements tactiles
    const onTouchStart = (event) => {
      const coords = getEventCoordinates(event);
      const touch = event.touches[0];
      const currentTime = Date.now();
      const tapLength = currentTime - lastTapTime;
      
      // Détecter le double-tap
      if (lastTapCoords && 
          tapLength < DOUBLE_TAP_DELAY &&
          Math.abs(touch.clientX - lastTapCoords.x) < DOUBLE_TAP_DISTANCE &&
          Math.abs(touch.clientY - lastTapCoords.y) < DOUBLE_TAP_DISTANCE) {
        // Double-tap détecté - éditer la table
        event.preventDefault();
        editTableAtCoordinates(coords);
        lastTapTime = 0;
        lastTapCoords = null;
        return;
      }
      
      // Enregistrer le tap pour la détection du double-tap
      lastTapTime = currentTime;
      lastTapCoords = { x: touch.clientX, y: touch.clientY };
      
      // Essayer de démarrer le drag
      if (startDrag(coords)) {
        event.preventDefault(); // Empêcher le scroll si on drag une table
        event.stopPropagation();
      }
    };

    const onTouchMove = (event) => {
      if (!isDraggingRef.current) return;
      
      event.preventDefault(); // Empêcher le scroll pendant le drag
      
      // Throttle à 60fps max
      const now = performance.now();
      if (now - lastMoveTime < 16) return;
      lastMoveTime = now;

      const coords = getEventCoordinates(event);
      updateDrag(coords);
      
      // Annuler le double-tap si on bouge
      lastTapTime = 0;
      lastTapCoords = null;
    };

    const onTouchEnd = (event) => {
      if (isDraggingRef.current) {
        event.preventDefault();
      }
      endDrag();
    };

    // Fonction pour éditer une table à partir de coordonnées
    const editTableAtCoordinates = (coords) => {
      if (!isEditing) return;

      mouseRef.current.x = coords.x;
      mouseRef.current.y = coords.y;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      // Chercher dans les groupes de tables et leurs enfants
      const tableGroupsArray = Object.values(tableGroupsRef.current);
      const intersects = raycasterRef.current.intersectObjects(tableGroupsArray, true);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        let tableGroup = null;

        if (intersected.userData.isTableGroup) {
          tableGroup = intersected;
        } else if (intersected.parent && intersected.parent.userData.isTableGroup) {
          tableGroup = intersected.parent;
        }

        if (tableGroup) {
          const nom = tableGroup.userData.nom;
          setEditingTable(nom);
          setTableFormData({
            nom: nom,
            nbChaises: tableGroup.userData.nbChaises || 10
          });
          setShowTableForm(true);
        }
      }
    };

    // Double-clic pour éditer une table
    const onDoubleClick = (event) => {
      event.preventDefault();
      const coords = getEventCoordinates(event);
      editTableAtCoordinates(coords);
    };

    if (isEditing) {
      // Événements souris
      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('mouseup', onMouseUp);
      renderer.domElement.addEventListener('dblclick', onDoubleClick);
      
      // Événements tactiles pour mobile
      renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
      renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
      renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: false });
    }

    // Gérer le clignotement dynamiquement
    if (clignoter && tableAClignoter && tableRefs.current[tableAClignoter]) {
      if (!blinking || blinkTarget !== tableRefs.current[tableAClignoter]) {
        blinking = true;
        blinkTarget = tableRefs.current[tableAClignoter];
        blinkOrigColor = blinkTarget.material.color.getHex();
        blinkFrame = 0;
        blinkScale = 1;
        blinkDirection = 1;
      }
    } else if (!clignoter && blinkTarget) {
      // Arrêter le clignotement si clignoter devient false
      if (blinkOrigColor !== null) {
        blinkTarget.material.color.setHex(blinkOrigColor);
        blinkTarget.scale.set(1, 1, 1);
      }
      blinking = false;
      blinkTarget = null;
      blinkOrigColor = null;
      blinkFrame = 0;
      blinkScale = 1;
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Animation de clignotement améliorée avec pulsation
      if (blinking && blinkTarget) {
        blinkFrame++;
        
        // Pulsation de couleur
        const intensity = Math.sin(blinkFrame * 0.2) * 0.5 + 0.5;
        const r = Math.floor((blinkOrigColor >> 16) & 0xFF + (255 - ((blinkOrigColor >> 16) & 0xFF)) * intensity);
        const g = Math.floor((blinkOrigColor >> 8) & 0xFF + (255 - ((blinkOrigColor >> 8) & 0xFF)) * intensity);
        const b = Math.floor(blinkOrigColor & 0xFF + (255 - (blinkOrigColor & 0xFF)) * intensity);
        blinkTarget.material.color.setRGB(r / 255, g / 255, b / 255);

        // Pulsation de taille
        blinkScale += blinkDirection * 0.02;
        if (blinkScale > 1.3) blinkDirection = -1;
        if (blinkScale < 0.9) blinkDirection = 1;
        blinkTarget.scale.set(blinkScale, blinkScale, blinkScale);

        // Le clignotement continue indéfiniment jusqu'à ce qu'on quitte la page
        // (le clignotement s'arrête uniquement si clignoter devient false ou si on quitte la page)
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const isMobileResize = window.innerWidth < 768;
      const isTabletResize = window.innerWidth >= 768 && window.innerWidth < 1024;
      const newWidth = isMobileResize 
        ? Math.min(window.innerWidth * 0.95, 600)
        : isTabletResize 
          ? Math.min(window.innerWidth * 0.9, 900)
          : Math.min(window.innerWidth * 0.9, 1200);
      const newHeight = isMobileResize
        ? Math.min(window.innerHeight * 0.7, 500)
        : isTabletResize
          ? Math.min(window.innerHeight * 0.75, 700)
          : Math.min(window.innerHeight * 0.8, 800);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    sceneInitializedRef.current = true;

    const currentMount = mountRef.current;

    return () => {
      window.removeEventListener("resize", handleResize);
      // Toujours retirer les événements au cas où
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('dblclick', onDoubleClick);
        renderer.domElement.removeEventListener('touchstart', onTouchStart);
        renderer.domElement.removeEventListener('touchmove', onTouchMove);
        renderer.domElement.removeEventListener('touchend', onTouchEnd);
      }
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      sceneInitializedRef.current = false;
    };
  }, [loading, tablesData.length, isEditing, clignoter, tableAClignoter, onClignotementFini]);

  const handleSave = async () => {
    const currentPositions = getCurrentTablePositions();
    await saveRoomLayout(currentPositions, colors);
    setTablesData(currentPositions);
  };

  // Calculer les statistiques de la salle
  const totalTables = tablesData.length;
  const totalChaises = tablesData.reduce((sum, table) => sum + (table.nbChaises || 10), 0);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    selectedTableRef.current = null;
    isDraggingRef.current = false;
  };

  const handleAddTable = () => {
    setEditingTable(null);
    setTableFormData({ nom: "", nbChaises: 10 });
    setShowTableForm(true);
  };

  const handleDeleteTable = async (tableName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la table "${tableName}" ?`)) {
      // Supprimer de la scène
      const tableGroup = tableGroupsRef.current[tableName];
      if (tableGroup && tablesGroupRef.current) {
        tablesGroupRef.current.remove(tableGroup);
        
        // Nettoyer les chaises
        const chairs = chairRefsRef.current[tableName] || [];
        chairs.forEach(chair => {
          chair.geometry.dispose();
          chair.material.dispose();
        });
        
        // Nettoyer les références
        delete tableGroupsRef.current[tableName];
        delete tableRefs.current[tableName];
        delete chairRefsRef.current[tableName];
      }
      
      // Mettre à jour les données
      const newTables = tablesData.filter(t => t.nom !== tableName);
      setTablesData(newTables);
      await saveRoomLayout(newTables, colors);
    }
  };

  const handleSubmitTableForm = async () => {
    if (!tableFormData.nom.trim()) {
      setMessage("Le nom de la table est requis");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // Vérifier si le nom existe déjà (sauf si on modifie la même table ou si c'est le même nom)
    const isNameTaken = tablesData.some(t => t.nom === tableFormData.nom && t.nom !== editingTable);
    if (isNameTaken) {
      setMessage("Une table avec ce nom existe déjà");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (editingTable) {
      // Modifier une table existante
      const tableGroup = tableGroupsRef.current[editingTable];
      if (tableGroup) {
        // Mettre à jour le nom si changé
        if (tableFormData.nom !== editingTable) {
          // Supprimer l'ancienne table de la scène
          tablesGroupRef.current?.remove(tableGroup);
          
          // Nettoyer les chaises
          const chairs = chairRefsRef.current[editingTable] || [];
          chairs.forEach(chair => {
            chair.geometry.dispose();
            chair.material.dispose();
          });
          
          // Nettoyer les références
          delete tableGroupsRef.current[editingTable];
          delete tableRefs.current[editingTable];
          delete chairRefsRef.current[editingTable];
          
          // Créer la nouvelle table avec le nouveau nom
          const oldTable = tablesData.find(t => t.nom === editingTable);
          const newTable = {
            ...oldTable,
            nom: tableFormData.nom,
            nbChaises: tableFormData.nbChaises,
            x: tableGroup.position.x,
            z: tableGroup.position.z,
            rotation: tableGroup.rotation.y
          };
          
          // Ajouter à la scène
          if (tablesGroupRef.current && sceneRef.current) {
            createTableInScene(sceneRef.current, tablesGroupRef.current, newTable);
          }
          
          // Mettre à jour les données
          const newTables = tablesData.filter(t => t.nom !== editingTable);
          newTables.push(newTable);
          setTablesData(newTables);
          await saveRoomLayout(newTables, colors);
        } else {
          // Juste mettre à jour le nombre de chaises
          updateTableChairs(tableGroup, tableFormData.nbChaises);
          const updatedTables = tablesData.map(t => 
            t.nom === editingTable 
              ? { ...t, nbChaises: tableFormData.nbChaises }
              : t
          );
          setTablesData(updatedTables);
          await saveRoomLayout(updatedTables, colors);
        }
      }
    } else {
      // Créer une nouvelle table
      const newTable = {
        nom: tableFormData.nom,
        x: 0,
        z: 0,
        rotation: 0,
        nbChaises: tableFormData.nbChaises
      };
      
      // Ajouter à la scène
      if (tablesGroupRef.current && sceneRef.current) {
        createTableInScene(sceneRef.current, tablesGroupRef.current, newTable);
      }
      
      // Mettre à jour les données
      const newTables = [...tablesData, newTable];
      setTablesData(newTables);
      await saveRoomLayout(newTables, colors);
    }
    
    setShowTableForm(false);
    setEditingTable(null);
    setTableFormData({ nom: "", nbChaises: 10 });
  };

  // Calcul des breakpoints (après tous les hooks)
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  if (loading) {
    return (
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
      }}>
        <p>Chargement de la disposition...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: isMobile ? "0" : "50%",
        left: isMobile ? "0" : "50%",
        transform: isMobile ? "none" : "translate(-50%, -50%)",
        width: isMobile ? "100vw" : isTablet ? "95vw" : "90vw",
        height: isMobile ? "100vh" : isTablet ? "85vh" : "80vh",
        maxWidth: isMobile ? "100%" : isTablet ? "1000px" : "1200px",
        maxHeight: isMobile ? "100%" : isTablet ? "750px" : "800px",
        backgroundColor: "#fff",
        borderRadius: isMobile ? "0" : "10px",
        boxShadow: isMobile ? "none" : "0 0 20px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        top: isMobile ? "10px" : "20px",
        left: isMobile ? "10px" : "20px",
        display: "flex",
        gap: isMobile ? "5px" : "10px",
        flexWrap: "wrap",
        zIndex: 1000,
        maxWidth: isMobile ? "calc(100% - 20px)" : "auto",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: isMobile ? "8px 12px" : "10px 20px",
            fontSize: isMobile ? "12px" : "14px",
            backgroundColor: "#405433",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isMobile ? "←" : "Retour"}
        </button>
        {isEditing && (
          <>
            <button
              onClick={handleAddTable}
              style={{
                padding: isMobile ? "8px 12px" : "10px 20px",
                fontSize: isMobile ? "12px" : "14px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {isMobile ? "+ Table" : "+ Ajouter table"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: isMobile ? "8px 12px" : "10px 20px",
                fontSize: isMobile ? "12px" : "14px",
                backgroundColor: saving ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: saving ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {saving ? (isMobile ? "..." : "Sauvegarde...") : (isMobile ? "💾" : "Sauvegarder")}
            </button>
          </>
        )}
        <button
          onClick={handleToggleEdit}
          style={{
            padding: isMobile ? "8px 12px" : "10px 20px",
            fontSize: isMobile ? "12px" : "14px",
            backgroundColor: isEditing ? "#ff6b6b" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isEditing ? (isMobile ? "✕" : "Arrêter l'édition") : (isMobile ? "✏️" : "Éditer la salle")}
        </button>
        {isEditing && (
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{
              padding: isMobile ? "8px 12px" : "10px 20px",
              fontSize: isMobile ? "12px" : "14px",
              backgroundColor: showColorPicker ? "#9C27B0" : "#9C27B0",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {isMobile ? "🎨" : "🎨 Couleurs"}
          </button>
        )}
      </div>
      {message && (
        <div style={{
          position: "absolute",
          top: isMobile ? "60px" : "70px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "8px 15px" : "10px 20px",
          fontSize: isMobile ? "12px" : "14px",
          backgroundColor: message.includes("succès") || message.includes("Erreur") ? 
            (message.includes("succès") ? "#4CAF50" : "#f44336") : "#2196F3",
          color: "white",
          borderRadius: "5px",
          zIndex: 1000,
          maxWidth: isMobile ? "90%" : "auto",
          textAlign: "center",
        }}>
          {message}
        </div>
      )}
      {/* Bouton pour afficher les instructions du mode édition */}
      {isEditing && (
        <div style={{
          position: "absolute",
          top: isMobile ? "50px" : "60px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}>
          <button
            onClick={() => setShowEditInstructions(!showEditInstructions)}
            style={{
              padding: isMobile ? "10px 18px" : "12px 24px",
              fontSize: isMobile ? "13px" : "14px",
              backgroundColor: showEditInstructions ? "#4CAF50" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "25px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
          >
            <span>{showEditInstructions ? "✕" : "📝"}</span>
            <span>{showEditInstructions ? "Fermer" : "Cliquez ici pour le mode d'édition"}</span>
          </button>
        </div>
      )}
      {/* Statistiques de la salle */}
      <div style={{
        position: "absolute",
        top: isMobile ? "10px" : "20px",
        right: isMobile ? "10px" : "20px",
        padding: isMobile ? "10px 12px" : "15px 20px",
        backgroundColor: "rgba(64, 84, 51, 0.9)",
        color: "white",
        borderRadius: "10px",
        zIndex: 1000,
        fontSize: isMobile ? "12px" : "16px",
        fontWeight: "bold",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "5px" : "8px",
        minWidth: isMobile ? "120px" : "200px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{isMobile ? "📊" : "📊 Tables :"}</span>
          <span style={{ fontSize: isMobile ? "16px" : "20px", color: "#FFD700" }}>{totalTables}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{isMobile ? "🪑" : "🪑 Chaises :"}</span>
          <span style={{ fontSize: isMobile ? "16px" : "20px", color: "#FFD700" }}>{totalChaises}</span>
        </div>
      </div>

      {/* Panneau de sélection de couleurs */}
      {isEditing && showColorPicker && (
        <div style={{
          position: "absolute",
          top: isMobile ? "100px" : "120px",
          right: isMobile ? "10px" : "20px",
          padding: isMobile ? "15px" : "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          zIndex: 2000,
          minWidth: isMobile ? "200px" : "250px",
          maxWidth: isMobile ? "calc(100% - 20px)" : "300px",
        }}>
          <h3 style={{ 
            margin: "0 0 15px 0", 
            fontSize: isMobile ? "16px" : "18px",
            color: "#333"
          }}>
            🎨 Personnaliser les couleurs
          </h3>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              fontSize: isMobile ? "13px" : "14px",
              color: "#555"
            }}>
              Couleur du sol :
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="color"
                value={colors.floor}
                onChange={(e) => setColors({ ...colors, floor: e.target.value })}
                style={{
                  width: isMobile ? "50px" : "60px",
                  height: isMobile ? "40px" : "45px",
                  border: "2px solid #ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: isMobile ? "12px" : "13px", color: "#666" }}>
                {colors.floor}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              fontSize: isMobile ? "13px" : "14px",
              color: "#555"
            }}>
              Couleur des tables :
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="color"
                value={colors.table}
                onChange={(e) => setColors({ ...colors, table: e.target.value })}
                style={{
                  width: isMobile ? "50px" : "60px",
                  height: isMobile ? "40px" : "45px",
                  border: "2px solid #ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: isMobile ? "12px" : "13px", color: "#666" }}>
                {colors.table}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "bold",
              fontSize: isMobile ? "13px" : "14px",
              color: "#555"
            }}>
              Couleur des chaises :
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="color"
                value={colors.chair}
                onChange={(e) => setColors({ ...colors, chair: e.target.value })}
                style={{
                  width: isMobile ? "50px" : "60px",
                  height: isMobile ? "40px" : "45px",
                  border: "2px solid #ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              />
              <span style={{ fontSize: isMobile ? "12px" : "13px", color: "#666" }}>
                {colors.chair}
              </span>
            </div>
          </div>

          <button
            onClick={async () => {
              const currentPositions = getCurrentTablePositions();
              await saveRoomLayout(currentPositions, colors);
              setTablesData(currentPositions);
              setMessage("Couleurs sauvegardées avec succès !");
              setTimeout(() => setMessage(""), 3000);
            }}
            style={{
              width: "100%",
              padding: isMobile ? "10px" : "12px",
              fontSize: isMobile ? "13px" : "14px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💾 Sauvegarder les couleurs
          </button>
        </div>
      )}

      {/* Panneau d'instructions du mode édition */}
      {isEditing && showEditInstructions && (
        <div style={{
          position: "absolute",
          top: isMobile ? "100px" : "120px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: isMobile ? "15px 18px" : isTablet ? "18px 22px" : "20px 25px",
          backgroundColor: "rgba(0,0,0,0.9)",
          color: "white",
          borderRadius: "12px",
          zIndex: 1000,
          fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
          maxWidth: isMobile ? "calc(100% - 40px)" : isTablet ? "320px" : "360px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          lineHeight: "1.8",
        }}>
          <p style={{ 
            margin: "0 0 12px 0", 
            fontWeight: "bold",
            fontSize: isMobile ? "15px" : isTablet ? "16px" : "18px",
            color: "#4CAF50",
            textAlign: "center"
          }}>
            📝 Mode édition - Instructions
          </p>
          {isMobile ? (
            <>
              <p style={{ margin: "8px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span>👆</span>
                <span><strong>Touchez et maintenez</strong> une table pour la déplacer</span>
              </p>
              <p style={{ margin: "8px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span>👆👆</span>
                <span><strong>Double-tapez</strong> sur une table pour la modifier</span>
              </p>
              <p style={{ margin: "8px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span>➕</span>
                <span>Utilisez les <strong>boutons en haut</strong> pour ajouter ou supprimer des tables</span>
              </p>
            </>
          ) : (
            <>
              <p style={{ margin: "8px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span>🖱️</span>
                <span><strong>Cliquez et glissez</strong> une table pour la déplacer</span>
              </p>
              <p style={{ margin: "8px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span>🖱️🖱️</span>
                <span><strong>Double-cliquez</strong> sur une table pour la modifier</span>
              </p>
              <p style={{ margin: "8px 0", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <span>➕</span>
                <span>Utilisez les <strong>boutons en haut</strong> pour ajouter ou supprimer des tables</span>
              </p>
            </>
          )}
        </div>
      )}
      
      {/* Formulaire pour ajouter/modifier une table */}
      {showTableForm && (
        <div style={{
          position: "absolute",
          top: isMobile ? "50%" : "50%",
          left: isMobile ? "50%" : "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: isMobile ? "20px" : "30px",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          zIndex: 2000,
          minWidth: isMobile ? "280px" : "300px",
          maxWidth: isMobile ? "90vw" : "400px",
          maxHeight: isMobile ? "90vh" : "auto",
          overflowY: isMobile ? "auto" : "visible",
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: isMobile ? "15px" : "20px",
            fontSize: isMobile ? "18px" : "20px",
          }}>
            {editingTable ? "Modifier la table" : "Nouvelle table"}
          </h3>
          <div style={{ marginBottom: isMobile ? "12px" : "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
            }}>
              Nom de la table :
            </label>
            <input
              type="text"
              value={tableFormData.nom}
              onChange={(e) => setTableFormData({ ...tableFormData, nom: e.target.value })}
              style={{
                width: "100%",
                padding: isMobile ? "10px" : "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: isMobile ? "14px" : "16px",
              }}
              placeholder="Nom de la table"
            />
          </div>
          <div style={{ marginBottom: isMobile ? "15px" : "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
            }}>
              Nombre de chaises :
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={tableFormData.nbChaises}
              onChange={(e) => setTableFormData({ ...tableFormData, nbChaises: parseInt(e.target.value) || 10 })}
              style={{
                width: "100%",
                padding: isMobile ? "10px" : "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: isMobile ? "14px" : "16px",
              }}
            />
          </div>
          {editingTable && (
            <button
              onClick={async () => {
                await handleDeleteTable(editingTable);
                setShowTableForm(false);
                setEditingTable(null);
              }}
              style={{
                width: "100%",
                padding: isMobile ? "12px" : "10px",
                fontSize: isMobile ? "14px" : "16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              Supprimer la table
            </button>
          )}
          <div style={{ display: "flex", gap: isMobile ? "8px" : "10px", flexDirection: isMobile ? "column" : "row" }}>
            <button
              onClick={handleSubmitTableForm}
              style={{
                flex: 1,
                padding: isMobile ? "12px" : "10px",
                fontSize: isMobile ? "14px" : "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {editingTable ? "Modifier" : "Créer"}
            </button>
            <button
              onClick={() => {
                setShowTableForm(false);
                setEditingTable(null);
                setTableFormData({ nom: "", nbChaises: 10 });
              }}
              style={{
                flex: 1,
                padding: isMobile ? "12px" : "10px",
                fontSize: isMobile ? "14px" : "16px",
                backgroundColor: "#ccc",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
