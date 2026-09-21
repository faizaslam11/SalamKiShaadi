# -*- coding: utf-8 -*-
"""
Interactive Walima reception invitation — PDF version.
Page 1 is a closed "envelope" — tapping it jumps to page 2.
Page 4 has a tappable RSVP button that opens WhatsApp.
Everything else is a normal PDF page-turn (swipe/scroll), which is the
real extent of "interactive" a PDF can do — no countdown/parallax here,
those only exist on the website.
"""
import arabic_reshaper
from bidi import get_display
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import math

# ---------------------------------------------------------------- fonts --
pdfmetrics.registerFont(TTFont("EBGaramond", "/home/claude/fonts-ttf/EBGaramond-Regular.ttf"))
pdfmetrics.registerFont(TTFont("EBGaramond-Bold", "/home/claude/fonts-ttf/EBGaramond-Bold.ttf"))
pdfmetrics.registerFont(TTFont("EBGaramond-Italic", "/home/claude/fonts-ttf/EBGaramond-Italic.ttf"))
pdfmetrics.registerFont(TTFont("DancingScript", "/home/claude/fonts-ttf/DancingScript-Regular.ttf"))
pdfmetrics.registerFont(TTFont("DancingScript-Bold", "/home/claude/fonts-ttf/DancingScript-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Amiri", "/usr/share/fonts/opentype/fonts-hosny-amiri/Amiri-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Poppins", "/usr/share/fonts/truetype/google-fonts/Poppins-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Poppins-Light", "/usr/share/fonts/truetype/google-fonts/Poppins-Light.ttf"))
pdfmetrics.registerFont(TTFont("Poppins-Medium", "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"))

# ---------------------------------------------------------------- palette --
BG        = Color(10/255, 9/255, 8/255)
PANEL     = Color(21/255, 18/255, 16/255)
GOLD      = Color(201/255, 169/255, 110/255)
GOLD_BR   = Color(232/255, 206/255, 154/255)
GOLD_DIM  = Color(138/255, 111/255, 68/255)
IVORY     = Color(243/255, 236/255, 221/255)
MUTED     = Color(185/255, 174/255, 156/255)
LINE      = Color(232/255, 206/255, 154/255, alpha=0.18)

W, H = 396, 704  # ~ 9:16 "card" ratio, comfortable on a phone PDF viewer

def ar(text):
    """Shape + reorder Arabic text so it draws correctly with a Latin-order canvas call."""
    return get_display(arabic_reshaper.reshape(text))

def background(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    # soft glow washes (layered low-alpha circles, since plain canvas has no radial gradient)
    for (cx, cy, r, a) in [(W*0.18, H*0.86, 260, 0.05), (W*0.85, H*0.62, 220, 0.04), (W*0.25, H*0.12, 240, 0.045)]:
        c.setFillColor(Color(201/255, 169/255, 110/255, alpha=a))
        c.circle(cx, cy, r, stroke=0, fill=1)

def corner_motifs(c):
    for x, flip in [(20, 1), (W-20, -1)]:
        c.saveState()
        c.translate(x, H-20)
        c.scale(flip, 1)
        c.setStrokeColor(GOLD); c.setLineWidth(0.7)
        p = c.beginPath()
        p.moveTo(0, 0); p.curveTo(0, -14, 0, -28, 0, -34)
        c.drawPath(p, stroke=1, fill=0)
        p2 = c.beginPath()
        p2.moveTo(0, 0); p2.curveTo(10, 0, 20, 0, 26, 0)
        c.drawPath(p2, stroke=1, fill=0)
        c.setFillColor(GOLD); c.circle(0, 0, 1.4, stroke=0, fill=1)
        c.restoreState()

def divider(c, cx, y, width=110):
    c.setStrokeColor(GOLD); c.setLineWidth(0.6)
    c.line(cx-width/2, y, cx-7, y)
    c.line(cx+7, y, cx+width/2, y)
    c.setFillColor(GOLD)
    p = c.beginPath()
    p.moveTo(cx, y+5); p.lineTo(cx+4.5, y); p.lineTo(cx, y-5); p.lineTo(cx-4.5, y)
    p.close()
    c.drawPath(p, stroke=0, fill=1)

def arch(c, cx, base_y, width, height, alpha=0.4):
    """Two nested pointed-arch outlines, echoing the site's hero arch motif."""
    def T(px, py, w=width, h=height):
        nx, ny = px/400.0, py/560.0
        return (cx - w/2 + w*nx, base_y + h*(1-ny))
    c.saveState()
    for scale, a in [(1.0, alpha), (0.90, alpha*0.55)]:
        w2, h2 = width*scale, height*scale
        off_x = cx - w2/2
        off_y = base_y + (height-h2)*0.35
        def Ts(px, py):
            nx, ny = px/400.0, py/560.0
            return (off_x + w2*nx, off_y + h2*(1-ny))
        c.setStrokeColor(Color(201/255, 169/255, 110/255, alpha=a))
        c.setLineWidth(1)
        p = c.beginPath()
        p.moveTo(*Ts(40, 560)); p.lineTo(*Ts(40, 220))
        p.curveTo(*Ts(40, 110), *Ts(110, 40), *Ts(200, 40))
        p.curveTo(*Ts(290, 40), *Ts(360, 110), *Ts(360, 220))
        p.lineTo(*Ts(360, 560))
        c.drawPath(p, stroke=1, fill=0)
    c.restoreState()

def mandala(c, cx, cy, r, spokes, alpha=0.10):
    c.saveState()
    c.setStrokeColor(Color(201/255, 169/255, 110/255, alpha=alpha))
    c.setLineWidth(0.5)
    c.circle(cx, cy, r, stroke=1, fill=0)
    c.circle(cx, cy, r*0.8, stroke=1, fill=0)
    for i in range(spokes):
        ang = math.radians(360/spokes*i)
        x2, y2 = cx+r*0.94*math.sin(ang), cy+r*0.94*math.cos(ang)
        c.line(cx, cy, x2, y2)
    c.restoreState()

def crescent(c, cx, cy, r, bg=BG):
    c.setFillColor(GOLD_BR)
    c.circle(cx, cy, r, stroke=0, fill=1)
    c.setFillColor(bg)
    c.circle(cx + r*0.42, cy + r*0.18, r*0.92, stroke=0, fill=1)

def star4(c, cx, cy, r, color=GOLD_BR):
    c.setFillColor(color)
    p = c.beginPath()
    pts = []
    for i in range(8):
        ang = math.radians(45*i)
        rr = r if i % 2 == 0 else r*0.35
        pts.append((cx+rr*math.sin(ang), cy+rr*math.cos(ang)))
    p.moveTo(*pts[0])
    for pt in pts[1:]:
        p.lineTo(*pt)
    p.close()
    c.drawPath(p, stroke=0, fill=1)

def mosque_silhouette(c, cx, base_y, scale=1.0):
    c.saveState()
    c.translate(cx, base_y)
    c.scale(scale, scale)
    c.setFillColor(Color(201/255, 169/255, 110/255, alpha=0.45))
    c.rect(-100, 0, 200, 4, stroke=0, fill=1)
    for dx in (-70, 70):
        p = c.beginPath()
        p.moveTo(dx-14, 4); p.lineTo(dx-14, 26)
        p.curveTo(dx-14, 40, dx+14, 40, dx+14, 26)
        p.lineTo(dx+14, 4); p.close()
        c.drawPath(p, stroke=0, fill=1)
    p = c.beginPath()
    p.moveTo(-42, 4); p.lineTo(-42, 42)
    p.curveTo(-42, 66, 42, 66, 42, 42)
    p.lineTo(42, 4); p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.circle(0, 68, 2.4, stroke=0, fill=1)
    c.setStrokeColor(Color(201/255, 169/255, 110/255, alpha=0.45)); c.setLineWidth(1)
    c.line(0, 68, 0, 58)
    c.restoreState()

def wrap_text(c, text, font, size, max_width):
    words = text.split(); lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if pdfmetrics.stringWidth(test, font, size) <= max_width:
            cur = test
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def centred_paragraph(c, text, font, size, cx, y, max_width, leading, color=IVORY):
    for line in wrap_text(c, text, font, size, max_width):
        c.setFont(font, size); c.setFillColor(color)
        c.drawCentredString(cx, y, line)
        y -= leading
    return y

# ==========================================================================
c = canvas.Canvas("walima_invite.pdf", pagesize=(W, H))
c.setTitle("Salam & Sara — Walima Reception")
c.setAuthor("Salim Farshori & Atiya Iqbal")
c.setSubject("You are invited to the Walima reception of Salam & Sara")

# -------------------------------------------------------------- PAGE 1: COVER
c.bookmarkPage("cover")
background(c)
corner_motifs(c)

ex, ey, ew, eh = W/2-110, H/2-70, 220, 140
c.setStrokeColor(GOLD); c.setLineWidth(1)
c.setFillColor(PANEL)
c.roundRect(ex, ey, ew, eh, 6, stroke=1, fill=1)
# envelope flap
c.setStrokeColor(GOLD); c.setLineWidth(0.9)
c.line(ex, ey+eh, ex+ew/2, ey+eh-58)
c.line(ex+ew, ey+eh, ex+ew/2, ey+eh-58)
# wax seal
c.setFillColor(GOLD)
c.circle(ex+ew/2, ey+eh-58, 15, stroke=0, fill=1)
c.setFont("DancingScript-Bold", 15)
c.setFillColor(BG)
c.drawCentredString(ex+ew/2, ey+eh-63, "S&S")

c.setFont("Poppins-Light", 8)
c.setFillColor(MUTED)
c.drawCentredString(W/2, ey-30, "T  A  P    T  O    O  P  E  N")

# whole card is a live link to page 2
c.linkRect("", "hero", (ex-20, ey-20, ex+ew+20, ey+eh+70), thickness=0, relative=0)
c.showPage()

# -------------------------------------------------------------- PAGE 2: HERO
c.bookmarkPage("hero")
background(c)
corner_motifs(c)
arch(c, W/2, 60, 300, H-110, alpha=0.32)

y = H - 108
bismillah = ar("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")
c.setFont("Amiri", 20)
c.setFillColor(GOLD_BR)
c.drawCentredString(W/2, y, bismillah)
y -= 30

c.setFont("EBGaramond-Italic", 12)
c.setFillColor(MUTED)
c.drawCentredString(W/2, y, "Together with the blessings of Allah")
y -= 34

c.setFont("EBGaramond-Bold", 15)
c.setFillColor(GOLD_BR)
c.drawCentredString(W/2, y, "Salim Farshori & Atiya Iqbal")
y -= 18
y = centred_paragraph(c, "request the honour of your presence at the Walima reception of their son",
                       "Poppins-Light", 8.3, W/2, y, 260, 12, color=MUTED)
y -= 34

c.setFont("EBGaramond-Bold", 40)
c.setFillColor(GOLD_BR)
c.drawCentredString(W/2 - 58, y, "Salam")
c.setFont("DancingScript", 30)
c.setFillColor(GOLD)
c.drawCentredString(W/2 + 12, y+2, "&")
c.setFont("EBGaramond-Bold", 40)
c.setFillColor(GOLD_BR)
c.drawCentredString(W/2 + 66, y, "Sara")
y -= 40

c.setFont("EBGaramond-Italic", 13)
c.setFillColor(MUTED)
c.drawCentredString(W/2, y, "on the occasion of their marriage")
y -= 26
divider(c, W/2, y)

c.setFont("Poppins-Light", 7.5)
c.setFillColor(MUTED)
star4(c, W/2, 62, 3, color=GOLD_DIM)
c.drawCentredString(W/2, 46, "swipe to continue")
c.showPage()
c.bookmarkPage("details")
background(c)
corner_motifs(c)

y = H - 96
c.setFont("Poppins-Medium", 8.5)
c.setFillColor(GOLD_DIM)
c.drawCentredString(W/2, y, "T H E   W A L I M A")
y -= 30
y = centred_paragraph(c,
    "The Walima is a cherished Sunnah \u2014 a joyous tradition passed down since the time of the Prophet Muhammad, "
    "when a marriage is announced and celebrated openly among family and friends.",
    "EBGaramond", 12.5, W/2, y, 280, 19)
y -= 12
y = centred_paragraph(c,
    "With grateful hearts, we invite you to share in this blessing \u2014 a feast, a gathering, and a prayer for the journey ahead.",
    "EBGaramond-Italic", 12, W/2, y, 270, 18, color=GOLD_BR)
y -= 26
divider(c, W/2, y)
y -= 44

# reception card
cw, ch = 280, 300
cx0, cy0 = W/2-cw/2, y-ch
c.setStrokeColor(GOLD); c.setLineWidth(1); c.setFillColor(PANEL)
c.roundRect(cx0, cy0, cw, ch, 4, stroke=1, fill=1)

yy = cy0+ch-40
c.setFont("Poppins-Light", 7.5); c.setFillColor(GOLD_DIM)
c.drawCentredString(W/2, cy0+ch-16, "Y O U   A R E   I N V I T E D   T O")
c.setFont("DancingScript-Bold", 34); c.setFillColor(GOLD_BR)
c.drawCentredString(W/2, yy-8, "Walima")
c.setFont("EBGaramond-Italic", 11); c.setFillColor(MUTED)
c.drawCentredString(W/2, yy-30, "An Evening of Elegance & Celebration")

rows = ["26th December 2026", "7:00 PM onwards", "Rahmani Farm, Badaun"]
ry = yy-62
for row in rows:
    star4(c, W/2-96, ry+3.5, 3, color=GOLD)
    c.setFont("EBGaramond", 13); c.setFillColor(IVORY)
    c.drawCentredString(W/2+6, ry, row)
    ry -= 26

c.setStrokeColor(LINE); c.setDash(2, 2); c.setLineWidth(0.6)
c.line(cx0+30, ry-4, cx0+cw-30, ry-4)
c.setDash()
c.setFont("Poppins-Light", 8); c.setFillColor(GOLD_DIM)
c.drawCentredString(W/2, ry-22, "F I N E S T ,   M O S T   E L E G A N T   A T T I R E")

c.setFont("Poppins-Light", 7.5); c.setFillColor(MUTED)
c.drawCentredString(W/2, 40, "swipe to continue")
c.showPage()

# ------------------------------------------------------------- PAGE 4: RSVP
c.bookmarkPage("rsvp")
background(c)
corner_motifs(c)
crescent(c, W/2, H-110, 22)

y = H - 168
y = centred_paragraph(c, "Your presence and duas would mean the world to us.",
                       "EBGaramond", 15, W/2, y, 260, 22)
y -= 34

# RSVP button
RSVP_LINK = "https://wa.me/910000000000?text=Bismillah!%20I%27d%20love%20to%20join%20you%20for%20the%20Walima."
bw, bh = 168, 40
bx, by = W/2-bw/2, y-bh
c.setFillColor(GOLD_BR)
c.roundRect(bx, by, bw, bh, bh/2, stroke=0, fill=1)
c.setFont("Poppins-Medium", 11)
c.setFillColor(BG)
c.drawCentredString(W/2, by+bh/2-4, "RSVP")
c.linkURL(RSVP_LINK, (bx, by, bx+bw, by+bh), thickness=0)
y = by - 28
c.setFont("Poppins-Light", 7.5); c.setFillColor(MUTED)
c.drawCentredString(W/2, y, "tap to message us on WhatsApp")
y -= 60

divider(c, W/2, y)
y -= 34
c.setFont("DancingScript-Bold", 26); c.setFillColor(GOLD_BR)
c.drawCentredString(W/2, y, "With love & duas")
y -= 24
c.setFont("EBGaramond-Italic", 12); c.setFillColor(MUTED)
c.drawCentredString(W/2, y, "Azam Farshori")

mosque_silhouette(c, W/2, 118, scale=0.85)
c.setFont("Poppins-Light", 8); c.setFillColor(MUTED)
c.drawCentredString(W/2, 56, "B A D A U N   \u00b7   D E C E M B E R   2 0 2 6")

c.showPage()
c.save()
print("done")
