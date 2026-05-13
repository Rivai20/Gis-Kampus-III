async function exportHistory() {
    const hist = await loadData('history');
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(new Blob([JSON.stringify(hist, null, 2)], { type: 'application/json' }));
    a.download = `history_${Date.now()}.json`;
    a.click();
}

async function clearHistory() {
    if (!confirm('Hapus semua riwayat history?')) return;
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').clear();
    await new Promise(r => tx.oncomplete = r);
    refreshSidebar();
}
