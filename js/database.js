/**
 * js/database.js
 * Pengelolaan IndexedDB: inisialisasi, load, save, dan history.
 * Semua fungsi database ada di sini.
 */

const DB_NAME    = 'SIG_Kampus_Unkhair_Mobile';
const DB_VERSION = 5;
let db;

/**
 * Buka / buat database IndexedDB.
 * Dipanggil sekali saat app pertama kali dijalankan.
 */
function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => { db = req.result; resolve(); };
        req.onupgradeneeded = (e) => {
            const dbUp = e.target.result;
            if (!dbUp.objectStoreNames.contains('bangunan')) dbUp.createObjectStore('bangunan', { keyPath: 'id' });
            if (!dbUp.objectStoreNames.contains('jalan'))    dbUp.createObjectStore('jalan',    { keyPath: 'id' });
            if (!dbUp.objectStoreNames.contains('zona'))     dbUp.createObjectStore('zona',     { keyPath: 'id' });
            if (!dbUp.objectStoreNames.contains('history'))  dbUp.createObjectStore('history',  { keyPath: 'timestamp' });
        };
    });
}

/**
 * Ambil semua data dari object store tertentu.
 * @param {string} store - nama store: 'bangunan' | 'jalan' | 'zona' | 'history'
 * @returns {Promise<Array>}
 */
function loadData(store) {
    return new Promise(res => {
        const tx  = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => res(req.result || []);
    });
}

/**
 * Ganti seluruh isi object store dengan array data baru.
 * @param {string} store
 * @param {Array}  data
 */
function saveData(store, data) {
    const tx       = db.transaction(store, 'readwrite');
    const storeObj = tx.objectStore(store);
    storeObj.clear();
    data.forEach(d => storeObj.add(d));
    return new Promise(r => tx.oncomplete = r);
}

/**
 * Tambah satu entri ke tabel history.
 * @param {string} action  - CREATE | UPDATE | DELETE | RESET | IMPORT
 * @param {string} type    - Bangunan | Jalan | Zona | System
 * @param {object} detail  - objek detail (akan di-stringify, max 200 karakter)
 */
function addHistory(action, type, detail) {
    const history = {
        timestamp: Date.now(),
        action,
        type,
        data: JSON.stringify(detail).slice(0, 200)
    };
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').add(history);
}