// ============================================================
// CRUD JALAN — Add / Edit / Delete
// ============================================================

async function saveJalan() {
    const nama     = document.getElementById('jalan_nama').value.trim();
    const koordRaw = document.getElementById('jalan_koordinat').value.trim();

    if (!koordRaw) {
        alert('Koordinat kosong!\nGunakan tombol ✏️ Gambar Jalan terlebih dahulu.');
        return;
    }

    let koord;
    try {
        koord = JSON.parse(koordRaw);
    } catch (e) {
        alert('Format koordinat tidak valid.');
        return;
    }

    if (!Array.isArray(koord) || koord.length < 2) {
        alert('Minimal 2 titik koordinat.');
        return;
    }

    try {
        const jalan = await loadData('jalan');
        const entry = { id: 'j' + Date.now(), nama: nama || 'Jalan Baru', koordinat: koord };
        jalan.push(entry);
        await saveData('jalan', jalan);
        await addHistory('CREATE', 'Jalan', { nama: entry.nama });
        document.getElementById('jalan_nama').value      = '';
        document.getElementById('jalan_koordinat').value = '';
        alert('✅ Jalan berhasil disimpan!');
        renderMap();
    } catch (err) {
        alert('Gagal menyimpan: ' + err.message);
    }
}

async function deleteJalan(id) {
    if (!confirm('Hapus jalan ini?')) return;
    const jalan = await loadData('jalan');
    const del   = jalan.find(j => j.id === id);
    await saveData('jalan', jalan.filter(j => j.id !== id));
    await addHistory('DELETE', 'Jalan', { nama: del?.nama });
    renderMap();
}

async function editJalan(id) {
    const j = (await loadData('jalan')).find(x => x.id === id);
    if (!j) return;
    document.getElementById('jalan_nama').value      = j.nama      || '';
    document.getElementById('jalan_koordinat').value = JSON.stringify(j.koordinat);
    switchTab('jalan');
}
