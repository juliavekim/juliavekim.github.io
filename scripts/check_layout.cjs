// Run against the built site: NODE_PATH=/tmp/profile-qa/node_modules node scripts/check_layout.cjs
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
  fs.mkdirSync('qa-screenshots', {recursive:true});
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844],['narrow',320,740]]) {
    const page = await browser.newPage({viewport:{width,height}});
    const errors=[];
    page.on('pageerror', e=>errors.push(String(e)));
    for (const route of ['/', '/cv/']) {
      await page.goto('http://127.0.0.1:8765'+route, {waitUntil:'networkidle'});
      await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Horizontal overflow at ${width}: ${route}`);
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('a.skip-link').getAttribute('href'),'#main');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link');
      const targets=await page.locator('.site-header nav a').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
      for (const target of targets) {
        await page.goto('http://127.0.0.1:8765'+target);
        if(target.includes('#')) assert.equal(await page.locator('#'+target.split('#')[1]).count(),1);
      }
      await page.goto('http://127.0.0.1:8765'+route,{waitUntil:'networkidle'});
      if(route==='/cv/') {
        assert.equal(await page.locator('.pdf-pages img').count(),2);
        assert.equal(await page.locator('.cv-section').count(),10);
        const response=await page.request.get('http://127.0.0.1:8765/uploads/resume.pdf');
        assert.equal(response.status(),200);
        assert.ok((await response.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
      }
      await page.screenshot({path:`qa-screenshots/${name}-${route==='/'?'home':'cv'}.png`,fullPage:true});
    }
    assert.deepEqual(errors,[]);
    await page.close();
  }
  await browser.close();
  console.log('PASS: desktop, mobile, and narrow layouts; navigation; keyboard entry; two CV pages; PDF download.');
})().catch(e=>{console.error(e);process.exit(1);});
