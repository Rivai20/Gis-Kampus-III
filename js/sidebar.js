// ============================================================
// SIDEBAR — Toggle sidebar, switchTab, refreshSidebar
// ============================================================
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
        btn.title     = 'Tutup Sidebar';
    } else {
        sidebar.classList.add('collapsed');
        overlay.classList.remove('visible');
        btn.innerHTML = '☰';
        btn.title     = 'Buka Sidebar';
    }
    setTimeout(() => { if (map) map.invalidateSize(); }, 300);
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 700 && sidebarOpen)
        document.getElementById('sidebarOverlay').classList.remove('visible');
});

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    const idx = { bangunan: 0, jalan: 1, zona: 2, history: 3 };
    document.querySelectorAll('.tab-btn')[idx[tab]]?.classList.add('active');
    cancelDrawing();
}

async function refreshSidebar() {
    const bangunan = await loadData('bangunan');
    const jalan    = await loadData('jalan');
    const zona     = await loadData('zona');
    const history  = await loadData('history');

    // ---- Daftar Bangunan ----
    document.getElementById('bangunanList').innerHTML = bangunan.map(b => `
        <div class="list-item" onclick="selectSearchResult('${b.id}')">
            <div class="list-item-title">${b.nama}</div>
            <div class="list-item-sub">${b.latitude.toFixed(5)}, ${b.longitude.toFixed(5)}</div>
            <div class="list-item-actions">
                <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); editBangunan('${b.id}')">Edit</button>
                <button class="btn btn-danger btn-sm"  onclick="event.stopPropagation(); deleteBangunan('${b.id}')">Hapus</button>
            </div>
        </div>`).join('');

    // ---- Daftar Jalan ----
    document.getElementById('jalanList').innerHTML = jalan.map(j => `
        <div class="list-item">
            <div class="list-item-title">${j.nama || 'Jalan'}</div>
            <div class="list-item-sub">${j.koordinat.length} titik</div>
            <div class="list-item-actions">
                <button class="btn btn-warning btn-sm" onclick="editJalan('${j.id}')">Edit</button>
                <button class="btn btn-danger btn-sm"  onclick="deleteJalan('${j.id}')">Hapus</button>
            </div>
        </div>`).join('');

    // ---- Hierarki Zona ----
    function renderZTree(parentId = null, level = 0) {
        const children = zona.filter(z => z.parentId === parentId);
        if (children.length === 0 && level === 0) return '<div class="list-item-sub">Tidak ada zona</div>';
        return children.map(z => `
            <div class="list-item" style="margin-left:${level * 15}px;border-left-color:${getColorByJenis(z.jenis)}">
                <div class="list-item-title">${z.nama} (${z.jenis})</div>
                <div class="list-item-actions">
                    <button class="btn btn-warning btn-sm" onclick="editZona('${z.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm"  onclick="deleteZona('${z.id}')">Hapus</button>
                </div>
            </div>${renderZTree(z.id, level + 1)}`).join('');
    }
    document.getElementById('zonaList').innerHTML = renderZTree(null, 0);

    // ---- Dropdown Zona Parent ----
    document.getElementById('zona_parent').innerHTML =
        '<option value="">-- Zona Utama --</option>' +
        zona.map(z => `<option value="${z.id}">${z.nama}</option>`).join('');

    // ---- History ----
    document.getElementById('historyList').innerHTML = history
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(h => `
            <div class="history-item">
                🕒 ${new Date(h.timestamp).toLocaleString()}<br>
                <strong>${h.action}</strong> - ${h.type}<br>
                <small>${h.data}</small>
            </div>`)
        .join('');
}

// ============================================================
// SEARCH FEATURE
// ============================================================
const searchInput          = document.getElementById('searchInput');
const searchResultsOverlay = document.getElementById('searchResultsOverlay');
const searchClearBtn       = document.getElementById('searchClearBtn');

searchInput.addEventListener('input', debounce(handleSearch, 200));
searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) handleSearch();
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchBarWrap')) hideSearchResults();
});

function debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

async function handleSearch() {
    const q = searchInput.value.trim().toLowerCase();
    searchClearBtn.classList.toggle('visible', q.length > 0);
    if (q.length === 0) { hideSearchResults(); return; }

    const bangunan = await loadData('bangunan');
    const results  = bangunan.filter(b =>
        b.nama.toLowerCase().includes(q) ||
        (b.fungsi     && b.fungsi.toLowerCase().includes(q)) ||
        (b.pengelola  && b.pengelola.toLowerCase().includes(q)) ||
        (b.inventaris && b.inventaris.toLowerCase().includes(q)) ||
        (b.jenis      && b.jenis.toLowerCase().includes(q))
    );
    renderSearchResults(results, q);
}

function highlightText(text, query) {
    if (!text || !query) return text || '-';
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function renderSearchResults(results, q) {
    if (results.length === 0) {
        searchResultsOverlay.innerHTML = `<div class="search-no-result">😕 Tidak ditemukan hasil untuk "<strong>${q}</strong>"</div>`;
    } else {
        const header = `<div class="search-result-header">Ditemukan ${results.length} bangunan</div>`;
        const items  = results.map(b => {
            const color = getColorByJenis(b.jenis);
            const emoji = { perkuliahan:'🏛', laboratorium:'🔬', administrasi:'📋', fasilitas:'☕' }[b.jenis] || '🏢';
            return `
            <div class="search-result-item" onclick="selectSearchResult('${b.id}')">
                <div class="search-result-icon" style="background:${color}">${emoji}</div>
                <div class="search-result-body">
                    <div class="search-result-name">${highlightText(b.nama, q)}</div>
                    <div class="search-result-meta">
                        ${b.fungsi    ? highlightText(b.fungsi, q) + ' &nbsp;·&nbsp; ' : ''}
                        ${b.pengelola ? '👤 ' + highlightText(b.pengelola, q)          : ''}
                    </div>
                </div>
                <span class="search-result-badge" style="background:${color}">${b.jenis}</span>
            </div>`;
        }).join('');
        searchResultsOverlay.innerHTML = header + items;
    }
    searchResultsOverlay.classList.add('visible');
}

async function selectSearchResult(id) {
    hideSearchResults();
    searchInput.value = '';
    searchClearBtn.classList.remove('visible');

    const bangunan = await loadData('bangunan');
    const b        = bangunan.find(x => x.id === id);
    if (!b) return;

    map.flyTo([b.latitude, b.longitude], 20, { animate: true, duration: 0.8 });
    highlightMarker(b.id);
    showDetailPanel(b);
}

function hideSearchResults() {
    searchResultsOverlay.classList.remove('visible');
}

function clearSearch() {
    searchInput.value = '';
    searchClearBtn.classList.remove('visible');
    hideSearchResults();
}

// ============================================================
// DETAIL PANEL
// ============================================================
function showDetailPanel(b) {
    const color = getColorByJenis(b.jenis);
    document.getElementById('detailTitle').textContent = b.nama;
    const badge = document.getElementById('detailBadge');
    badge.textContent    = getJenisLabel(b.jenis);
    badge.style.background = color;

    const fields = [
        { label: 'Fungsi',     value: b.fungsi     || '-' },
        { label: 'Kapasitas',  value: b.kapasitas  ? b.kapasitas + ' orang' : '-' },
        { label: 'Pengelola',  value: b.pengelola  || '-', full: true },
        { label: 'Inventaris', value: b.inventaris || '-', full: true },
        { label: 'Latitude',   value: b.latitude?.toFixed(7)  || '-' },
        { label: 'Longitude',  value: b.longitude?.toFixed(7) || '-' },
    ];

    document.getElementById('detailGrid').innerHTML = fields.map(f => `
        <div class="detail-cell ${f.full ? 'full' : ''}">
            <div class="detail-label">${f.label}</div>
            <div class="detail-value">${f.value}</div>
        </div>`).join('');

    document.getElementById('detailActions').innerHTML = `
        <button class="btn btn-warning" style="flex:1;" onclick="editBangunan('${b.id}'); closeDetailPanel();">✏️ Edit</button>
        <button class="btn btn-danger"  style="flex:1;" onclick="deleteBangunan('${b.id}'); closeDetailPanel();">🗑️ Hapus</button>`;

    document.getElementById('detailPanel').classList.add('visible');
}

function closeDetailPanel() {
    document.getElementById('detailPanel').classList.remove('visible');
    buildingMarkers.forEach(m => {
        if (m._bangunanData) m.setIcon(getIcon(m._bangunanData.jenis, false));
    });
}
