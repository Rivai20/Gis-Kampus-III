/**
 * js/crud-bangunan.js
 * Operasi Create, Read, Update, Delete untuk data Bangunan.
 */

/**
 * Tambah bangunan baru atau perbarui bangunan yang sedang diedit.
 * Dipanggil oleh form submit di index.html.
 */
async function addOrUpdateBangunan() {
    const id  = document.getElementById('bangunan_id').value || 'b' + Date.now();
    const data = {
        id,
        nama       : document.getElementById('bangunan_nama').value,
        fungsi     : document.getElementById('bangunan_fungsi').value,
        jenis      : document.getElementById('bangunan_jenis').value,
        kapasitas  : parseInt(document.getElementById('bangunan_kapasitas').value) || 0,
        inventaris : document.getElementById('bangunan_inventaris').value,
        pengelola  : document.getElementById('bangunan_pengelola').value,
        latitude   : parseFloat(document.getElementById('bangunan_lat').value),
        longitude  : parseFloat(document.getElementById('bangunan_lng').value)
    };

    if (!data.nama || isNaN(data.latitude)) {
        alert('Isi nama & koordinat');
        return;
    }

    let list = await loadData('bangunan');
    const idx = list.findIndex(b => b.id === id);

    if (idx >= 0) {
        list[idx] = data;
        await addHistory('UPDATE', 'Bangunan', { nama: data.nama });
    } else {
        list.push(data);
        await addHistory('CREATE', 'Bangunan', { nama: data.nama });
    }

    await saveData('bangunan', list);
    clearBangunanForm();
    renderMap();
}

/**
 * Hapus bangunan berdasarkan id.
 * @param {string} id
 */
async function deleteBangunan(id) {
    if (!confirm('Hapus bangunan ini?')) return;

    let list = await loadData('bangunan');
    const del = list.find(b => b.id === id);
    list = list.filter(b => b.id !== id);

    await saveData('bangunan', list);
    await addHistory('DELETE', 'Bangunan', { nama: del?.nama });
    renderMap();
}

/**
 * Isi form edit dengan data bangunan yang dipilih.
 * @param {string} id
 */
async function editBangunan(id) {
    const list = await loadData('bangunan');
    const b    = list.find(x => x.id === id);
    if (!b) return;

    document.getElementById('bangunan_id').value         = b.id;
    document.getElementById('bangunan_nama').value        = b.nama;
    document.getElementById('bangunan_fungsi').value      = b.fungsi     || '';
    document.getElementById('bangunan_jenis').value       = b.jenis;
    document.getElementById('bangunan_kapasitas').value   = b.kapasitas;
    document.getElementById('bangunan_inventaris').value  = b.inventaris || '';
    document.getElementById('bangunan_pengelola').value   = b.pengelola  || '';
    document.getElementById('bangunan_lat').value         = b.latitude;
    document.getElementById('bangunan_lng').value         = b.longitude;

    switchTab('bangunan');
}

/**
 * Reset / kosongkan semua field form bangunan.
 */
function clearBangunanForm() {
    ['bangunan_id','bangunan_nama','bangunan_fungsi','bangunan_kapasitas',
     'bangunan_inventaris','bangunan_pengelola','bangunan_lat','bangunan_lng']
        .forEach(id => document.getElementById(id).value = '');
}