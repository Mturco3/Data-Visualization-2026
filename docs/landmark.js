// Milan 3D map: palace height = OMI rent, balloons = yearly review volume.
(function () {
  var SKY_BOTTOM = 0xD6CCB8;
  var TWEEN_MS = 950;

  var FLOOR_W = 36;
  var FLOOR_H = 36;
  var LNG_MIN = 9.065;
  var LNG_MAX = 9.290;
  var LAT_MIN = 45.390;
  var LAT_MAX = 45.540;

  var BUILDING_W = 0.32;
  var HEIGHT_SCALE = 0.55;
  var BALLOON_R = 0.32;
  var BALLOON_GAP = 0.72;
  var REVIEWS_PER_BALLOON = 80;
  var MAX_BALLOONS = 12;

  var scene, camera, renderer, clock;
  var allData = {};
  var meshMap = {};
  var camAngle = { theta: 0.50, phi: 0.82 };
  var camRadius = 30;

  function geoToXZ(lng, lat) {
    return {
      x: ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN) - 0.5) * FLOOR_W,
      z: ((1 - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) - 0.5) * FLOOR_H
    };
  }

  function bootstrap() {
    var container = document.getElementById('landmark-canvas');
    if (!container || !window.THREE || !window.TWEEN) return;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = false;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(SKY_BOTTOM);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(SKY_BOTTOM);
    scene.fog = new THREE.FogExp2(SKY_BOTTOM, 0.014);

    var aspect = container.clientWidth / container.clientHeight;
    var frustum = 18;
    camera = new THREE.OrthographicCamera(-frustum * aspect, frustum * aspect, frustum, -frustum, 0.1, 400);
    positionCamera();

    setupLights();
    clock = new THREE.Clock();
    animate();

    new THREE.TextureLoader().load(
      'assets/milan_map.png',
      function (texture) { buildFloor(texture); loadData(); },
      undefined,
      function () { buildFloor(null); loadData(); }
    );

    bindControls(container);
    wireYearButtons();
    window.addEventListener('resize', onResize);
  }

  function setupLights() {
    scene.add(new THREE.HemisphereLight(0xC8DEFF, 0xD4B896, 0.8));

    var sun = new THREE.DirectionalLight(0xFFF5E8, 2.8);
    sun.position.set(22, 45, 18);
    scene.add(sun);

    var rim = new THREE.DirectionalLight(0x9BB8D4, 0.6);
    rim.position.set(-18, 20, -15);
    scene.add(rim);
  }

  function buildFloor(texture) {
    var mat = texture
      ? new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9, metalness: 0.0 })
      : new THREE.MeshStandardMaterial({ color: 0xCCBFA8, roughness: 0.9 });

    var floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_W, FLOOR_H), mat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    var base = new THREE.Mesh(
      new THREE.BoxGeometry(FLOOR_W + 1, 0.22, FLOOR_H + 1),
      new THREE.MeshStandardMaterial({ color: 0xB0A080, roughness: 0.8 })
    );
    base.position.y = -0.12;
    scene.add(base);
  }

  function loadData() {
    if (window.MILAN_DATA) {
      hydrateData(window.MILAN_DATA);
      return;
    }

    fetch('milan_data.json')
      .then(function (response) { return response.json(); })
      .then(hydrateData)
      .catch(function (error) {
        console.error('Could not load Milan 3D map data.', error);
      });
  }

  function hydrateData(json) {
    if (!json || !Array.isArray(json.neighbourhoods)) return;

    json.neighbourhoods.forEach(function (n) {
      allData[n.name] = { lat: n.lat, lng: n.lng, by_year: n.by_year };
    });
    buildBuildings();
    placeDuomoMarker();
    setYear(getActiveYear());
  }

  function buildBuildings() {
    Object.entries(allData).forEach(function (entry) {
      var name = entry[0];
      var data = entry[1];
      var p = geoToXZ(data.lng, data.lat);

      var body = new THREE.Mesh(
        new THREE.BoxGeometry(BUILDING_W, 1, BUILDING_W),
        new THREE.MeshStandardMaterial({ color: 0x8B3A2F, roughness: 0.75, metalness: 0.05 })
      );
      body.position.set(p.x, 0.5, p.z);
      scene.add(body);

      var cap = new THREE.Mesh(
        new THREE.BoxGeometry(BUILDING_W + 0.04, 0.06, BUILDING_W + 0.04),
        new THREE.MeshStandardMaterial({ color: 0xA04840, roughness: 0.6, metalness: 0.1 })
      );
      cap.position.set(p.x, 1.03, p.z);
      scene.add(cap);

      meshMap[name] = {
        building: body,
        cap: cap,
        balloons: [],
        wires: [],
        px: p.x,
        pz: p.z
      };
    });
  }

  function placeDuomoMarker() {
    var p = geoToXZ(9.18706, 45.46255);
    var cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.90, 8),
      new THREE.MeshStandardMaterial({ color: 0xF4B82D, roughness: 0.3, metalness: 0.6 })
    );
    cone.position.set(p.x, 0.45, p.z);
    scene.add(cone);

    var ring = new THREE.Mesh(
      new THREE.RingGeometry(0.35, 0.50, 32),
      new THREE.MeshBasicMaterial({ color: 0xF4B82D, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, 0.07, p.z);
    ring.userData.isDuomoRing = true;
    scene.add(ring);
  }

  function makeBalloon() {
    var geo = new THREE.SphereGeometry(BALLOON_R, 18, 14);
    var pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var y = pos.getY(i);
      var factor = 0.88 + 0.22 * ((y / BALLOON_R + 1) / 2);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
      pos.setY(i, y * 1.18);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    return new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: 0xFF5A5F, roughness: 0.25, metalness: 0.0, envMapIntensity: 0.5 })
    );
  }

  function setYear(year) {
    var key = String(year);
    var display = document.getElementById('landmark-year-display');
    if (display) display.textContent = key;

    Object.entries(allData).forEach(function (entry) {
      var name = entry[0];
      var data = entry[1];
      var yd = data.by_year[key] || {};
      var rent = yd.rent_mid || 0;
      var reviewCount = yd.review_count || 0;
      var targetH = Math.max(rent * HEIGHT_SCALE, 0.06);
      var e = meshMap[name];
      if (!e) return;

      var b = e.building;
      var obj = { h: b.scale.y, y: b.position.y };
      new TWEEN.Tween(obj)
        .to({ h: targetH, y: targetH / 2 }, TWEEN_MS)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(function () {
          b.scale.y = obj.h;
          b.position.y = obj.y;
          if (e.cap) e.cap.position.y = obj.h + 0.03;
        })
        .start();

      clearBalloons(name);
      setTimeout(function () { spawnBalloons(name, reviewCount, targetH); }, TWEEN_MS * 0.65);
    });
  }

  function clearBalloons(name) {
    var e = meshMap[name];
    e.balloons.forEach(function (b) { scene.remove(b); });
    e.wires.forEach(function (w) { scene.remove(w); });
    e.balloons = [];
    e.wires = [];
  }

  function spawnBalloons(name, count, buildingH) {
    if (count === 0) return;
    var e = meshMap[name];
    var visual = Math.min(Math.ceil(count / REVIEWS_PER_BALLOON), MAX_BALLOONS);

    for (var i = 0; i < visual; i++) {
      var by = buildingH + BALLOON_R * 1.2 + 0.2 + i * BALLOON_GAP;
      var balloon = makeBalloon();
      balloon.position.set(e.px, by, e.pz);
      balloon.userData.baseY = by;
      balloon.userData.phase = Math.random() * Math.PI * 2;
      scene.add(balloon);
      e.balloons.push(balloon);

      var fromY = i === 0
        ? buildingH
        : buildingH + BALLOON_R * 1.2 + 0.2 + (i - 1) * BALLOON_GAP - BALLOON_R * 1.18;
      var wire = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(e.px, fromY, e.pz),
          new THREE.Vector3(e.px, by - BALLOON_R * 1.18, e.pz)
        ]),
        new THREE.LineBasicMaterial({ color: 0xCCCCCC })
      );
      scene.add(wire);
      e.wires.push(wire);
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    var t = clock.getElapsedTime();

    Object.values(meshMap).forEach(function (e) {
      e.balloons.forEach(function (b) {
        b.position.y = b.userData.baseY
          + Math.sin(t * 1.1 + b.userData.phase) * 0.11
          + Math.sin(t * 0.38 + b.userData.phase * 0.7) * 0.05;
        b.position.x = e.px + Math.sin(t * 0.6 + b.userData.phase) * 0.04;
        b.position.z = e.pz + Math.cos(t * 0.5 + b.userData.phase) * 0.04;
      });
    });

    scene.children.forEach(function (obj) {
      if (obj.userData.isDuomoRing) {
        obj.material.opacity = 0.3 + 0.35 * Math.abs(Math.sin(t * 1.5));
        var s = 1 + 0.15 * Math.abs(Math.sin(t * 1.5));
        obj.scale.set(s, s, 1);
      }
    });

    renderer.render(scene, camera);
  }

  function positionCamera() {
    var t = camAngle.theta;
    var p = camAngle.phi;
    camera.position.set(
      camRadius * Math.sin(p) * Math.sin(t),
      camRadius * Math.cos(t),
      camRadius * Math.sin(p) * Math.cos(t)
    );
    camera.lookAt(0, 0, 0);
  }

  function bindControls(container) {
    container.addEventListener('wheel', function (e) {
      e.preventDefault();
      camRadius = Math.max(10, Math.min(55, camRadius + e.deltaY * 0.04));
      positionCamera();
      camera.updateProjectionMatrix();
    }, { passive: false });
  }

  function wireYearButtons() {
    var buttons = document.querySelectorAll('.landmark-year-button');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var year = parseInt(button.getAttribute('data-year'), 10);
        buttons.forEach(function (b) { b.classList.remove('active'); });
        button.classList.add('active');
        setYear(year);
      });
    });
  }

  function getActiveYear() {
    var active = document.querySelector('.landmark-year-button.active');
    return active ? parseInt(active.getAttribute('data-year'), 10) : 2018;
  }

  function onResize() {
    var c = renderer.domElement.parentElement;
    var frustum = 18;
    var aspect = c.clientWidth / c.clientHeight;
    camera.left = -frustum * aspect;
    camera.right = frustum * aspect;
    camera.top = frustum;
    camera.bottom = -frustum;
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
