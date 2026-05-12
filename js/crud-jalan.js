/**
 * js/crud-jalan.js
 * Operasi Create, Read, Update, Delete untuk data Jalan.
 */

/**
 * Simpan jalan baru dari form atau hasil gambar di peta.
 */
async function saveJalan() {
    const nama = document.getElementById('jalan_nama').value;
    let koord;

    try {
        koord = JSON.parse(document.getElementById('jalan_koordinat').value);
    } catch (e) {
        alert('Format koordinat tidak valid (harus JSON array)');
        return;
    }

    if (!Array.isArray(koord) || koord.length < 2) {
        alert('Minimal 2 titik koordinat');
        return;
    }

    const jalan = await loadData('jalan');
    jalan.push({ id: 'j' + Date.now(), nama: nama || 'Jalan', koordinat: koord });

    await saveData('jalan', jalan);
    await addHistory('CREATE', 'Jalan', { nama });

    // Bersihkan form
    document.getElementById('jalan_nama').value       = '';
    document.getElementById('jalan_koordinat').value  = '';

    renderMap();
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