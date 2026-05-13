const DB_NAME    = 'SIG_Kampus_Unkhair_Mobile';
const DB_VERSION = 5;
let db;

function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => { db = req.result; resolve(); };
        req.onupgradeneeded = (e) => {
            const d = e.target.result;
            if (!d.objectStoreNames.contains('bangunan')) d.createObjectStore('bangunan', { keyPath: 'id' });
            if (!d.objectStoreNames.contains('jalan'))    d.createObjectStore('jalan',    { keyPath: 'id' });
            if (!d.objectStoreNames.contains('zona'))     d.createObjectStore('zona',     { keyPath: 'id' });
            if (!d.objectStoreNames.contains('history'))  d.createObjectStore('history',  { keyPath: 'timestamp' });
        };
    });
}

function loadData(store) {
    return new Promise(res => {
        const tx  = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => res(req.result || []);
    });
}

function saveData(store, data) {
    return new Promise((resolve, reject) => {
        const tx       = db.transaction(store, 'readwrite');
        const storeObj = tx.objectStore(store);
        tx.oncomplete = () => resolve();
        tx.onerror    = (e) => { console.error('saveData error:', e.target.error); reject(e.target.error); };
        const clearReq = storeObj.clear();
        clearReq.onsuccess = () => { data.forEach(d => storeObj.put(d)); };
        clearReq.onerror   = (e) => reject(e.target.error);
    });
}

function addHistory(action, type, detail) {
    const entry = {
        timestamp: Date.now(),
        action,
        type,
        data: JSON.stringify(detail).slice(0, 200)
    };
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').add(entry);
}
