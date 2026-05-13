// ============================================================
// MAP — Leaflet: render peta, marker, mode gambar
// ============================================================
let map;
let buildingMarkers = [], roadLines = [], zonePolygons = [];
let drawingMode = null, drawingPoints = [], tempLayer = null;

// ---- HELPER WARNA & IKON ----
function getColorByJenis(jenis) {
    const colors = {
        perkuliahan : '#3498db',
        laboratorium: '#e74c3c',
        administrasi: '#1abc9c',
        fasilitas   : '#9b59b6',
        parkir      : '#95a5a6',
        hijau       : '#2ecc71',
        batas       : '#f1c40f'
    };
    return colors[jenis] || '#95a5a6';
}

function getJenisLabel(jenis) {
    const labels = {
        perkuliahan : '🏛️ Perkuliahan',
        laboratorium: '🔬 Laboratorium',
        administrasi: '📋 Administrasi',
        fasilitas   : '☕ Fasilitas Umum'
    };
    return labels[jenis] || jenis;
}

function getIcon(jenis, highlight = false) {
    const bg   = getColorByJenis(jenis);
    const ring = highlight
        ? `box-shadow:0 0 0 4px #ff9800,0 0 0 8px rgba(255,152,0,0.3);`
        : '';
    const emoji = { perkuliahan:'🏛', laboratorium:'🔬', administrasi:'📋', fasilitas:'☕' }[jenis] || '🏢';
    return L.divIcon({
        html: `<div style="background:${bg};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);${ring}transition:box-shadow 0.3s;"><span style="font-size:15px;">${emoji}</span></div>`,
        iconSize    : [32, 32],
        popupAnchor : [0, -14],
        className   : 'custom-marker'
    });
}

// ---- INIT MAP ----
function initMap() {
    map = L.map('map').setView([0.77602, 127.37436], 18);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM',
        maxZoom    : 20
    }).addTo(map);

    setupCoordPicker();

    // Klik di peta = tutup search results
    map.on('click', () => hideSearchResults());
}

// ---- RENDER SEMUA LAYER ----
async function renderMap() {
    buildingMarkers.forEach(m => map.removeLayer(m));
    roadLines.forEach(l => map.removeLayer(l));
    zonePolygons.forEach(p => map.removeLayer(p));
    buildingMarkers = []; roadLines = []; zonePolygons = [];

    const bangunan = await loadData('bangunan');
    const jalan    = await loadData('jalan');
    const zona     = await loadData('zona');

    // Zona / polygon
    zona.forEach(z => {
        const color = getColorByJenis(z.jenis);
        const poly  = L.polygon(z.koordinat, {
            color,
            weight     : 2,
            fillColor  : color,
            fillOpacity: z.jenis === 'batas' ? 0.1 : 0.3,
            dashArray  : z.jenis === 'batas' ? '5,5' : null
        }).addTo(map);
        poly.bindPopup(`<b>${z.nama}</b><br>Jenis: ${z.jenis}<br>
            <button class="btn btn-warning btn-sm" onclick="editZona('${z.id}')">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteZona('${z.id}')">🗑️ Hapus</button>`);
        zonePolygons.push(poly);
    });

    // Jalan / polyline
    jalan.forEach(j => {
        const line = L.polyline(j.koordinat, { color: '#222', weight: 5, opacity: 0.9 }).addTo(map);
        line.bindPopup(`<b>${j.nama || 'Jalan'}</b><br>
            <button class="btn btn-warning btn-sm" onclick="editJalan('${j.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteJalan('${j.id}')">Hapus</button>`);
        roadLines.push(line);
    });

    // Bangunan / marker
    bangunan.forEach(b => {
        const marker = L.marker([b.latitude, b.longitude], { icon: getIcon(b.jenis) }).addTo(map);
        marker._bangunanData = b;
        marker.on('click', () => showDetailPanel(b));
        buildingMarkers.push(marker);
    });

    refreshSidebar();
}

// ---- COORD PICKER (klik peta → isi form) ----
function setupCoordPicker() {
    map.on('click', e => {
        if (drawingMode) {
            drawingPoints.push([e.latlng.lat, e.latlng.lng]);
            redrawTempLayer();
            updateDrawIndicator();
        } else if (document.querySelector('.tab-content.active')?.id === 'tab-bangunan') {
            document.getElementById('bangunan_lat').value = e.latlng.lat.toFixed(7);
            document.getElementById('bangunan_lng').value = e.latlng.lng.toFixed(7);
            const info = document.getElementById('coordInfo');
            info.innerHTML = `✅ Koordinat: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
            setTimeout(() => info.innerHTML = '📍 Klik peta untuk isi koordinat bangunan', 2000);
        }
    });
}

// ---- HIGHLIGHT MARKER ----
function highlightMarker(id) {
    buildingMarkers.forEach(m => {
        if (m._bangunanData) m.setIcon(getIcon(m._bangunanData.jenis, false));
    });
    const target = buildingMarkers.find(m => m._bangunanData && m._bangunanData.id === id);
    if (target) {
        target.setIcon(getIcon(target._bangunanData.jenis, true));
        setTimeout(() => {
            if (target._bangunanData) target.setIcon(getIcon(target._bangunanData.jenis, false));
        }, 3500);
    }
}

// ---- MODE MENGGAMBAR ----
function startDrawLine()    { startDrawing('line'); }
function startDrawPolygon() { startDrawing('polygon'); }

function startDrawing(type) {
    cancelDrawing();
    drawingMode   = type;
    drawingPoints = [];
    map.doubleClickZoom.disable();
    map.getContainer().style.cursor = 'crosshair';
    updateDrawIndicator();
}

function updateDrawIndicator() {
    const el    = document.getElementById('drawModeIndicator');
    const count = drawingPoints.length;
    const min   = drawingMode === 'line' ? 2 : 3;
    const ready = count >= min;
    el.style.display = drawingMode ? 'flex' : 'none';
    el.innerHTML = `
        <span>✏️ ${count} titik — ${ready ? 'siap!' : 'min ' + min}</span>
        ${ready ? `<button onclick="finishDrawing()" style="background:#0f3b2c;color:white;border:none;padding:4px 10px;border-radius:20px;font-weight:bold;cursor:pointer;">✅ Selesai</button>` : ''}
        <button onclick="undoLastPoint()" style="background:#e74c3c;color:white;border:none;padding:4px 10px;border-radius:20px;font-weight:bold;cursor:pointer;" ${count === 0 ? 'disabled' : ''}>↩ Undo</button>
        <button onclick="cancelDrawing()" style="background:#555;color:white;border:none;padding:4px 10px;border-radius:20px;font-weight:bold;cursor:pointer;">❌</button>
    `;
}

function undoLastPoint() {
    if (drawingPoints.length > 0) {
        drawingPoints.pop();
        redrawTempLayer();
        updateDrawIndicator();
    }
}

function redrawTempLayer() {
    if (tempLayer) { map.removeLayer(tempLayer); tempLayer = null; }
    if (drawingPoints.length < 1) return;
    if (drawingMode === 'line') {
        tempLayer = L.polyline(drawingPoints, { color: '#ff9800', weight: 4, dashArray: '5,5' }).addTo(map);
    } else if (drawingPoints.length >= 2) {
        tempLayer = L.polygon(drawingPoints, { color: '#ff9800', weight: 2, fillOpacity: 0.2 }).addTo(map);
    }
}

function finishDrawing() {
    const min = drawingMode === 'line' ? 2 : 3;
    if (!drawingMode || drawingPoints.length < min) {
        alert(`Minimal ${min} titik untuk ${drawingMode === 'line' ? 'jalan' : 'zona'}`);
        return;
    }
    let final = [...drawingPoints];
    if (drawingMode === 'polygon') {
        const f = final[0], l = final[final.length - 1];
        if (f[0] !== l[0] || f[1] !== l[1]) final.push(f);
    }
    const jsonStr = JSON.stringify(final);
    if (drawingMode === 'line') document.getElementById('jalan_koordinat').value = jsonStr;
    else                        document.getElementById('zona_koordinat').value  = jsonStr;
    alert(`✅ ${drawingPoints.length} titik direkam! Klik 💾 Simpan.`);
    cancelDrawing();
}

function cancelDrawing() {
    if (tempLayer) { map.removeLayer(tempLayer); tempLayer = null; }
    drawingMode   = null;
    drawingPoints = [];
    document.getElementById('drawModeIndicator').style.display = 'none';
    map.doubleClickZoom.enable();
    map.getContainer().style.cursor = '';
}
