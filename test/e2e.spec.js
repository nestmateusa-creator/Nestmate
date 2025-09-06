const assert = require('chai').assert;
const puppeteer = require('puppeteer');
const path = require('path');
const http = require('http');
const fs = require('fs');

describe('Smoke UI e2e (served)', function(){
  this.timeout(30000);
  let browser, page, serverProc;
  const PORT = 8765;
  const root = path.resolve(__dirname, '..');

  before(async ()=>{
    // spawn the dev server script
    const cp = require('child_process');
    serverProc = cp.spawn(process.execPath, [path.join(root, 'scripts', 'dev-server.js'), String(PORT)], { stdio: ['ignore','pipe','pipe'] });
    // wait for server ready by polling
    const http = require('http');
    const max = Date.now() + 8000;
    while(Date.now() < max){
      try{
        await new Promise((resolve, reject)=>{
          const req = http.get({ hostname: 'localhost', port: PORT, path: '/smoke.html', timeout: 2000 }, (res)=>{ res.resume(); resolve(); });
          req.on('error', ()=>resolve());
          req.on('timeout', ()=>{ req.destroy(); resolve(); });
        });
        // small wait
        await new Promise(r=>setTimeout(r,200));
        // attempt to fetch page
        const ok = await new Promise((res)=>{ const req = http.get({ hostname:'localhost', port:PORT, path:'/smoke.html' }, r=>{ res(r.statusCode===200); r.resume(); }); req.on('error', ()=>res(false)); });
        if(ok) break;
      }catch(e){}
    }
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
    page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/smoke.html`);
  // prepare artifacts dir
  const art = path.join(root, 'test', 'artifacts'); if(!fs.existsSync(art)) fs.mkdirSync(art, { recursive: true });
  });

  after(async ()=>{
    if(browser) await browser.close();
  if(serverProc){ serverProc.kill(); }
  });

  it('opens section details when clicking left nav', async ()=>{
    await page.click('[data-section="roof"]');
    await page.waitForSelector('#sectionContent');
    const txt = await page.$eval('#sectionContent', el=>el.innerText);
  await page.screenshot({ path: path.join(root, 'test', 'artifacts', 'open-roof.png') });
    assert.include(txt.toLowerCase(), 'roof');
  });

  it('slider syncs with number input for roof', async ()=>{
    await page.click('[data-section="roof"]');
    await page.waitForSelector('#sld_roofAge');
    await page.evaluate(()=>{ document.getElementById('sld_roofAge').value = 12; document.getElementById('sld_roofAge').dispatchEvent(new Event('input')); });
  const numVal = await page.$eval('#fld_roofAge', el=>el.value);
  await page.screenshot({ path: path.join(root, 'test', 'artifacts', 'roof-slider.png') });
  assert.equal(String(numVal), '12');
  });

  it('save shows confirmation in the details pane', async ()=>{
    await page.click('[data-section="home_details"]');
    await page.waitForSelector('#fld_address');
    await page.click('#fld_address');
    await page.type('#fld_address', '123 Test Ave');
    await page.click('#fld_yearBuilt');
    await page.type('#fld_yearBuilt', '1999');
    // click Save button (find by text)
    const buttons = await page.$x("//button[contains(., 'Save')]");
    if(buttons && buttons.length) await buttons[0].click();
    await page.waitForFunction(()=> document.querySelector('#sectionContent') && document.querySelector('#sectionContent').innerText.toLowerCase().includes('saved'));
  const content = await page.$eval('#sectionContent', el=>el.innerText);
  await page.screenshot({ path: path.join(root, 'test', 'artifacts', 'saved-home-details.png') });
  assert.include(content.toLowerCase(), 'saved');
  });
});
