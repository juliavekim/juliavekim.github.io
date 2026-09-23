const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 fs.mkdirSync('qa-screenshots',{recursive:true});
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  for(const route of ['/', '/cv/', '/experience/']){
   const response=await page.goto('http://127.0.0.1:8765'+route,{waitUntil:'networkidle'});
   assert.equal(response.status(),200);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow: ${route} at ${width}`);
   if(route==='/'){
    assert.equal(await page.locator('#profile').count(),1,'Original biography block must remain');
    assert.ok(await page.getByText('Non-generative safety evaluation:',{exact:false}).count());
    assert.ok(await page.getByText('Epistemic harms from AI:',{exact:false}).count());
    assert.equal(await page.locator('a[href="/#talks"], a[href="/#teaching"]').count(),0);
   }
   if(route==='/cv/'){
    assert.equal(await page.locator('img[src*="resume-page-"]').count(),2);
    assert.ok(await page.getByText('Biophysics Machine Learning Researcher',{exact:false}).count());
    assert.ok(await page.getByText('Joseph Alfred Whealy',{exact:false}).count());
    const pdf=await page.request.get('http://127.0.0.1:8765/uploads/resume.pdf');
    assert.equal(pdf.status(),200);assert.ok((await pdf.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
   }
   await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>{img.loading='eager';return img.decode()})));
   await page.screenshot({path:`qa-screenshots/${name}-${route==='/'?'home':route.replaceAll('/','')}.png`,fullPage:true});
  }
  await page.close();
 }
 await browser.close();
 console.log('PASS: original theme and research introduction, navigation, CV content, both PDF pages, download, desktop/mobile overflow.');
})().catch(e=>{console.error(e);process.exit(1)});
