!(function (t) {
  var e = {};
  function i(o) {
    if (e[o]) return e[o].exports;
    var r = (e[o] = { i: o, l: !1, exports: {} });
    return t[o].call(r.exports, r, r.exports, i), (r.l = !0), r.exports;
  }
  (i.m = t),
    (i.c = e),
    (i.d = function (t, e, o) {
      i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: o });
    }),
    (i.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (i.t = function (t, e) {
      if ((1 & e && (t = i(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var o = Object.create(null);
      if (
        (i.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var r in t)
          i.d(
            o,
            r,
            function (e) {
              return t[e];
            }.bind(null, r)
          );
      return o;
    }),
    (i.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return i.d(e, "a", e), e;
    }),
    (i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (i.p = ""),
    i((i.s = 0));
})([
  function (t, e, i) {
    i(1), (t.exports = i(2));
  },
  function (t, e, i) {
    t.exports = i.p + "bundle.css";
  },
  function (t, e, i) {
    "use strict";
    function o(t, e) {
      return (
        (this.planes = []),
        (this._drawStack = []),
        (this._drawingEnabled = !0),
        (this._forceRender = !1),
        (this.container = document.getElementById(t || "canvas")),
        (this.productionMode = e || !1),
        this.container
          ? (this._init(), this)
          : (this.productionMode ||
              console.warn("You must specify a valid container ID"),
            void (this._onErrorCallback && this._onErrorCallback()))
      );
    }
    (o.prototype._init = function () {
      if (
        ((this.glCanvas = document.createElement("canvas")),
        (this.glContext =
          this.glCanvas.getContext("webgl", { alpha: !0 }) ||
          this.glCanvas.getContext("experimental-webgl")),
        !this.glContext)
      )
        return (
          this.productionMode ||
            console.warn("WebGL context could not be created"),
          void (this._onErrorCallback && this._onErrorCallback())
        );
      var t = window.pixelRatio || 1;
      this.setPixelRatio(t),
        (this._loseContextExtension =
          this.glContext.getExtension("WEBGL_lose_context")),
        (this._contextLostHandler = this._contextLost.bind(this)),
        this.glCanvas.addEventListener(
          "webglcontextlost",
          this._contextLostHandler,
          !1
        ),
        (this._contextRestoredHandler = this._contextRestored.bind(this)),
        this.glCanvas.addEventListener(
          "webglcontextrestored",
          this._contextRestoredHandler,
          !1
        ),
        (this._resizeHandler = this.resize.bind(this)),
        window.addEventListener("resize", this._resizeHandler, !1),
        this._readyToDraw();
    }),
      (o.prototype.setPixelRatio = function (t) {
        (this.pixelRatio = parseFloat(Math.max(t, 1)) || 1), this.resize();
      }),
      (o.prototype._setSize = function () {
        var t = this.container.getBoundingClientRect();
        (this._boundingRect = {
          width: t.width * this.pixelRatio,
          height: t.height * this.pixelRatio,
          top: t.top * this.pixelRatio,
          left: t.left * this.pixelRatio,
        }),
          (this.glCanvas.style.width =
            Math.floor(this._boundingRect.width / this.pixelRatio) + "px"),
          (this.glCanvas.style.height =
            Math.floor(this._boundingRect.height / this.pixelRatio) + "px"),
          (this.glCanvas.width = Math.floor(this._boundingRect.width)),
          (this.glCanvas.height = Math.floor(this._boundingRect.height)),
          this.glContext.viewport(
            0,
            0,
            this.glContext.drawingBufferWidth,
            this.glContext.drawingBufferHeight
          );
      }),
      (o.prototype.resize = function () {
        this._setSize();
        for (var t = 0; t < this.planes.length; t++)
          this.planes[t]._canDraw && this.planes[t].planeResize();
        this.needRender();
      }),
      (o.prototype.enableDrawing = function () {
        this._drawingEnabled = !0;
      }),
      (o.prototype.disableDrawing = function () {
        this._drawingEnabled = !1;
      }),
      (o.prototype.needRender = function () {
        this._forceRender = !0;
      }),
      (o.prototype._contextLost = function (t) {
        t.preventDefault(),
          this._animationFrameID &&
            window.cancelAnimationFrame(this._animationFrameID);
        var e = this;
        setTimeout(function () {
          e._onContextLostCallback && e._onContextLostCallback();
        }, 0);
      }),
      (o.prototype.restoreContext = function () {
        this.glContext && this._loseContextExtension
          ? this._loseContextExtension.restoreContext()
          : this.productionMode ||
            (this.glContext
              ? this._loseContextExtension ||
                console.warn(
                  "Could not restore context because the restore context extension is not defined"
                )
              : console.warn(
                  "Could not restore context because the context is not defined"
                ));
      }),
      (o.prototype._contextRestored = function () {
        for (var t = 0; t < this.planes.length; t++)
          this.planes[t]._restoreContext();
        var e = this;
        setTimeout(function () {
          e._onContextRestoredCallback && e._onContextRestoredCallback();
        }, 0),
          this.needRender(),
          this._animate();
      }),
      (o.prototype.dispose = function () {
        for (; this.planes.length > 0; ) this.removePlane(this.planes[0]);
        var t = this,
          e = setInterval(function () {
            0 === t.planes.length &&
              (clearInterval(e),
              t.glContext.clear(
                t.glContext.DEPTH_BUFFER_BIT | t.glContext.COLOR_BUFFER_BIT
              ),
              window.cancelAnimationFrame(t._animationFrameID),
              window.removeEventListener("resize", t._resizeHandler, !1),
              t.glCanvas.removeEventListener(
                "webglcontextlost",
                t._contextLostHandler,
                !1
              ),
              t.glCanvas.removeEventListener(
                "webglcontextrestored",
                t._contextRestoredHandler,
                !1
              ),
              t.glContext &&
                t._loseContextExtension &&
                t._loseContextExtension.loseContext(),
              t.container.removeChild(t.glCanvas));
          }, 100);
      }),
      (o.prototype._createPlane = function (t, e) {
        return new o.Plane(this, t, e);
      }),
      (o.prototype.addPlane = function (t, e) {
        return this.glContext
          ? t && 0 !== t.length
            ? this._createPlane(t, e)
            : (this.productionMode ||
                console.warn(
                  "The html element you specified does not currently exists in the DOM"
                ),
              this._onErrorCallback && this._onErrorCallback(),
              !1)
          : (this.productionMode ||
              console.warn(
                "Unable to create a plane. The WebGl context couldn't be created"
              ),
            this._onErrorCallback && this._onErrorCallback(),
            null);
      }),
      (o.prototype.removePlane = function (t) {
        t._canDraw = !1;
        for (var e, i = this._drawStack, o = 0; o < i.length; o++)
          t.index === i[o] && this._drawStack.splice(o, 1);
        t && t._dispose();
        for (o = 0; o < this.planes.length; o++)
          t.index === this.planes[o].index && (e = o);
        (t = null),
          (this.planes[e] = null),
          this.planes.splice(e, 1),
          this.glContext &&
            this.glContext.clear(
              this.glContext.DEPTH_BUFFER_BIT | this.glContext.COLOR_BUFFER_BIT
            );
      }),
      (o.prototype._stackPlane = function (t) {
        this._drawStack.push(t);
      }),
      (o.prototype._createShader = function (t, e) {
        var i = this.glContext.createShader(e);
        return (
          this.glContext.shaderSource(i, t),
          this.glContext.compileShader(i),
          this.glContext.getShaderParameter(i, this.glContext.COMPILE_STATUS)
            ? i
            : (this.productionMode ||
                console.warn(
                  "Errors occurred while compiling the shader:\n" +
                    this.glContext.getShaderInfoLog(i)
                ),
              this._onErrorCallback && this._onErrorCallback(),
              null)
        );
      }),
      (o.prototype._handleDepth = function (t) {
        (this._shouldHandleDepth = t),
          t
            ? this.glContext.enable(this.glContext.DEPTH_TEST)
            : this.glContext.disable(this.glContext.DEPTH_TEST);
      }),
      (o.prototype._readyToDraw = function () {
        this.container.appendChild(this.glCanvas),
          this.glContext.blendFunc(
            this.glContext.SRC_ALPHA,
            this.glContext.ONE_MINUS_SRC_ALPHA
          ),
          this.glContext.enable(this.glContext.BLEND),
          this._handleDepth(!0),
          console.log("curtains.js - v2.0"),
          this._animate();
      }),
      (o.prototype._animate = function () {
        this._drawScene(),
          (this._animationFrameID = window.requestAnimationFrame(
            this._animate.bind(this)
          ));
      }),
      (o.prototype._drawScene = function () {
        if (this._drawingEnabled || this._forceRender) {
          this._forceRender && (this._forceRender = !1),
            this.__onRenderCallback && this.__onRenderCallback(),
            this.glContext.clearColor(0, 0, 0, 0),
            this.glContext.clearDepth(1);
          for (var t = 0; t < this._drawStack.length; t++) {
            var e = this.planes[this._drawStack[t]];
            e &&
              (e._shouldUseDepthTest && !this._shouldHandleDepth
                ? this._handleDepth(!0)
                : !e._shouldUseDepthTest &&
                  this._shouldHandleDepth &&
                  this._handleDepth(!1),
              e._drawPlane());
          }
        }
      }),
      (o.prototype.onError = function (t) {
        return t && (this._onErrorCallback = t), this;
      }),
      (o.prototype.onContextLost = function (t) {
        return t && (this._onContextLostCallback = t), this;
      }),
      (o.prototype.onContextRestored = function (t) {
        return t && (this._onContextRestoredCallback = t), this;
      }),
      (o.prototype.onRender = function (t) {
        return t && (this.__onRenderCallback = t), this;
      }),
      (o.Plane = function (t, e, i) {
        return (
          (this._wrapper = t),
          (this.htmlElement = e),
          (this.index = this._wrapper.planes.length),
          this._init(e, i),
          this._wrapper.planes.push(this),
          this
        );
      }),
      (o.Plane.prototype._init = function (t, e) {
        e || (e = {}), this._setupShaders(e);
        var i = this._setupPlaneProgram();
        if (
          (this._setInitParams(e),
          (this.images = []),
          (this.videos = []),
          (this.canvases = []),
          (this.textures = []),
          i)
        ) {
          this._setAttributes();
          var o,
            r = this._wrapper;
          if (
            (this._setDocumentSizes(),
            this._setComputedSizes(),
            (this.scale = { x: 1, y: 1 }),
            (this.rotation = { x: 0, y: 0, z: 0 }),
            (this.relativeTranslation = { x: 0, y: 0 }),
            (this._translation = { x: 0, y: 0, z: 0 }),
            r._stackPlane(this.index),
            this._setUniforms(this.uniforms),
            this._initializeBuffers(),
            (this._loadingManager = { sourcesLoaded: 0, initSourcesToLoad: 0 }),
            this.autoloadSources)
          ) {
            for (
              var n = [], a = 0;
              a < this.htmlElement.getElementsByTagName("img").length;
              a++
            )
              n.push(this.htmlElement.getElementsByTagName("img")[a]);
            n.length > 0 && this.loadSources(n);
            var s = [];
            for (
              a = 0;
              a < this.htmlElement.getElementsByTagName("video").length;
              a++
            )
              s.push(this.htmlElement.getElementsByTagName("video")[a]);
            s.length > 0 && this.loadSources(s);
            var h = [];
            for (
              a = 0;
              a < this.htmlElement.getElementsByTagName("canvas").length;
              a++
            )
              h.push(this.htmlElement.getElementsByTagName("canvas")[a]);
            h.length > 0 && this.loadSources(h),
              (this._loadingManager.initSourcesToLoad =
                n.length + s.length + h.length);
          }
          0 !== this._loadingManager.initSourcesToLoad ||
            r.productionMode ||
            console.warn(
              "This plane does not contain any image, video or canvas element. You may want to add some later with the loadSource() or loadSources() method."
            );
          var l = this;
          o = setInterval(function () {
            l._loadingManager.sourcesLoaded >=
              l._loadingManager.initSourcesToLoad &&
              (clearInterval(o), l._onReadyCallback && l._onReadyCallback());
          }, 16);
        }
      }),
      (o.Plane.prototype._setInitParams = function (t) {
        var e = this._wrapper;
        (this._canDraw = !1),
          (this.alwaysDraw = t.alwaysDraw || !1),
          (this._shouldDraw = !0),
          (this._definition = {
            width: parseInt(t.widthSegments) || 1,
            height: parseInt(t.heightSegments) || 1,
          }),
          (!t.mimicCSS && !1 !== t.mimicCSS) ||
            e.productionMode ||
            console.warn(
              "mimicCSS property is deprecated since v2.0 as the planes will always copy their html elements sizes and positions."
            ),
          (this.imageCover = t.imageCover || !1),
          this.imageCover &&
            !e.productionMode &&
            console.warn(
              "imageCover property is deprecated. Please use texture matrix in your shader instead."
            ),
          (this.autoloadSources = t.autoloadSources),
          (null !== this.autoloadSources && void 0 !== this.autoloadSources) ||
            (this.autoloadSources = !0),
          (this.crossOrigin = t.crossOrigin || "anonymous"),
          (this._fov = t._fov || 75),
          (this._shouldUseDepthTest = !0),
          t.uniforms ||
            (e.productionMode ||
              console.warn(
                "You are setting a plane without uniforms, you won't be able to interact with it. Please check your addPlane method for : ",
                this.htmlElement
              ),
            (t.uniforms = {})),
          (this.uniforms = {});
        var i = this;
        t.uniforms &&
          Object.keys(t.uniforms).map(function (e, o) {
            var r = t.uniforms[e];
            i.uniforms[e] = { name: r.name, type: r.type, value: r.value };
          });
      }),
      (o.Plane.prototype._setupShaders = function (t) {
        var e,
          i,
          o = this._wrapper,
          r = t.vertexShaderID || this.htmlElement.getAttribute("data-vs-id"),
          n = t.fragmentShaderID || this.htmlElement.getAttribute("data-fs-id");
        t.vertexShader ||
          (r && document.getElementById(r)
            ? (e = document.getElementById(r).innerHTML)
            : (o.productionMode ||
                console.warn(
                  "No vertex shader provided, will use a default one"
                ),
              (e =
                "#ifdef GL_ES\nprecision mediump float;\n#endif\nattribute vec3 aVertexPosition;attribute vec2 aTextureCoord;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec3 vVertexPosition;varying vec2 vTextureCoord;void main() {vTextureCoord = aTextureCoord;vVertexPosition = aVertexPosition;gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);}"))),
          t.fragmentShader ||
            (n && document.getElementById(n)
              ? (i = document.getElementById(n).innerHTML)
              : (o.productionMode ||
                  console.warn(
                    "No fragment shader provided, will use a default one"
                  ),
                (i =
                  "#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec3 vVertexPosition;varying vec2 vTextureCoord;void main( void ) {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}"))),
          (this._shaders = {
            vertexShaderCode: t.vertexShader || e,
            fragmentShaderCode: t.fragmentShader || i,
          });
      }),
      (o.Plane.prototype._setupPlaneProgram = function () {
        var t = !0,
          e = this._wrapper,
          i = e.glContext;
        return (
          (this._program = i.createProgram()),
          (this._shaders.vertexShader = e._createShader(
            this._shaders.vertexShaderCode,
            i.VERTEX_SHADER
          )),
          (this._shaders.fragmentShader = e._createShader(
            this._shaders.fragmentShaderCode,
            i.FRAGMENT_SHADER
          )),
          (this._shaders.vertexShader && this._shaders.fragmentShader) ||
            e.productionMode ||
            (e.productionMode ||
              console.warn(
                "Unable to find or compile the vertex or fragment shader"
              ),
            this._onErrorCallback && this._onErrorCallback(),
            (t = !1)),
          t &&
            (i.attachShader(this._program, this._shaders.vertexShader),
            i.attachShader(this._program, this._shaders.fragmentShader),
            i.linkProgram(this._program),
            i.getProgramParameter(this._program, i.LINK_STATUS) ||
              (e.productionMode ||
                console.warn("Unable to initialize the shader program."),
              this._onErrorCallback && this._onErrorCallback(),
              (t = !1)),
            (this._matrices = {
              mvMatrix: {
                name: "uMVMatrix",
                matrix: new Float32Array([
                  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                ]),
                location: i.getUniformLocation(this._program, "uMVMatrix"),
              },
              pMatrix: {
                name: "uPMatrix",
                matrix: new Float32Array([
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]),
                location: i.getUniformLocation(this._program, "uPMatrix"),
              },
            })),
          t
        );
      }),
      (o.Plane.prototype._setDocumentSizes = function () {
        var t = this._wrapper,
          e = this.htmlElement.getBoundingClientRect();
        0 === e.width && 0 === e.height && (e = t._boundingRect),
          (this._boundingRect = {
            document: {
              width: e.width * t.pixelRatio,
              height: e.height * t.pixelRatio,
              top: e.top * t.pixelRatio,
              left: e.left * t.pixelRatio,
            },
          });
      }),
      (o.Plane.prototype._setComputedSizes = function () {
        var t = this._wrapper,
          e =
            this._boundingRect.document.width / 2 +
            this._boundingRect.document.left,
          i =
            this._boundingRect.document.height / 2 +
            this._boundingRect.document.top,
          o = t._boundingRect.width / 2 + t._boundingRect.left,
          r = t._boundingRect.height / 2 + t._boundingRect.top;
        this._boundingRect.computed = {
          width: this._boundingRect.document.width / t._boundingRect.width,
          height: this._boundingRect.document.height / t._boundingRect.height,
          top: (r - i) / t._boundingRect.height,
          left: (e - o) / t._boundingRect.height,
        };
      }),
      (o.Plane.prototype._restoreContext = function () {
        if (
          ((this._canDraw = !1),
          (this._shaders.vertexShader = null),
          (this._shaders.fragmentShader = null),
          (this._program = null),
          (this._matrices = null),
          (this._attributes = null),
          (this._geometry.bufferInfos = null),
          (this._material.bufferInfos = null),
          this._setupPlaneProgram())
        ) {
          this._setAttributes(),
            this._setUniforms(this.uniforms),
            this._initializeBuffers();
          for (var t = 0; t < this.textures.length; t++) {
            var e = this.textures[t].source;
            this.textures[t]._init(), this.textures[t].setSource(e);
          }
        }
      }),
      (o.Plane.prototype._setPlaneVertices = function () {
        (this._geometry = { vertices: [] }), (this._material = { uvs: [] });
        for (var t = 0; t < this._definition.height; ++t)
          for (
            var e = t / this._definition.height, i = 0;
            i < this._definition.width;
            ++i
          ) {
            var o = i / this._definition.width;
            this._material.uvs.push(o),
              this._material.uvs.push(e),
              this._material.uvs.push(0),
              this._geometry.vertices.push(2 * (o - 0.5)),
              this._geometry.vertices.push(2 * (e - 0.5)),
              this._geometry.vertices.push(0),
              this._material.uvs.push(o + 1 / this._definition.width),
              this._material.uvs.push(e),
              this._material.uvs.push(0),
              this._geometry.vertices.push(
                2 * (o + 1 / this._definition.width - 0.5)
              ),
              this._geometry.vertices.push(2 * (e - 0.5)),
              this._geometry.vertices.push(0),
              this._material.uvs.push(o),
              this._material.uvs.push(e + 1 / this._definition.height),
              this._material.uvs.push(0),
              this._geometry.vertices.push(2 * (o - 0.5)),
              this._geometry.vertices.push(
                2 * (e + 1 / this._definition.height - 0.5)
              ),
              this._geometry.vertices.push(0),
              this._material.uvs.push(o),
              this._material.uvs.push(e + 1 / this._definition.height),
              this._material.uvs.push(0),
              this._geometry.vertices.push(2 * (o - 0.5)),
              this._geometry.vertices.push(
                2 * (e + 1 / this._definition.height - 0.5)
              ),
              this._geometry.vertices.push(0),
              this._material.uvs.push(o + 1 / this._definition.width),
              this._material.uvs.push(e + 1 / this._definition.height),
              this._material.uvs.push(0),
              this._geometry.vertices.push(
                2 * (o + 1 / this._definition.width - 0.5)
              ),
              this._geometry.vertices.push(
                2 * (e + 1 / this._definition.height - 0.5)
              ),
              this._geometry.vertices.push(0),
              this._material.uvs.push(o + 1 / this._definition.width),
              this._material.uvs.push(e),
              this._material.uvs.push(0),
              this._geometry.vertices.push(
                2 * (o + 1 / this._definition.width - 0.5)
              ),
              this._geometry.vertices.push(2 * (e - 0.5)),
              this._geometry.vertices.push(0);
          }
      }),
      (o.Plane.prototype._initializeBuffers = function () {
        var t = this._wrapper.glContext;
        this._geometry || this._material || this._setPlaneVertices(),
          this._applyCSSPositions(),
          this.setPerspective(this._fov, 0.1, 2 * this._fov),
          this._attributes &&
            ((this._geometry.bufferInfos = {
              id: t.createBuffer(),
              itemSize: 3,
              numberOfItems: this._geometry.vertices.length / 3,
            }),
            t.bindBuffer(t.ARRAY_BUFFER, this._geometry.bufferInfos.id),
            t.bufferData(
              t.ARRAY_BUFFER,
              new Float32Array(this._geometry.vertices),
              t.STATIC_DRAW
            ),
            t.vertexAttribPointer(
              this._attributes.vertexPosition.location,
              this._geometry.bufferInfos.itemSize,
              t.FLOAT,
              !1,
              0,
              0
            ),
            t.enableVertexAttribArray(this._attributes.vertexPosition.location),
            (this._material.bufferInfos = {
              id: t.createBuffer(),
              itemSize: 3,
              numberOfItems: this._material.uvs.length / 3,
            }),
            t.bindBuffer(t.ARRAY_BUFFER, this._material.bufferInfos.id),
            t.bufferData(
              t.ARRAY_BUFFER,
              new Float32Array(this._material.uvs),
              t.STATIC_DRAW
            ),
            t.vertexAttribPointer(
              this._attributes.textureCoord.location,
              this._material.bufferInfos.itemSize,
              t.FLOAT,
              !1,
              0,
              0
            ),
            t.enableVertexAttribArray(this._attributes.textureCoord.location),
            (this._canDraw = !0));
      }),
      (o.Plane.prototype._setAttributes = function () {
        var t = {
          vertexPosition: "aVertexPosition",
          textureCoord: "aTextureCoord",
        };
        this._attributes || (this._attributes = {});
        var e = this;
        Object.keys(t).map(function (i, o) {
          var r = t[i];
          e._attributes[i] = {
            name: r,
            location: e._wrapper.glContext.getAttribLocation(e._program, r),
          };
        });
      }),
      (o.Plane.prototype._handleUniformSetting = function (t, e, i) {
        var o = this._wrapper.glContext;
        switch (t) {
          case "1i":
            o.uniform1i(e, i);
            break;
          case "1iv":
            o.uniform1iv(e, i);
            break;
          case "1f":
            o.uniform1f(e, i);
            break;
          case "1fv":
            o.uniform1fv(e, i);
            break;
          case "2i":
            o.uniform2i(e, i[0], i[1]);
            break;
          case "2iv":
            o.uniform2iv(e, i);
            break;
          case "2f":
            o.uniform2f(e, i[0], i[1]);
            break;
          case "2fv":
            o.uniform2fv(e, i);
            break;
          case "3i":
            o.uniform3i(e, i[0], i[1], i[2]);
            break;
          case "3iv":
            o.uniform3iv(e, i);
            break;
          case "3f":
            o.uniform3f(e, i[0], i[1], i[2]);
            break;
          case "3fv":
            o.uniform3fv(e, i);
            break;
          case "4i":
            o.uniform4i(e, i[0], i[1], i[2], i[3]);
            break;
          case "4iv":
            o.uniform4iv(e, i);
            break;
          case "4f":
            o.uniform4f(e, i[0], i[1], i[2], i[3]);
            break;
          case "4fv":
            o.uniform4fv(e, i);
            break;
          case "mat2":
            o.uniformMatrix2fv(e, !1, i);
            break;
          case "mat3":
            o.uniformMatrix3fv(e, !1, i);
            break;
          case "mat4":
            o.uniformMatrix4fv(e, !1, i);
            break;
          default:
            this._wrapper.productionMode ||
              console.warn("This uniform type is not handled : ", t);
        }
      }),
      (o.Plane.prototype._setUniforms = function (t) {
        var e = this._wrapper;
        e.glContext.useProgram(this._program);
        var i = this;
        t &&
          Object.keys(t).map(function (o, r) {
            var n = t[o];
            (i.uniforms[o].location = e.glContext.getUniformLocation(
              i._program,
              n.name
            )),
              n.type ||
                (Array.isArray(n.value)
                  ? 4 === n.value.length
                    ? ((n.type = "4f"),
                      e.productionMode ||
                        console.warn(
                          "No uniform type declared for " +
                            n.name +
                            ", applied a 4f (array of 4 floats) uniform type"
                        ))
                    : 3 === n.value.length
                    ? ((n.type = "3f"),
                      e.productionMode ||
                        console.warn(
                          "No uniform type declared for " +
                            n.name +
                            ", applied a 3f (array of 3 floats) uniform type"
                        ))
                    : 2 === n.value.length &&
                      ((n.type = "2f"),
                      e.productionMode ||
                        console.warn(
                          "No uniform type declared for " +
                            n.name +
                            ", applied a 2f (array of 2 floats) uniform type"
                        ))
                  : n.value.constructor === Float32Array
                  ? 16 === n.value.length
                    ? ((n.type = "mat4"),
                      e.productionMode ||
                        console.warn(
                          "No uniform type declared for " +
                            n.name +
                            ", applied a mat4 (4x4 matrix array) uniform type"
                        ))
                    : 9 === n.value.length
                    ? ((n.type = "mat3"),
                      e.productionMode ||
                        console.warn(
                          "No uniform type declared for " +
                            n.name +
                            ", applied a mat3 (3x3 matrix array) uniform type"
                        ))
                    : 4 === n.value.length &&
                      ((n.type = "mat2"),
                      e.productionMode ||
                        console.warn(
                          "No uniform type declared for " +
                            n.name +
                            ", applied a mat2 (2x2 matrix array) uniform type"
                        ))
                  : ((n.type = "1f"),
                    e.productionMode ||
                      console.warn(
                        "No uniform type declared for " +
                          n.name +
                          ", applied a 1f (float) uniform type"
                      ))),
              i._handleUniformSetting(n.type, i.uniforms[o].location, n.value);
          });
      }),
      (o.Plane.prototype._updateUniforms = function () {
        if (this.uniforms) {
          var t = this;
          Object.keys(t.uniforms).map(function (e) {
            var i = t.uniforms[e],
              o = i.location,
              r = i.value,
              n = i.type;
            t._handleUniformSetting(n, o, r);
          });
        }
      }),
      (o.Plane.prototype._multiplyMatrix = function (t, e) {
        var i = [],
          o = t[0],
          r = t[1],
          n = t[2],
          a = t[3],
          s = t[4],
          h = t[5],
          l = t[6],
          u = t[7],
          d = t[8],
          c = t[9],
          p = t[10],
          _ = t[11],
          m = t[12],
          f = t[13],
          g = t[14],
          x = t[15],
          v = e[0],
          y = e[1],
          b = e[2],
          w = e[3];
        return (
          (i[0] = v * o + y * s + b * d + w * m),
          (i[1] = v * r + y * h + b * c + w * f),
          (i[2] = v * n + y * l + b * p + w * g),
          (i[3] = v * a + y * u + b * _ + w * x),
          (v = e[4]),
          (y = e[5]),
          (b = e[6]),
          (w = e[7]),
          (i[4] = v * o + y * s + b * d + w * m),
          (i[5] = v * r + y * h + b * c + w * f),
          (i[6] = v * n + y * l + b * p + w * g),
          (i[7] = v * a + y * u + b * _ + w * x),
          (v = e[8]),
          (y = e[9]),
          (b = e[10]),
          (w = e[11]),
          (i[8] = v * o + y * s + b * d + w * m),
          (i[9] = v * r + y * h + b * c + w * f),
          (i[10] = v * n + y * l + b * p + w * g),
          (i[11] = v * a + y * u + b * _ + w * x),
          (v = e[12]),
          (y = e[13]),
          (b = e[14]),
          (w = e[15]),
          (i[12] = v * o + y * s + b * d + w * m),
          (i[13] = v * r + y * h + b * c + w * f),
          (i[14] = v * n + y * l + b * p + w * g),
          (i[15] = v * a + y * u + b * _ + w * x),
          i
        );
      }),
      (o.Plane.prototype._scaleMatrix = function (t, e, i, o) {
        var r = new Float32Array(16);
        return (
          (r[0] = e * t[0]),
          (r[1] = e * t[1]),
          (r[2] = e * t[2]),
          (r[3] = e * t[3]),
          (r[4] = i * t[4]),
          (r[5] = i * t[5]),
          (r[6] = i * t[6]),
          (r[7] = i * t[7]),
          (r[8] = o * t[8]),
          (r[9] = o * t[9]),
          (r[10] = o * t[10]),
          (r[11] = o * t[11]),
          t !== r &&
            ((r[12] = t[12]),
            (r[13] = t[13]),
            (r[14] = t[14]),
            (r[15] = t[15])),
          r
        );
      }),
      (o.Plane.prototype._setPerspectiveMatrix = function (t, e, i) {
        var o =
          this._wrapper._boundingRect.width /
          this._wrapper._boundingRect.height;
        return (
          t !== this._fov && (this._fov = t),
          [
            t / o,
            0,
            0,
            0,
            0,
            t,
            0,
            0,
            0,
            0,
            (e + i) * (1 / (e - i)),
            -1,
            0,
            0,
            e * i * (1 / (e - i)) * 2,
            0,
          ]
        );
      }),
      (o.Plane.prototype.setPerspective = function (t, e, i) {
        var o = parseInt(t) || 75;
        o < 0 ? (o = 0) : o > 180 && (o = 180);
        var r = parseFloat(e) || 0.1,
          n = parseFloat(i) || 100;
        this._matrices &&
          ((this._matrices.pMatrix.matrix = this._setPerspectiveMatrix(
            o,
            r,
            n
          )),
          this._wrapper.glContext.useProgram(this._program),
          this._wrapper.glContext.uniformMatrix4fv(
            this._matrices.pMatrix.location,
            !1,
            this._matrices.pMatrix.matrix
          ),
          this._setMVMatrix());
      }),
      (o.Plane.prototype._setMVMatrix = function () {
        var t = this._wrapper,
          e = new Float32Array([
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
          ]),
          i = new Float32Array([
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            this._translation.x,
            this._translation.y,
            this._translation.z - this._fov / 2,
            1,
          ]),
          o = new Float32Array([
            1,
            0,
            0,
            0,
            0,
            Math.cos(this.rotation.x),
            Math.sin(this.rotation.x),
            0,
            0,
            -Math.sin(this.rotation.x),
            Math.cos(this.rotation.x),
            0,
            0,
            0,
            0,
            1,
          ]),
          r = new Float32Array([
            Math.cos(this.rotation.y),
            0,
            -Math.sin(this.rotation.y),
            0,
            0,
            1,
            0,
            0,
            Math.sin(this.rotation.y),
            0,
            Math.cos(this.rotation.y),
            0,
            0,
            0,
            0,
            1,
          ]),
          n = new Float32Array([
            Math.cos(this.rotation.z),
            Math.sin(this.rotation.z),
            0,
            0,
            -Math.sin(this.rotation.z),
            Math.cos(this.rotation.z),
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
          ]),
          a = {
            x:
              this.scale.x *
              (((t._boundingRect.width / t._boundingRect.height) *
                this._boundingRect.computed.width) /
                2),
            y: (this.scale.y * this._boundingRect.computed.height) / 2,
          },
          s = new Float32Array([
            a.x,
            0,
            0,
            0,
            0,
            a.y,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
          ]),
          h = this._multiplyMatrix(e, i);
        (h = this._multiplyMatrix(h, o)),
          (h = this._multiplyMatrix(h, r)),
          (h = this._multiplyMatrix(h, n)),
          (h = this._multiplyMatrix(h, s)),
          this._matrices &&
            ((this._matrices.mvMatrix.matrix = h),
            t.glContext.useProgram(this._program),
            t.glContext.uniformMatrix4fv(
              this._matrices.mvMatrix.location,
              !1,
              this._matrices.mvMatrix.matrix
            ));
      }),
      (o.Plane.prototype.setScale = function (t, e) {
        (t = parseFloat(t) || 1),
          (t = Math.max(t, 0.001)),
          (e = parseFloat(e) || 1),
          (e = Math.max(e, 0.001)),
          (this.scale = { x: t, y: e }),
          this.alwaysDraw || this._shouldDrawCheck(),
          this._setMVMatrix();
        for (var i = 0; i < this.textures.length; i++)
          this.textures[i]._adjustTextureSize();
      }),
      (o.Plane.prototype.setRotation = function (t, e, i) {
        (t = parseFloat(t) || 0),
          (e = parseFloat(e) || 0),
          (i = parseFloat(i) || 0),
          (this.rotation = { x: t, y: e, z: i }),
          this._setMVMatrix();
      }),
      (o.Plane.prototype._setTranslation = function () {
        var t = { x: 0, y: 0 };
        (0 === this.relativeTranslation.x &&
          0 === this.relativeTranslation.y) ||
          (t = this._documentToPlaneSpace(
            this.relativeTranslation.x,
            this.relativeTranslation.y
          )),
          (this._translation.x = this._boundingRect.computed.left + t.x),
          (this._translation.y = this._boundingRect.computed.top + t.y),
          this.alwaysDraw || this._shouldDrawCheck(),
          this._setMVMatrix();
      }),
      (o.Plane.prototype.setRelativePosition = function (t, e) {
        (this.relativeTranslation = { x: t, y: e }), this._setTranslation();
      }),
      (o.Plane.prototype._documentToPlaneSpace = function (t, e) {
        var i = this._wrapper;
        return {
          x:
            (t / (i._boundingRect.width / i.pixelRatio)) *
            (i._boundingRect.width / i._boundingRect.height),
          y: -e / (i._boundingRect.height / i.pixelRatio),
        };
      }),
      (o.Plane.prototype.mouseToPlaneCoords = function (t, e) {
        var i =
            (this._boundingRect.document.width -
              this._boundingRect.document.width * this.scale.x) /
            2,
          o =
            (this._boundingRect.document.height -
              this._boundingRect.document.height * this.scale.y) /
            2,
          r =
            (this._boundingRect.document.width * this.scale.x) /
            this._wrapper.pixelRatio,
          n =
            (this._boundingRect.document.height * this.scale.y) /
            this._wrapper.pixelRatio,
          a = (this._boundingRect.document.top + o) / this._wrapper.pixelRatio;
        return {
          x:
            ((t -
              (this._boundingRect.document.left + i) /
                this._wrapper.pixelRatio) /
              r) *
              2 -
            1,
          y: 1 - ((e - a) / n) * 2,
        };
      }),
      (o.Plane.prototype._shouldDrawCheck = function () {
        var t =
            (this._boundingRect.document.width -
              this._boundingRect.document.width * this.scale.x) /
            2,
          e =
            (this._boundingRect.document.height -
              this._boundingRect.document.height * this.scale.y) /
            2,
          i = this._boundingRect.document.top + this.relativeTranslation.y + e,
          o =
            this._boundingRect.document.left +
            this.relativeTranslation.x +
            this._boundingRect.document.width -
            t,
          r =
            this._boundingRect.document.top +
            this.relativeTranslation.y +
            this._boundingRect.document.height -
            e,
          n = this._boundingRect.document.left + this.relativeTranslation.x + t,
          a = this;
        o < -0 ||
        n > this._wrapper._boundingRect.width + 0 ||
        r < -0 ||
        i > this._wrapper._boundingRect.height + 0
          ? this._shouldDraw &&
            ((this._shouldDraw = !1),
            setTimeout(function () {
              a._onLeaveViewCallback && a._onLeaveViewCallback();
            }, 0))
          : (this._shouldDraw ||
              setTimeout(function () {
                a._onReEnterViewCallback && a._onReEnterViewCallback();
              }, 0),
            (this._shouldDraw = !0));
      }),
      (o.Plane.prototype._applyCSSPositions = function () {
        this._setComputedSizes(), this._setTranslation();
      }),
      (o.Plane.prototype.updatePosition = function () {
        this._setDocumentSizes(), this._applyCSSPositions();
      }),
      (o.Plane.prototype.enableDepthTest = function (t) {
        this._shouldUseDepthTest = t;
      }),
      (o.Plane.prototype.moveToFront = function () {
        this.enableDepthTest(!1);
        for (var t = this._wrapper._drawStack, e = 0; e < t.length; e++)
          this.index === t[e] && t.splice(e, 1);
        t.push(this.index);
      }),
      (o.Plane.prototype.planeResize = function () {
        this.setPerspective(this._fov, 0.1, 2 * this._fov),
          this._setDocumentSizes(),
          this._setComputedSizes(),
          this._applyCSSPositions();
        for (var t = 0; t < this.textures.length; t++)
          this.textures[t]._adjustTextureSize();
      }),
      (o.Plane.prototype.createTexture = function (t) {
        return new o.Texture(this, { index: this.textures.length, sampler: t });
      }),
      (o.Plane.prototype.loadSources = function (t) {
        for (var e = 0; e < t.length; e++) this.loadSource(t[e]);
      }),
      (o.Plane.prototype.loadSource = function (t) {
        "IMG" === t.tagName.toUpperCase()
          ? this.loadImage(t)
          : "VIDEO" === t.tagName.toUpperCase()
          ? this.loadVideo(t)
          : "CANVAS" === t.tagName.toUpperCase()
          ? this.loadCanvas(t)
          : this._wrapper.productionMode ||
            console.warn(
              "this HTML tag could not be converted into a texture:",
              t.tagName
            );
      }),
      (o.Plane.prototype.loadImage = function (t) {
        var e = t;
        (e.crossOrigin = this.crossOrigin || "anonymous"),
          (e.sampler = t.getAttribute("data-sampler") || null);
        var i = this.createTexture(e.sampler);
        (i._onSourceLoadedHandler = i._onSourceLoaded.bind(i, e)),
          e.addEventListener("load", i._onSourceLoadedHandler, !1),
          e.complete && i._onSourceLoaded(e),
          this.images.push(e);
      }),
      (o.Plane.prototype.loadVideo = function (t) {
        var e = t;
        (e.preload = !0),
          (e.muted = !0),
          (e.loop = !0),
          (e.sampler = t.getAttribute("data-sampler") || null),
          (e.crossOrigin = this.crossOrigin || "anonymous");
        var i = this.createTexture(e.sampler);
        (i._onSourceLoadedHandler = i._onVideoLoadedData.bind(i, e)),
          e.addEventListener("canplaythrough", i._onSourceLoadedHandler, !1),
          e.readyState >= e.HAVE_FUTURE_DATA && i._onSourceLoaded(e),
          e.load(),
          this.videos.push(e);
      }),
      (o.Plane.prototype.loadCanvas = function (t) {
        var e = t;
        e.sampler = t.getAttribute("data-sampler") || null;
        var i = this.createTexture(e.sampler);
        this.canvases.push(e), i._onSourceLoaded(e);
      }),
      (o.Plane.prototype.loadImages = function (t) {
        for (var e = 0; e < t.length; e++) this.loadImage(t[e]);
      }),
      (o.Plane.prototype.loadVideos = function (t) {
        for (var e = 0; e < t.length; e++) this.loadVideo(t[e]);
      }),
      (o.Plane.prototype.loadCanvases = function (t) {
        for (var e = 0; e < t.length; e++) this.loadCanvas(t[e]);
      }),
      (o.Plane.prototype.playVideos = function () {
        for (var t = 0; t < this.textures.length; t++) {
          var e = this.textures[t];
          if ("video" === e.type) {
            var i = e.source.play(),
              o = this;
            void 0 !== i &&
              i.catch(function (t) {
                o._wrapper.productionMode ||
                  console.warn("Could not play the video : ", t);
              });
          }
        }
      }),
      (o.Plane.prototype._bindPlaneBuffers = function () {
        var t = this._wrapper.glContext;
        t.bindBuffer(t.ARRAY_BUFFER, this._geometry.bufferInfos.id),
          t.vertexAttribPointer(
            this._attributes.vertexPosition.location,
            this._geometry.bufferInfos.itemSize,
            t.FLOAT,
            !1,
            0,
            0
          ),
          t.enableVertexAttribArray(this._attributes.vertexPosition.location),
          t.bindBuffer(t.ARRAY_BUFFER, this._material.bufferInfos.id),
          t.vertexAttribPointer(
            this._attributes.textureCoord.location,
            this._material.bufferInfos.itemSize,
            t.FLOAT,
            !1,
            0,
            0
          ),
          t.enableVertexAttribArray(this._attributes.textureCoord.location);
      }),
      (o.Plane.prototype._bindPlaneTexture = function (t) {
        var e = this._wrapper.glContext;
        e.activeTexture(e.TEXTURE0 + t.index),
          e.bindTexture(e.TEXTURE_2D, t._sampler.texture);
      }),
      (o.Plane.prototype._drawPlane = function () {
        var t = this._wrapper.glContext;
        if (
          this._canDraw &&
          (t.useProgram(this._program),
          this._onRenderCallback && this._onRenderCallback(),
          this._updateUniforms(),
          this._shouldDraw)
        ) {
          for (var e = 0; e < this.textures.length; e++)
            this.textures[e]._drawTexture();
          this._bindPlaneBuffers(),
            t.drawArrays(
              t.TRIANGLES,
              0,
              this._geometry.bufferInfos.numberOfItems
            );
        }
      }),
      (o.Plane.prototype._dispose = function () {
        for (
          var t = this._wrapper.glContext, e = 0;
          e < this.textures.length;
          e++
        )
          this.textures[e]._dispose();
        (this.textures = null),
          t &&
            (this._geometry &&
              (t.bindBuffer(t.ARRAY_BUFFER, this._geometry.bufferInfos.id),
              t.bufferData(t.ARRAY_BUFFER, 1, t.STATIC_DRAW),
              t.deleteBuffer(this._geometry.bufferInfos.id),
              (this._geometry = null)),
            this._material &&
              (t.bindBuffer(t.ARRAY_BUFFER, this._material.bufferInfos.id),
              t.bufferData(t.ARRAY_BUFFER, 1, t.STATIC_DRAW),
              t.deleteBuffer(this._material.bufferInfos.id),
              (this._material = null)),
            this._shaders &&
              (t.deleteShader(this._shaders.fragmentShader),
              t.deleteShader(this._shaders.vertexShader),
              (this._shaders = null)),
            this._program &&
              (t.deleteProgram(this._program), (this._program = null)));
      }),
      (o.Plane.prototype.onLoading = function (t) {
        return t && (this._onPlaneLoadingCallback = t), this;
      }),
      (o.Plane.prototype.onReady = function (t) {
        return t && (this._onReadyCallback = t), this;
      }),
      (o.Plane.prototype.onReEnterView = function (t) {
        return t && (this._onReEnterViewCallback = t), this;
      }),
      (o.Plane.prototype.onLeaveView = function (t) {
        return t && (this._onLeaveViewCallback = t), this;
      }),
      (o.Plane.prototype.onRender = function (t) {
        return t && (this._onRenderCallback = t), this;
      }),
      (o.Texture = function (t, e) {
        return (
          (this._plane = t),
          (this._wrapper = t._wrapper),
          (this._sampler = { name: e.sampler || null }),
          (this._willUpdate = !1),
          (this.shouldUpdate = !1),
          (this.scale = { x: 1, y: 1 }),
          this._init(),
          t.textures.push(this),
          this
        );
      }),
      (o.Texture.prototype._init = function () {
        var t = this._wrapper.glContext,
          e = this._plane;
        (this._sampler.texture = t.createTexture()),
          t.bindTexture(t.TEXTURE_2D, this._sampler.texture),
          t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !1),
          t.texImage2D(
            t.TEXTURE_2D,
            0,
            t.RGBA,
            1,
            1,
            0,
            t.RGBA,
            t.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 255])
          ),
          (this.index = e.textures.length),
          (this._sourceLoaded = !1),
          t.useProgram(e._program);
        var i = this._sampler.name || "uSampler" + this.index;
        (this._sampler.location = t.getUniformLocation(e._program, i)),
          t.uniform1i(this._sampler.location, this.index);
        var o = this._sampler.name
          ? this._sampler.name + "Matrix"
          : "uTextureMatrix" + this.index;
        this._textureMatrix = {
          name: o,
          matrix: null,
          location: t.getUniformLocation(this._plane._program, o),
        };
      }),
      (o.Texture.prototype.setSource = function (t) {
        (this.source = t),
          "IMG" === t.tagName.toUpperCase()
            ? (this.type = "image")
            : "VIDEO" === t.tagName.toUpperCase()
            ? ((this.type = "video"), (this.shouldUpdate = !0))
            : "CANVAS" === t.tagName.toUpperCase()
            ? ((this.type = "canvas"),
              (this._willUpdate = !0),
              (this.shouldUpdate = !0))
            : this._wrapper.productionMode ||
              console.warn(
                "this HTML tag could not be converted into a texture:",
                t.tagName
              ),
          (this._size = {
            width: this.source.width || this.source.videoWidth,
            height: this.source.height || this.source.videoHeight,
          });
        var e = this._wrapper.glContext;
        e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0),
          e.bindTexture(e.TEXTURE_2D, this._sampler.texture),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
          e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR),
          this._adjustTextureSize(),
          e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t);
      }),
      (o.Texture.prototype._update = function () {
        var t = this._wrapper.glContext;
        t.texImage2D(
          t.TEXTURE_2D,
          0,
          t.RGBA,
          t.RGBA,
          t.UNSIGNED_BYTE,
          this.source
        );
      }),
      (o.Texture.prototype._getSizes = function () {
        var t = this._plane._boundingRect.document.width * this._plane.scale.x,
          e = this._plane._boundingRect.document.height * this._plane.scale.y,
          i = this._size.width,
          o = this._size.height,
          r = i / o,
          n = t / e,
          a = 0,
          s = 0;
        return (
          n > r
            ? (s = Math.min(0, e - t * (1 / r)))
            : n < r && (a = Math.min(0, t - e * r)),
          {
            planeWidth: t,
            planeHeight: e,
            sourceWidth: i,
            sourceHeight: o,
            xOffset: a,
            yOffset: s,
          }
        );
      }),
      (o.Texture.prototype.setScale = function (t, e) {
        (t = parseFloat(t) || 1),
          (t = Math.max(t, 0.001)),
          (e = parseFloat(e) || 1),
          (e = Math.max(e, 0.001)),
          (this.scale = { x: t, y: e }),
          this._adjustTextureSize();
      }),
      (o.Texture.prototype._adjustTextureSize = function () {
        if (this.source) {
          var t = this._getSizes();
          this._updateTextureMatrix(t);
        }
      }),
      (o.Texture.prototype._updateTextureMatrix = function (t) {
        var e = {
          x: t.planeWidth / (t.planeWidth - t.xOffset),
          y: t.planeHeight / (t.planeHeight - t.yOffset),
        };
        (e.x /= this.scale.x), (e.y /= this.scale.y);
        var i = new Float32Array([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          (1 - e.x) / 2,
          (1 - e.y) / 2,
          0,
          1,
        ]);
        (this._textureMatrix.matrix = this._plane._scaleMatrix(i, e.x, e.y, 1)),
          this._wrapper.glContext.useProgram(this._plane._program),
          this._wrapper.glContext.uniformMatrix4fv(
            this._textureMatrix.location,
            !1,
            this._textureMatrix.matrix
          );
      }),
      (o.Texture.prototype._onSourceLoaded = function (t) {
        this._plane._loadingManager.sourcesLoaded++, this.setSource(t);
        var e = this;
        this._sourceLoaded ||
          setTimeout(function () {
            e._plane._onPlaneLoadingCallback &&
              e._plane._onPlaneLoadingCallback();
          }, 0),
          (this._sourceLoaded = !0);
      }),
      (o.Texture.prototype._onVideoLoadedData = function (t) {
        this._sourceLoaded || this._onSourceLoaded(t);
      }),
      (o.Texture.prototype._drawTexture = function () {
        this._plane._bindPlaneTexture(this),
          "video" === this.type &&
            this.source &&
            this.source.readyState >= this.source.HAVE_CURRENT_DATA &&
            (this._willUpdate = !this._willUpdate),
          this._willUpdate && this.shouldUpdate && this._update();
      }),
      (o.Texture.prototype._dispose = function () {
        "video" === this.type
          ? (this.source.removeEventListener(
              "canplaythrough",
              this._onSourceLoadedHandler,
              !1
            ),
            this.source.pause(),
            this.source.removeAttribute("src"),
            this.source.load(),
            this.source.updateInterval &&
              clearInterval(this.source.updateInterval))
          : "canvas" === this.type
          ? (this.source.width = this.source.width)
          : "image" === this.type &&
            this.source.removeEventListener(
              "load",
              this._onSourceLoadedHandler,
              !1
            ),
          (this.source = null);
        var t = this._wrapper.glContext;
        t &&
          (t.activeTexture(t.TEXTURE0 + this.index),
          t.bindTexture(t.TEXTURE_2D, null),
          t.deleteTexture(this._sampler.texture)),
          this._plane._loadingManager.sourcesLoaded--;
      }),
      (window.onload = function () {
        var t = { x: 0, y: 0 },
          e = { x: 0, y: 0 },
          i = 0,
          r = new o("canvas");
        r.onError(function () {
          document.body.classList.add("no-curtains");
        });
        var n = document.getElementsByClassName("curtain"),
          a = window.devicePixelRatio ? window.devicePixelRatio : 1,
          s = {
            widthSegments: 20,
            heightSegments: 20,
            uniforms: {
              resolution: {
                name: "uResolution",
                type: "2f",
                value: [a * n[0].clientWidth, a * n[0].clientHeight],
              },
              time: { name: "uTime", type: "1f", value: 0 },
              mousePosition: {
                name: "uMousePosition",
                type: "2f",
                value: [t.x, t.y],
              },
              mouseMoveStrength: {
                name: "uMouseMoveStrength",
                type: "1f",
                value: 0,
              },
            },
          },
          h = r.addPlane(n[0], s);
        function l(o, r) {
          -1e5 != t.x && -1e5 != t.y && ((e.x = t.x), (e.y = t.y)),
            o.targetTouches
              ? ((t.x = o.targetTouches[0].clientX),
                (t.y = o.targetTouches[0].clientY))
              : ((t.x = o.clientX), (t.y = o.clientY));
          var n = r.mouseToPlaneCoords(t.x, t.y);
          if (((r.uniforms.mousePosition.value = [n.x, n.y]), e.x && e.y)) {
            var a =
              Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2)) / 30;
            (a = Math.min(4, a)) >= i && ((i = a), (r.uniforms.time.value = 0));
          }
        }
        h &&
          h
            .onReady(function () {
              h.setPerspective(35);
              var t = document.getElementById("page-wrap");
              t.addEventListener("mousemove", function (t) {
                l(t, h);
              }),
                t.addEventListener("touchmove", function (t) {
                  l(t, h);
                }),
                window.addEventListener("resize", function () {
                  h.uniforms.resolution.value = [
                    a * n[0].clientWidth,
                    a * n[0].clientHeight,
                  ];
                });
            })
            .onRender(function () {
              h.uniforms.time.value++,
                (h.uniforms.mouseMoveStrength.value = i),
                (i = Math.max(0, 0.995 * i));
            });
      });
  },
]);
