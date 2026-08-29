"""Capture real frames from the running Cashflow Generator for the demo GIF.

Every frame is a genuine screenshot of the live app doing real work with the
anonymized demo inputs. Nothing here is mocked.
"""
import os
import time
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8765"
INPUTS = r"D:/Ganna/The Cashflow Automation/Madkour-App/demo/inputs"
RAW = r"C:/Users/muham/AppData/Local/Temp/claude/D--Ganna-The-Cashflow-Automation-Madkour-App/f5a4b8d0-ea8b-418b-b6bc-1b21aee93216/scratchpad/raw"
W, H = 1200, 780

os.makedirs(RAW, exist_ok=True)
for f in os.listdir(RAW):
    os.remove(os.path.join(RAW, f))


def shot(page, name):
    page.screenshot(path=os.path.join(RAW, name + ".png"))
    print("  frame:", name)


with sync_playwright() as pw:
    browser = pw.chromium.launch()
    ctx = browser.new_context(viewport={"width": W, "height": H},
                              device_scale_factor=1, accept_downloads=True)
    page = ctx.new_page()

    # ---------------------------------------------------------- hero
    page.goto(BASE, wait_until="networkidle")
    page.wait_for_timeout(1200)
    shot(page, "01_hero")

    # ------------------------------------------------- upload states
    page.eval_on_selector(".upload-grid", "el => el.scrollIntoView({block:'center'})")
    page.wait_for_timeout(600)
    shot(page, "02_upload_empty")

    steps = [
        ("boq", "BOQ for Cash IN.xlsx", "03_upload_boq"),
        ("budget", "Budget For Cash Out.xlsx", "04_upload_budget"),
        ("assumptions", "Assumptions.xlsx", "05_upload_assumptions"),
        ("primavera", "Primavera Baseline.xlsx", "06_upload_primavera"),
    ]
    for kind, fname, out in steps:
        page.set_input_files(f"#{kind}Card input[type=file]",
                             os.path.join(INPUTS, fname))
        page.wait_for_timeout(1400)
        page.eval_on_selector(".upload-grid", "el => el.scrollIntoView({block:'center'})")
        shot(page, out)

    # --------------------------------------------- generation states
    page.eval_on_selector(".action-bar", "el => el.scrollIntoView({block:'center'})")
    page.wait_for_timeout(400)
    shot(page, "07_ready")

    page.evaluate("() => { window.__t0 = Date.now(); generate(); }")
    seen100 = 0
    for i in range(90):
        page.wait_for_timeout(70)
        try:
            page.eval_on_selector(".action-bar", "el => el.scrollIntoView({block:'center'})")
        except Exception:
            pass
        pct = page.evaluate("() => document.getElementById('progressPct').textContent")
        shot(page, f"08_gen_{i:02d}_p{pct.replace('%','').zfill(3)}")
        if pct == "100%":
            seen100 += 1
            if seen100 > 2:
                break
    elapsed = page.evaluate("() => Date.now() - window.__t0")
    page.wait_for_timeout(900)
    page.eval_on_selector(".action-bar", "el => el.scrollIntoView({block:'center'})")
    page.wait_for_timeout(250)
    shot(page, "09_done")
    print("generation elapsed ms:", elapsed)

    # ------------------------------------------------ workbook frame
    page.goto(BASE + "/demo/preview.html", wait_until="networkidle")
    page.wait_for_function("() => window.__ready === true")
    page.wait_for_timeout(700)
    shot(page, "10_workbook")

    browser.close()

print("raw frames ->", RAW)
