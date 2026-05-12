/**
 * js/app.js
 * Entry point utama aplikasi.
 * Menginisialisasi database, peta, dan data awal.
 * Juga menangani Export / Import / Reset data.
 */

/**
 * Inisialisasi aplikasi.
 * Dipanggil otomatis saat halaman selesai dimuat.
 */
async function init() {
    await initDB();

    // Isi data default jika database masih kosong
    const existing = await loadData('bangunan');
    if (existing.length === 0) {
        await saveData('bangunan', DEFAULT_DATA.bangunan);
        await saveData('jalan',    DEFAULT_DATA.jalan);
        await saveData('zona',     DEFAULT_DATA.zona);
    }

    initMap();
    await renderMap();
}

// ---- EXPORT / IMPORT / RESET ----

/**
 * Unduh semua data (bangunan, jalan, zona) sebagai file JSON.
 */
async function exportData() {
    const data = {
        bangunan   : await loadData('bangunan'),
        jalan      : await loadData('jalan'),
        zona       : await loadData('zona'),
        exportTime : new Date().toISOString()
    };
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `sig_kampus_${Date.now()}.json`;
    a.click();
}

/**
 * Muat data dari file JSON yang dipilih pengguna.
 * Mengganti seluruh data yang ada di database.
 */
async function importData() {
    const inp    = document.createElement('input');
    inp.type     = 'file';
    inp.accept   = 'application/json';
    inp.onchange = async (e) => {
        try {
            const text = await e.target.files[0].text();
            const data = JSON.parse(text);
            if (data.bangunan) await saveData('bangunan', data.bangunan);
            if (data.jalan)    await saveData('jalan',    data.jalan);
            if (data.zona)     await saveData('zona',     data.zona);
            await addHistory('IMPORT', 'System', 'Import data dari file JSON');
            renderMap();
        } catch (err) {
            alert('File tidak valid: ' + err.message);
        }
    };
    inp.click();
}

/**
 * Reset semua data ke nilai default (DEFAULT_DATA dari default-data.js).
 */
async function resetToDefault() {
    if (!confirm('Reset semua data ke default? Semua perubahan akan hilang.')) return;
    await saveData('bangunan', DEFAULT_DATA.bangunan);
    await saveData('jalan',    DEFAULT_DATA.jalan);
    await saveData('zona',     DEFAULT_DATA.zona);
    await addHistory('RESET', 'System', 'Reset ke default JSON');
    renderMap();
}

// Jalankan saat DOM siap
init();