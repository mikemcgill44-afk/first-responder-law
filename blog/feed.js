(function(){
  var PAGE_SIZE = 5;
  var CATEGORY_LABELS = {
    'discipline': 'Discipline',
    'line-of-duty-disability': 'Line-of-Duty Disability',
    'workers-comp': "Workers' Compensation",
    'pensions': 'Pensions & Retirement',
    'wrongful-death': 'Wrongful Death',
    'civil-rights': 'Civil Rights',
    'meet-confer': 'Meet & Confer',
    'collective-bargaining': 'Collective Bargaining',
    'civil-litigation': 'Civil Litigation',
    'fitness-for-duty': 'Fitness for Duty',
    'calpers': 'CalPERS',
    'county-retirement': 'County Retirement',
    'criminal-law': 'Criminal Law',
    'perb': 'PERB',
    'lacerb': 'LA City ERB',
    'ercom': 'ERCOM',
    'personal-injury': 'Personal Injury',
    'on-duty-accident': 'On-Duty Accident'
  };
  var state = { posts: [], filtered: [], page: 1, selected: {} };

  function fmtDate(d){
    var dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function labelsFor(cats){
    return (cats || []).map(function(c){ return CATEGORY_LABELS[c] || c; }).join(', ');
  }

  function selectedCount(){
    var n = 0;
    for(var k in state.selected){ if(state.selected[k]) n++; }
    return n;
  }

  function render(){
    var listEl = document.getElementById('post-list');
    var pagEl = document.getElementById('pagination');
    if(!listEl) return;

    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = state.filtered.slice(start, start + PAGE_SIZE);

    if(!pageItems.length){
      listEl.innerHTML = '<p class="feed-empty">' + (selectedCount() > 0 ? 'No blog entries yet for this topic. Check back soon.' : 'Select one or more topics above to see blog entries.') + '</p>';
    } else {
      listEl.innerHTML = pageItems.map(function(p){
        var catLabel = labelsFor(p.categories);
        return '<div class="post-card">' +
          (catLabel ? '<div class="section-title">' + catLabel + '</div>' : '') +
          '<h3><a href="/blog/' + p.slug + '.html">' + p.title + '</a></h3>' +
          '<p>' + p.excerpt + '</p>' +
          '<div class="post-meta">' + fmtDate(p.date) + '</div>' +
          '</div>';
      }).join('');
    }

    var totalPages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
    if(pagEl){
      if(totalPages > 1){
        pagEl.style.display = 'flex';
        pagEl.innerHTML = '<button id="prev-page"' + (state.page <= 1 ? ' disabled' : '') + '>&larr; Previous</button>' +
          '<span class="page-indicator">Page ' + state.page + ' of ' + totalPages + '</span>' +
          '<button id="next-page"' + (state.page >= totalPages ? ' disabled' : '') + '>Next &rarr;</button>';
        var prevBtn = document.getElementById('prev-page');
        var nextBtn = document.getElementById('next-page');
        if(prevBtn) prevBtn.onclick = function(){
          if(state.page > 1){ state.page--; render(); listEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        };
        if(nextBtn) nextBtn.onclick = function(){
          if(state.page < totalPages){ state.page++; render(); listEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        };
      } else {
        pagEl.style.display = 'none';
        pagEl.innerHTML = '';
      }
    }
  }

  function applyFilters(){
    state.page = 1;
    var count = selectedCount();
    state.filtered = count === 0 ? [] : state.posts.filter(function(p){
      var cats = p.categories || [];
      for(var i = 0; i < cats.length; i++){
        if(state.selected[cats[i]]) return true;
      }
      return false;
    });
    var btns = document.querySelectorAll('.filter-btn');
    for(var i = 0; i < btns.length; i++){
      var b = btns[i];
      var cat = b.getAttribute('data-filter');
      if(state.selected[cat]){
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    }
    render();
  }

  function toggleFilter(cat){
    state.selected[cat] = !state.selected[cat];
    applyFilters();
  }

  function init(){
    var audience = window.FRL_AUDIENCE || null;
    fetch('/blog/posts.json').then(function(r){ return r.json(); }).then(function(data){
      var posts = data.filter(function(p){
        return !audience || (p.audience || []).indexOf(audience) !== -1;
      });
      posts.sort(function(a, b){ return new Date(b.date) - new Date(a.date); });
      state.posts = posts;
      state.filtered = [];
      render();

      var btns = document.querySelectorAll('.filter-btn');
      for(var i = 0; i < btns.length; i++){
        (function(b){
          b.addEventListener('click', function(){
            var cat = b.getAttribute('data-filter');
            toggleFilter(cat);
          });
        })(btns[i]);
      }
    }).catch(function(){
      var listEl = document.getElementById('post-list');
      if(listEl) listEl.innerHTML = '<p class="feed-empty">Could not load blog entries right now.</p>';
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
(function(){
 var PAGE_SIZE = 5;
  var CATEGORY_LABELS = {
    'discipline': 'Discipline',
    'line-of-duty-disability': 'Line-of-Duty Disability',
    'workers-comp': "Workers' Compensation",
    'pensions': 'Pensions & Retirement',
    'wrongful-death': 'Wrongful Death',
    'civil-rights': 'Civil Rights',
    'meet-confer': 'Meet & Confer',
    'collective-bargaining': 'Collective Bargaining',
    'civil-litigation': 'Civil Litigation',
    'fitness-for-duty': 'Fitness for Duty',
    'calpers': 'CalPERS',
    'county-retirement': 'County Retirement',
    'criminal-law': 'Criminal Law',
    'perb': 'PERB',
    'lacerb': 'LA City ERB',
    'ercom': 'ERCOM'
  };
  var state = { posts: [], filtered: [], page: 1, selected: {} };

 function fmtDate(d){
   var dt = new Date(d + 'T00:00:00');
   return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
 }

 function labelsFor(cats){
   return (cats || []).map(function(c){ return CATEGORY_LABELS[c] || c; }).join(', ');
 }

 function selectedCount(){
   var n = 0;
   for(var k in state.selected){ if(state.selected[k]) n++; }
   return n;
 }

 function render(){
   var listEl = document.getElementById('post-list');
   var pagEl = document.getElementById('pagination');
   if(!listEl) return;

  var start = (state.page - 1) * PAGE_SIZE;
   var pageItems = state.filtered.slice(start, start + PAGE_SIZE);

  if(!pageItems.length){
    listEl.innerHTML = '<p class="feed-empty">' + (selectedCount() > 0 ? 'No blog entries yet for this topic. Check back soon.' : 'Select one or more topics above to see blog entries.') + '</p>';
  } else {
    listEl.innerHTML = pageItems.map(function(p){
      var catLabel = labelsFor(p.categories);
      return '<div class="post-card">' +
        (catLabel ? '<div class="section-title">' + catLabel + '</div>' : '') +
        '<h3><a href="/blog/' + p.slug + '.html">' + p.title + '</a></h3>' +
        '<p>' + p.excerpt + '</p>' +
        '<div class="post-meta">' + fmtDate(p.date) + '</div>' +
        '</div>';
    }).join('');
  }

  var totalPages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
   if(pagEl){
     if(totalPages > 1){
   pagEl.style.display = 'flex';
       pagEl.innerHTML = '<button id="prev-page"' + (state.page <= 1 ? ' disabled' : '') + '>&larr; Previous</button>' +
         '<span class="page-indicator">Page ' + state.page + ' of ' + totalPages + '</span>' +
         '<button id="next-page"' + (state.page >= totalPages ? ' disabled' : '') + '>Next &rarr;</button>';
       var prevBtn = document.getElementById('prev-page');
       var nextBtn = document.getElementById('next-page');
       if(prevBtn) prevBtn.onclick = function(){
         if(state.page > 1){ state.page--; render(); listEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
       };
       if(nextBtn) nextBtn.onclick = function(){
         if(state.page < totalPages){ state.page++; render(); listEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
       };
     } else {
       pagEl.style.display = 'none';
       pagEl.innerHTML = '';
     }
   }
 }

 function applyFilters(){
   state.page = 1;
   var count = selectedCount();
   state.filtered = count === 0 ? [] : state.posts.filter(function(p){
     var cats = p.categories || [];
     for(var i = 0; i < cats.length; i++){
       if(state.selected[cats[i]]) return true;
       }
       return false;
   });
   var btns = document.querySelectorAll('.filter-btn');
   for(var i = 0; i < btns.length; i++){
     var b = btns[i];
     var cat = b.getAttribute('data-filter');
     if(state.selected[cat]){
       b.classList.add('active');
     } else {
       b.classList.remove('active');
     }
   }
   render();
 }

 function toggleFilter(cat){
   state.selected[cat] = !state.selected[cat];
   applyFilters();
 }

 function init(){
   var audience = window.FRL_AUDIENCE || null;
   fetch('/blog/posts.json').then(function(r){ return r.json(); }).then(function(data){
     var posts = data.filter(function(p){
       return !audience || (p.audience || []).indexOf(audience) !== -1;
     });
     posts.sort(function(a, b){ return new Date(b.date) - new Date(a.date); });
     state.posts = posts;
     state.filtered = [];
     render();

                                                                        var btns = document.querySelectorAll('.filter-btn');
     for(var i = 0; i < btns.length; i++){
       (function(b){
         b.addEventListener('click', function(){
           var cat = b.getAttribute('data-filter');
           toggleFilter(cat);
         });
       })(btns[i]);
     }
   }).catch(function(){
     var listEl = document.getElementById('post-list');
     if(listEl) listEl.innerHTML = '<p class="feed-empty">Could not load blog entries right now.</p>';
   });
 }

 if(document.readyState === 'loading'){
   document.addEventListener('DOMContentLoaded', init);
 } else {
   init();
 }
})();
