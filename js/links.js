// Parse links.md and render
(async function(){
  const container = document.getElementById('linksContainer');
  if(!container) return;
  
  container.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading links...</p></div>';
  
  try{
    const res = await fetch('links.md');
    const text = await res.text();
    const items = parseMarkdownLinks(text);
    
    if(items.length === 0){
      container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-link"></i><h3>No links found</h3><p>Add some links to your links.md file</p></div>';
      return;
    }
    
    container.innerHTML = '<div class="links-grid"></div>';
    const grid = container.querySelector('.links-grid');
    
    for(const it of items){
      const card = document.createElement('div');
      card.className = 'link-card';
      
      const icon = getIconForSection(it.section);
      const desc = it.section || 'External Link';
      
      card.innerHTML = `
        <div class="card-header">
          <div class="card-icon">
            <i class="${icon}"></i>
          </div>
          <div>
            <h3 class="card-title">${escapeHtml(it.label)}</h3>
          </div>
        </div>
        <p class="card-desc">${escapeHtml(desc)}</p>
        <div class="card-actions">
          <a class="btn primary" href="${it.url}" target="_blank" rel="noopener">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit
          </a>
        </div>
      `;
      grid.appendChild(card);
    }
  }catch(err){
    console.error(err);
    container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i><h3>Failed to load links</h3><p>Check if links.md exists and is accessible</p></div>';
  }
})();

function parseMarkdownLinks(md){
  const lines = md.split(/\r?\n/);
  const items = [];
  let currentSection = '';
  
  for(const line of lines){
    const heading = line.match(/^\*\*(.+?)\*\*:?$/);
    if(heading){
      currentSection = heading[1].trim();
      continue;
    }
    
    const m = line.match(/^\*\s*\*\*(.+?)\*\*:\s*\[(.+?)\]\((.+?)\)/);
    if(m){
      items.push({ 
        label: m[1].trim(), 
        url: m[3].trim(), 
        section: currentSection 
      });
      continue;
    }
    
    const m2 = line.match(/^\*\s*\*\*(.+?)\*\*\s*\((.+?)\)/);
    if(m2){
      items.push({ 
        label: m2[1].trim(), 
        url: '#', 
        section: currentSection 
      });
    }
  }
  return items;
}

function getIconForSection(section){
  if(!section) return 'fa-solid fa-link';
  
  const iconMap = {
    'Note FX': 'fa-solid fa-sticky-note',
    'Raw Me': 'fa-solid fa-user',
    'Om App Store': 'fa-solid fa-store',
    'Socials': 'fa-solid fa-share-nodes',
    'YouTube': 'fa-brands fa-youtube',
    'GitHub': 'fa-brands fa-github',
    'X': 'fa-brands fa-x-twitter',
    'Twitter': 'fa-brands fa-x-twitter'
  };
  
  for(const [key, icon] of Object.entries(iconMap)){
    if(section.toLowerCase().includes(key.toLowerCase())){
      return icon;
    }
  }
  
  return 'fa-solid fa-link';
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


