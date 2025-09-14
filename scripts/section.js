// scripts/section.js
// Full-page section editor. Reads ?section=... and renders a detailed form for that section.
(function(){
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section') || 'my_home';
  const titleEl = document.getElementById('title');
  const content = document.getElementById('content');
  const backBtn = document.getElementById('backBtn');
  const saveBtn = document.getElementById('saveBtn');

  titleEl.innerText = 'Editing: ' + section.replace('_',' ');

  // init firebase safely
  let db = null; try{ if(window.firebase){ db = firebase.firestore(); } }catch(e){ console.warn('firebase not available', e); }

  // load existing data (from Firestore or localStorage)
  let data = {};
  async function load(){
    if(db && firebase.auth && firebase.auth().currentUser){
      try{
        const uid = firebase.auth().currentUser.uid;
        const ref = db.collection('users').doc(uid).collection('meta').doc('dashboard');
        const snap = await ref.get();
        const doc = snap && snap.exists? snap.data() : null;
        data = doc && doc.data ? doc.data : (doc || {});
      }catch(e){ console.warn('failed to load from firestore', e); }
    } else {
      try{ data = JSON.parse(localStorage.getItem('nm_dashboard') || '{}'); }catch(e){ data = {}; }
    }
    render();
  }

  function addField(label, id, value='', type='text'){
    const wrap = document.createElement('div'); wrap.style.marginBottom='12px';
    const lab = document.createElement('label'); lab.innerText = label; lab.htmlFor = id;
    let input;
    if(type==='textarea'){ input = document.createElement('textarea'); input.rows = 6; }
    else { input = document.createElement('input'); input.type = type; }
    input.id = id; input.value = value || '';
    wrap.appendChild(lab); wrap.appendChild(document.createElement('br')); wrap.appendChild(input);
    content.appendChild(wrap);
  }

  function render(){
    content.innerHTML = '';
    const d = data || {};
    const sectionData = d[section] || {};
    switch(section){
      case 'roof':
        addField('Roof age (years)','fld_roofAge', sectionData.roofAge || d.roofAge || '','number');
        addField('Roof notes','fld_roofNotes', sectionData.notes || '','textarea');
        break;
      case 'appliances':
        addField('Appliances condition (0-10)','fld_appliancesCondition', sectionData.appliancesCondition || d.appliancesCondition || '','number');
        addField('Notes','fld_appliancesNotes', sectionData.notes || '','textarea');
        break;
      case 'builder':
        addField('Builder name','fld_builderName', sectionData.builderName || d.builderName || '');
        addField('Contact','fld_builderContact', sectionData.builderContact || '');
        addField('Notes','fld_builderNotes', sectionData.notes || 'textarea','textarea');
        break;
      case 'contractors':
        if(window.SectionUtils){
          const editor = SectionUtils.createContractorsEditor(content, 'contractorsEditor', d.contractors || []);
          // store helper for save
          content._contractorsEditor = editor;
        } else {
          addField('Contractors (one per line: name — contact — specialty)', 'fld_contractors', (Array.isArray(d.contractors)? d.contractors.join('\n') : d.contractors||''),'textarea');
        }
        break;
      case 'documents':
        if(window.SectionUtils){
          const uploader = SectionUtils.createDocumentsUploader(content, 'documentsUploader', d.documents || []);
          content._documentsUploader = uploader;
        } else {
          addField('Documents / links (one per line)', 'fld_documents', (Array.isArray(d.documents)? d.documents.join('\n') : d.documents||''),'textarea');
        }
        break;
      case 'my_home':
      default:
        addField('Address','fld_address', d.address || '');
        if(window.SectionUtils) SectionUtils.addDateField(content, 'Year built','fld_yearBuilt', d.yearBuilt || '');
        else addField('Year built','fld_yearBuilt', d.yearBuilt || '','number');
        addField('Square feet','fld_sqft', d.sqft || '','number');
        addField('Bedrooms','fld_bedrooms', d.bedrooms || '','number');
        addField('Bathrooms','fld_bathrooms', d.bathrooms || '','number');
        addField('Notes','fld_homeNotes', d.homeNotes || '','textarea');
        break;
    }
  }

  async function save(){
    const d = data || {}; d[section] = d[section] || {};
    // copy fields
    function val(id){ const el = document.getElementById(id); return el? el.value : ''; }
    if(section==='roof'){
      d.roof = d.roof || {};
      d.roof.roofAge = val('fld_roofAge'); d.roof.notes = val('fld_roofNotes'); d.roofAge = d.roof.roofAge;
    } else if(section==='appliances'){
      d.appliances = d.appliances || {};
      d.appliances.appliancesCondition = val('fld_appliancesCondition'); d.appliances.notes = val('fld_appliancesNotes'); d.appliancesCondition = d.appliances.appliancesCondition;
    } else if(section==='builder'){
      d.builder = d.builder || {};
      d.builder.builderName = val('fld_builderName'); d.builder.builderContact = val('fld_builderContact'); d.builder.notes = val('fld_builderNotes');
    } else {
      d.address = val('fld_address'); d.yearBuilt = val('fld_yearBuilt'); d.sqft = val('fld_sqft'); d.bedrooms = val('fld_bedrooms'); d.bathrooms = val('fld_bathrooms'); d.homeNotes = val('fld_homeNotes');
    }

    // contractors and documents special handling
    if(section === 'contractors' && content._contractorsEditor){
      d.contractors = content._contractorsEditor.getList();
    }
    if(section === 'documents' && content._documentsUploader){
      d.documents = content._documentsUploader.getFiles();
    }

    // If there are uploaded files and storage is available, upload them and replace dataUrls with storage URLs
    if(section === 'documents' && content._documentsUploader && typeof content._documentsUploader.getFiles === 'function'){
      const files = content._documentsUploader.getFiles();
      if(files && files.length && db && firebase.storage && firebase.auth && firebase.auth().currentUser){
        try{
          const uid = firebase.auth().currentUser.uid;
          const storage = firebase.storage();
          const uploaded = [];
          // overlay
          const overlay = document.createElement('div'); overlay.style.position='fixed'; overlay.style.left=0; overlay.style.top=0; overlay.style.right=0; overlay.style.bottom=0; overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center'; overlay.style.background='rgba(2,6,23,0.4)'; overlay.style.zIndex=6000;
          const panel = document.createElement('div'); panel.style.background='#fff'; panel.style.padding='18px'; panel.style.borderRadius='10px'; panel.style.minWidth='320px'; panel.innerText = 'Uploading files...'; overlay.appendChild(panel); document.body.appendChild(overlay);
          for(const f of files){
            if(f.file){
              const ref = storage.ref().child(`users/${uid}/documents/${Date.now()}_${encodeURIComponent(f.name)}`);
              const task = ref.put(f.file);
              await new Promise((res, rej)=>{
                task.on('state_changed', snap=>{
                  const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                  panel.innerText = `Uploading ${f.name} — ${pct}%`;
                }, rej, async ()=>{
                  const url = await task.snapshot.ref.getDownloadURL();
                  uploaded.push({ name: f.name, url }); res();
                });
              });
            } else if(f.dataUrl){
              uploaded.push({ name: f.name, dataUrl: f.dataUrl });
            }
          }
          document.body.removeChild(overlay);
          d.documents = uploaded;
        }catch(e){ console.warn('upload failed', e); }
      } else {
        // no storage available or no files: keep dataUrls
        d.documents = files;
      }
    }

    if(db && firebase.auth && firebase.auth().currentUser){
      try{
        const uid = firebase.auth().currentUser.uid;
        const ref = db.collection('users').doc(uid).collection('meta').doc('dashboard');
        await ref.set({ data: d }, { merge: true });
        alert('Saved to Firestore');
        window.location.href = 'dashboard-trial-fresh.html';
        return;
      }catch(e){ console.warn('failed to save to firestore', e); alert('Failed to save to Firestore'); }
    }
    // fallback localStorage
    try{ localStorage.setItem('nm_dashboard', JSON.stringify(d)); alert('Saved locally'); window.location.href = 'dashboard.html'; }catch(e){ console.error(e); alert('Save failed'); }
  }

  // expose save for callers
  window.sectionSave = save;


  backBtn.onclick = ()=>{ window.location.href = 'dashboard.html'; };
  saveBtn.onclick = save;

  // load initially
  load();

})();
