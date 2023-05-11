import svgPathReverse from 'https://cdn.jsdelivr.net/npm/svg-path-reverse@1.7.0/+esm'

class Config {
   #seed
   #offset
   #tabsize
   #jitter
   #radius
   #xn
   #yn
   #width
   #height

   constructor(config) {
      this.seed = config?.seed ?? 0
      this.offset = config?.offset ?? 0
      this.t = config?.tabsize ?? .2
      this.j = config?.jitter ?? .04
      this.radius = config?.radius ?? 48.0
      this.xn = config?.xn ?? 4
      this.yn = config?.yn ?? 9
      this.width = config?.width ?? 628
      this.height = config?.height ?? 900
   }

   merge(other) {
      this.seed = other?.seed ?? this.seed
      this.offset = other?.offset ?? this.offset
      this.t = other?.tabsize ?? this.t
      this.j = other?.jitter ?? this.j
      this.radius = other?.radius ?? this.radius
      this.xn = other?.xn ?? this.xn
      this.yn = other?.yn ?? this.yn
      this.width = other?.width ?? this.width
      this.height = other?.height ?? this.height
   }

   get seed() { return this.#seed }
   get offset() { return this.#offset }
   get t() { return this.#tabsize }
   get j() { return this.#jitter }
   get radius() { return this.#radius }
   get xn() { return this.#xn }
   get yn() { return this.#yn }
   get width() { return this.#width }
   get height() { return this.#height }

   set seed(seed) { this.#seed = seed; }
   set offset(offset) { this.#offset = offset }
   set t(tabsize) { this.#tabsize = tabsize }
   set j(jitter) { this.#jitter = jitter }
   set radius(radius) { this.#radius = radius }
   set yn(yn) { this.#yn = yn }
   set xn(xn) { this.#xn = xn }
   set width(width) { this.#width = width }
   set height(height) { this.#height = height }
}

export default class Jigsaw {
   get dh() { return this.config.dh }
   get dv() { return this.config.dv }
   get db() { return this.config.db }
   /* NO setters
   set dh(dh) { this.#dh = dh }
   set dv(dv) { this.#dv = dv }
   set db(db) { this.#db = db }
   */
   getJigsawPieceAsSVG(i, id, w, h, style) {
      const data = this.config.map2.get(i)
      const d = data?.path ?? ""
      const viewBox = data?.viewBox ?? "0 0 100 100"

      return `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" width="${w}" height="${h}" style="${style}" viewBox="${viewBox}">
   <path d="${d}"></path>
</svg>
`
   }
   getJigsawPiecePath(i) {
      const data = this.config.map2.get(i)
      return data?.path ?? ""
   }
   getJigsawPieceViewBox(i) {
      const data = this.config.map2.get(i)
      return data?.viewBox ?? "0 0 100 100"
   }
   constructor(config) {
      this.config = new Config(config ?? {}, this.update)
      this.config.map = new Map()
      this.#everything()
   }
   update = function (config) {
      this.config.merge(config)
      this.#everything()
   }
   #everything = function () {
      console.log('[jigsaw] everything')

      const _ = this.config

      function uniform(min, max) { let r = Math.random(); return min + r * (max - min); }
      function rbool() { return Math.random() > 0.5; }

      function $(id) { return document.getElementById(id); }

      let a, b, c, d, e, flip, xi, yi, vertical /* t, j, xn, yn, offset, width, height, radius */

      function first() { e = uniform(-_.j, _.j); next(); }
      function next() {
         let flipold = flip;
         flip = rbool();
         a = (flip == flipold ? -e : e);
         b = uniform(-_.j, _.j);
         c = uniform(-_.j, _.j);
         d = uniform(-_.j, _.j);
         e = uniform(-_.j, _.j);
      }
      function sl() { return vertical ? _.height / _.yn : _.width / _.xn; }
      function sw() { return vertical ? _.width / _.xn : _.height / _.yn; }
      function ol() { return _.offset + sl() * (vertical ? yi : xi); }
      function ow() { return _.offset + sw() * (vertical ? xi : yi); }
      function l(v) { let ret = ol() + sl() * v; return Math.round(ret * 100) / 100; }
      function w(v) { let ret = ow() + sw() * v * (flip ? -1.0 : 1.0); return Math.round(ret * 100) / 100; }
      function p0l() { return l(0.0); }
      function p0w() { return w(0.0); }
      function p1l() { return l(0.2); }
      function p1w() { return w(a); }
      function p2l() { return l(0.5 + b + d); }
      function p2w() { return w(-_.t + c); }
      function p3l() { return l(0.5 - _.t + b); }
      function p3w() { return w(_.t + c); }
      function p4l() { return l(0.5 - 2.0 * _.t + b - d); }
      function p4w() { return w(3.0 * _.t + c); }
      function p5l() { return l(0.5 + 2.0 * _.t + b - d); }
      function p5w() { return w(3.0 * _.t + c); }
      function p6l() { return l(0.5 + _.t + b); }
      function p6w() { return w(_.t + c); }
      function p7l() { return l(0.5 + b + d); }
      function p7w() { return w(-_.t + c); }
      function p8l() { return l(0.8); }
      function p8w() { return w(e); }
      function p9l() { return l(1.0); }
      function p9w() { return w(0.0); }

      const svgNS = "http://www.w3.org/2000/svg"
      const key = (x, y) => `_${x.toString()}x${y.toString()}`

      function parse_input() {/*
            const old = document.getElementById('pieces_container')
            if (old) {
               old.remove()
            }
            let svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
            svg.setAttribute('width', 720)
            svg.setAttribute('height', 1920)
            svg.setAttribute('id', "pieces_container")
            */
         for (let y = 0; y < _.yn; y++) {
            for (let x = 0; x < _.xn; x++) {
               const k = key(x, y)
               _.map.set(k, {})
               /*
               let sym = document.createElementNS(svgNS, "symbol");
               sym.setAttribute("id", k);
               let path = document.createElementNS(sym, 'path');
               sym.appendChild(path);
               svg.appendChild(sym);
               let use = document.createElementNS(svgNS, "use");
               use.setAttribute("id", `use${k}`);
               use.setAttribute('href', `#${k}`);
               svg.appendChild(use);
               let view = document.createElementNS(svgNS, "view");
               view.setAttribute("id", `view${k}`);
               svg.appendChild(view); */
            }
         }
         /*document.body.appendChild(svg);*/
      }

      function gen_dh() {
         let str = "";
         vertical = 0;

         for (yi = 1; yi < _.yn; ++yi) {
            xi = 0;
            first();
            let startPoint = "M " + p0l() + "," + p0w() + " ";
            str += startPoint;
            for (; xi < _.xn; ++xi) {
               let curve;
               curve = "C " + p1l() + " " + p1w() + " " + p2l() + " " + p2w() + " " + p3l() + " " + p3w() + " ";
               curve += "C " + p4l() + " " + p4w() + " " + p5l() + " " + p5w() + " " + p6l() + " " + p6w() + " ";
               curve += "C " + p7l() + " " + p7w() + " " + p8l() + " " + p8w() + " " + p9l() + " " + p9w() + " ";
               str += curve
               _.map.get(key(xi, yi - 1))._1bottom = startPoint + curve
               _.map.get(key(xi, yi))._3top = startPoint + curve

               startPoint = "M " + p9l() + "," + p9w() + " ";
               next();
            }
         }
         for (xi = 0; xi < _.xn; ++xi) {
            function line(Y) {
               const x1 = _.offset + xi * _.width / _.xn
               const y1 = _.offset + Y
               const x2 = x1 + _.width / _.xn
               const y2 = y1
               let startPoint = `M ${x1} ${y1} `
               let lineto = `L ${x2} ${y2} `
               return startPoint + lineto
            }
            _.map.get(key(xi, 0))._3top = line(0)
            _.map.get(key(xi, _.yn - 1))._1bottom = line(_.height)
         }

         return str;
      }

      function gen_dv() {
         let str = "";
         vertical = 1;

         for (xi = 1; xi < _.xn; ++xi) {
            yi = 0;
            first();
            let startPoint = "M " + p0w() + "," + p0l() + " ";
            str += startPoint;
            for (; yi < _.yn; ++yi) {
               let curve;
               curve = "C " + p1w() + " " + p1l() + " " + p2w() + " " + p2l() + " " + p3w() + " " + p3l() + " ";
               curve += "C " + p4w() + " " + p4l() + " " + p5w() + " " + p5l() + " " + p6w() + " " + p6l() + " ";
               curve += "C " + p7w() + " " + p7l() + " " + p8w() + " " + p8l() + " " + p9w() + " " + p9l() + " ";
               str += curve
               _.map.get(key(xi - 1, yi))._2right = startPoint + curve
               _.map.get(key(xi, yi))._4left = startPoint + curve
               startPoint = "M " + p9w() + "," + p9l() + " ";
               next();
               // break;
            }
            // break;
         }
         for (yi = 0; yi < _.yn; ++yi) {
            function line(X) {
               const x1 = _.offset + X
               const y1 = _.offset + yi * _.height / _.yn
               const x2 = x1
               const y2 = y1 + _.height / _.yn
               let startPoint = `M ${x1} ${y1} `
               let lineto = `L ${x2} ${y2} `
               return startPoint + lineto
            }
            _.map.get(key(0, yi))._4left = line(0)
            _.map.get(key(_.xn - 1, yi))._2right = line(_.width)
         }
         return str;
      }

      function gen_db() {
         let str = "";

         str += "M " + (_.offset + _.radius) + " " + (_.offset) + " ";
         str += "L " + (_.offset + _.width - _.radius) + " " + (_.offset) + " ";
         str += "A " + (_.radius) + " " + (_.radius) + " 0 0 1 " + (_.offset + _.width) + " " + (_.offset + _.radius) + " ";
         str += "L " + (_.offset + _.width) + " " + (_.offset + _.height - _.radius) + " ";
         str += "A " + (_.radius) + " " + (_.radius) + " 0 0 1 " + (_.offset + _.width - _.radius) + " " + (_.offset + _.height) + " ";
         str += "L " + (_.offset + _.radius) + " " + (_.offset + _.height) + " ";
         str += "A " + (_.radius) + " " + (_.radius) + " 0 0 1 " + (_.offset) + " " + (_.offset + _.height - _.radius) + " ";
         str += "L " + (_.offset) + " " + (_.offset + _.radius) + " ";
         str += "A " + (_.radius) + " " + (_.radius) + " 0 0 1 " + (_.offset + _.radius) + " " + (_.offset) + " ";
         return str;
      }

      function cut(path) {
         return path.replaceAll(/M [0-9\.]+[\s,]+[0-9\.]+ /gi, '')
      }

      function reverse(path) {
         return svgPathReverse.reverse(path)
      }

      function update() {
         console.log('[jigsaw] generate')

         let ratio = 1.0 * _.width / _.height
         let wid
         let hei
         if (ratio > 1.5) {
            _.radius = _.radius * 900 / _.width
            wid = 900
            hei = wid / ratio
         }
         else {
            _.radius = _.radius * 600 / _.height
            hei = 600
            wid = hei * ratio
         }
         parse_input()
         /*
         $("puzzlepath_h").setAttribute("d", gen_dh());
         $("puzzlepath_v").setAttribute("d", gen_dv());
         $("puzzlepath_b").setAttribute("d", gen_db());
         */
         _.dh = gen_dh()
         _.dv = gen_dv()
         _.db = gen_db()

         _.map2 = new Map()
         let ind = 0;
         for (let yi = 0; yi < _.yn; yi++) {
            for (let xi = 0; xi < _.xn; xi++) {
               // console.log(xi, yi)
               const k = key(xi, yi)
               const d = _.map.get(k)
               const bottom = d._1bottom || ''
               const right = d._2right || ''
               const top = d._3top || ''
               const left = d._4left || ''
               d.path = top + ' ' + cut(right) + cut(reverse(bottom)) + ' ' + cut(reverse(left))
               const x = _.offset /* - 50 */ + xi * _.width / _.xn
               const y = _.offset /* - 60 */ + yi * _.height / _.yn
               const width = _.width / _.xn /* + 100 */
               const height = _.height / _.yn /* + 120 */
               d.viewBox = `${x} ${y} ${width} ${height}`
               _.map2.set(ind++, d)

               /*
               const sym = document.getElementById(k)
               const use = document.getElementById(`use${k}`)
               const view = document.getElementById(`view${k}`)
               sym.querySelector('path').setAttribute('d', d.path)
               sym.setAttribute('viewBox', d.viewBox)
               const x2 = _.offset + xi * width
               const y2 = _.offset + yi * height
               use.setAttribute('x', `${x2}`)
               use.setAttribute('y', `${y2}`)
               use.setAttribute('width', `${width}`)
               use.setAttribute('height', `${height}`)
               use.setAttribute('id', `bonhomme${xi + yi * _.xn}`)
               view.setAttribute('viewBox', `${x2} ${y2} ${width} ${height}`)
               view.setAttribute('id', `bonhomme${xi + yi * _.xn}-view`)
               */
            }
         }
         /*
         const svg = document.getElementById('pieces_container')
         const bb = svg.getBBox()
         const bb2 = `${_.offset - bb.x} ${_.offset - bb.y} ${_.width * 2} ${_.height * 2}`
         svg.setAttribute('viewBox', bb2)
         */
      }

      update()
   }
}

