from playwright.sync_api import sync_playwright
import json
URL='http://127.0.0.1:8765/index.html'
errs=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':1280,'height':720})
    page.on('pageerror',lambda e:errs.append(str(e)))
    page.goto(URL,wait_until='networkidle')
    page.evaluate("resetGameState();currentSlot=1;startGame();clearGameTimeouts();")
    locked=page.evaluate("""() => {player.x=partsShopArea.x;player.y=partsShopArea.y;const u=upgradesList.find(x=>x.id==='shop1');u.bought=false;openPartsShop();return document.getElementById('parts-shop-modal').style.display;}""")
    assert locked!='flex','Loja abriu sem upgrade'
    opened=page.evaluate("""() => {const u=upgradesList.find(x=>x.id==='shop1');u.bought=true;u.fn();openPartsShop();return {blocked:isGameplayBlocked(),tick};}""")
    page.wait_for_timeout(200)
    assert page.evaluate('tick')==opened['tick'],'Overlay não congelou a simulação'
    page.evaluate('closePartsShop()')
    q=page.evaluate("""() => {cars.length=0;waitingCars.length=0;bays.forEach(b=>b.car=null);window._bay1Bought=false;for(let i=0;i<9;i++)spawnCar();return {cars:cars.length,waiting:waitingCars.length};}""")
    assert q=={'cars':5,'waiting':4},q
    chain=page.evaluate("""() => {diagnosticLevel=3;window._chainChance=1;const c={problem:{...problems.find(p=>p.name==='Motor')},chainProblems:[],_chainResolved:false};const a=resolveChainProblems(c).slice(),b=resolveChainProblems(c).slice();return {a,b};}""")
    assert chain['a']==chain['b'] and len(chain['a'])==2,chain
    bills=page.evaluate("""() => {BillsSystem.reset();BillsSystem.applySaveData({lastBillDay:6,billsPaid:false,billsDue:true,latePenaltyApplied:false});money=0;reputation=100;BillsSystem.payAll();const a=reputation;BillsSystem.payAll();return [a,reputation];}""")
    assert bills==[70,70],bills
    cantina_sprite=page.evaluate("""() => ({ready:CANTINA_SPRITE.ready,failed:CANTINA_SPRITE.failed,w:CANTINA_SPRITE.image.naturalWidth,h:CANTINA_SPRITE.image.naturalHeight,area:{...cantineArea}})""")
    assert cantina_sprite['ready'] and not cantina_sprite['failed'],cantina_sprite
    assert [cantina_sprite['w'],cantina_sprite['h']]==[114,100],cantina_sprite
    assert [cantina_sprite['area']['w'],cantina_sprite['area']['h']]==[200,175],cantina_sprite
    assert not errs,errs
    browser.close()
print(json.dumps({'ok':True,'checks':['shop-lock','overlay-freeze','queue','chain-stable','bill-once','cantina-sprite']},ensure_ascii=False))
