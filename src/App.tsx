"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const root = containerRef.current;

    // Stars
    const starsContainer = root.querySelector("#starsContainer");
    if (starsContainer && starsContainer.children.length === 0) {
      for (let i = 0; i < 120; i++) {
        const s = document.createElement("div");
        s.className = "ns-star";
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
        const sz = (1 + Math.random() * 2).toFixed(1) + "px";
        s.style.width = sz;
        s.style.height = sz;
        starsContainer.appendChild(s);
      }
    }

    // Clock
    function fmtLong() {
      const n = new Date();
      return (
        n.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: true,
        }) + " IST"
      );
    }
    function fmtShort() {
      const n = new Date();
      return (
        n.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: true,
        }) + " IST"
      );
    }
    function tick() {
      const l = fmtLong(),
        s = fmtShort();
      const e1 = root.querySelector("#landingClock");
      if (e1) e1.textContent = l;
      const e2 = root.querySelector("#policeClock");
      if (e2) e2.textContent = s;
      const e3 = root.querySelector("#judgeClock");
      if (e3) e3.textContent = s;
    }
    tick();
    const ci = setInterval(tick, 1000);

    // Nav
    function show(t: string) {
      root.querySelector("#landingPage")?.classList.add("ns-hidden");
      root.querySelector("#policeDashboard")?.classList.add("ns-hidden");
      root.querySelector("#judgeDashboard")?.classList.add("ns-hidden");
      if (t === "police")
        root.querySelector("#policeDashboard")?.classList.remove("ns-hidden");
      else if (t === "judge")
        root.querySelector("#judgeDashboard")?.classList.remove("ns-hidden");
    }
    function goBack() {
      root.querySelector("#policeDashboard")?.classList.add("ns-hidden");
      root.querySelector("#judgeDashboard")?.classList.add("ns-hidden");
      root.querySelector("#landingPage")?.classList.remove("ns-hidden");
    }

    // File
    function updFile(inp: HTMLInputElement) {
      const el = root.querySelector("#fileStatus");
      if (el) el.textContent = inp.files?.[0] ? inp.files[0].name : "No file selected.";
    }
    function doUpload() {
      const cid = (root.querySelector("#policeCaseId") as HTMLInputElement)?.value.trim();
      const el = root.querySelector("#uploadStatus");
      const fs = root.querySelector("#fileStatus")?.textContent;
      if (!el) return;
      if (!cid) { el.textContent = "Please enter a Case ID."; return; }
      if (fs === "No file selected.") { el.textContent = "Please select a file first."; return; }
      el.textContent = "Uploading to IPPS & Blockchain...";
      setTimeout(() => { if (el) el.textContent = "Evidence uploaded successfully."; }, 2000);
    }
    function doVerify() {
      const h = (root.querySelector("#judgeHash") as HTMLInputElement)?.value.trim();
      const el = root.querySelector("#verifyResult");
      if (!el) return;
      if (!h) { el.textContent = "Please enter a File Hash or Case ID."; return; }
      el.textContent = "Verifying evidence on blockchain...";
      setTimeout(() => { if (el) el.textContent = "Evidence verified. Integrity confirmed."; }, 2000);
    }

    // Listeners
    const pc = root.querySelector("[data-role='police']");
    const jc = root.querySelector("[data-role='judge']");
    const bbs = root.querySelectorAll("[data-action='back']");
    const ub = root.querySelector("[data-action='upload']");
    const vb = root.querySelector("[data-action='verify']");
    const fi = root.querySelector("[data-action='file']") as HTMLInputElement;

    const ph = () => show("police");
    const jh = () => show("judge");
    const bh = () => goBack();
    const uh = () => doUpload();
    const vh = () => doVerify();
    const fh = (e: Event) => updFile(e.target as HTMLInputElement);

    pc?.addEventListener("click", ph);
    jc?.addEventListener("click", jh);
    bbs.forEach((b) => b.addEventListener("click", bh));
    ub?.addEventListener("click", uh);
    vb?.addEventListener("click", vh);
    fi?.addEventListener("change", fh);

    [pc, jc].forEach((c) => {
      c?.addEventListener("keydown", (e) => {
        const ke = e as KeyboardEvent;
        if (ke.key === "Enter" || ke.key === " ") { e.preventDefault(); (c as HTMLElement).click(); }
      });
    });

    return () => {
      clearInterval(ci);
      pc?.removeEventListener("click", ph);
      jc?.removeEventListener("click", jh);
      bbs.forEach((b) => b.removeEventListener("click", bh));
      ub?.removeEventListener("click", uh);
      vb?.removeEventListener("click", vh);
      fi?.removeEventListener("change", fh);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.ns-root{
  --bg:#0a1221;--bg2:#0e1a2e;
  --card-c:rgba(15,30,50,0.55);--card-g:rgba(10,30,28,0.55);
  --bc:rgba(0,210,230,0.18);--bg2g:rgba(50,210,130,0.25);
  --txt:#d0dce8;--txt2:#7a8fa6;--txt3:#4a5e75;
  --c4:#22d3ee;--c5:#06b6d4;--cg:rgba(0,210,230,0.15);
  --e4:#34d399;--e5:#10b981;--eg:rgba(50,210,130,0.15);
  --ff:'Rajdhani',system-ui,sans-serif;
  --fd:'Orbitron',system-ui,sans-serif;
  font-family:var(--ff);background:var(--bg);color:var(--txt);
  min-height: 100vh;
  width: 100vw;           
  display: flex;          
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  background-image:
    linear-gradient(rgba(0,210,230,0.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,210,230,0.025) 1px,transparent 1px);
  background-size:60px 60px;
}
.ns-hidden{display:none!important}

/* Stars */
.ns-stars{position:fixed;inset:0;pointer-events:none;z-index:0}
.ns-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;opacity:.25;animation:tw 3s infinite ease-in-out}
@keyframes tw{0%,100%{opacity:.15}50%{opacity:.7}}

/* Ambient */
.ns-amb{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(circle at 25% 30%,rgba(0,210,230,.07) 0%,transparent 55%),
  radial-gradient(circle at 75% 70%,rgba(50,210,130,.06) 0%,transparent 55%)}

/* Animated corner accents on cards */
.ns-corner-tl,.ns-corner-tr,.ns-corner-bl,.ns-corner-br{position:absolute;width:24px;height:24px;pointer-events:none}
.ns-corner-tl{top:-1px;left:-1px;border-top:2px solid;border-left:2px solid;border-radius:4px 0 0 0}
.ns-corner-tr{top:-1px;right:-1px;border-top:2px solid;border-right:2px solid;border-radius:0 4px 0 0}
.ns-corner-bl{bottom:-1px;left:-1px;border-bottom:2px solid;border-left:2px solid;border-radius:0 0 0 4px}
.ns-corner-br{bottom:-1px;right:-1px;border-bottom:2px solid;border-right:2px solid;border-radius:0 0 4px 0}
.ns-corners-cyan .ns-corner-tl,.ns-corners-cyan .ns-corner-tr,.ns-corners-cyan .ns-corner-bl,.ns-corners-cyan .ns-corner-br{border-color:rgba(0,210,230,.45)}
.ns-corners-green .ns-corner-tl,.ns-corners-green .ns-corner-tr,.ns-corners-green .ns-corner-bl,.ns-corners-green .ns-corner-br{border-color:rgba(50,210,130,.5)}

/* Page */
.ns-page{
  position:relative;
  z-index:1;
  min-height:100vh;
  width: 100%; 
  display:flex;
  flex-direction:column;
  justify-content: space-between; 
}

/* Header */
.ns-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2rem}
@media(min-width:768px){.ns-hdr{padding:2rem 3rem}}
.ns-hdr-l,<div className="ns-hdr-r" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
</div>
.ns-hdr-r{justify-content:flex-end;gap:1rem}
.ns-hdr-c{display:flex;justify-content:center}

/* Logo */
.ns-logo{display:flex;align-items:center;gap:.75rem}
.ns-logo-t{display:flex;flex-direction:column}
.ns-logo-n{font-family:var(--fd);font-weight:1000;font-size:2.2rem;letter-spacing:.1em;color:var(--txt);line-height:1.1}
.ns-logo-n--lg{font-size:2rem}
@media(min-width:768px){.ns-logo-n--lg{font-size:2.5rem}}
.ns-logo-s{font-size:.65rem;letter-spacing:.35em;color:var(--c4);text-transform:uppercase;font-weight:600;margin-top:-2px}

/* Login section */
.ns-lsec{display:flex;flex-direction:column;align-items:center;margin-top:1.5rem;gap:.75rem}
.ns-lbox{display:flex;flex-direction:column;width:18rem}
.ns-linp{width:100%;padding:.625rem 1rem;background:rgba(10,18,33,.6);border:1px solid rgba(0,210,230,.25);color:var(--txt);font-family:var(--ff);font-size:.8125rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;outline:none;transition:border-color .25s}
.ns-linp+.ns-linp{border-top:none}
.ns-linp::placeholder{color:var(--txt3);letter-spacing:.15em}
.ns-linp:focus{border-color:rgba(0,210,230,.5)}
.ns-bio{display:flex;align-items:center;justify-content:center;gap:.5rem;background:transparent;border:none;color:var(--c4);font-family:var(--ff);font-weight:700;font-size:.8125rem;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;padding:.5rem;transition:opacity .2s}
.ns-bio:hover{opacity:.75}

/* Role cards area */
.ns-cards{flex:1;display:flex;align-items:center;justify-content:center;padding:2rem 1.5rem}
@media(min-width:768px){.ns-cards{padding:2.5rem 3rem}}
.ns-cards-g{display:flex;flex-direction:column;gap:2rem;width:100%;max-width:58rem}
@media(min-width:768px){.ns-cards-g{flex-direction:row;gap:2.5rem}}

/* Glass card */
.ns-gc{
  flex:1;position:relative;overflow:hidden;
  background:linear-gradient(135deg,var(--card-c),rgba(12,22,40,.4));
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border:1px solid var(--bc);border-radius:.75rem;
  padding:2rem 2rem 2.25rem;display:flex;flex-direction:column;align-items:center;
  gap:1.25rem;cursor:pointer;transition:all .35s;
  box-shadow:0 0 20px var(--cg),0 0 60px rgba(0,210,230,.04);
  min-height:360px;
}
.ns-gc:hover{border-color:rgba(0,210,230,.35);transform:translateY(-4px)}
@media(min-width:768px){.ns-gc{padding:2.5rem 2.5rem 2.5rem;min-height:400px;gap:1.5rem}}

.ns-gc--gr{
  background:linear-gradient(135deg,var(--card-g),rgba(8,22,22,.4));
  border-color:var(--bg2g);box-shadow:0 0 20px var(--eg),0 0 60px rgba(50,210,130,.04);
}
.ns-gc--gr:hover{border-color:rgba(50,210,130,.4)}

/* Inner glow line on cards */
.ns-gc::before{
  content:'';position:absolute;inset:0;border-radius:.75rem;
  background:linear-gradient(180deg,rgba(0,210,230,.06) 0%,transparent 40%);
  pointer-events:none;
}
.ns-gc--gr::before{
  background:linear-gradient(180deg,rgba(50,210,130,.06) 0%,transparent 40%);
}

/* Card title */
.ns-ct{font-family:var(--fd);font-weight:700;font-size:1rem;letter-spacing:.15em;text-transform:uppercase;color:var(--txt);text-align:center;position:relative;z-index:1}
@media(min-width:768px){.ns-ct{font-size:1.15rem}}

/* Card login btn */
.ns-clb{
  display:inline-block;padding:.6rem 2.5rem;border:2px solid rgba(0,210,230,.55);
  border-radius:.3rem;background:transparent;color:var(--c4);font-family:var(--fd);
  font-weight:700;font-size:.8125rem;letter-spacing:.2em;text-transform:uppercase;
  cursor:pointer;transition:all .2s;position:relative;z-index:1;
}
.ns-clb:hover{background:rgba(0,210,230,.08);box-shadow:0 0 12px rgba(0,210,230,.2)}
.ns-clb--gr{border-color:transparent;background:rgba(16,185,129,.85);color:var(--bg)}
.ns-clb--gr:hover{background:var(--e4);box-shadow:0 0 16px rgba(50,210,130,.3)}

/* Ring icon container */
.ns-ri{position:relative;width:200px;height:200px;display:flex;align-items:center;justify-content:center;z-index:1}
@media(max-width:767px){.ns-ri{width:160px;height:160px}}

/* Ring layers */
.ns-ri-out{position:absolute;inset:0;animation:rSlow 14s linear infinite}
.ns-ri-mid{position:absolute;inset:10px;animation:rRev 10s linear infinite}
.ns-ri-in{position:absolute;inset:24px;animation:rSlow 18s linear infinite}
@keyframes rSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rRev{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}

/* Glow circle */
.ns-ri-glow{
  position:absolute;top:50%;left:50%;width:50%;height:50%;
  transform:translate(-50%,-50%);border-radius:50%;
  animation:pGlow 3s ease-in-out infinite;
}
.ns-ri-glow--c{border:1.5px solid rgba(0,210,230,.3);box-shadow:0 0 30px rgba(0,210,230,.15),inset 0 0 20px rgba(0,210,230,.05)}
.ns-ri-glow--g{border:1.5px solid rgba(50,210,130,.3);box-shadow:0 0 30px rgba(50,210,130,.15),inset 0 0 20px rgba(50,210,130,.05)}
@keyframes pGlow{0%,100%{opacity:.55}50%{opacity:1}}

/* Center symbol */
.ns-ri-sym{position:relative;z-index:2}

/* Scan line effect on cards */
.ns-gc-scan{
  position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,210,230,.25),transparent);
  animation:scanDown 4s linear infinite;pointer-events:none;
}
.ns-gc--gr .ns-gc-scan{background:linear-gradient(90deg,transparent,rgba(50,210,130,.25),transparent)}
@keyframes scanDown{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}

/* Avatar */
.ns-av{position:relative;width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(30,50,70,.8);border:1px solid rgba(100,150,180,.2);display:flex;align-items:center;justify-content:center;overflow:hidden}
.ns-av-dot{position:absolute;top:-1px;right:-1px;width:.75rem;height:.75rem;background:var(--e4);border-radius:50%;border:2px solid var(--bg)}

/* Back btn */
.ns-bb{display:inline-flex;align-items:center;gap:.5rem;background:transparent;border:none;color:var(--c4);font-family:var(--ff);font-weight:700;font-size:.875rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
.ns-bb:hover{opacity:.75}
.ns-bb--g{color:var(--e4)}

/* Dashboard */
.ns-db{flex:1;display:flex;align-items:center;justify-content:center;padding:1rem 1rem 2rem}
.ns-db-out{width:100%;max-width:42rem;background:linear-gradient(135deg,rgba(18,30,50,.75),rgba(12,22,40,.55));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(100,180,220,.1);border-radius:1.25rem;padding:1.5rem}
@media(min-width:768px){.ns-db-out{padding:2.5rem}}
.ns-db-in{position:relative;background:linear-gradient(135deg,var(--card-c),rgba(12,22,40,.4));backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid var(--bc);border-radius:.75rem;padding:1.5rem;box-shadow:0 0 20px var(--cg);margin-bottom:1.5rem}
.ns-db-in--g{background:linear-gradient(135deg,var(--card-g),rgba(8,22,22,.4));border-color:var(--bg2g);box-shadow:0 0 20px var(--eg)}
.ns-db-in:last-child{margin-bottom:0}
.ns-db-hd{display:flex;align-items:center;gap:.75rem;margin-bottom:1.5rem}
.ns-db-ti{font-family:var(--fd);font-weight:700;font-size:1.2rem;letter-spacing:.06em;color:var(--txt)}
@media(min-width:768px){.ns-db-ti{font-size:1.4rem}}

/* Form */
.ns-fi{width:100%;padding:.8rem 1rem;background:rgba(240,245,250,.92);border:1px solid transparent;border-radius:.375rem;font-family:var(--ff);font-size:.875rem;font-weight:500;color:#1a2535;outline:none;transition:box-shadow .2s}
.ns-fi::placeholder{color:var(--txt2)}
.ns-fi:focus{box-shadow:0 0 0 3px rgba(0,210,230,.2)}
.ns-fi--sr{padding-right:3rem}
.ns-fi:focus.ns-fi--g{box-shadow:0 0 0 3px rgba(50,210,130,.2)}
.ns-fg{margin-bottom:1rem}
.ns-sw{position:relative}
.ns-sw-ic{position:absolute;right:1rem;top:50%;transform:translateY(-50%);color:var(--txt3);pointer-events:none}

.ns-fw{position:relative;display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:rgba(40,55,75,.5);border:1px solid rgba(100,120,140,.25);border-radius:.375rem;cursor:pointer;transition:background .2s}
.ns-fw:hover{background:rgba(40,55,75,.7)}
.ns-fw input[type="file"]{position:absolute;inset:0;opacity:0;cursor:pointer}
.ns-fw-ic{color:var(--txt2);flex-shrink:0}
.ns-fw-lb{font-weight:600;font-size:.875rem;color:var(--txt2)}
.ns-fw-st{font-size:.8125rem;color:var(--txt3);margin-left:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:10rem}

.ns-sub{width:100%;padding:.875rem;border:none;border-radius:.5rem;font-family:var(--fd);font-weight:700;font-size:.9375rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:all .25s}
.ns-sub--b{background:linear-gradient(135deg,#2563eb,#0891b2);color:#fff;box-shadow:0 4px 16px rgba(37,99,235,.35)}
.ns-sub--b:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,.5)}
.ns-sub--g{background:linear-gradient(135deg,var(--e4),var(--e5));color:var(--bg);box-shadow:0 4px 16px rgba(50,210,130,.35)}
.ns-sub--g:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(50,210,130,.5)}

.ns-stb{margin-top:1rem;display:flex;align-items:center;gap:.5rem;font-size:.8125rem;color:var(--txt2)}
.ns-stb-d{color:var(--c4);animation:pGlow 2s ease-in-out infinite}
.ns-rb{margin-top:1rem;padding:.75rem 1rem;background:rgba(15,25,40,.4);border:1px solid rgba(100,140,170,.15);border-radius:.375rem;font-size:.8125rem;color:var(--txt2)}

@media(max-width:767px){
  .ns-logo-n--lg{font-size:1.75rem}
  .ns-hdr{flex-wrap:wrap;gap:.75rem}
}
`,
        }}
      />
      <div ref={containerRef} className="ns-root">
        <div className="ns-stars" id="starsContainer" />
        <div className="ns-amb" />

        {/* ===== LANDING PAGE ===== */}
        <div id="landingPage" className="ns-page">
          <header className="ns-hdr">
            <div className="ns-hdr-l" />
            <div className="ns-hdr-c">
              <div className="ns-logo">
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M32 8L8 20V24H56V20L32 8Z" fill="#22d3ee" />

                  {/* Pillars - Symbolizing Strength and Justice */}
                  <rect x="14" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="25" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="36" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="47" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="6" y="50" width="52" height="4" rx="1" fill="#22d3ee" opacity="0.8" />
                  <rect x="10" y="56" width="44" height="4" rx="1" fill="#22d3ee" opacity="0.6" />
                </svg>
                <div className="ns-logo-t" style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  marginLeft: '20px', 
  paddingTop: '40px',  
  justifyContent: 'center' 
}}>
                  <span className="ns-logo-n" style={{ fontSize: '2.25rem', fontWeight: 'bold', lineHeight: '1', color: '#ffffff' }}>
                    NyayaSetu - The Bridge of Justice
                  </span>
                  <span className="ns-tagline" style={{ fontSize: '1.25rem', opacity: '0.8', color: '#22d3ee', marginTop: '12px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                    Digital Evidence System for Indian Courts | Blockchain Secured and Tamper-Proof
                  </span>
                </div>
              </div>
            </div>
            <div className="ns-hdr-r">
            </div>
          </header>

          {/* Department Cards */}
          <section className="ns-cards">
            <div className="ns-cards-g">
              {/* Police Card */}
              <div
                className="ns-gc ns-corners-cyan"
                data-role="police"
                role="button"
                tabIndex={0}
                aria-label="Open Police Department Login"
              >
                <div className="ns-gc-scan" />
                <div className="ns-corner-tl" />
                <div className="ns-corner-tr" />
                <div className="ns-corner-bl" />
                <div className="ns-corner-br" />

                <h2 className="ns-ct">Police Department</h2>

                <div className="ns-ri">
                  {/* Outer ring */}
                  <svg className="ns-ri-out" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="92" stroke="rgba(0,210,230,0.12)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="92" stroke="rgba(0,210,230,0.55)" strokeWidth="2" strokeDasharray="14 8 6 8" strokeLinecap="round" />
                    {/* Tick marks */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
                      <line key={a} x1="100" y1="12" x2="100" y2="20" stroke="rgba(0,210,230,0.5)" strokeWidth="2" transform={`rotate(${a} 100 100)`} />
                    ))}
                  </svg>
                  {/* Middle ring */}
                  <svg className="ns-ri-mid" viewBox="0 0 180 180" fill="none">
                    <circle cx="90" cy="90" r="80" stroke="rgba(0,210,230,0.35)" strokeWidth="1.5" strokeDasharray="22 5 5 5" strokeLinecap="round" />
                    {/* Small dots */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <circle key={a} cx="90" cy="14" r="2" fill="rgba(0,210,230,0.6)" transform={`rotate(${a} 90 90)`} />
                    ))}
                  </svg>
                  {/* Inner ring */}
                  <svg className="ns-ri-in" viewBox="0 0 140 140" fill="none">
                    <circle cx="70" cy="70" r="62" stroke="rgba(0,210,230,0.2)" strokeWidth="1" strokeDasharray="8 12" />
                  </svg>
                  {/* Glow */}
                  <div className="ns-ri-glow ns-ri-glow--c" />
                  {/* Shield + P */}
                  <svg className="ns-ri-sym" width="60" height="68" viewBox="0 0 56 64" fill="none">
                    <path d="M28 2 L50 14 L50 34 C50 48 38 58 28 62 C18 58 6 48 6 34 L6 14 Z" stroke="#22d3ee" strokeWidth="2.5" fill="rgba(0,210,230,0.08)" />
                    <text x="28" y="43" textAnchor="middle" fill="#22d3ee" fontSize="28" fontWeight="700" fontFamily="'Orbitron',system-ui">
                      P
                    </text>
                  </svg>
                </div>

                <button className="ns-clb" type="button">
                  LOGIN
                </button>
              </div>

              {/* Judicial Card */}
              <div
                className="ns-gc ns-gc--gr ns-corners-green"
                data-role="judge"
                role="button"
                tabIndex={0}
                aria-label="Open Judicial Chamber Login"
              >
                <div className="ns-gc-scan" />
                <div className="ns-corner-tl" />
                <div className="ns-corner-tr" />
                <div className="ns-corner-bl" />
                <div className="ns-corner-br" />

                <h2 className="ns-ct">Judicial Chamber</h2>

                <div className="ns-ri">
                  {/* Outer ring */}
                  <svg className="ns-ri-out" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="92" stroke="rgba(50,210,130,0.12)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="92" stroke="rgba(50,210,130,0.55)" strokeWidth="2" strokeDasharray="14 8 6 8" strokeLinecap="round" />
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
                      <line key={a} x1="100" y1="12" x2="100" y2="20" stroke="rgba(50,210,130,0.5)" strokeWidth="2" transform={`rotate(${a} 100 100)`} />
                    ))}
                  </svg>
                  {/* Middle ring */}
                  <svg className="ns-ri-mid" viewBox="0 0 180 180" fill="none">
                    <circle cx="90" cy="90" r="80" stroke="rgba(50,210,130,0.35)" strokeWidth="1.5" strokeDasharray="22 5 5 5" strokeLinecap="round" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <circle key={a} cx="90" cy="14" r="2" fill="rgba(50,210,130,0.6)" transform={`rotate(${a} 90 90)`} />
                    ))}
                  </svg>
                  {/* Inner ring */}
                  <svg className="ns-ri-in" viewBox="0 0 140 140" fill="none">
                    <circle cx="70" cy="70" r="62" stroke="rgba(50,210,130,0.2)" strokeWidth="1" strokeDasharray="8 12" />
                  </svg>
                  {/* Glow */}
                  <div className="ns-ri-glow ns-ri-glow--g" />
                  {/* Gavel icon - Upscaled & Bold Version */}
                  <svg className="ns-ri-sym" width="60" height="60" viewBox="0 0 64 64" fill="none">
                    {/* Hammer */}
                    <rect x="20" y="18" width="40" height="18" rx="4" fill="#34d399" transform="rotate(-45 40 27)" />

                    {/* Stick */}
                    <rect x="38" y="32" width="6" height="32" rx="3" fill="#34d399" opacity="0.85" transform="rotate(-45 41 32)" />

                    {/* Base*/}
                    <rect x="8" y="54" width="48" height="6" rx="3" fill="#34d399" opacity="0.6" />
                  </svg>
                </div>

                <button className="ns-clb ns-clb--gr" type="button">
                  LOGIN
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ===== POLICE DASHBOARD ===== */}
        <div id="policeDashboard" className="ns-page ns-hidden">
          <header className="ns-hdr" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            <div className="ns-hdr-l" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              <button type="button" className="ns-bb" data-action="back" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>

            <div className="ns-hdr-c" style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="ns-logo">
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M32 8L8 20V24H56V20L32 8Z" fill="#22d3ee" />

                  {/* Pillars - Symbolizing Strength and Justice */}
                  <rect x="14" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="25" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="36" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="47" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="6" y="50" width="52" height="4" rx="1" fill="#22d3ee" opacity="0.8" />
                  <rect x="10" y="56" width="44" height="4" rx="1" fill="#22d3ee" opacity="0.6" />
                </svg>
                <div className="ns-logo-t" style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  marginLeft: '20px', 
  paddingTop: '40px',  
  justifyContent: 'center' 
}}>
                  <span className="ns-logo-n" style={{ fontSize: '2.25rem', fontWeight: 'bold', lineHeight: '1', color: '#ffffff' }}>
                    NyayaSetu - The Bridge of Justice
                  </span>
                  <span className="ns-tagline" style={{ fontSize: '1.25rem', opacity: '0.8', color: '#22d3ee', marginTop: '12px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                    Digital Evidence System for Indian Courts | Blockchain Secured and Tamper-Proof
                  </span>
                </div>
              </div>
            </div>
            <div className="ns-hdr-r" style={{ flex: 1 }}>
            </div>

          </header>

          <section className="ns-db">
            <div className="ns-db-out">
              <div className="ns-db-in ns-corners-cyan" style={{ position: "relative" }}>
                <div className="ns-corner-tl" />
                <div className="ns-corner-tr" />
                <div className="ns-corner-bl" />
                <div className="ns-corner-br" />
                <div className="ns-db-hd">
                  <svg width="50" height="50" viewBox="0 0 56 64" fill="none" aria-hidden="true">
                    <path d="M28 2 L50 14 L50 34 C50 48 38 58 28 62 C18 58 6 48 6 34 L6 14 Z" stroke="#22d3ee" strokeWidth="3" fill="rgba(0,210,230,0.1)" />
                    <text x="28" y="42" textAnchor="middle" fill="#22d3ee" fontSize="24" fontWeight="1000" fontFamily="'Orbitron',system-ui">P</text>
                  </svg>
                  <h1 className="ns-db-ti">Police Dashboard</h1>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="ns-fg">
                    <input type="text" className="ns-fi" placeholder="Case ID" id="policeCaseId" />
                  </div>
                  <div className="ns-fg">
                    <div className="ns-fw">
                      <svg className="ns-fw-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span className="ns-fw-lb">Choose File</span>
                      <span className="ns-fw-st" id="fileStatus">No file selected.</span>
                      <input type="file" data-action="file" aria-label="Upload evidence file" />
                    </div>
                  </div>
                  <button type="button" className="ns-sub ns-sub--b" data-action="upload">
                    {"Upload to IPFS & Blockchain"}
                  </button>
                  <div className="ns-stb">
                    <span className="ns-stb-d">{"*"}</span>
                    <span>{"Status: "}</span>
                    <span id="uploadStatus">Awaiting file...</span>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>


        {/* ===== JUDGE DASHBOARD ===== */}
        <div id="judgeDashboard" className="ns-page ns-hidden">
          <header className="ns-hdr" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="ns-hdr-l" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
              <button type="button" className="ns-bb" data-action="back" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#34d399'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Back
              </button>
            </div>
            <div className="ns-hdr-c" style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="ns-logo">
                <svg width="50" height="50" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <path d="M32 8L8 20V24H56V20L32 8Z" fill="#22d3ee" />

                  {/* Pillars - Symbolizing Strength and Justice */}
                  <rect x="14" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="25" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="36" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="47" y="28" width="6" height="20" rx="1" fill="#22d3ee" opacity="0.9" />
                  <rect x="6" y="50" width="52" height="4" rx="1" fill="#22d3ee" opacity="0.8" />
                  <rect x="10" y="56" width="44" height="4" rx="1" fill="#22d3ee" opacity="0.6" />
                </svg>
                <div className="ns-logo-t" style={{ 
  display: 'flex', 
  flexDirection: 'column', 
  marginLeft: '20px', 
  paddingTop: '40px',  
  justifyContent: 'center' 
}}>
                  <span className="ns-logo-n" style={{ fontSize: '2.25rem', fontWeight: 'bold', lineHeight: '1', color: '#ffffff' }}>
                    NyayaSetu - The Bridge of Justice
                  </span>
                  <span className="ns-tagline" style={{ fontSize: '1.25rem', opacity: '0.8', color: '#22d3ee', marginTop: '12px', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>
                    Digital Evidence System for Indian Courts | Blockchain Secured and Tamper-Proof
                  </span>
                </div>
              </div>
            </div>
            <div className="ns-hdr-r" style={{ flex: 1 }}>
            </div>

          </header>

          <section className="ns-db">
            <div className="ns-db-out">
              <div className="ns-db-in ns-db-in--g ns-corners-green" style={{ position: "relative" }}>
                <div className="ns-corner-tl" />
                <div className="ns-corner-tr" />
                <div className="ns-corner-bl" />
                <div className="ns-corner-br" />
                <div className="ns-db-hd">
                  <svg width="50" height="50" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="14" stroke="#34d399" strokeWidth="1.5" fill="rgba(50,210,130,0.1)" />
                    <line x1="16" y1="6" x2="16" y2="24" stroke="#34d399" strokeWidth="1.5" />
                    <line x1="8" y1="10" x2="24" y2="10" stroke="#34d399" strokeWidth="1.5" />
                    <path d="M8 10 L5 18 H11 Z" fill="rgba(50,210,130,0.3)" stroke="#34d399" strokeWidth="1" />
                    <path d="M24 10 L21 18 H27 Z" fill="rgba(50,210,130,0.3)" stroke="#34d399" strokeWidth="1" />
                    <line x1="12" y1="24" x2="20" y2="24" stroke="#34d399" strokeWidth="1.5" />
                  </svg>
                  <h1 className="ns-db-ti">Judge Dashboard</h1>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="ns-fg">
                    <div className="ns-sw">
                      <input type="text" className="ns-fi ns-fi--sr ns-fi--g" placeholder="Enter File Hash or Case ID" id="judgeHash" />
                      <svg className="ns-sw-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                  </div>
                  <button type="button" className="ns-sub ns-sub--g" data-action="verify">
                    Verify Evidence
                  </button>
                  <div className="ns-rb" id="verifyResult">
                    Enter hash and verify.
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

