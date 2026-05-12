/**
 * js/crud-jalan.js
 * Operasi Create, Read, Update, Delete untuk data Jalan.
 */

/**
 * Simpan jalan baru dari form atau hasil gambar di peta.
 */
async function saveJalan() {
    const nama     = document.getElementById('jalan_nama').value.trim();
    const koordRaw = document.getElementById('jalan_koordinat').value.trim();

    if (!koordRaw) {
        alert('Koordinat kosong!\nGunakan tombol ✏️ Gambar Jalan, atau isi manual.');
        return;
    }

    let koord;
    try {
        koord = JSON.parse(koordRaw);
    } catch (e) {
        alert('Format koordinat tidak valid.\nContoh: [[lat,lng],[lat,lng]]');
        return;
    }

    if (!Array.isArray(koord) || koord.length < 2) {
        alert('Minimal 2 titik koordinat untuk jalan.');
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
        console.error('saveJalan error:', err);
        alert('Gagal menyimpan: ' + err.message);
    }
}

/**
 * Hapus jalan berdasarkan id.
 * @param {string} id
 */
async function deleteJalan(id) {
    if (!confirm('Hapus jalan ini?')) return;
    const jalan = (await loadData('jalan')).filter(j => j.id !== id);
    await saveData('jalan', jalan);
    await addHistory('DELETE', 'Jalan', { id });
    renderMap();
}

/**
 * Isi form edit dengan data jalan yang dipilih.
 * @param {string} id
 */
async function editJalan(id) {
    const jalan = await loadData('jalan');
    const j     = jalan.find(x => x.id === id);
    if (!j) return;

    document.getElementById('jalan_nama').value      = j.nama || '';
    document.getElementById('jalan_koordinat').value = JSON.stringify(j.koordinat);
    switchTab('jalan');
}
