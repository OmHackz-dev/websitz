// Render posts from JSONBin
(async function(){
  const container = document.getElementById('posts');
  if(!container) return;
  
  container.innerHTML = '<div class="loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading posts...</p></div>';
  
  const { apiKey, postsBin } = JsonBin.loadConfig();
  try{
    const record = await JsonBin.readBin(postsBin, apiKey);
    const posts = getSafeArray(record && record.posts);
    
    if(posts.length === 0){
      container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-newspaper"></i><h3>No posts yet</h3><p>Add some posts from the admin page</p></div>';
      return;
    }
    
    const sorted = posts.slice().sort((a,b)=> new Date(b.date||0)-new Date(a.date||0));
    
    container.innerHTML = '<div class="posts-grid"></div>';
    const grid = container.querySelector('.posts-grid');
    
    for(const p of sorted){
      const card = document.createElement('div');
      card.className = 'post-card';
      
      const date = formatDate(p.date);
      const rawContent = p.content || '';
      const excerptSrc = rawContent.length > 300 ? rawContent.slice(0, 300) + '...' : rawContent;
      const htmlExcerpt = typeof DOMPurify !== 'undefined' && typeof marked !== 'undefined'
        ? DOMPurify.sanitize(marked.parse(excerptSrc))
        : nl2br(escapeHtml(excerptSrc));
      
      card.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">${escapeHtml(p.title||'Untitled')}</h3>
          <div class="card-meta">
            <i class="fa-regular fa-calendar"></i> ${date}
          </div>
        </div>
        <div class="card-excerpt">${htmlExcerpt}</div>
        <div class="card-actions">
          <a href="/post?id=${encodeURIComponent(p.id)}" class="read-more">
            Read More <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      `;
      grid.appendChild(card);
    }
  }catch(err){
    console.error(err);
    container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-exclamation-triangle"></i><h3>Failed to load posts</h3><p>Check admin settings and bin permissions</p></div>';
  }
})();

function formatDate(d){
  const date = d ? new Date(d) : new Date();
  return date.toLocaleDateString();
}

function nl2br(text){
  return (text||'').replace(/\n/g,'<br>');
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


