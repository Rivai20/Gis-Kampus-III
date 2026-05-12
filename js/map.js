/**
 * js/map.js
 * Inisialisasi peta Leaflet dan rendering semua layer:
 * marker bangunan, polyline jalan, dan polygon zona.
 */

let map;
let buildingMarkers = [];
let roadLines       = [];
let zonePolygons    = [];

// State untuk mode menggambar
let drawingMode   = null;
let drawingPoints = [];
let tempLayer     = null;

/**
 * Warna berdasarkan jenis fitur.
 * Ubah di sini untuk mengganti palet warna.
 */
function getColorByJenis(jenis) {
    const colors = {
        'perkuliahan': '#3498db',
        'laboratorium': '#e74c3c',
        'administrasi': '#1abc9c',
        'fasilitas': '#9b59b6',
        'parkir': '#95a5a6',
        'hijau': '#2ecc71',
        'batas': '#f1c40f'
    };
    return colors[jenis] || '#95a5a6';
}

/**
 * Buat icon marker bulat berwarna sesuai jenis bangunan.
 */
function getIcon(jenis) {
    const bg = getColorByJenis(jenis);
    return L.divIcon({
        html: `<div style="background:${bg}; width:28px; height:28px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3);">
                    <span style="color:white; font-size:14px;">🏢</span>
               </div>`,
        iconSize: [28, 28],
        popupAnchor: [0, -12]
    });
}

/**
 * Inisialisasi peta Leaflet.
 * Dipanggil satu kali dari app.js.
 */
function initMap() {
    map = L.map('map').setView([0.77602, 127.37436], 18);

    // Tile layer — ganti URL di sini untuk mengganti basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM',
        maxZoom: 20
    }).addTo(map);

    setupCoordPicker();
}

/**
 * Render ulang semua layer dari database.
 * Hapus layer lama dulu, lalu gambar ulang dari data terbaru.
 */
async function renderMap() {
    // Hapus layer lama
    buildingMarkers.forEach(m => map.removeLayer(m));
    roadLines.forEach(l => map.removeLayer(l));
    zonePolygons.forEach(p => map.removeLayer(p));
    buildingMarkers = [];
    roadLines       = [];
    zonePolygons    = [];

    const bangunan = await loadData('bangunan');
    const jalan    = await loadData('jalan');
    const zona     = await loadData('zona');

    // --- Zona (polygon) ---
    zona.forEach(z => {
        const color = getColorByJenis(z.jenis);
        const fill  = z.jenis === 'batas' ? 0.1 : 0.3;
        const poly  = L.polygon(z.koordinat, {
            color,
            weight: 2,
            fillColor: color,
            fillOpacity: fill,
            dashArray: z.jenis === 'batas' ? '5,5' : null
        }).addTo(map);
        poly.bindPopup(`
            <b>${z.nama}</b><br>Jenis: ${z.jenis}<br>
            <button class="btn btn-warning btn-sm" onclick="editZona('${z.id}')">✏️ Edit</button>
            <button class="btn btn-danger btn-sm"  onclick="deleteZona('${z.id}')">🗑️ Hapus</button>
        `);
        zonePolygons.push(poly);
    });

    // --- Jalan (polyline) ---
    jalan.forEach(j => {
        const line = L.polyline(j.koordinat, { color: '#222', weight: 5, opacity: 0.9 }).addTo(map);
        line.bindPopup(`
            <b>${j.nama || 'Jalan'}</b><br>
            <button class="btn btn-warning" onclick="editJalan('${j.id}')">Edit</button>
            <button class="btn btn-danger"  onclick="deleteJalan('${j.id}')">Hapus</button>
        `);
        roadLines.push(line);
    });

    // --- Bangunan (marker) ---
    bangunan.forEach(b => {
        const marker = L.marker([b.latitude, b.longitude], { icon: getIcon(b.jenis) }).addTo(map);
        marker.bindPopup(`
            <b>${b.nama}</b><br>
            Fungsi: ${b.fungsi || '-'}<br>
            Pengelola: ${b.pengelola || '-'}<br>
            <button class="btn btn-warning btn-sm" onclick="editBangunan('${b.id}')">✏️ Edit</button>
            <button class="btn btn-danger btn-sm"  onclick="deleteBangunan('${b.id}')">🗑️ Hapus</button>
        `);
        buildingMarkers.push(marker);
    });

    refreshSidebar();
}

/**
 * Satu handler click terpusat untuk seluruh peta.
 * - Jika mode gambar aktif  → tambah titik ke drawingPoints
 * - Jika tab bangunan aktif → isi form koordinat
 */
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

/** Update teks dan tombol di banner mode gambar. */
function updateDrawIndicator() {
    const el    = document.getElementById('drawModeIndicator');
    const count = drawingPoints.length;
    const min   = drawingMode === 'line' ? 2 : 3;
    const ready = count >= min;
    el.style.display = drawingMode ? 'flex' : 'none';
    el.style.alignItems = 'center';
    el.style.gap = '8px';
    el.innerHTML = `
        <span>✏️ ${count} titik — ${ready ? 'siap disimpan' : `minimal ${min}`}</span>
        ${ready ? `<button onclick="finishDrawing()" style="background:#0f3b2c;color:white;border:none;padding:4px 10px;border-radius:20px;font-weight:bold;cursor:pointer;">✅ Selesai</button>` : ''}
        <button onclick="undoLastPoint()" style="background:#e74c3c;color:white;border:none;padding:4px 10px;border-radius:20px;font-weight:bold;cursor:pointer;" ${count===0?'disabled':''}>↩ Undo</button>
        <button onclick="cancelDrawing()" style="background:#555;color:white;border:none;padding:4px 10px;border-radius:20px;font-weight:bold;cursor:pointer;">❌</button>
    `;
}

/** Hapus titik terakhir. */
function undoLastPoint() {
    if (drawingPoints.length > 0) {
        drawingPoints.pop();
        redrawTempLayer();
        updateDrawIndicator();
    }
}

/** Gambar ulang layer sementara sesuai titik yang sudah diklik. */
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

    // Tutup polygon jika belum tertutup
    if (drawingMode === 'polygon') {
        const first = final[0], last = final[final.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) final.push(first);
    }

    const jsonStr = JSON.stringify(final);
    if (drawingMode === 'line') {
        document.getElementById('jalan_koordinat').value = jsonStr;
    } else {
        document.getElementById('zona_koordinat').value = jsonStr;
    }

    alert(`✅ ${drawingPoints.length} titik direkam! Sekarang klik 💾 Simpan.`);
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
