import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright
SS = Path(__file__).parent/"screenshots"; SS.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        ctx = await b.new_context(viewport={"width":1603,"height":1027},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
            is_mobile=True, has_touch=True, locale="de-DE",
            extra_http_headers={"Accept-Language":"de-DE,de;q=0.9,en;q=0.8"})
        p = await ctx.new_page()
        await p.goto("http://localhost:8080/de/hypovereinsbank", wait_until="domcontentloaded")
        await p.wait_for_timeout(2500)
        d = await p.evaluate("""()=>{const s=[...document.querySelectorAll('section')].find(x=>x.classList.contains('hvb-hero'));
          if(!s) return {found:false}; const cs=getComputedStyle(s); const r=s.getBoundingClientRect();
          return {found:true,width:Math.round(r.width),height:Math.round(r.height),size:cs.backgroundSize,pos:cs.backgroundPosition,bgColor:cs.backgroundColor,minH:cs.minHeight};}""")
        print("live desktop:", json.dumps(d))
        await p.set_viewport_size({"width":390,"height":844}); await p.wait_for_timeout(600)
        d2 = await p.evaluate("""()=>{const s=[...document.querySelectorAll('section')].find(x=>x.classList.contains('hvb-hero'));
          const cs=getComputedStyle(s); const r=s.getBoundingClientRect();
          return {width:Math.round(r.width),height:Math.round(r.height),size:cs.backgroundSize,pos:cs.backgroundPosition};}""")
        print("live phone:", json.dumps(d2))
        await ctx.close()
        m = await b.new_context(viewport={"width":1603,"height":700})
        mp = await m.new_page()
        await mp.goto("file:///tmp/browser/hvb-hero/mock.html", wait_until="domcontentloaded")
        await mp.wait_for_timeout(700)
        await mp.screenshot(path=str(SS/"mock_desktop.png"))
        print("mock shot saved")
        await b.close()

asyncio.run(main())
