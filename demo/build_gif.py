"""Compose the captured app frames into a LinkedIn-ready looping GIF (and MP4).

Every screenshot is real output from the live tool. The only added layer is
the caption band, the credit footer and the step dots.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAW = r"C:/Users/muham/AppData/Local/Temp/claude/D--Ganna-The-Cashflow-Automation-Madkour-App/f5a4b8d0-ea8b-418b-b6bc-1b21aee93216/scratchpad/raw"
OUTDIR = r"D:/Ganna/The Cashflow Automation/Madkour-App/demo"

# Set to a real figure once confirmed, e.g. "2 days". None = no time claim.
MANUAL_TIME = None

S = 1080
BG = (10, 22, 51)
ACCENT = (94, 140, 255)
WHITE = (255, 255, 255)
MUTED = (150, 170, 214)

F_BOLD = "C:/Windows/Fonts/GOTHICB.TTF"
F_REG = "C:/Windows/Fonts/GOTHIC.TTF"
f_eyebrow = ImageFont.truetype(F_BOLD, 25)
f_cap = ImageFont.truetype(F_BOLD, 52)
f_foot = ImageFont.truetype(F_REG, 24)
f_footb = ImageFont.truetype(F_BOLD, 24)

CARD_X, CARD_W = 40, 1000
BAND_TOP, BAND_BOT = 252, 946          # vertical band the screenshot is centred in
BAND_H = BAND_BOT - BAND_TOP

# crop boxes into the 1200x780 captures
CROPS = {
    "01_hero":              (24, 96, 1176, 640),
    "02_upload_empty":      (48, 150, 1152, 706),
    "03_upload_boq":        (48, 150, 1152, 706),
    "04_upload_budget":     (48, 150, 1152, 706),
    "05_upload_assumptions": (48, 150, 1152, 706),
    "06_upload_primavera":  (48, 150, 1152, 706),
    "07_ready":             (60, 60, 1140, 600),
    "09_done":              (60, 0, 1140, 600),
    "10_workbook":          (0, 0, 900, 680),
}

hook = (["A project cashflow workbook,", "built by hand, sheet by sheet."]
        if not MANUAL_TIME else
        ["Building one by hand", f"took {MANUAL_TIME}."])
payoff = (["From four input files", "to a full cashflow baseline."]
          if not MANUAL_TIME else
          [f"{MANUAL_TIME} of manual work,", "now one click."])

# (raw frame, eyebrow, caption lines, step index, duration ms)
TIMELINE = [
    ("01_hero",             "COST CONTROL",  hook,                                            0, 2300),
    ("01_hero",             "THE TOOL",      ["One browser tool.", "Nothing leaves your laptop."], 0, 2000),
    ("02_upload_empty",     "STEP 1",        ["Drop in your", "project files."],               1, 650),
    ("03_upload_boq",       "STEP 1",        ["Drop in your", "project files."],               1, 420),
    ("04_upload_budget",    "STEP 1",        ["Drop in your", "project files."],               1, 420),
    ("05_upload_assumptions", "STEP 1",      ["Drop in your", "project files."],               1, 420),
    ("06_upload_primavera", "STEP 1",        ["BOQ, Budget, Assumptions,", "2,229 schedule activities."], 1, 1800),
    ("07_ready",            "STEP 2",        ["Click Generate."],                              2, 1600),
    ("09_done",             "STEP 2",        ["Workbook ready.", "In seconds."],               2, 1900),
    ("10_workbook",         "STEP 3",        ["18 sheets. 3 currencies.", "79,041 live formulas."], 3, 2700),
    ("10_workbook",         "THE RESULT",    payoff,                                           3, 2400),
]


def rounded(img, r):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.size[0], img.size[1]], r, fill=255)
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def fit(shot, w, h):
    """Contain-fit: whole screenshot visible, nothing cropped or squashed."""
    sw, sh = shot.size
    scale = min(w / sw, h / sh)
    return shot.resize((int(sw * scale), int(sh * scale)), Image.LANCZOS)


def compose(key, eyebrow, lines, step):
    canvas = Image.new("RGB", (S, S), BG)
    d = ImageDraw.Draw(canvas)

    d.text((CARD_X + 4, 56), eyebrow, font=f_eyebrow, fill=ACCENT)
    y = 100
    for ln in lines:
        d.text((CARD_X, y), ln, font=f_cap, fill=WHITE)
        y += 64

    shot = Image.open(os.path.join(RAW, key + ".png")).convert("RGB").crop(CROPS[key])
    shot = fit(shot, CARD_W, BAND_H)
    card = rounded(shot, 18)
    px = CARD_X + (CARD_W - card.size[0]) // 2
    py = BAND_TOP + (BAND_H - card.size[1]) // 2
    canvas.paste(card, (px, py), card)

    # step dots
    for i in range(4):
        cx = CARD_X + 8 + i * 26
        on = i <= step
        d.ellipse([cx, 968, cx + 13, 981],
                  fill=ACCENT if on else (38, 55, 96))

    d.text((CARD_X + 4, 1012), "Madkour Cashflow Generator", font=f_footb, fill=MUTED)
    txt = "Ganna Abdelaziz · Cost Control Engineer"
    w = d.textlength(txt, font=f_foot)
    d.text((S - CARD_X - w, 1012), txt, font=f_foot, fill=MUTED)
    return canvas


os.makedirs(OUTDIR, exist_ok=True)
STILLS = os.path.join(OUTDIR, "stills")
os.makedirs(STILLS, exist_ok=True)

frames, durations = [], []
for i, (key, eyebrow, lines, step, ms) in enumerate(TIMELINE):
    img = compose(key, eyebrow, lines, step)
    frames.append(img)
    durations.append(ms)
    img.save(os.path.join(STILLS, f"{i:02d}_{key}.png"))

gif_path = os.path.join(OUTDIR, "cashflow-generator-demo.gif")
pal = [f.convert("P", palette=Image.ADAPTIVE, colors=200) for f in frames]
pal[0].save(gif_path, save_all=True, append_images=pal[1:],
            duration=durations, loop=0, optimize=True, disposal=2)

size_mb = os.path.getsize(gif_path) / 1e6
print(f"GIF  -> {gif_path}  ({size_mb:.2f} MB, {len(frames)} frames, "
      f"{sum(durations)/1000:.1f}s loop)")

frames[0].save(os.path.join(OUTDIR, "poster.png"))
print("poster ->", os.path.join(OUTDIR, "poster.png"))

# ------------------------------------------------------------- MP4
# LinkedIn autoplays native video and it carries further than a GIF.
try:
    import imageio.v2 as imageio
    FPS = 25
    mp4 = os.path.join(OUTDIR, "cashflow-generator-demo.mp4")
    w = imageio.get_writer(mp4, fps=FPS, codec="libx264", quality=8,
                           macro_block_size=8)
    for img, ms in zip(frames, durations):
        for _ in range(max(1, round(ms / 1000 * FPS))):
            w.append_data(np.asarray(img))
    w.close()
    print(f"MP4  -> {mp4}  ({os.path.getsize(mp4)/1e6:.2f} MB)")
except Exception as e:
    print("MP4 skipped:", e)
