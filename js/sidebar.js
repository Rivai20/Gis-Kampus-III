/**
 * js/sidebar.js
 * Kontrol sidebar (toggle buka/tutup) dan render daftar
 * di semua tab: bangunan, jalan, zona, history.
 */

let sidebarOpen = true;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn     = document.getElementById('sidebarToggleBtn');
    sidebarOpen   = !sidebarOpen;

    if (sidebarOpen) {
        sidebar.classList.remove('collapsed');
        overlay.classList.add('visible');
        btn.innerHTML = '✕';
        btn.title = 'Tutup Sidebar';
    } else {
        sidebar.classList.add('collapsed');
        overlay.classList.remove('visible');
        btn.innerHTML = '☰';
        btn.title = 'Buka Sidebar';
    }

    // Paksa Leaflet hitung ulang ukuran peta
    setTimeout(() => { if (map) map.invalidateSize(); }, 300);
}

/**
 * Sembunyikan overlay di layar lebar (> 700px).
 * Dipanggil saat resize window.
 */
function checkOverlayVisibility() {
    const overlay = document.getElementById('sidebarOverlay');
    if (window.innerWidth > 700 && sidebarOpen) {
        overlay.classList.remove('visible');
    }
}
window.addEventListener('resize', checkOverlayVisibility);

/**
 * Ganti tab aktif.
 * @param {string} tab - 'bangunan' | 'jalan' | 'zona' | 'history'
 */
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(`tab-${tab}`).classList.add('active');

    const tabIndex = { bangunan: 0, jalan: 1, zona: 2, history: 3 };
    const btns = document.querySelectorAll('.tab-btn');
    if (btns[tabIndex[tab]]) btns[tabIndex[tab]].classList.add('active');

    cancelDrawing();
}

/**
 * Render ulang semua daftar di sidebar dari database.
 */
async function refreshSidebar() {
    const bangunan = await loadData('bangunan');
    const jalan    = await loadData('jalan');
    const zona     = await loadData('zona');
    const history  = await loadData('history');

    // -- Daftar Bangunan --
    document.getElementById('bangunanList').innerHTML = bangunan.map(b => `
        <div class="list-item">
            <div class="list-item-title">${b.nama}</div>
            <div class="list-item-sub">${b.latitude.toFixed(5)}, ${b.longitude.toFixed(5)}</div>
            <div class="list-item-actions">
                <button class="btn btn-warning btn-sm" onclick="editBangunan('${b.id}')">Edit</button>
                <button class="btn btn-danger btn-sm"  onclick="deleteBangunan('${b.id}')">Hapus</button>
            </div>
        </div>
    `).join('');

    // -- Daftar Jalan --
    document.getElementById('jalanList').innerHTML = jalan.map(j => `
        <div class="list-item">
            <div class="list-item-title">${j.nama || 'Jalan'}</div>
            <div class="list-item-sub">${j.koordinat.length} titik</div>
            <div class="list-item-actions">
                <button class="btn btn-warning" onclick="editJalan('${j.id}')">Edit</button>
                <button class="btn btn-danger"  onclick="deleteJalan('${j.id}')">Hapus</button>
            </div>
        </div>
    `).join('');

    // -- Hierarki Zona (nested) --
    function renderZTree(parentId = null, level = 0) {
        const children = zona.filter(z => z.parentId === parentId);
        if (children.length === 0 && level === 0) return '<div class="list-item-sub">Tidak ada zona</div>';
        return children.map(z => `
            <div class="list-item" style="margin-left:${level * 15}px; border-left-color:${getColorByJenis(z.jenis)}">
                <div class="list-item-title">${z.nama} (${z.jenis})</div>
                <div class="list-item-actions">
                    <button class="btn btn-warning btn-sm" onclick="editZona('${z.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm"  onclick="deleteZona('${z.id}')">Hapus</button>
                </div>
            </div>
            ${renderZTree(z.id, level + 1)}
        `).join('');
    }
    document.getElementById('zonaList').innerHTML = renderZTree(null, 0);

    // -- Dropdown zona induk --
    const parentSelect = document.getElementById('zona_parent');
    parentSelect.innerHTML = '<option value="">-- Zona Utama --</option>' +
        zona.map(z => `<option value="${z.id}">${z.nama}</option>`).join('');

    // -- Riwayat History --
    document.getElementById('historyList').innerHTML = history
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(h => `
            <div class="history-item">
                🕒 ${new Date(h.timestamp).toLocaleString()}<br>
                <strong>${h.action}</strong> - ${h.type}<br>
                <small>${h.data}</small>
            </div>
        `).join('');
}