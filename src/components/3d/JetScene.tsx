import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Camera, Compass, Eye, Maximize2, RotateCcw, Sparkles, Sun, Moon } from 'lucide-react';

interface JetSceneProps {
  scrollProgress: number; // 0 to 1
  activeSection: string; // 'hero' | 'experience' | 'fleet' | 'booking' | 'calendar' | 'concierge'
  selectedAircraftLivery?: string;
  accentColor?: string;
}

export const JetScene: React.FC<JetSceneProps> = ({
  scrollProgress,
  activeSection,
  selectedAircraftLivery = '#161922',
  accentColor = '#d4af37'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive control states
  const [cameraMode, setCameraMode] = useState<'cinematic' | 'orbit' | 'cockpit' | 'wing'>('cinematic');
  const [lightingTheme, setLightingTheme] = useState<'midnight' | 'sunset'>('midnight');
  const [isDragging, setIsDragging] = useState(false);
  const [controlsHint, setControlsHint] = useState(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const jetGroupRef = useRef<THREE.Group | null>(null);
  const turbineLeftRef = useRef<THREE.Mesh | null>(null);
  const turbineRightRef = useRef<THREE.Mesh | null>(null);
  const cloudsGroupRef = useRef<THREE.Group | null>(null);
  const runwayGroupRef = useRef<THREE.Group | null>(null);
  const strobeLightRef = useRef<THREE.PointLight | null>(null);
  const exhaustGlowLeft = useRef<THREE.PointLight | null>(null);
  const exhaustGlowRight = useRef<THREE.PointLight | null>(null);
  
  // Materials that need livery updates
  const fuselageMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const accentMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Manual rotation angles when in 'orbit' mode
  const orbitRotation = useRef({ x: 0.1, y: 0.8 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const isPointerDown = useRef(false);

  // Build the 3D Procedural Luxury Business Jet
  const buildLuxuryJet = useCallback((): THREE.Group => {
    const jet = new THREE.Group();

    // Materials
    const fuselageMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedAircraftLivery),
      roughness: 0.25,
      metalness: 0.85,
    });
    fuselageMaterialRef.current = fuselageMat;

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      roughness: 0.2,
      metalness: 0.95,
      emissive: new THREE.Color(accentColor),
      emissiveIntensity: 0.2,
    });
    accentMaterialRef.current = goldAccentMat;

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111c2a,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.5,
      metalness: 0.9,
    });

    const windowGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffdf88,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15,
    });

    // 1. Fuselage Main Body (Tapered aerodynamic hull)
    // Front Nose cone
    const noseGeo = new THREE.ConeGeometry(0.8, 2.4, 32);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, fuselageMat);
    nose.position.z = 4.7;
    jet.add(nose);

    // Main Cabin Cylinder
    const cabinGeo = new THREE.CylinderGeometry(0.8, 0.78, 7.0, 32);
    cabinGeo.rotateX(Math.PI / 2);
    const cabin = new THREE.Mesh(cabinGeo, fuselageMat);
    cabin.position.z = 0;
    jet.add(cabin);

    // Rear Fuselage Taper
    const rearGeo = new THREE.ConeGeometry(0.78, 3.8, 32);
    rearGeo.rotateX(-Math.PI / 2);
    const rear = new THREE.Mesh(rearGeo, fuselageMat);
    rear.position.z = -5.4;
    jet.add(rear);

    // Luxury Golden Livery Racing Stripe along fuselage side
    const stripeGeo = new THREE.BoxGeometry(1.64, 0.06, 8.5);
    const stripe = new THREE.Mesh(stripeGeo, goldAccentMat);
    stripe.position.set(0, 0.05, 0.5);
    jet.add(stripe);

    // 2. Cockpit Windshield (Sleek tinted VIP canopy)
    const cockpitGeo = new THREE.SphereGeometry(0.78, 16, 16, 0, Math.PI, 0, Math.PI * 0.45);
    cockpitGeo.rotateX(-Math.PI / 2.2);
    const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
    cockpit.position.set(0, 0.35, 3.8);
    cockpit.scale.set(0.9, 0.8, 1.4);
    jet.add(cockpit);

    // 3. Cabin Windows (Executive Oval Windows on both sides)
    const windowGroup = new THREE.Group();
    const winGeo = new THREE.CapsuleGeometry(0.12, 0.18, 4, 8);
    winGeo.rotateZ(Math.PI / 2);

    for (let i = -2.8; i <= 2.4; i += 0.65) {
      // Left side window
      const winL = new THREE.Mesh(winGeo, windowGlowMat);
      winL.position.set(0.8, 0.22, i);
      winL.rotation.y = Math.PI / 2;
      windowGroup.add(winL);

      // Right side window
      const winR = new THREE.Mesh(winGeo, windowGlowMat);
      winR.position.set(-0.8, 0.22, i);
      winR.rotation.y = -Math.PI / 2;
      windowGroup.add(winR);
    }
    jet.add(windowGroup);

    // 4. Swept Wings (Advanced Transonic Wing profile with Winglets)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, -1.2);
    wingShape.lineTo(6.8, -3.2); // Wing tip swept back
    wingShape.lineTo(6.6, -3.8);
    wingShape.lineTo(0, -2.4);
    wingShape.closePath();

    const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    wingGeo.rotateX(Math.PI / 2);

    // Right Wing
    const wingR = new THREE.Mesh(wingGeo, fuselageMat);
    wingR.position.set(0, -0.2, 1.2);
    wingR.rotation.z = -0.05; // Slight dihedral
    jet.add(wingR);

    // Left Wing (Mirror)
    const wingL = new THREE.Mesh(wingGeo, fuselageMat);
    wingL.position.set(0, -0.2, 1.2);
    wingL.scale.x = -1;
    wingL.rotation.z = 0.05;
    jet.add(wingL);

    // Wing Leading Edge Chrome De-ice Trim
    const wingLeadingR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 7.3, 8), chromeMat);
    wingLeadingR.position.set(3.4, -0.3, -1.0);
    wingLeadingR.rotation.z = 1.28;
    wingLeadingR.rotation.y = 0.30;
    jet.add(wingLeadingR);

    const wingLeadingL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 7.3, 8), chromeMat);
    wingLeadingL.position.set(-3.4, -0.3, -1.0);
    wingLeadingL.rotation.z = -1.28;
    wingLeadingL.rotation.y = -0.30;
    jet.add(wingLeadingL);

    // Winglets (Angled vertical tips in champagne gold)
    const wingletGeo = new THREE.BoxGeometry(0.12, 1.2, 0.6);
    const wingletR = new THREE.Mesh(wingletGeo, goldAccentMat);
    wingletR.position.set(6.7, 0.35, -2.2);
    wingletR.rotation.z = -0.25;
    wingletR.rotation.y = -0.3;
    jet.add(wingletR);

    const wingletL = new THREE.Mesh(wingletGeo, goldAccentMat);
    wingletL.position.set(-6.7, 0.35, -2.2);
    wingletL.scale.x = -1;
    wingletL.rotation.z = 0.25;
    wingletL.rotation.y = 0.3;
    jet.add(wingletL);

    // Navigation Lights: Green (Right) and Red (Left), White Strobes
    const navGreenGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const navGreenMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const navGreen = new THREE.Mesh(navGreenGeo, navGreenMat);
    navGreen.position.set(6.8, 0.9, -2.2);
    jet.add(navGreen);

    const navRedGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const navRedMat = new THREE.MeshBasicMaterial({ color: 0xff2244 });
    const navRed = new THREE.Mesh(navRedGeo, navRedMat);
    navRed.position.set(-6.8, 0.9, -2.2);
    jet.add(navRed);

    // 5. Twin Turbofan Engines (Mounted on aft fuselage)
    const buildEngine = (isLeft: boolean) => {
      const engGroup = new THREE.Group();
      const xOffset = isLeft ? -1.45 : 1.45;

      // Pylon mount connecting to fuselage
      const pylonGeo = new THREE.BoxGeometry(0.6, 0.15, 1.2);
      const pylon = new THREE.Mesh(pylonGeo, fuselageMat);
      pylon.position.set(isLeft ? -1.0 : 1.0, 0.35, -2.8);
      jet.add(pylon);

      // Engine Nacelle Cowling
      const nacelleGeo = new THREE.CylinderGeometry(0.48, 0.44, 2.6, 24);
      nacelleGeo.rotateX(Math.PI / 2);
      const nacelle = new THREE.Mesh(nacelleGeo, fuselageMat);
      engGroup.add(nacelle);

      // Chrome Intake Lip Ring
      const lipGeo = new THREE.TorusGeometry(0.46, 0.05, 12, 24);
      const lip = new THREE.Mesh(lipGeo, goldAccentMat);
      lip.position.z = 1.3;
      engGroup.add(lip);

      // Rotating Turbine Fan Blades
      const fanGeo = new THREE.ConeGeometry(0.42, 0.4, 16);
      fanGeo.rotateX(-Math.PI / 2);
      const fanMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.3 });
      const fan = new THREE.Mesh(fanGeo, fanMat);
      fan.position.z = 1.0;
      engGroup.add(fan);

      // Exhaust Nozzle Cone
      const exhaustGeo = new THREE.ConeGeometry(0.38, 0.8, 20);
      exhaustGeo.rotateX(Math.PI / 2);
      const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x282c37, metalness: 0.95, roughness: 0.2 });
      const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
      exhaust.position.z = -1.5;
      engGroup.add(exhaust);

      engGroup.position.set(xOffset, 0.35, -2.8);
      return { group: engGroup, fan };
    };

    const leftEngine = buildEngine(true);
    jet.add(leftEngine.group);
    turbineLeftRef.current = leftEngine.fan;

    const rightEngine = buildEngine(false);
    jet.add(rightEngine.group);
    turbineRightRef.current = rightEngine.fan;

    // Glowing exhaust lights for night cruise effect
    const exLightL = new THREE.PointLight(0x44aaff, 1.5, 4);
    exLightL.position.set(-1.45, 0.35, -4.5);
    jet.add(exLightL);
    exhaustGlowLeft.current = exLightL;

    const exLightR = new THREE.PointLight(0x44aaff, 1.5, 4);
    exLightR.position.set(1.45, 0.35, -4.5);
    jet.add(exLightR);
    exhaustGlowRight.current = exLightR;

    // 6. Empennage (T-Tail Vertical Fin & Horizontal Stabilizer)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.3, 2.6);
    finShape.lineTo(-1.3, 2.6);
    finShape.lineTo(-1.6, 0);
    finShape.closePath();

    const finExtrude = new THREE.ExtrudeGeometry(finShape, { depth: 0.12, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.02, bevelThickness: 0.02 });
    finExtrude.rotateY(Math.PI / 2);
    const vertFin = new THREE.Mesh(finExtrude, fuselageMat);
    vertFin.position.set(-0.06, 0.5, -4.8);
    jet.add(vertFin);

    // Gold Fin Accent Line
    const finGold = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.4, 0.08), goldAccentMat);
    finGold.position.set(0, 1.7, -4.3);
    finGold.rotation.x = -0.15;
    jet.add(finGold);

    // Horizontal T-Tail Wing
    const hTailShape = new THREE.Shape();
    hTailShape.moveTo(0, 0);
    hTailShape.lineTo(2.4, -0.9);
    hTailShape.lineTo(2.2, -1.3);
    hTailShape.lineTo(0, -0.6);
    hTailShape.closePath();

    const hTailGeo = new THREE.ExtrudeGeometry(hTailShape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
    hTailGeo.rotateX(Math.PI / 2);

    const hTailR = new THREE.Mesh(hTailGeo, fuselageMat);
    hTailR.position.set(0, 3.1, -4.6);
    jet.add(hTailR);

    const hTailL = new THREE.Mesh(hTailGeo, fuselageMat);
    hTailL.position.set(0, 3.1, -4.6);
    hTailL.scale.x = -1;
    jet.add(hTailL);

    // Tail White Strobe Beacon
    const tailBeacon = new THREE.PointLight(0xffffff, 2, 8);
    tailBeacon.position.set(0, 3.2, -5.5);
    jet.add(tailBeacon);
    strobeLightRef.current = tailBeacon;

    return jet;
  }, [selectedAircraftLivery, accentColor]);

  // Build Runway environment (visible at low scroll progress)
  const buildRunway = useCallback((): THREE.Group => {
    const group = new THREE.Group();

    // Dark asphalt tarmac
    const tarmacGeo = new THREE.PlaneGeometry(16, 120);
    const tarmacMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.9,
      metalness: 0.1,
    });
    const tarmac = new THREE.Mesh(tarmacGeo, tarmacMat);
    tarmac.rotation.x = -Math.PI / 2;
    tarmac.position.set(0, -2.4, -20);
    group.add(tarmac);

    // Centerline markings
    for (let z = -70; z < 30; z += 6) {
      const lineGeo = new THREE.PlaneGeometry(0.3, 3.2);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, -2.38, z);
      group.add(line);
    }

    // Runway Edge Lights (Luminous Amber / Warm White)
    const edgeLightGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8);
    const edgeLightMat = new THREE.MeshBasicMaterial({ color: 0xffe070 });

    for (let z = -65; z < 35; z += 5) {
      // Left side edge light
      const lightL = new THREE.Mesh(edgeLightGeo, edgeLightMat);
      lightL.position.set(-7.5, -2.28, z);
      group.add(lightL);

      // Right side edge light
      const lightR = new THREE.Mesh(edgeLightGeo, edgeLightMat);
      lightR.position.set(7.5, -2.28, z);
      group.add(lightR);
    }

    return group;
  }, []);

  // Build high altitude atmosphere clouds and sky particles
  const buildAtmosphere = useCallback((): THREE.Group => {
    const group = new THREE.Group();

    // High altitude ethereal cloud discs
    const cloudGeo = new THREE.DodecahedronGeometry(2.5, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x1a273a,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.35,
    });

    for (let i = 0; i < 28; i++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      const x = (Math.random() - 0.5) * 60;
      const y = -6 - Math.random() * 8;
      const z = -40 + Math.random() * 80;
      cloud.position.set(x, y, z);
      cloud.scale.set(1 + Math.random() * 3, 0.4 + Math.random() * 0.4, 2 + Math.random() * 3);
      group.add(cloud);
    }

    // Starfield points
    const starGeo = new THREE.BufferGeometry();
    const starCount = 450;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 120;
      starPos[i + 1] = Math.random() * 60 + 5;
      starPos[i + 2] = (Math.random() - 0.5) * 120;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.75,
    });
    const starField = new THREE.Points(starGeo, starMat);
    group.add(starField);

    return group;
  }, []);

  // Setup Three.js scene, renderer, camera
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x070b12, 0.016);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 1.2, 14);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x233148, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    keyLight.position.set(12, 18, 14);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.8);
    rimLight.position.set(-15, 8, -10);
    scene.add(rimLight);

    const underGlow = new THREE.DirectionalLight(0x1a2e4a, 0.8);
    underGlow.position.set(0, -10, 5);
    scene.add(underGlow);

    // 5. Add Jet, Runway, Atmosphere
    const jet = buildLuxuryJet();
    jetGroupRef.current = jet;
    scene.add(jet);

    const runway = buildRunway();
    runwayGroupRef.current = runway;
    scene.add(runway);

    const clouds = buildAtmosphere();
    cloudsGroupRef.current = clouds;
    scene.add(clouds);

    // 6. Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Spin turbine blades
      if (turbineLeftRef.current) turbineLeftRef.current.rotation.z += 0.35;
      if (turbineRightRef.current) turbineRightRef.current.rotation.z += 0.35;

      // Strobe Light Pulse (Aircraft anti-collision strobe)
      if (strobeLightRef.current) {
        const strobe = Math.sin(elapsedTime * 6);
        strobeLightRef.current.intensity = strobe > 0.85 ? 4.5 : 0.2;
      }

      // Exhaust glow flicker
      if (exhaustGlowLeft.current && exhaustGlowRight.current) {
        const flicker = 1.4 + Math.sin(elapsedTime * 14) * 0.2;
        exhaustGlowLeft.current.intensity = flicker;
        exhaustGlowRight.current.intensity = flicker;
      }

      // Drift atmosphere particles past aircraft
      if (cloudsGroupRef.current) {
        cloudsGroupRef.current.position.z += 0.08;
        if (cloudsGroupRef.current.position.z > 25) {
          cloudsGroupRef.current.position.z = -15;
        }
      }

      // Smooth flight floating oscillation (aerodynamic lift effect)
      if (jetGroupRef.current && cameraMode === 'cinematic') {
        const pitchOsc = Math.sin(elapsedTime * 1.2) * 0.015;
        const rollOsc = Math.cos(elapsedTime * 0.9) * 0.02;
        const altitudeOsc = Math.sin(elapsedTime * 1.5) * 0.08;
        jetGroupRef.current.position.y += (altitudeOsc - jetGroupRef.current.position.y * 0.05) * 0.05;
        jetGroupRef.current.rotation.x += (pitchOsc - jetGroupRef.current.rotation.x * 0.02) * 0.05;
        jetGroupRef.current.rotation.z += (rollOsc - jetGroupRef.current.rotation.z * 0.02) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [buildLuxuryJet, buildRunway, buildAtmosphere, cameraMode]);

  // Update livery color when prop changes
  useEffect(() => {
    if (fuselageMaterialRef.current) {
      fuselageMaterialRef.current.color.set(selectedAircraftLivery);
    }
    if (accentMaterialRef.current) {
      accentMaterialRef.current.color.set(accentColor);
      accentMaterialRef.current.emissive.set(accentColor);
    }
  }, [selectedAircraftLivery, accentColor]);

  // Adjust Camera and Jet Stance based on Scroll Progress & Modes
  useEffect(() => {
    if (!cameraRef.current || !jetGroupRef.current || !runwayGroupRef.current) return;

    const camera = cameraRef.current;
    const jet = jetGroupRef.current;
    const runway = runwayGroupRef.current;

    if (cameraMode === 'cinematic') {
      // 0.0 -> 0.18: Runway Hero Stance
      if (scrollProgress < 0.18) {
        const p = scrollProgress / 0.18;
        runway.visible = true;
        runway.position.y = -2.4 - p * 8; // Runway drops away as jet ascends

        // Jet taxiing and taking off
        jet.position.set(0, -0.8 + p * 1.8, p * -1.5);
        jet.rotation.set(-0.06 - p * 0.18, 0.45 - p * 0.25, -0.04 - p * 0.08);

        // Camera sweeps from low side to three-quarter tracking
        camera.position.set(5.5 - p * 3.5, 0.8 + p * 0.8, 12 - p * 2);
        camera.lookAt(0, 0.2, 0);
      }
      // 0.18 -> 0.45: High Altitude Flight Experience & Performance Cruise
      else if (scrollProgress < 0.45) {
        const p = (scrollProgress - 0.18) / (0.45 - 0.18);
        runway.visible = false;

        // Elegant banking turn across Nigerian airspace
        jet.position.set(-1.2 + p * 2.4, 0.6 + Math.sin(p * Math.PI) * 0.5, -0.5);
        jet.rotation.set(-0.08, 0.1 + p * 0.4, 0.15 - p * 0.35); // Bank roll

        camera.position.set(-6 + p * 11, 2.5, 10 - p * 1.5);
        camera.lookAt(0, 0, 0);
      }
      // 0.45 -> 0.72: Fleet Showcase - Central Pedestal for 360 Inspection
      else if (scrollProgress < 0.72) {
        const p = (scrollProgress - 0.45) / (0.72 - 0.45);
        runway.visible = false;

        // Centered for inspection
        jet.position.set(0, 0.1, 0);
        jet.rotation.set(0.08, 0.5 + p * Math.PI * 1.8, 0); // Majestic rotation showcase

        camera.position.set(0, 1.8, 11.5);
        camera.lookAt(0, 0.2, 0);
      }
      // 0.72 -> 0.88: Flight Booking & Routes Navigation
      else if (scrollProgress < 0.88) {
        const p = (scrollProgress - 0.72) / (0.88 - 0.72);
        runway.visible = false;

        // Jet angled toward route trajectory
        jet.position.set(2.8 - p * 3.5, -0.2, -1.0);
        jet.rotation.set(-0.15, -0.5 + p * 0.3, 0.1);

        camera.position.set(-4, 3.2, 9.5);
        camera.lookAt(0.5, 0, 0);
      }
      // 0.88 -> 1.0: VIP Concierge Arrival & Luxury Close-Up
      else {
        const p = (scrollProgress - 0.88) / (1.0 - 0.88);
        runway.visible = false;

        // Close-up on sleek fuselage, windows, and luxury emblem
        jet.position.set(-1.8 + p * 1.2, -0.4, 1.8);
        jet.rotation.set(-0.05, 0.8 - p * 0.2, -0.05);

        camera.position.set(3.2, 0.6, 7.2);
        camera.lookAt(-0.5, 0.1, 0);
      }
    } else if (cameraMode === 'cockpit') {
      jet.position.set(0, 0, 0);
      jet.rotation.set(0, 0, 0);
      camera.position.set(0, 0.4, 4.2);
      camera.lookAt(0, 0.4, 20);
    } else if (cameraMode === 'wing') {
      jet.position.set(0, 0, 0);
      jet.rotation.set(0, 0.15, 0.05);
      camera.position.set(5.2, 0.8, -1.5);
      camera.lookAt(0, 0.2, 1.5);
    } else if (cameraMode === 'orbit') {
      // Manual interactive orbit angles
      jet.position.set(0, 0, 0);
      jet.rotation.x = orbitRotation.current.x;
      jet.rotation.y = orbitRotation.current.y;
      camera.position.set(0, 1.5, 11);
      camera.lookAt(0, 0, 0);
    }
  }, [scrollProgress, cameraMode]);

  // Pointer drag events for 'orbit' inspection mode
  const handlePointerDown = (e: React.PointerEvent) => {
    if (cameraMode !== 'orbit') return;
    isPointerDown.current = true;
    setIsDragging(true);
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current || cameraMode !== 'orbit') return;
    const deltaX = e.clientX - pointerStart.current.x;
    const deltaY = e.clientY - pointerStart.current.y;

    orbitRotation.current.y += deltaX * 0.008;
    orbitRotation.current.x += deltaY * 0.008;

    // Clamp vertical pitch to prevent flipping
    orbitRotation.current.x = Math.max(-1.0, Math.min(1.0, orbitRotation.current.x));

    pointerStart.current = { x: e.clientX, y: e.clientY };

    if (jetGroupRef.current) {
      jetGroupRef.current.rotation.x = orbitRotation.current.x;
      jetGroupRef.current.rotation.y = orbitRotation.current.y;
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${cameraMode === 'orbit' ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* 3D Viewport Controls HUD Pill (Right-aligned, minimalist & luxury) */}
      <aside aria-label="3D Viewport Controls" className="pointer-events-auto absolute top-24 right-4 sm:right-8 z-30 flex flex-col gap-2 bg-[#0d131f]/85 backdrop-blur-md border border-amber-500/20 rounded-2xl p-2 shadow-2xl text-xs">
        <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-widest text-amber-400/80 border-b border-white/5 flex items-center justify-between gap-3">
          <span>3D AIRCRAFT HUD</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-1 pt-1">
          <button
            id="camera-mode-cinematic"
            onClick={() => setCameraMode('cinematic')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-left ${
              cameraMode === 'cinematic'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Auto-synchronize camera to page scroll"
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>Flight Cam</span>
          </button>

          <button
            id="camera-mode-orbit"
            onClick={() => {
              setCameraMode('orbit');
              setControlsHint(true);
              setTimeout(() => setControlsHint(false), 3500);
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-left ${
              cameraMode === 'orbit'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="360 Free Orbit Inspection"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>360° Orbit</span>
          </button>

          <button
            id="camera-mode-cockpit"
            onClick={() => setCameraMode('cockpit')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-left ${
              cameraMode === 'cockpit'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Cockpit Horizon POV"
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span>Cockpit</span>
          </button>

          <button
            id="camera-mode-wing"
            onClick={() => setCameraMode('wing')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-left ${
              cameraMode === 'wing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Wing & Turbofan Close-up"
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Wing Cam</span>
          </button>
        </div>

        {/* Orbit instruction banner when user activates 360 mode */}
        {controlsHint && (
          <div className="mt-1 px-2 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-200 text-center animate-fade-in">
            Click & drag screen to rotate aircraft 360°
          </div>
        )}
      </aside>

      {/* Flight Telemetry HUD bar (Bottom right) */}
      <footer aria-label="Flight Telemetry" className="pointer-events-none absolute bottom-6 right-6 hidden md:flex items-center gap-6 bg-[#070c14]/80 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 text-[11px] text-slate-400 font-mono">
        <div>
          <span className="text-slate-500 mr-1.5">ALT:</span>
          <span className="text-amber-300 font-semibold">
            {Math.round(41000 + scrollProgress * 10000).toLocaleString()} FT
          </span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div>
          <span className="text-slate-500 mr-1.5">MACH:</span>
          <span className="text-amber-300 font-semibold">
            {(0.82 + scrollProgress * 0.10).toFixed(2)}
          </span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div>
          <span className="text-slate-500 mr-1.5">AIRSPACE:</span>
          <span className="text-slate-200">LAGOS FIR (DNKK)</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div>
          <span className="text-slate-500 mr-1.5">STATUS:</span>
          <span className="text-emerald-400 font-medium">DISPATCH READY</span>
        </div>
      </footer>
    </div>
  );
};
