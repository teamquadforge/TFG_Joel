import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1e1e24)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 2, 6)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1.2, 0)

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
dirLight.position.set(4, 6, 3)
scene.add(dirLight)

// Escenari
const floorGeometry = new THREE.PlaneGeometry(12, 12)
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x4a4a4a,
  side: THREE.DoubleSide,
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

scene.add(new THREE.AxesHelper(2))
scene.add(new THREE.GridHelper(12, 12))

// Vídeo
const video = document.createElement('video')
video.loop = true
video.muted = true
video.playsInline = true
video.autoplay = true
video.crossOrigin = 'anonymous'

function loadVideoSource(src) {
  video.src = src
  video.load()
  video.play().then(() => {
    console.log('Vídeo reproduciéndose')
  }).catch((err) => {
    console.log('No se pudo reproducir automáticamente:', err)
  })
}

loadVideoSource('/demo.mp4')

const videoTexture = new THREE.VideoTexture(video)
videoTexture.colorSpace = THREE.SRGBColorSpace

// Superficie 
const defaultCorners = {
  tl: new THREE.Vector3(-2, 2.5, -2.45),
  tr: new THREE.Vector3( 2, 2.5, -2.45),
  bl: new THREE.Vector3(-2, 0.0, -2.45),
  br: new THREE.Vector3( 2, 0.0, -2.45),
}

const corners = {
  tl: defaultCorners.tl.clone(),
  tr: defaultCorners.tr.clone(),
  bl: defaultCorners.bl.clone(),
  br: defaultCorners.br.clone(),
}

const wallGeometry = new THREE.BufferGeometry()

function updateWallGeometry() {
  const positions = new Float32Array([
    corners.bl.x, corners.bl.y, corners.bl.z,
    corners.tl.x, corners.tl.y, corners.tl.z,
    corners.tr.x, corners.tr.y, corners.tr.z,

    corners.bl.x, corners.bl.y, corners.bl.z,
    corners.tr.x, corners.tr.y, corners.tr.z,
    corners.br.x, corners.br.y, corners.br.z,
  ])

  const uvs = new Float32Array([
    0, 0,
    0, 1,
    1, 1,

    0, 0,
    1, 1,
    1, 0,
  ])

  wallGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  wallGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  wallGeometry.computeVertexNormals()
}

updateWallGeometry()

const wallMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
  side: THREE.DoubleSide,
})

const wall = new THREE.Mesh(wallGeometry, wallMaterial)
scene.add(wall)

// Marc visual
const frameGeometry = new THREE.BoxGeometry(4.3, 2.8, 0.08)
const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 })
const frame = new THREE.Mesh(frameGeometry, frameMaterial)
frame.position.set(0, 1.25, -2.6)
scene.add(frame)

// Puntos de control
const handleGeometry = new THREE.SphereGeometry(0.08, 16, 16)

const handleMaterials = {
  normal: new THREE.MeshStandardMaterial({ color: 0xffaa00 }),
  selected: new THREE.MeshStandardMaterial({ color: 0x00ffcc }),
}

const handles = {
  tl: new THREE.Mesh(handleGeometry, handleMaterials.selected),
  tr: new THREE.Mesh(handleGeometry, handleMaterials.normal),
  bl: new THREE.Mesh(handleGeometry, handleMaterials.normal),
  br: new THREE.Mesh(handleGeometry, handleMaterials.normal),
}

scene.add(handles.tl, handles.tr, handles.bl, handles.br)

function updateHandles() {
  handles.tl.position.copy(corners.tl)
  handles.tr.position.copy(corners.tr)
  handles.bl.position.copy(corners.bl)
  handles.br.position.copy(corners.br)
}

updateHandles()

let selectedCorner = 'tl'

function refreshHandleSelection() {
  Object.keys(handles).forEach((key) => {
    handles[key].material = key === selectedCorner
      ? handleMaterials.selected
      : handleMaterials.normal
  })
}

refreshHandleSelection()

function refreshWall() {
  updateWallGeometry()
  updateHandles()
}

function resetCorners() {
  corners.tl.copy(defaultCorners.tl)
  corners.tr.copy(defaultCorners.tr)
  corners.bl.copy(defaultCorners.bl)
  corners.br.copy(defaultCorners.br)
  refreshWall()
}

const moveStep = 0.05

window.addEventListener('keydown', (event) => {
  const key = event.key

  if (key === '1') selectedCorner = 'tl'
  if (key === '2') selectedCorner = 'tr'
  if (key === '3') selectedCorner = 'bl'
  if (key === '4') selectedCorner = 'br'

  refreshHandleSelection()

  const c = corners[selectedCorner]

  switch (key) {
    case 'ArrowLeft':
      c.x -= moveStep
      break
    case 'ArrowRight':
      c.x += moveStep
      break
    case 'ArrowUp':
      c.y += moveStep
      break
    case 'ArrowDown':
      c.y -= moveStep
      break
    case 'q':
    case 'Q':
      c.z += moveStep
      break
    case 'e':
    case 'E':
      c.z -= moveStep
      break
    default:
      return
  }

  refreshWall()
})

// Guardar / Cargar mapping
function getMappingData() {
  return {
    corners: {
      tl: { x: corners.tl.x, y: corners.tl.y, z: corners.tl.z },
      tr: { x: corners.tr.x, y: corners.tr.y, z: corners.tr.z },
      bl: { x: corners.bl.x, y: corners.bl.y, z: corners.bl.z },
      br: { x: corners.br.x, y: corners.br.y, z: corners.br.z },
    }
  }
}

function applyMappingData(data) {
  if (!data?.corners) return

  const c = data.corners

  if (c.tl) corners.tl.set(c.tl.x, c.tl.y, c.tl.z)
  if (c.tr) corners.tr.set(c.tr.x, c.tr.y, c.tr.z)
  if (c.bl) corners.bl.set(c.bl.x, c.bl.y, c.bl.z)
  if (c.br) corners.br.set(c.br.x, c.br.y, c.br.z)

  refreshWall()
}

function downloadMappingJSON() {
  const data = getMappingData()
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'mapping-config.json'
  a.click()

  URL.revokeObjectURL(url)
}

// UI
const panel = document.createElement('div')
panel.style.position = 'absolute'
panel.style.top = '16px'
panel.style.left = '16px'
panel.style.padding = '12px 14px'
panel.style.background = 'rgba(0,0,0,0.65)'
panel.style.color = 'white'
panel.style.fontFamily = 'Arial, sans-serif'
panel.style.fontSize = '14px'
panel.style.lineHeight = '1.5'
panel.style.borderRadius = '8px'
panel.style.zIndex = '10'
panel.style.maxWidth = '340px'

panel.innerHTML = `
  <strong>TFG Videomapping Preview</strong><br>
  1-4: seleccionar esquina<br>
  fletxes: mover esquina<br>
  Q / E: moure profunditat<br><br>
`

const videoLabel = document.createElement('div')
videoLabel.textContent = 'Cargar vídeo:'
videoLabel.style.marginTop = '6px'
panel.appendChild(videoLabel)

const videoInput = document.createElement('input')
videoInput.type = 'file'
videoInput.accept = 'video/*'
videoInput.style.marginTop = '6px'
videoInput.style.display = 'block'

videoInput.addEventListener('change', (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const fileURL = URL.createObjectURL(file)
  loadVideoSource(fileURL)
})

panel.appendChild(videoInput)

const buttonRow = document.createElement('div')
buttonRow.style.display = 'flex'
buttonRow.style.gap = '8px'
buttonRow.style.flexWrap = 'wrap'
buttonRow.style.marginTop = '12px'

function createButton(text) {
  const btn = document.createElement('button')
  btn.textContent = text
  btn.style.padding = '8px 10px'
  btn.style.border = 'none'
  btn.style.borderRadius = '6px'
  btn.style.cursor = 'pointer'
  btn.style.background = '#2e8bff'
  btn.style.color = 'white'
  btn.style.fontSize = '13px'
  return btn
}

const resetButton = createButton('Reset')
resetButton.addEventListener('click', () => {
  resetCorners()
})

const saveButton = createButton('Guardar mapping')
saveButton.addEventListener('click', () => {
  downloadMappingJSON()
})

const loadButton = createButton('Carregar mapping')

const mappingInput = document.createElement('input')
mappingInput.type = 'file'
mappingInput.accept = 'application/json'
mappingInput.style.display = 'none'

loadButton.addEventListener('click', () => {
  mappingInput.value = ''
  mappingInput.click()
})

mappingInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)
    applyMappingData(data)
  } catch (error) {
    console.error('Error al carregar el mapping:', error)
    alert('No s’ha pogut carregar el fitxer JSON del mapping.')
  } finally {
    event.target.value = ''
  }
})

buttonRow.appendChild(resetButton)
buttonRow.appendChild(saveButton)
buttonRow.appendChild(loadButton)

panel.appendChild(buttonRow)
panel.appendChild(mappingInput)
document.body.appendChild(panel)

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Animación
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

animate()