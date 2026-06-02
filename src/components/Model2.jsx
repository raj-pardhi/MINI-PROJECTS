import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import * as THREE from "three"
import { useThree } from '@react-three/fiber'
import { useGLTF, useTexture, useAnimations } from '@react-three/drei'
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins once outside component
gsap.registerPlugin(useGSAP, ScrollTrigger)

// Constants
const OVERLAY_PATHS = Array.from({ length: 20 }, (_, i) => `/overlay/overlay-${i + 1}.png`)
const TEXTURE_PATHS = {
  dogNormal: "/dog_normals.jpg",
  branchDiffuse: "/branches_diffuse.jpeg",
  branchNormal: "branches_normals.jpeg"
}

const CAMERA_CONFIG = {
  position: { z: 0.55 },
  toneMapping: THREE.ReinhardToneMapping,
  colorSpace: THREE.SRGBColorSpace
}

const MODEL_CONFIG = {
  path: "/models/three.drc.glb",
  initialPosition: [0.25, -0.55, 0],
  initialRotation: [0, Math.PI / 3.9, 0],
  animationName: "Take 001"
}

const HOVER_MAPPING = {
  "tomorrowland": 18,
  "navy-pier": 7,
  "msi-chicago": 8,
  "phone": 11,
  "kikk": 9,
  "kennedy": 7,
  "opera": 12
}

const Model = () => {
  const modelRef = useRef()
  const materialUniforms = useRef({
    uMatcap1: { value: null },
    uMatcap2: { value: null },
    uProgress: { value: 1.0 }
  })

  // Load model and textures
  const { scene, animations } = useGLTF(MODEL_CONFIG.path)
  const { actions } = useAnimations(animations, scene)
  
  // Load all textures
  const overlayTextures = useTexture(OVERLAY_PATHS)
  const [dogNormalMap] = useTexture([TEXTURE_PATHS.dogNormal])
  const [branchDiffuse, branchNormal] = useTexture([
    TEXTURE_PATHS.branchDiffuse,
    TEXTURE_PATHS.branchNormal
  ])

  // Configure textures
  useMemo(() => {
    dogNormalMap.flipY = false
    dogNormalMap.colorSpace = THREE.SRGBColorSpace
    
    overlayTextures.forEach(tex => {
      tex.colorSpace = THREE.SRGBColorSpace
    })
    
    branchDiffuse.colorSpace = THREE.SRGBColorSpace
    branchNormal.colorSpace = THREE.SRGBColorSpace
  }, [dogNormalMap, overlayTextures, branchDiffuse, branchNormal])

  // Initialize material uniforms
  useEffect(() => {
    materialUniforms.current.uMatcap1.value = overlayTextures[18]
    materialUniforms.current.uMatcap2.value = overlayTextures[1]
  }, [overlayTextures])

  // Setup camera and renderer
  useThree(({ camera, gl }) => {
    camera.position.z = CAMERA_CONFIG.position.z
    gl.toneMapping = CAMERA_CONFIG.toneMapping
    gl.outputColorSpace = CAMERA_CONFIG.colorSpace
  })

  // Create shader modifier function
  const createShaderModifier = useCallback((shader) => {
    Object.assign(shader.uniforms, {
      uMatcapTexture1: materialUniforms.current.uMatcap1,
      uMatcapTexture2: materialUniforms.current.uMatcap2,
      uProgress: materialUniforms.current.uProgress
    })

    shader.fragmentShader = shader.fragmentShader.replace(
      "void main() {",
      `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;
        
        void main() {
      `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      "vec4 matcapColor = texture2D( matcap, uv );",
      `
        vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
        vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
        float transitionFactor = 0.2;
        
        float progress = smoothstep(
          uProgress - transitionFactor,
          uProgress,
          (vViewPosition.x + vViewPosition.y) * 0.5 + 0.5
        );
        
        vec4 matcapColor = mix(matcapColor2, matcapColor1, progress);
      `
    )
  }, [])

  // Create materials
  const materials = useMemo(() => {
    const dog = new THREE.MeshMatcapMaterial({
      normalMap: dogNormalMap,
      matcap: overlayTextures[1]
    })
    dog.onBeforeCompile = createShaderModifier

    const branch = new THREE.MeshMatcapMaterial({
      normalMap: branchNormal,
      map: branchDiffuse
    })

    return { dog, branch }
  }, [dogNormalMap, overlayTextures, branchDiffuse, branchNormal, createShaderModifier])

  // Apply materials to scene
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.name.includes("DOG") ? materials.dog : materials.branch
      }
    })
  }, [scene, materials])

  // Play animation
  useEffect(() => {
    if (actions[MODEL_CONFIG.animationName]) {
      actions[MODEL_CONFIG.animationName].play()
    }
  }, [actions])

  // Matcap transition handler
  const transitionToMatcap = useCallback((overlayIndex) => {
    materialUniforms.current.uMatcap1.value = overlayTextures[overlayIndex]
    
    gsap.to(materialUniforms.current.uProgress, {
      value: 0.0,
      duration: 0.3,
      onComplete: () => {
        materialUniforms.current.uMatcap2.value = materialUniforms.current.uMatcap1.value
        materialUniforms.current.uProgress.value = 1.0
      }
    })
  }, [overlayTextures])

  // Setup hover interactions
  useEffect(() => {
    const handlers = []
    
    // Add mouseenter listeners for each title
    Object.entries(HOVER_MAPPING).forEach(([title, overlayIndex]) => {
      const element = document.querySelector(`.title[img-title="${title}"]`)
      if (element) {
        const handler = () => transitionToMatcap(overlayIndex)
        element.addEventListener("mouseenter", handler)
        handlers.push({ element, event: "mouseenter", handler })
      }
    })

    // Add mouseleave listener for titles container
    const titlesContainer = document.querySelector('.titles')
    if (titlesContainer) {
      const resetHandler = () => transitionToMatcap(1)
      titlesContainer.addEventListener("mouseleave", resetHandler)
      handlers.push({ element: titlesContainer, event: "mouseleave", handler: resetHandler })
    }

    // Cleanup
    return () => {
      handlers.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler)
      })
    }
  }, [transitionToMatcap])

  // Scroll animation
  useGSAP(() => {
    if (!modelRef.current) return

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#center",
        endTrigger: "#section-3",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    })

    timeline
      .to(modelRef.current.position, {
        z: "-=0.75",
        y: "+=0.1"
      })
      .to(modelRef.current.rotation, {
        x: `+=${Math.PI / 15}`
      })
      .to(modelRef.current.rotation, {
        y: `-=${Math.PI}`
      }, "third")
      .to(modelRef.current.position, {
        x: "-=0.5",
        z: "+=0.6",
        y: "-=0.05"
      }, "third")
  }, [])

  return (
    <>
      <primitive 
        ref={modelRef}
        object={scene} 
        position={MODEL_CONFIG.initialPosition}
        rotation={MODEL_CONFIG.initialRotation}
      />
      <directionalLight 
        position={[0, 5, 5]} 
        color={0xFFFFFF} 
        intensity={10} 
      />
    </>
  )
}

export default Model