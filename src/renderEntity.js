import { Rectangle, Line, Curve, Pt, Create } from "pts"

class BaseRenderer {
  constructor(entity, centre) {
    this.entity = entity
    this.centre = centre
  }

  // isClicked(x, y) {
  //   return false;
  // }
}

export class LayerRender extends BaseRenderer{
  render(gridX, form, time, space) {
    const rect = Rectangle.fromCenter(this.centre, Math.floor(gridX/2.5),  Math.floor(gridX/3))
    const header = Rectangle.fromTopLeft(rect.p1, Math.floor(gridX/2.5), Math.floor(gridX/6))
    form.fillOnly("#ad6684").rect(rect, 2, "circle" );
    form.stroke("#22404b", 3).rect( rect );
    form.fillOnly("#632d47").rect(header, 2, "circle" );
    console.log(this.entity.name)
    form.font("12").textBox( header, this.entity.name, "top", "..." );
  }
}

export class TransitionRender extends BaseRenderer{
  constructor(entity) {
    super(entity)

    const colours = ["#4CA973", "#48BF91", "#318ea0"]
    const randInt = Math.ceil(Math.random() * colours.length)
    this.colour = colours[randInt]
    this.thickness = (3 + randInt) * 0.1

    this.noiseX1 = Math.ceil((Math.random() - 0.5))
    this.noiseY1 = Math.ceil((Math.random() - 0.5))
    this.noiseX2 = Math.ceil((Math.random() - 0.5))
    this.noiseY2 = Math.ceil((Math.random() - 0.5))
  }

  render(gridX, form, time, space, layerRendersById) {
    const src = layerRendersById[this.entity.from]
    const dest = layerRendersById[this.entity.to]

    const pts = Create.distributeLinear( [src.centre, dest.centre], 4);

    // console.log(pts)

    // // Add anchors at the actual src and dest
    // pts.insert([new Pt(src.centre.x, src.centre.y)], 0)
    // pts.insert([new Pt(dest.centre.x, dest.centre.y)], 5)

    pts[1].x += this.noiseX1 * gridX * 0.1
    pts[1].y += this.noiseY1 * gridX * 0.1
    pts[2].x += this.noiseX2 * gridX * 0.1
    pts[2].y += this.noiseY2 * gridX * 0.1

    console.log(pts)

    form.strokeOnly(this.colour, this.thickness).line( Curve.bezier( pts, 10, 0.8 ) );
  }
}