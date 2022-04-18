import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

import bg from './bg.jpeg'
import fragmentShader from './shader/fragment.frag?raw'
import vertexShader from './shader/vertex.vert?raw'

import './style.css'

class Sketch {
  constructor(el) {
    this.domElement = el

    this.windowSize = new THREE.Vector2(
      this.domElement.offsetWidth,
      this.domElement.offsetHeight
    )
    this.mouse = new THREE.Vector2(1.0, 1.0)
    this.hoveredObjects = {}

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.windowSize.x / this.windowSize.y,
      0.1,
      100
    )
    this.camera.position.z = 1
    this.scene.add(this.camera)

    this.clock = new THREE.Clock()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.domElement.append(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true

    this.addRaycaster()
    this.addObject()
    this.addEventListener()
    this.resize()
    this.render()
  }

  addRaycaster() {
    this.raycaster = new THREE.Raycaster()
  }

  addObject() {
    this.geometry = new THREE.PlaneBufferGeometry(1.5, 1)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTexture: { value: new THREE.TextureLoader().load(bg) },
        uScale: { value: 0 },
        uProgress: { value: 0 },
      },
      fragmentShader,
      vertexShader,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)
  }

  resize() {
    this.windowSize.set(
      this.domElement.offsetWidth,
      this.domElement.offsetHeight
    )

    this.camera.aspect = this.windowSize.x / this.windowSize.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.windowSize.x, this.windowSize.y)
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  }

  mousemove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  addEventListener() {
    window.addEventListener('resize', this.resize.bind(this))
    window.addEventListener('mousemove', this.mousemove.bind(this))
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime()

    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children)

    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object
      if (this.hoveredObjects[object.uuid]) {
        continue
      }

      gsap.to(object.material.uniforms.uScale, {
        value: 0.2,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.to(object.material.uniforms.uProgress, {
        value: 1,
        duration: 1,
        ease: 'power3.out',
      })

      this.hoveredObjects[object.uuid] = object
    }

    for (const uuid of Object.keys(this.hoveredObjects)) {
      const objIndex = intersects.findIndex(
        object => object.object.uuid === uuid
      )
      if (objIndex > -1) {
        continue
      }
      const object = this.hoveredObjects[uuid]
      delete this.hoveredObjects[uuid]

      gsap.to(object.material.uniforms.uScale, {
        value: 0,
        duration: 1,
        ease: 'power3.out',
      })
      gsap.to(object.material.uniforms.uProgress, {
        value: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }

    this.material.uniforms.uTime.value = elapsedTime

    this.controls.update()

    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch(document.getElementById('app'))
