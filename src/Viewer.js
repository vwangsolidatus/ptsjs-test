import { PtsCanvas } from "react-pts-canvas";
import './Viewer.css'
import { Num, Rectangle, Pt } from "pts";
import { Layer, Transition } from "./entity"
import { LayerRender, TransitionRender } from "./renderEntity"


const Viewer = ({data}) => {
  const numLayers = data.Layers.length

  const layerEntities = data.Layers.map((l) => {
    return (
      new Layer(l.Id, l.Name)
    )
  })

  const transitionEntities = data.Transitions.map((t) => {
    return (
      new Transition(t.Id, t.From, t.To)
    )
  })

  const gridWidth = Math.ceil(Math.sqrt(numLayers))
  const gridHeight = Math.ceil(numLayers/gridWidth)

  let gridX = 0
  let gridY = 0

  const layerCentres = []
  const layerRenders = []
  const transitionRenders = []
  const layerRendersById = {}

  return (
    <PtsCanvas
      background="#2b2b35"
      style={{ height: "100vh", padding: 0, margin: 0 }}
      onStart={(bound, space) => {
        let row = 0
        let col = 0

        gridX = Math.floor(space.size.x / gridWidth)
        gridY = Math.floor(space.size.y / gridHeight)
        for (let i = 0; i < numLayers; i++) {
          layerCentres.push(new Pt(gridX * row + (gridX / 2), gridY * col + (gridY / 2)))
          row += 1
          if (row === gridWidth) {
            row = 0
            col += 1
          }
        }
        for (let i = 0; i < numLayers; i++) {
          const layerRender = new LayerRender(layerEntities[i], layerCentres[i])
          layerRenders.push(layerRender)
          layerRendersById[layerEntities[i].id] = layerRender
        }
        for (const transition of transitionEntities) {
          transitionRenders.push(new TransitionRender(transition))
        }
      }}
      onAnimate={(space, form, time) => {
        for (const transitionRender of transitionRenders) {
          transitionRender.render(gridX, form, time, space, layerRendersById)
        }
        for (const layerRender of layerRenders) {
          layerRender.render(gridX, form, time)
        }
      }}
    />
  )
}


export default Viewer