// ============================================================
//  landmark.js — Milan 3D Map (v5)
//  Physically-based materials (MeshStandardMaterial)
//  Realistic buildings + latex balloons
// ============================================================
(function () {

  var SKY_TOP    = 0xC9D8E8;
  var SKY_BOTTOM = 0xD6CCB8;
  var TWEEN_MS   = 950;

  // Floor
  var FLOOR_W = 36, FLOOR_H = 36;
  var LNG_MIN = 9.065, LNG_MAX = 9.290;
  var LAT_MIN = 45.390, LAT_MAX = 45.540;

  // Building
  var BUILDING_W       = 0.32;
  var HEIGHT_SCALE     = 0.55;

  // Balloon
  var BALLOON_R            = 0.32;
  var BALLOON_GAP          = 0.72;
  var LISTINGS_PER_BALLOON = 8;
  var MAX_BALLOONS         = 10;

  var scene, camera, renderer, rafId, clock;
  var allData = {}, meshMap = {};
  var isDragging = false, prevMouse = { x: 0, y: 0 };
  var camAngle = { theta: 0.50, phi: 0.82 };
  var camRadius = 30;

  function geoToXZ(lng, lat) {
    return {
      x: ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN) - 0.5) * FLOOR_W,
      z: ((1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) - 0.5) * FLOOR_H
    };
  }

  // ── Bootstrap ──────────────────────────────────────────────
  function bootstrap() {
    var container = document.getElementById('landmark-canvas');
    if (!container) return;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(SKY_BOTTOM);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(SKY_BOTTOM);
    scene.fog = new THREE.FogExp2(SKY_BOTTOM, 0.014);

    // Camera
    var aspect = container.clientWidth / container.clientHeight;
    var f = 18;
    camera = new THREE.OrthographicCamera(-f*aspect, f*aspect, f, -f, 0.1, 400);
    positionCamera();

    setupLights();
    clock = new THREE.Clock();

    // Load texture
    new THREE.TextureLoader().load(
      'assets/milan_map.png',
      function(tex) { buildFloor(tex); loadData(); },
      undefined,
      function()    { buildFloor(null); loadData(); }
    );

    bindControls(container);
    window.addEventListener('resize', onResize);
  }

  // ── Lights ────────────────────────────────────────────────
  function setupLights() {
    // Sky hemisphere light — warm ground / cool sky
    var hemi = new THREE.HemisphereLight(0xC8DEFF, 0xD4B896, 0.8);
    scene.add(hemi);

    // Main directional sun
    var sun = new THREE.DirectionalLight(0xFFF5E8, 2.8);
    sun.position.set(22, 45, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(4096, 4096);
    sun.shadow.camera.left = -28; sun.shadow.camera.right = 28;
    sun.shadow.camera.top  =  28; sun.shadow.camera.bottom = -28;
    sun.shadow.camera.near = 1;   sun.shadow.camera.far = 120;
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    // Cool rim light from opposite side
    var rim = new THREE.DirectionalLight(0x9BB8D4, 0.6);
    rim.position.set(-18, 20, -15);
    scene.add(rim);
  }

  // ── Floor ─────────────────────────────────────────────────
  function buildFloor(tex) {
    var mat = tex
      ? new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, metalness: 0.0 })
      : new THREE.MeshStandardMaterial({ color: 0xCCBFA8, roughness: 0.9 });

    var floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_W, FLOOR_H), mat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Thick base rim
    var base = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_W + 1, 0.22, FLOOR_H + 1),
      new THREE.MeshStandardMaterial({ color: 0xB0A080, roughness: 0.8 })
    );
    base.position.y = -0.12;
    base.receiveShadow = true;
    scene.add(base);
  }

  // ── Load data ─────────────────────────────────────────────
  function loadData() {
    fetch('milan_data.json')
      .then(function(r) { return r.json(); })
      .then(function(json) {
        json.neighbourhoods.forEach(function(n) {
          allData[n.name] = { lat: n.lat, lng: n.lng, by_year: n.by_year };
        });
        buildBuildings();
        placeDuomoMarker();
        setYear(2018);
        animate();
      });
  }

  // ── Buildings — realistic terracotta blocks ────────────────
  function buildBuildings() {
    Object.entries(allData).forEach(function(entry) {
      var name = entry[0], data = entry[1];
      var p    = geoToXZ(data.lng, data.lat);

      // Main body
      var bodyGeo = new THREE.BoxGeometry(BUILDING_W, 1, BUILDING_W);
      var bodyMat = new THREE.MeshStandardMaterial({
        color:     0x8B3A2F,
        roughness: 0.75,
        metalness: 0.05,
      });
      var body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow    = true;
      body.receiveShadow = true;
      body.position.set(p.x, 0.5, p.z);
      scene.add(body);

      // Rooftop cap (slightly lighter, flat)
      var capGeo = new THREE.BoxGeometry(BUILDING_W + 0.04, 0.06, BUILDING_W + 0.04);
      var capMat = new THREE.MeshStandardMaterial({
        color:     0xA04840,
        roughness: 0.6,
        metalness: 0.1,
      });
      var cap = new THREE.Mesh(capGeo, capMat);
      cap.castShadow = true;
      cap.position.set(p.x, 1.03, p.z);   // sits on top; updated in setYear
      scene.add(cap);

      meshMap[name] = {
        building: body,
        cap:      cap,
        balloons: [],
        wires:    [],
        px: p.x,
        pz: p.z
      };
    });
  }

  // ── Duomo marker ──────────────────────────────────────────
  function placeDuomoMarker() {
    var p = geoToXZ(9.18706, 45.46255);

    var cGeo = new THREE.ConeGeometry(0.28, 0.90, 8);
    var cMat = new THREE.MeshStandardMaterial({
      color: 0xF4B82D, roughness: 0.3, metalness: 0.6
    });
    var cone = new THREE.Mesh(cGeo, cMat);
    cone.position.set(p.x, 0.45, p.z);
    cone.castShadow = true;
    scene.add(cone);

    // Animated pulse ring (updated in animate())
    var rGeo = new THREE.RingGeometry(0.35, 0.50, 32);
    var rMat = new THREE.MeshBasicMaterial({
      color: 0xF4B82D, side: THREE.DoubleSide, transparent: true, opacity: 0.5
    });
    var ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, 0.07, p.z);
    ring.userData.isDuomoRing = true;
    scene.add(ring);

    // Label
    var cv = document.createElement('canvas');
    cv.width = 220; cv.height = 54;
    var ctx = cv.getContext('2d');
    ctx.fillStyle = '#F4B82D';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 5;
    ctx.fillText('Duomo ★', 6, 38);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(cv), transparent: true
    }));
    sprite.scale.set(2.8, 0.70, 1);
    sprite.position.set(p.x, 2.4, p.z);
    scene.add(sprite);
  }

  // ── Balloon — latex look ───────────────────────────────────
  function makeBalloon() {
    // Slightly elongated sphere for latex balloon shape
    var geo = new THREE.SphereGeometry(BALLOON_R, 18, 14);

    // Squish vertically to make it more balloon-like
    var pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var y = pos.getY(i);
      // Narrow the bottom, widen the top slightly
      var factor = 0.88 + 0.22 * ((y / BALLOON_R + 1) / 2);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
      // Slightly elongate vertically
      pos.setY(i, y * 1.18);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    var mat = new THREE.MeshStandardMaterial({
      color:     0xFF5A5F,
      roughness: 0.25,    // shiny like latex
      metalness: 0.0,
      envMapIntensity: 0.5,
    });
    return new THREE.Mesh(geo, mat);
  }

  // ── Year update ───────────────────────────────────────────
  function setYear(year) {
    var key = String(year);
    Object.entries(allData).forEach(function(entry) {
      var name = entry[0], data = entry[1];
      var yd   = data.by_year[key] || {};
      var rent = yd.rent_mid   || 0;
      var n    = yd.n_listings || 0;
      var targetH = Math.max(rent * HEIGHT_SCALE, 0.06);
      var e = meshMap[name];
      if (!e) return;

      var b   = e.building;
      var obj = { h: b.scale.y, y: b.position.y };
      new TWEEN.Tween(obj)
        .to({ h: targetH, y: targetH / 2 }, TWEEN_MS)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(function() {
          b.scale.y    = obj.h;
          b.position.y = obj.y;
          // Keep cap on top
          if (e.cap) e.cap.position.y = obj.h + 0.03;
        })
        .start();

      clearBalloons(name);
      setTimeout(function() { spawnBalloons(name, n, targetH); }, TWEEN_MS * 0.65);
    });
  }

  function clearBalloons(name) {
    var e = meshMap[name];
    e.balloons.forEach(function(b) { scene.remove(b); });
    e.wires.forEach(function(w)    { scene.remove(w); });
    e.balloons = []; e.wires = [];
  }

  function spawnBalloons(name, count, buildingH) {
    if (count === 0) return;
    var e      = meshMap[name];
    var visual = Math.min(Math.ceil(count / LISTINGS_PER_BALLOON), MAX_BALLOONS);

    for (var i = 0; i < visual; i++) {
      var by = buildingH + BALLOON_R * 1.2 + 0.2 + i * BALLOON_GAP;

      var balloon = makeBalloon();
      balloon.position.set(e.px, by, e.pz);
      balloon.userData.baseY = by;
      balloon.userData.phase = Math.random() * Math.PI * 2;
      balloon.castShadow = true;
      scene.add(balloon);
      e.balloons.push(balloon);

      // Thin string
      var fromY = i === 0
        ? buildingH
        : buildingH + BALLOON_R * 1.2 + 0.2 + (i - 1) * BALLOON_GAP - BALLOON_R * 1.18;
      var wGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(e.px, fromY, e.pz),
        new THREE.Vector3(e.px, by - BALLOON_R * 1.18, e.pz)
      ]);
      var wire = new THREE.Line(wGeo,
        new THREE.LineBasicMaterial({ color: 0xCCCCCC }));
      scene.add(wire);
      e.wires.push(wire);
    }
  }

  // ── Render loop ───────────────────────────────────────────
  function animate() {
    rafId = requestAnimationFrame(animate);
    TWEEN.update();
    var t = clock.getElapsedTime();

    // Float balloons
    Object.values(meshMap).forEach(function(e) {
      e.balloons.forEach(function(b) {
        b.position.y = b.userData.baseY
          + Math.sin(t * 1.1 + b.userData.phase) * 0.11
          + Math.sin(t * 0.38 + b.userData.phase * 0.7) * 0.05;
        // Gentle sway
        b.position.x = e.px + Math.sin(t * 0.6 + b.userData.phase) * 0.04;
        b.position.z = e.pz + Math.cos(t * 0.5 + b.userData.phase) * 0.04;
      });
    });

    // Pulse Duomo ring
    scene.children.forEach(function(obj) {
      if (obj.userData.isDuomoRing) {
        obj.material.opacity = 0.3 + 0.35 * Math.abs(Math.sin(t * 1.5));
        var s = 1 + 0.15 * Math.abs(Math.sin(t * 1.5));
        obj.scale.set(s, s, 1);
      }
    });

    renderer.render(scene, camera);
  }

  // ── Camera & controls ─────────────────────────────────────
  function positionCamera() {
    var t = camAngle.theta, p = camAngle.phi;
    camera.position.set(
      camRadius * Math.sin(p) * Math.sin(t),
      camRadius * Math.cos(t),
      camRadius * Math.sin(p) * Math.cos(t)
    );
    camera.lookAt(0, 0, 0);
  }

  function bindControls(container) {
    container.addEventListener('mousedown', function(e) {
      isDragging = true; prevMouse = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', function() {
      isDragging = false; container.style.cursor = 'grab';
    });
    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      camAngle.phi   += (e.clientX - prevMouse.x) * 0.006;
      camAngle.theta  = Math.max(0.18, Math.min(1.25,
        camAngle.theta + (e.clientY - prevMouse.y) * 0.005));
      prevMouse = { x: e.clientX, y: e.clientY };
      positionCamera(); camera.updateProjectionMatrix();
    });
    container.addEventListener('wheel', function(e) {
      e.preventDefault();
      camRadius = Math.max(10, Math.min(55, camRadius + e.deltaY * 0.04));
      positionCamera(); camera.updateProjectionMatrix();
    }, { passive: false });
  }

  function onResize() {
    var c = renderer.domElement.parentElement;
    var f = 18, a = c.clientWidth / c.clientHeight;
    camera.left = -f*a; camera.right = f*a;
    camera.top = f; camera.bottom = -f;
    camera.updateProjectionMatrix();
    renderer.setSize(c.clientWidth, c.clientHeight);
  }

  window.LandmarkMap = { setYear: setYear };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();