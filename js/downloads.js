// Render downloads from JSONBin
(async function(){
  const container = document.getElementById('downloads');
  if(!container) return;
  
  container.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading downloads...</p></div>';
  
  const { apiKey, downloadsBin } = JsonBin.loadConfig();
  try{
    const record = await JsonBin.readBin(downloadsBin, apiKey);
    const items = getSafeArray(record && record.items);
    
    if(items.length === 0){
      container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-download"></i><h3>No downloads yet</h3><p>Add some downloads from the admin page</p></div>';
      return;
    }
    
    container.innerHTML = '<div class="downloads-grid"></div>';
    const grid = container.querySelector('.downloads-grid');
    
    for(const it of items){
      const card = document.createElement('div');
      card.className = 'download-card';
      
      const date = new Date(it.date || Date.now()).toLocaleDateString();
      
      card.innerHTML = `
        <div class="card-header">
          <div class="card-icon">
            <i class="fa-solid fa-download"></i>
          </div>
          <div>
            <h3 class="card-title">${escapeHtml(it.name)}</h3>
          </div>
        </div>
        <p class="card-desc">${escapeHtml(it.desc || 'No description available')}</p>
        <div class="card-meta">
          <i class="fa-regular fa-calendar"></i> Added ${date}
        </div>
        <div class="card-actions">
          <a class="btn primary" href="${encodeURI(it.url)}" target="_blank" rel="noopener">
            <i class="fa-solid fa-download"></i> Download
          </a>
          <a class="btn" href="/download?id=${encodeURIComponent(it.id)}" class="read-more">
            <i class="fa-solid fa-info-circle"></i> Details
          </a>
        </div>
      `;
      grid.appendChild(card);
    }
  }catch(err){
    console.error(err);
    container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i><h3>Failed to load downloads</h3><p>Check admin settings and bin permissions</p></div>';
  }
})();

function escapeHtml(s){
  return (s||'').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


