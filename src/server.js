<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Odont Hub — Protótipo MVP</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#010267;--purple:#542F62;--blue:#336699;
  --navy2:#0a0e9a;--purple2:#7a4496;--blue2:#4d82b8;
  --bg:#f3f4f9;--white:#fff;
  --text:#12133a;--text2:#4a4b6a;--text3:#8889aa;
  --border:#e3e5f0;--border2:#d0d2e8;
  --shadow:0 1px 3px rgba(1,2,103,.06),0 1px 2px rgba(1,2,103,.04);
  --shadow-md:0 4px 16px rgba(1,2,103,.1),0 2px 4px rgba(1,2,103,.05);
  --r:12px;--rs:8px;--sidebar:220px;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;
}
body{background:var(--bg);color:var(--text);font-size:14px;line-height:1.5;min-height:100vh}
#login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(140deg,#010267 0%,#542F62 55%,#336699 100%);position:relative;overflow:hidden;}
#login-screen::before{content:'';position:absolute;width:700px;height:700px;background:rgba(255,255,255,.03);border-radius:50%;top:-250px;right:-180px;}
#login-screen::after{content:'';position:absolute;width:500px;height:500px;background:rgba(255,255,255,.04);border-radius:50%;bottom:-150px;left:-120px;}
.login-card{background:white;border-radius:20px;padding:48px 44px;width:430px;box-shadow:0 32px 80px rgba(0,0,0,.22);position:relative;z-index:1;}
.login-logo{text-align:center;margin-bottom:32px;}
.login-logomark{display:inline-block;margin-bottom:12px;line-height:1;}
.login-logo h1{font-size:22px;font-weight:800;color:var(--navy);letter-spacing:-.5px;}
.login-logo h1 span{color:var(--purple);}
.login-logo p{font-size:12px;color:var(--text3);margin-top:3px;}
.lbl{display:block;font-size:11px;font-weight:700;color:var(--text2);margin-bottom:6px;letter-spacing:.06em;text-transform:uppercase;}
.inp{width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:14px;font-family:inherit;color:var(--text);outline:none;margin-bottom:16px;transition:border-color .2s;}
.inp:focus{border-color:var(--blue);}
.btn-primary{width:100%;padding:13px;background:linear-gradient(135deg,#010267,#542F62);color:white;border:none;border-radius:var(--rs);font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;transition:opacity .2s,transform .1s;margin-top:4px;display:flex;align-items:center;justify-content:center;gap:8px;}
.btn-primary:hover{opacity:.9;transform:translateY(-1px);}
.login-divider{text-align:center;margin:18px 0;position:relative;}
.login-divider::before{content:'';position:absolute;top:50%;left:0;right:0;height:1px;background:var(--border);}
.login-divider span{position:relative;background:white;padding:0 12px;font-size:12px;color:var(--text3);}
.login-register{text-align:center;padding:10px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:13px;color:var(--text2);cursor:pointer;transition:all .15s;}
.login-register:hover{border-color:var(--blue);color:var(--blue);}
.login-register strong{color:var(--navy);}
.free-tag{display:inline-flex;align-items:center;gap:5px;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;border-radius:20px;padding:5px 12px;font-size:11px;font-weight:700;margin-top:18px;}
#app-screen{display:flex;min-height:100vh;}
.sidebar{width:var(--sidebar);background:var(--navy);position:fixed;top:0;left:0;height:100vh;z-index:10;display:flex;flex-direction:column;}
.sb-logo{padding:22px 18px 16px;border-bottom:1px solid rgba(255,255,255,.08);}
.sb-logo-row{display:flex;align-items:center;gap:10px;}
.logomark{flex-shrink:0;display:flex;align-items:center;justify-content:center;line-height:1;}
.logo-name{font-size:16px;font-weight:800;color:white;letter-spacing:-.3px;line-height:1.1;}
.logo-name span{color:#8ab4d4;}
.logo-plan{font-size:9px;font-weight:700;letter-spacing:.08em;background:rgba(255,255,255,.12);color:rgba(255,255,255,.65);padding:2px 7px;border-radius:4px;margin-top:3px;display:inline-block;}
.sb-nav{flex:1;overflow-y:auto;padding:14px 10px;}
.sb-section{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);padding:0 8px;margin-top:16px;margin-bottom:5px;}
.sb-section:first-child{margin-top:0;}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:9px;cursor:pointer;color:rgba(255,255,255,.55);font-size:13.5px;font-weight:500;transition:all .15s;margin-bottom:1px;user-select:none;}
.nav-item:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.9);}
.nav-item.active{background:linear-gradient(135deg,rgba(84,47,98,.7),rgba(51,102,153,.45));color:white;}
.nav-item i{font-size:18px;flex-shrink:0;}
.nb{margin-left:auto;background:#ef4444;color:white;font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;min-width:18px;text-align:center;}
.sb-footer{padding:12px 10px;border-top:1px solid rgba(255,255,255,.08);}
.user-row{display:flex;align-items:center;gap:9px;padding:8px;border-radius:9px;cursor:pointer;transition:background .15s;}
.user-row:hover{background:rgba(255,255,255,.07);}
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;flex-shrink:0;}
.av.s{width:28px;height:28px;font-size:10px;}
.av.m{width:36px;height:36px;font-size:13px;}
.av.l{width:44px;height:44px;font-size:15px;}
.av.xl{width:56px;height:56px;font-size:20px;}
.av-grad-1{background:linear-gradient(135deg,#010267,#336699);}
.av-grad-2{background:linear-gradient(135deg,#542F62,#8b5cf6);}
.av-grad-3{background:linear-gradient(135deg,#336699,#4d82b8);}
.av-grad-4{background:linear-gradient(135deg,#7c4a0a,#d97706);}
.av-grad-5{background:linear-gradient(135deg,#065f46,#059669);}
.av-grad-6{background:linear-gradient(135deg,#7f1d1d,#dc2626);}
.av-grad-me{background:linear-gradient(135deg,#010267,#542F62);}
.user-name{font-size:13px;font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.user-cro{font-size:10px;color:rgba(255,255,255,.4);}
.main{margin-left:var(--sidebar);flex:1;display:flex;flex-direction:column;min-height:100vh;}
.free-bar{background:rgba(16,185,129,.08);border-bottom:1px solid rgba(16,185,129,.2);padding:7px 28px;display:flex;align-items:center;gap:10px;font-size:12px;color:#065f46;}
.free-bar i{font-size:15px;color:#059669;}
.free-bar a{color:var(--blue);font-weight:600;text-decoration:none;cursor:pointer;margin-left:auto;font-size:11px;}
.topbar{background:white;border-bottom:1px solid var(--border);padding:12px 28px;display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:5;}
.page-title{font-size:16px;font-weight:700;color:var(--navy);flex:1;}
.search{display:flex;align-items:center;gap:8px;background:var(--bg);border:1.5px solid var(--border);border-radius:9px;padding:7px 12px;width:230px;}
.search input{border:none;background:transparent;font-size:13px;font-family:inherit;color:var(--text);outline:none;width:100%;}
.search input::placeholder{color:var(--text3);}
.search i{color:var(--text3);font-size:16px;}
.icon-btn{width:36px;height:36px;border-radius:9px;background:var(--bg);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2);font-size:18px;transition:all .15s;position:relative;}
.icon-btn:hover{background:var(--border);}
.notif-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:#ef4444;border-radius:50%;border:1.5px solid white;}
.page{padding:22px 28px;flex:1;display:none;width:100%;}
.page.active{display:block !important;width:100%;box-sizing:border-box;}
.card{background:white;border-radius:var(--r);padding:18px 20px;box-shadow:var(--shadow);border:1px solid var(--border);}
.card-neon{background:white;border-radius:14px;padding:13px;border:1.5px solid;position:relative;overflow:hidden;}
.card-neon::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.card-neon-purple{border-color:rgba(84,47,98,.3);box-shadow:0 4px 16px rgba(84,47,98,.12),0 0 20px rgba(84,47,98,.05);}
.card-neon-purple::before{background:linear-gradient(90deg,transparent,#542F62,transparent);}
.card-neon-blue{border-color:rgba(51,102,153,.3);box-shadow:0 4px 16px rgba(51,102,153,.12),0 0 20px rgba(51,102,153,.05);}
.card-neon-blue::before{background:linear-gradient(90deg,transparent,#336699,transparent);}
.card-neon-navy{border-color:rgba(1,2,103,.25);box-shadow:0 4px 16px rgba(1,2,103,.1),0 0 20px rgba(1,2,103,.04);}
.card-neon-navy::before{background:linear-gradient(90deg,transparent,#010267,transparent);}
.card-neon-violet{border-color:rgba(122,61,146,.3);box-shadow:0 4px 16px rgba(122,61,146,.12),0 0 20px rgba(122,61,146,.05);}
.card-neon-violet::before{background:linear-gradient(90deg,transparent,#7a3d92,transparent);}
.card-neon-teal{border-color:rgba(77,130,184,.3);box-shadow:0 4px 16px rgba(77,130,184,.12),0 0 20px rgba(77,130,184,.05);}
.card-neon-teal::before{background:linear-gradient(90deg,transparent,#4d82b8,transparent);}
.ic-neon-purple{background:linear-gradient(135deg,#f0eaf6,#e8d8f0);color:#542F62;box-shadow:0 0 14px rgba(84,47,98,.2);}
.ic-neon-blue{background:linear-gradient(135deg,#e8eeff,#d8e8ff);color:#336699;box-shadow:0 0 14px rgba(51,102,153,.2);}
.ic-neon-navy{background:linear-gradient(135deg,#e8eaf8,#d8dcf5);color:#010267;box-shadow:0 0 14px rgba(1,2,103,.15);}
.ic-neon-violet{background:linear-gradient(135deg,#f5eeff,#ead8ff);color:#7a3d92;box-shadow:0 0 14px rgba(122,61,146,.2);}
.ic-neon-teal{background:linear-gradient(135deg,#e8f4ff,#d8eeff);color:#4d82b8;box-shadow:0 0 14px rgba(77,130,184,.2);}
.btn-electric{font-size:10px;font-weight:800;display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:20px;margin-top:9px;border:none;cursor:pointer;}
.btn-electric-purple{background:linear-gradient(135deg,#542F62,#7a3d92);color:white;box-shadow:0 2px 12px rgba(84,47,98,.5),0 0 20px rgba(84,47,98,.2);}
.btn-electric-blue{background:linear-gradient(135deg,#336699,#4d82b8);color:white;box-shadow:0 2px 12px rgba(51,102,153,.5),0 0 20px rgba(51,102,153,.2);}
.btn-electric-navy{background:linear-gradient(135deg,#010267,#0a0e9a);color:white;box-shadow:0 2px 12px rgba(1,2,103,.5),0 0 20px rgba(1,2,103,.2);}
.btn-electric-violet{background:linear-gradient(135deg,#7a3d92,#9b5db5);color:white;box-shadow:0 2px 12px rgba(122,61,146,.5),0 0 20px rgba(122,61,146,.2);}
.btn-electric-teal{background:linear-gradient(135deg,#4d82b8,#336699);color:white;box-shadow:0 2px 12px rgba(77,130,184,.5),0 0 20px rgba(77,130,184,.2);}
.welcome{background:linear-gradient(135deg,#010267 0%,#542F62 55%,#336699 100%);border-radius:var(--r);padding:22px 26px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden;}
.welcome::after{content:'';position:absolute;right:-40px;top:-60px;width:220px;height:220px;background:rgba(255,255,255,.04);border-radius:50%;}
.welcome h2{font-size:18px;font-weight:700;color:white;}
.welcome p{font-size:13px;color:rgba(255,255,255,.7);margin-top:4px;}
.btn-white-outline{background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.3);color:white;padding:8px 16px;border-radius:var(--rs);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .15s;white-space:nowrap;position:relative;z-index:1;}
.btn-white-outline:hover{background:rgba(255,255,255,.25);}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat{background:white;border-radius:var(--r);padding:18px 20px;box-shadow:var(--shadow);border:1px solid var(--border);}
.stat-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:11px;}
.ico-purple{background:rgba(84,47,98,.1);color:var(--purple);}
.ico-blue{background:rgba(51,102,153,.1);color:var(--blue);}
.ico-navy{background:rgba(1,2,103,.08);color:var(--navy2);}
.ico-green{background:rgba(16,185,129,.1);color:#10b981;}
.stat-val{font-size:26px;font-weight:800;color:var(--navy);line-height:1;}
.stat-lbl{font-size:12px;color:var(--text3);margin-top:3px;}
.stat-chg{font-size:11px;color:#10b981;font-weight:600;margin-top:5px;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px;}
.card-ttl{font-size:14px;font-weight:700;color:var(--navy);}
.card-lnk{font-size:12px;color:var(--blue);font-weight:600;cursor:pointer;text-decoration:none;}
.act{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);}
.act:last-child{border-bottom:none;}
.dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0;}
.dot.p{background:var(--purple);}.dot.b{background:var(--blue);}
.dot.g{background:#10b981;}.dot.o{background:#f59e0b;}
.act-txt{font-size:13px;color:var(--text2);flex:1;line-height:1.45;}
.act-txt strong{color:var(--text);font-weight:600;}
.act-time{font-size:11px;color:var(--text3);flex-shrink:0;}
.bar-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
.bar-lbl{font-size:12px;color:var(--text2);width:130px;}
.bar-track{flex:1;background:var(--bg);border-radius:4px;height:8px;overflow:hidden;}
.bar-fill{height:100%;border-radius:4px;}
.bar-pct{font-size:11px;color:var(--text3);width:30px;text-align:right;}
.comm-layout{display:grid;grid-template-columns:1fr 290px;gap:18px;} .comm-left{min-width:0;}
.composer{background:white;border-radius:var(--r);padding:16px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:14px;}
.comp-top{display:flex;gap:12px;align-items:flex-start;}
.comp-ta{flex:1;min-height:72px;border:1.5px solid var(--border);border-radius:var(--rs);padding:10px 14px;font-family:inherit;font-size:13px;color:var(--text);resize:none;outline:none;transition:border-color .2s;}
.comp-ta:focus{border-color:var(--blue);}
.comp-ta::placeholder{color:var(--text3);}
.comp-ftr{display:flex;align-items:center;gap:6px;margin-top:9px;padding-left:48px;}
.comp-btn{display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:var(--rs);border:1.5px solid var(--border);background:transparent;font-size:12px;color:var(--text2);font-family:inherit;cursor:pointer;font-weight:500;transition:all .15s;}
.comp-btn:hover{background:var(--bg);}
.comp-btn i{font-size:15px;}
.btn-pub{margin-left:auto;background:var(--navy);color:white;border:none;padding:7px 18px;border-radius:var(--rs);font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;transition:opacity .15s;}
.btn-pub:hover{opacity:.85;}
.post{background:white;border-radius:var(--r);padding:18px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:13px;}
.post-hdr{display:flex;align-items:center;gap:10px;margin-bottom:11px;}
.post-uinfo{flex:1;}
.post-name{font-size:13.5px;font-weight:700;color:var(--text);}
.post-meta{font-size:11px;color:var(--text3);display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:2px;}
.cro-badge{background:rgba(1,2,103,.07);color:var(--navy2);padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;}
.tags{margin-bottom:9px;}
.tag{display:inline-block;background:rgba(51,102,153,.1);color:var(--blue);font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;margin-right:5px;margin-bottom:5px;}
.post-txt{font-size:13.5px;color:var(--text2);line-height:1.65;margin-bottom:11px;}
.post-acts{display:flex;align-items:center;gap:3px;padding-top:9px;border-top:1px solid var(--border);}
.pact{display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:var(--rs);border:none;background:transparent;font-size:12px;color:var(--text3);font-family:inherit;cursor:pointer;font-weight:500;transition:all .15s;}
.pact:hover{background:var(--bg);color:var(--purple);}
.pact.liked{color:#ef4444;}
.pact i{font-size:17px;}
.pact.ml{margin-left:auto;}
.side-card{background:white;border-radius:var(--r);padding:15px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:13px;}
.side-card h3{font-size:13px;font-weight:700;color:var(--navy);margin-bottom:11px;}
.trend{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer;}
.trend:last-child{border-bottom:none;}
.trend-n{font-size:18px;font-weight:800;color:var(--border);width:24px;}
.trend-txt{font-size:12px;color:var(--text2);font-weight:500;}
.trend-cnt{font-size:11px;color:var(--text3);}
.sugg{display:flex;align-items:center;gap:9px;margin-bottom:9px;}
.sugg:last-child{margin-bottom:0;}
.btn-follow{padding:4px 10px;border-radius:6px;border:1.5px solid var(--blue);background:transparent;font-size:11px;font-weight:700;color:var(--blue);cursor:pointer;font-family:inherit;transition:all .15s;}
.btn-follow:hover{background:var(--blue);color:white;}
.mkt-top{display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap;}
.filter-btn{padding:7px 14px;border-radius:20px;border:1.5px solid var(--border);background:white;font-size:12px;font-weight:600;color:var(--text2);cursor:pointer;font-family:inherit;transition:all .15s;}
.filter-btn:hover{border-color:var(--blue);color:var(--blue);}
.filter-btn.on{background:var(--navy);border-color:var(--navy);color:white;}
.btn-new{margin-left:auto;background:linear-gradient(135deg,#542F62,#336699);color:white;padding:8px 16px;border-radius:var(--rs);border:none;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;display:flex;align-items:center;gap:6px;transition:opacity .15s;}
.btn-new:hover{opacity:.88;}
.mkt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.mkt-card{background:white;border-radius:var(--r);box-shadow:var(--shadow);border:1px solid var(--border);overflow:hidden;transition:box-shadow .2s,transform .2s;cursor:pointer;}
.mkt-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);}
.mkt-img{width:100%;height:155px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;position:relative;}
.mkt-img i{font-size:40px;}
.cond{position:absolute;top:10px;left:10px;padding:3px 8px;border-radius:5px;font-size:10px;font-weight:700;}
.cond.new{background:#dcfce7;color:#16a34a;}
.cond.used{background:#fef3c7;color:#d97706;}
.mkt-body{padding:13px;}
.mkt-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px;}
.mkt-price{font-size:18px;font-weight:800;color:var(--navy);margin-bottom:7px;}
.mkt-loc{font-size:12px;color:var(--text3);display:flex;align-items:center;gap:4px;margin-bottom:11px;}
.mkt-loc i{font-size:14px;}
.btn-interest{width:100%;padding:8px;border-radius:var(--rs);background:rgba(1,2,103,.07);border:1.5px solid rgba(1,2,103,.12);color:var(--navy);font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all .15s;}
.btn-interest:hover{background:var(--navy);color:white;}
.tabs-wrap{display:flex;gap:0;background:var(--bg);border-radius:10px;padding:4px;margin-bottom:20px;border:1px solid var(--border);width:fit-content;}
.tab{padding:7px 20px;border-radius:7px;border:none;background:transparent;font-size:13px;font-weight:600;color:var(--text3);font-family:inherit;cursor:pointer;transition:all .15s;}
.tab.on{background:white;color:var(--navy);box-shadow:0 1px 3px rgba(0,0,0,.1);}
.jobs-layout{display:grid;grid-template-columns:1fr 300px;gap:18px;}
.job{background:white;border-radius:var(--r);padding:18px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:12px;cursor:pointer;transition:box-shadow .15s;}
.job:hover{box-shadow:var(--shadow-md);}
.job-top{display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;}
.clinic-av{width:44px;height:44px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:white;font-size:13px;font-weight:800;}
.job-ttl{font-size:15px;font-weight:700;color:var(--text);}
.job-clinic{font-size:12px;color:var(--text3);margin-top:2px;}
.job-loc{margin-left:auto;font-size:11px;color:var(--text3);white-space:nowrap;}
.jtags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:9px;}
.jtag{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid;}
.jtag.sp{background:rgba(84,47,98,.08);color:var(--purple);border-color:rgba(84,47,98,.2);}
.jtag.ct{background:rgba(51,102,153,.08);color:var(--blue);border-color:rgba(51,102,153,.2);}
.jtag.lc{background:rgba(1,2,103,.06);color:var(--navy2);border-color:rgba(1,2,103,.12);}
.job-desc{font-size:13px;color:var(--text2);line-height:1.55;margin-bottom:11px;}
.job-ftr{display:flex;align-items:center;justify-content:space-between;padding-top:9px;border-top:1px solid var(--border);}
.job-sal{font-size:13px;color:var(--text2);}
.job-sal strong{color:var(--navy);font-weight:700;}
.btn-apply{background:var(--purple);color:white;border:none;padding:7px 16px;border-radius:var(--rs);font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;transition:opacity .15s;}
.btn-apply:hover{opacity:.85;}
.upgrade-card{background:linear-gradient(135deg,#542F62,#336699);border-radius:var(--r);padding:18px;color:white;margin-bottom:13px;}
.upgrade-card h4{font-size:14px;font-weight:700;margin-bottom:5px;}
.upgrade-card p{font-size:12px;opacity:.8;margin-bottom:13px;line-height:1.5;}
.btn-upgrade{background:white;color:var(--purple);border:none;padding:8px;border-radius:var(--rs);font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;width:100%;transition:opacity .15s;}
.btn-upgrade:hover{opacity:.9;}
.exp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:18px;}
.exp-card{background:white;border-radius:var(--r);padding:20px;box-shadow:var(--shadow);border:1px solid var(--border);text-align:center;transition:box-shadow .2s,transform .2s;}
.exp-card:hover{box-shadow:var(--shadow-md);transform:translateY(-2px);}
.modal-overlay{position:fixed;inset:0;background:rgba(1,2,103,.4);z-index:100;display:none;align-items:center;justify-content:center;}
.modal-overlay.open{display:flex;}
.modal{background:white;border-radius:var(--r);width:400px;height:560px;box-shadow:0 24px 60px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;}
.modal-hdr{padding:14px 18px;background:var(--navy);display:flex;align-items:center;gap:10px;}
.modal-hdr-info{flex:1;}
.modal-hdr-name{font-size:14px;font-weight:700;color:white;}
.modal-hdr-spec{font-size:11px;color:rgba(255,255,255,.6);}
.modal-close{color:rgba(255,255,255,.7);font-size:20px;cursor:pointer;transition:color .15s;}
.modal-close:hover{color:white;}
.modal-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:var(--bg);}
.msg{max-width:75%;}
.msg.me{align-self:flex-end;}
.msg-bubble{padding:9px 13px;border-radius:12px;font-size:13px;line-height:1.45;}
.msg.them .msg-bubble{background:white;color:var(--text);border-bottom-left-radius:4px;}
.msg.me .msg-bubble{background:var(--navy);color:white;border-bottom-right-radius:4px;}
.msg-time{font-size:10px;color:var(--text3);margin-top:3px;text-align:right;}
.msg.them .msg-time{text-align:left;}
.modal-input{padding:12px 16px;border-top:1px solid var(--border);display:flex;gap:10px;align-items:center;}
.modal-input input{flex:1;padding:9px 13px;border:1.5px solid var(--border);border-radius:20px;font-size:13px;font-family:inherit;outline:none;}
.modal-input input:focus{border-color:var(--blue);}
.btn-send{width:36px;height:36px;border-radius:50%;background:var(--navy);color:white;border:none;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;transition:opacity .15s;flex-shrink:0;}
.btn-send:hover{opacity:.85;}
.help-banner{background:linear-gradient(135deg,#010267 0%,#542F62 55%,#336699 100%);border-radius:var(--r);padding:22px 26px;margin-bottom:24px;display:flex;align-items:center;gap:20px;position:relative;overflow:hidden;}
.help-banner::after{content:'';position:absolute;right:-50px;top:-60px;width:200px;height:200px;background:rgba(255,255,255,.04);border-radius:50%;}
.help-banner-ico{font-size:40px;line-height:1;}
.help-banner h2{font-size:17px;font-weight:800;color:white;margin-bottom:4px;}
.help-banner p{font-size:13px;color:rgba(255,255,255,.72);line-height:1.55;}







.spec-grid{display:grid !important;grid-template-columns:1fr 1fr !important;gap:16px;width:100%;box-sizing:border-box;}
.spec-card{background:white;border-radius:14px;overflow:hidden;border:1px solid var(--border);box-shadow:var(--shadow);cursor:pointer;transition:box-shadow .2s,transform .2s;flex:1 1 calc(50% - 8px);min-width:200px;box-sizing:border-box;}
.spec-top{height:148px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.spec-body{padding:16px 18px 18px;}
.spec-name{font-size:15px;font-weight:800;color:var(--navy);margin-bottom:5px;}
.spec-desc{font-size:13px;color:var(--text3);line-height:1.5;margin-bottom:12px;}
.btn-help{width:100%;padding:10px;border-radius:8px;font-size:13px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;}
.spec-card:hover{box-shadow:var(--shadow-md);transform:translateY(-4px);}
.spec-top i{font-size:72px !important;color:rgba(255,255,255,.92);filter:drop-shadow(0 2px 8px rgba(0,0,0,.25));}
.btn-help:hover{opacity:.88;transform:translateY(-1px);}
.btn-help i{font-size:16px;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:10px;}
.proto{position:fixed;bottom:14px;right:14px;z-index:200;background:rgba(84,47,98,.92);color:white;font-size:10px;font-weight:700;letter-spacing:.07em;padding:5px 11px;border-radius:6px;pointer-events:none;}

/* ===== MOBILE ===== */
.mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:white;z-index:50;padding:6px 0 14px;justify-content:space-around;border-top:1px solid #e3e5f0;box-shadow:0 -4px 16px rgba(1,2,103,.08);}
.mobile-nav::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1.5px;background:linear-gradient(90deg,transparent,#542F62,#336699,transparent);}
.mobile-nav-item{display:flex;flex-direction:column;align-items:center;gap:2px;color:#c0c2d8;cursor:pointer;font-size:10px;font-weight:600;padding:3px 6px;border-radius:8px;transition:all .15s;min-width:52px;text-align:center;}
.mobile-nav-item.active{color:#542F62;}
.mobile-nav-item.active i{filter:drop-shadow(0 0 4px rgba(84,47,98,.6));}
.mobile-nav-item i{font-size:20px;display:block;}
.mobile-nav-dot{width:5px;height:5px;background:linear-gradient(135deg,#542F62,#336699);border-radius:50%;margin-top:2px;box-shadow:0 0 6px #542F62;display:none;}
.mobile-nav-item.active .mobile-nav-dot{display:block;}
.mobile-topbar{display:none;background:white;border-bottom:1px solid var(--border);padding:10px 16px;align-items:center;gap:10px;position:sticky;top:0;z-index:5;}
#mobile-drawer-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:98;}
#mobile-drawer{display:none;position:fixed;bottom:65px;left:0;right:0;background:white;border-radius:16px 16px 0 0;z-index:99;padding:16px;box-shadow:0 -4px 24px rgba(0,0,0,.15);}
@media (max-width:768px){
  .sidebar{display:none !important;width:0 !important;}
  .main{margin-left:0 !important;width:100% !important;min-width:0;}
  .topbar{display:none !important;}
  .free-bar{display:none !important;}
  .proto{display:none;}
  .page{padding:10px 12px 82px !important;width:100% !important;max-width:100vw;overflow-x:hidden;display:none !important;}
  .page.active{display:block !important;}
  .mobile-nav{display:flex !important;}
  .mobile-topbar{display:flex !important;}
  .stats{grid-template-columns:1fr 1fr !important;gap:10px;}
  .comm-layout{grid-template-columns:1fr !important;max-width:100vw;overflow:hidden;}
  .comm-layout > div:last-child{display:none !important;}
  .comm-layout > div:first-child{width:100% !important;min-width:0;max-width:100%;}
  .post,.post-card{margin-bottom:10px;border-radius:12px;width:100% !important;max-width:100% !important;box-sizing:border-box;}
  .comp{border-radius:12px;margin-bottom:10px;width:100% !important;box-sizing:border-box;}
  .comp .comp-ftr{flex-wrap:wrap;gap:6px;} .btn-pub{flex-shrink:0;white-space:nowrap;} .comp-ftr select{max-width:140px;flex:1;min-width:0;}
  .post img,.post-card img{max-width:100% !important;width:100% !important;border-radius:8px;}
  .post-acts{flex-wrap:wrap;gap:8px;}
  .mkt-grid{grid-template-columns:1fr 1fr !important;gap:10px;}
                .jobs-layout{grid-template-columns:1fr !important;}
  .jobs-layout > div:last-child{display:none;}
  .tabs-wrap{flex-wrap:nowrap;overflow-x:auto;gap:5px;padding-bottom:2px;}
  .tabs-wrap::-webkit-scrollbar{display:none;}
  .tab{font-size:11px !important;padding:7px 10px !important;white-space:nowrap;flex-shrink:0;}
  .job{padding:12px !important;}
  .job-ftr{flex-direction:column;gap:8px;align-items:flex-start;}
  .btn-apply{width:100%;justify-content:center;}
  #cursos-grid{grid-template-columns:1fr 1fr !important;gap:10px;}
  #recursos-grid{grid-template-columns:1fr 1fr !important;gap:10px;}
  .grid2{grid-template-columns:1fr !important;}
  .welcome{flex-direction:column;gap:10px;padding:14px !important;}
  .welcome .btn-white-outline{width:100%;text-align:center;}
  .modal-overlay{align-items:flex-end !important;padding-bottom:0 !important;} #chat-modal .modal, #chat-modal.open ~ .modal{border-radius:20px 20px 0 0 !important;} .modal{width:100vw !important;height:82vh !important;max-height:82vh !important;border-radius:20px 20px 0 0 !important;margin:0 !important;} .modal-input{padding:10px 12px 20px !important;}
  .login-card{width:92vw;padding:28px 20px;}
  .stat-val{font-size:20px;}
  .welcome h2{font-size:15px;}
  #app-screen{flex-direction:column !important;}
  .card-neon{min-width:0 !important;}
  .comp{border-radius:12px;margin-bottom:12px;}
  .post-card{border-radius:12px;margin-bottom:10px;}
          img{max-width:100% !important;}
  .topbar-right{gap:6px;}
  .btn-electric{font-size:9px !important;padding:4px 7px !important;}
  #recursos-grid > div{padding:10px !important;}
}
</style>
</head>
<body>
<div class="proto">PROTÓTIPO MVP — ODONT HUB</div>

<!-- LOGIN -->
<div id="login-screen">
  <div class="login-card">
    <div class="login-logo">
      <div class="login-logomark">
        <svg width="160" height="72" viewBox="0 0 260 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lg1" x1="0" y1="55" x2="260" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#542F62"/>
              <stop offset="45%" stop-color="#7a3d92"/>
              <stop offset="75%" stop-color="#010267"/>
              <stop offset="100%" stop-color="#336699"/>
            </linearGradient>
          </defs>
          <path d="M 130,51 C 138,36 148,12 180,10 C 210,8 228,32 224,56 C 220,76 204,90 182,86 C 158,82 140,64 130,51 C 120,38 102,14 72,14 C 44,14 30,36 34,60 C 38,82 62,96 88,90 C 116,84 124,66 130,51 Z"
                stroke="#7a3d92" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.2"/>
          <path d="M 130,51 C 138,36 148,12 180,10 C 210,8 228,32 224,56 C 220,76 204,90 182,86 C 158,82 140,64 130,51 C 120,38 102,14 72,14 C 44,14 30,36 34,60 C 38,82 62,96 88,90 C 116,84 124,66 130,51 Z"
                stroke="url(#lg1)" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 130,51 C 138,36 148,12 180,10 C 210,8 228,32 224,56 C 220,76 204,90 182,86 C 158,82 140,64 130,51 C 120,38 102,14 72,14 C 44,14 30,36 34,60 C 38,82 62,96 88,90 C 116,84 124,66 130,51 Z"
                stroke="rgba(255,255,255,0.4)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          
          
          
        </svg>
      </div>
      <h1>ODONT <span>HUB</span></h1>
      <p>O ecossistema digital para dentistas</p>
    </div>
    <label class="lbl">E-mail profissional</label>
    <input id="login-email" class="inp" type="email" placeholder="dr.seunome@email.com">
    <label class="lbl">Senha</label>
    <div style="position:relative;">
      <input id="login-password" class="inp" type="password" placeholder="Sua senha" style="padding-right:40px;">
      <button type="button" onclick="togglePass('login-password','eye-login')" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#8889aa;padding:4px;">
        <i id="eye-login" class="ti ti-eye" style="font-size:18px;"></i>
      </button>
    </div>
    <label class="lbl">CRO <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text3)">(opcional no login)</span></label>
    <input id="login-cro" class="inp" type="text" placeholder="SP-12345" style="margin-bottom:8px;">
    <div id="login-error" style="display:none;background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:12px;"></div>
    <button class="btn-primary" id="login-btn" onclick="doLogin()"><i class="ti ti-login"></i> Entrar na plataforma</button>
    <div class="login-divider"><span>ou</span></div>
    <div class="login-register" onclick="showRegister()">Ainda não tem conta? <strong>Criar conta gratuita</strong> →</div>
    <div id="register-modal" style="display:none;position:fixed;inset:0;background:rgba(1,2,103,.5);z-index:999;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:16px;padding:32px;width:420px;max-height:90vh;overflow-y:auto;">
        <h2 style="font-size:18px;font-weight:800;color:#010267;margin-bottom:20px;">Criar conta gratuita</h2>
        <label class="lbl">Nome completo</label><input id="reg-name" class="inp" type="text" placeholder="Dr. Seu Nome">
        <label class="lbl">E-mail</label><input id="reg-email" class="inp" type="email" placeholder="dr.seunome@email.com">
        <label class="lbl">Senha (mín. 8 caracteres)</label><div style="position:relative;">
        <input id="reg-password" class="inp" type="password" placeholder="••••••••" style="padding-right:40px;">
        <button type="button" onclick="togglePass('reg-password','eye-reg')" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#8889aa;padding:4px;">
          <i id="eye-reg" class="ti ti-eye" style="font-size:18px;"></i>
        </button>
      </div>
        <label class="lbl">CRO</label><input id="reg-cro" class="inp" type="text" placeholder="SP-12345">
        <label class="lbl">Especialidade</label>
        <select id="reg-specialty" class="inp" style="background:white;">
          <option value="">Selecione...</option>
          <option>Dentística</option><option>Clínica Geral</option><option>Implantodontia</option><option>Ortodontia</option>
          <option>Endodontia</option><option>Periodontia</option><option>Prótese Dentária</option>
          <option>Bucomaxilofacial</option><option>Harmonização Facial</option><option>Odontopediatria</option>
        </select>
        <div id="reg-error" style="display:none;background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:12px;"></div>
        <button class="btn-primary" onclick="doRegister()" id="reg-btn"><i class="ti ti-user-plus"></i> Criar conta</button>
        <div style="text-align:center;margin-top:12px;font-size:13px;color:#8889aa;cursor:pointer;" onclick="hideRegister()">← Voltar ao login</div>
      </div>
    </div>
    <div style="text-align:center;"><div class="free-tag"><i class="ti ti-check" style="font-size:12px;"></i> Beta aberto — totalmente gratuito</div></div>
  </div>
</div>

<!-- APP -->
<div id="app-screen" style="display:none;">
  <!-- MOBILE TOPBAR -->
  <div class="mobile-topbar" id="mobile-topbar">
    <svg width="44" height="20" viewBox="0 0 260 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mg1" x1="0" y1="55" x2="260" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#542F62"/>
          <stop offset="45%" stop-color="#7a3d92"/>
          <stop offset="75%" stop-color="#010267"/>
          <stop offset="100%" stop-color="#336699"/>
        </linearGradient>
      </defs>
      <path d="M 130,51 C 138,36 148,12 180,10 C 210,8 228,32 224,56 C 220,76 204,90 182,86 C 158,82 140,64 130,51 C 120,38 102,14 72,14 C 44,14 30,36 34,60 C 38,82 62,96 88,90 C 116,84 124,66 130,51 Z"
            stroke="#7a3d92" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.2"/>
      <path d="M 130,51 C 138,36 148,12 180,10 C 210,8 228,32 224,56 C 220,76 204,90 182,86 C 158,82 140,64 130,51 C 120,38 102,14 72,14 C 44,14 30,36 34,60 C 38,82 62,96 88,90 C 116,84 124,66 130,51 Z"
            stroke="url(#mg1)" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 130,51 C 138,36 148,12 180,10 C 210,8 228,32 224,56 C 220,76 204,90 182,86 C 158,82 140,64 130,51 C 120,38 102,14 72,14 C 44,14 30,36 34,60 C 38,82 62,96 88,90 C 116,84 124,66 130,51 Z"
            stroke="rgba(255,255,255,0.3)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      
      
      
    </svg>
    <div style="flex:1;">
      <div style="font-size:20px;font-weight:900;letter-spacing:-.5px;line-height:1.1;"><span style="color:#010267;">ODONT </span><span style="background:linear-gradient(90deg,#542F62,#336699);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">HUB</span></div>
      <div style="font-size:9px;font-weight:600;color:#8889aa;letter-spacing:.08em;">O ecossistema digital para dentistas</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      <i class="ti ti-bell" style="font-size:20px;color:var(--text2);"></i>
      <div class="av s av-grad-me" id="mobile-av">TM</div>
    </div>
  </div>

  <aside class="sidebar">
    <div class="sb-logo">
      <div class="sb-logo-row">
        <div class="logomark">
          <svg width="44" height="20" viewBox="0 0 200 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 100,36 C 110,14 148,8 162,26 C 176,44 166,68 148,74 C 130,80 108,68 100,52 C 92,36 70,12 52,18 C 34,24 24,48 38,66 C 52,84 82,80 100,52" stroke="rgba(255,255,255,0.25)" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M 100,36 C 110,14 148,8 162,26 C 176,44 166,68 148,74 C 130,80 108,68 100,52 C 92,36 70,12 52,18 C 34,24 24,48 38,66 C 52,84 82,80 100,52" stroke="white" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div><div class="logo-name">ODONT <span>HUB</span></div><div class="logo-plan">PLANO GRATUITO</div></div>
      </div>
    </div>
    <nav class="sb-nav">
      <div class="sb-section">Principal</div>
      <div class="nav-item active" data-s="dashboard" onclick="nav(this,'dashboard','Dashboard')"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
      <div class="nav-item" data-s="community" onclick="nav(this,'community','Comunidade')"><i class="ti ti-messages"></i> Comunidade <span class="nb">3</span></div>
      <div class="sb-section">Recursos</div>
      <div class="nav-item" data-s="market" onclick="nav(this,'market','Marketplace')"><i class="ti ti-shopping-cart"></i> Dental Marketplace</div>
      <div class="nav-item" data-s="agenda" onclick="nav(this,'agenda','Agenda Clínica')"><i class="ti ti-calendar"></i> Agenda</div>
      <div class="nav-item" data-s="jobs" onclick="nav(this,'jobs','Vagas & Oportunidades')"><i class="ti ti-briefcase"></i> Vagas <span class="nb">2</span></div>
      <div class="nav-item" onclick="showLabs()" style="cursor:pointer;display:flex;align-items:center;gap:8px;"><i class="ti ti-flask"></i> Labs & Técnicos</div>
      <div class="nav-item" data-s="experts" onclick="nav(this,'experts','Ajuda do Especialista')"><i class="ti ti-message-question"></i> Especialistas</div>
      <div class="nav-item" data-s="cursos" onclick="nav(this,'cursos','Anúncios de Cursos')"><i class="ti ti-school"></i> Cursos <span class="nb" style="background:#f59e0b;">N</span></div>
      <div class="sb-section">Conta</div>
      <div class="nav-item" onclick="alert('Perfil em construção! 🚧')"><i class="ti ti-user"></i> Meu perfil</div>
      <div class="nav-item" onclick="alert('Notificações em breve!')"><i class="ti ti-bell"></i> Notificações <span class="nb">5</span></div>
      <div class="nav-item" onclick="alert('Configurações em breve!')"><i class="ti ti-settings"></i> Configurações</div>
    </nav>
    <div class="sb-footer">
      <div class="user-row" onclick="toggleLogoutMenu()">
        <div class="av m av-grad-me" id="sb-av">TM</div>
        <div style="flex:1;min-width:0;"><div class="user-name">Taisa Maeshiro</div><div class="user-cro">CRO 110889</div></div>
        <i class="ti ti-dots-vertical" style="color:rgba(255,255,255,.35);font-size:16px;"></i>
      </div>
      <div id="logout-menu" style="display:none;background:white;border-radius:8px;margin:6px 0 0;overflow:hidden;">
        <div onclick="doLogout()" style="padding:11px 14px;font-size:13px;font-weight:600;color:#ef4444;cursor:pointer;display:flex;align-items:center;gap:8px;"><i class="ti ti-logout" style="font-size:16px;"></i> Sair da conta</div>
      </div>
    </div>
  </aside>

  <div class="main">
    <div class="free-bar"><i class="ti ti-rocket"></i> Você está no <strong style="margin:0 3px;">plano gratuito</strong> — acesso completo durante o beta. <a href="#">Conhecer os planos futuros →</a></div>
    <div class="topbar">
      <span class="page-title" id="page-title">Dashboard</span>
      <div class="search"><i class="ti ti-search"></i><input placeholder="Buscar na plataforma..."></div>
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="icon-btn"><i class="ti ti-bell"></i><div class="notif-dot"></div></div>
        <div class="icon-btn"><i class="ti ti-message"></i></div>
        <div class="av s av-grad-me">CM</div>
      </div>
    </div>

    <!-- DASHBOARD -->
    <div id="screen-dashboard" class="page active">
      <div class="welcome">
        <div><h2 id="welcome-msg">Bem-vindo(a)! 🦷</h2><p>Sua comunidade tem novas interações.</p></div>
        <button class="btn-white-outline" onclick="nav(document.querySelector('[data-s=community]'),'community','Comunidade')">Ver Comunidade →</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;" id="recursos-grid">
        <div onclick="nav(document.querySelector('[data-s=community]'),'community','Comunidade')" style="cursor:pointer;padding:12px;background:white;border-radius:14px;border:1.5px solid rgba(84,47,98,.3);box-shadow:0 4px 16px rgba(84,47,98,.12);position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#542F62,transparent);"></div>
          <div style="width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:8px;background:linear-gradient(135deg,#f0eaf6,#e8d8f0);color:#542F62;"><i class="ti ti-messages"></i></div>
          <div style="font-size:12px;font-weight:700;color:#12133a;margin-bottom:2px;">Comunidade</div>
          <div style="font-size:10px;color:#8889aa;">Feed de dentistas</div>
          <div style="background:linear-gradient(135deg,#542F62,#7a3d92);color:white;font-size:10px;font-weight:800;margin-top:8px;display:inline-flex;align-items:center;gap:3px;padding:5px 8px;border-radius:20px;box-shadow:0 2px 10px rgba(84,47,98,.5);"><i class="ti ti-arrow-right" style="font-size:10px;"></i> Ver feed</div>
        </div>
        <div onclick="nav(document.querySelector('[data-s=experts]'),'experts','Ajuda do Especialista')" style="cursor:pointer;padding:12px;background:white;border-radius:14px;border:1.5px solid rgba(51,102,153,.3);box-shadow:0 4px 16px rgba(51,102,153,.12);position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#336699,transparent);"></div>
          <div style="width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:8px;background:linear-gradient(135deg,#e8eeff,#d8e8ff);color:#336699;"><i class="ti ti-message-question"></i></div>
          <div style="font-size:11px;font-weight:700;color:#12133a;margin-bottom:2px;">Dúvidas com<br>Especialistas</div>
          <div style="font-size:10px;color:#8889aa;">Quero ajuda!</div>
          <div style="background:linear-gradient(135deg,#336699,#4d82b8);color:white;font-size:10px;font-weight:800;margin-top:8px;display:inline-flex;align-items:center;gap:3px;padding:5px 8px;border-radius:20px;box-shadow:0 2px 10px rgba(51,102,153,.5);"><i class="ti ti-arrow-right" style="font-size:10px;"></i> Consultar</div>
        </div>
        <div onclick="nav(document.querySelector('[data-s=jobs]'),'jobs','Vagas')" style="cursor:pointer;padding:12px;background:white;border-radius:14px;border:1.5px solid rgba(1,2,103,.25);box-shadow:0 4px 16px rgba(1,2,103,.1);position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#010267,transparent);"></div>
          <div style="width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:8px;background:linear-gradient(135deg,#e8eaf8,#d8dcf5);color:#010267;"><i class="ti ti-briefcase"></i></div>
          <div style="font-size:12px;font-weight:700;color:#12133a;margin-bottom:2px;">Vagas</div>
          <div style="font-size:10px;color:#8889aa;">Oportunidades</div>
          <div style="background:linear-gradient(135deg,#010267,#0a0e9a);color:white;font-size:10px;font-weight:800;margin-top:8px;display:inline-flex;align-items:center;gap:3px;padding:5px 8px;border-radius:20px;box-shadow:0 2px 10px rgba(1,2,103,.5);"><i class="ti ti-arrow-right" style="font-size:10px;"></i> Ver vagas</div>
        </div>
        <div onclick="nav(document.querySelector('[data-s=cursos]'),'cursos','Cursos')" style="cursor:pointer;padding:12px;background:white;border-radius:14px;border:1.5px solid rgba(122,61,146,.3);box-shadow:0 4px 16px rgba(122,61,146,.12);position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#7a3d92,transparent);"></div>
          <div style="width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:8px;background:linear-gradient(135deg,#f5eeff,#ead8ff);color:#7a3d92;"><i class="ti ti-school"></i></div>
          <div style="font-size:12px;font-weight:700;color:#12133a;margin-bottom:2px;">Cursos</div>
          <div style="font-size:10px;color:#8889aa;">12 disponíveis</div>
          <div style="background:linear-gradient(135deg,#7a3d92,#9b5db5);color:white;font-size:10px;font-weight:800;margin-top:8px;display:inline-flex;align-items:center;gap:3px;padding:5px 8px;border-radius:20px;box-shadow:0 2px 10px rgba(122,61,146,.5);"><i class="ti ti-arrow-right" style="font-size:10px;"></i> Explorar</div>
        </div>
        <div onclick="nav(document.querySelector('[data-s=market]'),'market','Marketplace')" style="cursor:pointer;padding:12px;background:white;border-radius:14px;border:1.5px solid rgba(77,130,184,.3);box-shadow:0 4px 16px rgba(77,130,184,.12);position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#4d82b8,transparent);"></div>
          <div style="width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:8px;background:linear-gradient(135deg,#e8f4ff,#d8eeff);color:#4d82b8;"><i class="ti ti-shopping-cart"></i></div>
          <div style="font-size:12px;font-weight:700;color:#12133a;margin-bottom:2px;">Marketplace</div>
          <div style="font-size:10px;color:#8889aa;">Equip. e materiais</div>
          <div style="background:linear-gradient(135deg,#4d82b8,#336699);color:white;font-size:10px;font-weight:800;margin-top:8px;display:inline-flex;align-items:center;gap:3px;padding:5px 8px;border-radius:20px;box-shadow:0 2px 10px rgba(77,130,184,.5);"><i class="ti ti-arrow-right" style="font-size:10px;"></i> Ver anúncios</div>
        </div>
        <div style="padding:12px;background:white;border-radius:14px;border:1px solid #e3e5f0;box-shadow:0 2px 8px rgba(0,0,0,.04);">
          <div style="width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:8px;background:#f3f4f9;color:#c0c2d8;"><i class="ti ti-calendar"></i></div>
          <div style="font-size:12px;font-weight:700;color:#12133a;margin-bottom:2px;">Agenda</div>
          <div style="font-size:10px;color:#8889aa;">Em breve</div>
          <div style="font-size:10px;color:#c0c2d8;margin-top:8px;font-weight:600;">Brevemente</div>
        </div>
      </div>
      <div class="grid2">
        <div class="card">
          <div class="card-hdr"><span class="card-ttl">Atividade recente</span><a class="card-lnk">Ver tudo</a></div>
          <div class="act"><div class="dot p"></div><div class="act-txt"><strong>Dra. Ana Pereira</strong> curtiu seu post sobre implantes Straumann</div><div class="act-time">2m</div></div>
          <div class="act"><div class="dot b"></div><div class="act-txt"><strong>Dr. Felipe Santos</strong> comentou: "Ótima técnica!"</div><div class="act-time">15m</div></div>
          <div class="act"><div class="dot o"></div><div class="act-txt">Interesse no seu anúncio de <strong>Compressor NSK</strong></div><div class="act-time">1h</div></div>
          <div class="act"><div class="dot g"></div><div class="act-txt"><strong>Clínica OdontoPrime</strong> visualizou seu perfil</div><div class="act-time">3h</div></div>
        </div>
        <div class="card">
          <div class="card-hdr"><span class="card-ttl">Especialidades em alta</span></div>
          <div class="bar-row"><div class="bar-lbl">Implantodontia</div><div class="bar-track"><div class="bar-fill" style="width:85%;background:linear-gradient(90deg,#010267,#542F62);"></div></div><div class="bar-pct">85%</div></div>
          <div class="bar-row"><div class="bar-lbl">Ortodontia</div><div class="bar-track"><div class="bar-fill" style="width:72%;background:linear-gradient(90deg,#542F62,#336699);"></div></div><div class="bar-pct">72%</div></div>
          <div class="bar-row"><div class="bar-lbl">Endodontia</div><div class="bar-track"><div class="bar-fill" style="width:61%;background:linear-gradient(90deg,#336699,#4d82b8);"></div></div><div class="bar-pct">61%</div></div>
          <div class="bar-row"><div class="bar-lbl">Prótese dentária</div><div class="bar-track"><div class="bar-fill" style="width:54%;background:linear-gradient(90deg,#4d82b8,#6aabcc);"></div></div><div class="bar-pct">54%</div></div>
          <div class="bar-row" style="margin-bottom:0;"><div class="bar-lbl">Odontopediatria</div><div class="bar-track"><div class="bar-fill" style="width:30%;background:#8bbfd8;"></div></div><div class="bar-pct">30%</div></div>
        </div>
      </div>
    </div>

    <!-- COMUNIDADE -->
    <div id="screen-community" class="page">
      <div class="comm-layout">
        <div>
          <div class="composer">
            <div id="image-preview" style="display:none;margin:8px 0 0 48px;position:relative;">
              <img id="preview-img" style="max-width:100%;max-height:200px;border-radius:8px;border:1px solid var(--border);">
              <button onclick="removeImage()" style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,.5);color:white;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-size:14px;">×</button>
            </div>
            <div class="comp-top">
              <div class="av l av-grad-me" id="feed-av">TM</div>
              <textarea id="post-content" class="comp-ta" placeholder="Compartilhe um caso, dúvida ou novidade..."></textarea>
            </div>
            <div class="comp-ftr">
              <select id="post-specialty" style="padding:6px 10px;border-radius:var(--rs);border:1.5px solid var(--border);font-size:12px;font-family:inherit;color:var(--text2);background:white;outline:none;">
                <option value="">Especialidade (opcional)</option>
                <option>Dentística</option><option>Clínica Geral</option><option>Implantodontia</option>
                <option>Ortodontia</option><option>Endodontia</option><option>Periodontia</option>
                <option>Prótese Dentária</option><option>Bucomaxilofacial</option>
                <option>Harmonização Facial</option><option>Odontopediatria</option><option>Gestão & Marketing</option>
              </select>
              <label style="display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:var(--rs);border:1.5px solid var(--border);background:transparent;font-size:12px;color:var(--text2);cursor:pointer;font-weight:500;">
                <i class="ti ti-photo" style="font-size:15px;"></i> Foto
                <input type="file" id="post-image" accept="image/*" style="display:none;" onchange="previewImage(this)">
              </label>
              <button class="btn-pub" id="btn-pub" onclick="submitPost()">Publicar</button>
            </div>
          </div>
          <div id="feed-list">
            <div style="text-align:center;padding:40px;color:var(--text3);">
              <i class="ti ti-loader" style="font-size:32px;display:block;margin-bottom:10px;animation:spin 1s linear infinite;"></i>
              Carregando posts...
            </div>
          </div>
        </div>
        <div>
          <div class="side-card">
            <h3>Tópicos em alta</h3>
            <div class="trend"><div class="trend-n">01</div><div><div class="trend-txt">#Implantodontia</div><div class="trend-cnt">234 posts</div></div></div>
            <div class="trend"><div class="trend-n">02</div><div><div class="trend-txt">#AllOn4</div><div class="trend-cnt">128 posts</div></div></div>
            <div class="trend"><div class="trend-n">03</div><div><div class="trend-txt">#Endodontia</div><div class="trend-cnt">97 posts</div></div></div>
            <div class="trend"><div class="trend-n">04</div><div><div class="trend-txt">#Ortodontia</div><div class="trend-cnt">84 posts</div></div></div>
            <div class="trend"><div class="trend-n">05</div><div><div class="trend-txt">#CasosClínicos</div><div class="trend-cnt">72 posts</div></div></div>
          </div>
          <div class="side-card">
            <h3>Sugestões de conexão</h3>
            <div class="sugg"><div class="av s av-grad-1">JV</div><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:var(--text);">Dr. João Viana</div><div style="font-size:11px;color:var(--text3);">Periodontia · CRO/SP</div></div><button class="btn-follow">+ Seguir</button></div>
            <div class="sugg"><div class="av s av-grad-3">ML</div><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:var(--text);">Dra. Maria Lima</div><div style="font-size:11px;color:var(--text3);">Prótese · CRO/RJ</div></div><button class="btn-follow">+ Seguir</button></div>
            <div class="sugg"><div class="av s av-grad-5">TC</div><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:var(--text);">Dr. Thiago Campos</div><div style="font-size:11px;color:var(--text3);">Cirurgia · CRO/MG</div></div><button class="btn-follow">+ Seguir</button></div>
          </div>
        </div>
      </div>
    </div>

    <!-- MARKETPLACE -->
    <div id="screen-market" class="page">
      <div class="welcome" style="margin-bottom:16px;">
        <div><h2>🛒 Dental Marketplace</h2><p>Compre e venda equipamentos e materiais odontológicos.</p></div>
        <button class="btn-white-outline" onclick="document.getElementById('modal-produto').classList.add('open')">+ Vender produto</button>
      </div>
      <div class="mkt-top">
        <button class="filter-btn on" onclick="filterMkt(this)">Todos</button>
        <button class="filter-btn" onclick="filterMkt(this)">Equipamentos</button>
        <button class="filter-btn" onclick="filterMkt(this)">Materiais</button>
        <button class="filter-btn" onclick="filterMkt(this)">Móveis</button>
        <button class="filter-btn" onclick="filterMkt(this)">Novos</button>
        <button class="filter-btn" onclick="filterMkt(this)">Usados</button>
      </div>
      <div class="mkt-grid" id="mkt-grid">
        <div class="card-neon card-neon-navy" onclick="openProduto({title:'Fotopolimerizador LED',desc:'Fotopolimerizador LED de alta potência, 1500mW/cm². Ideal para resinas compostas e cimentos resinosos. Acompanha óculos de proteção.',price:'890',oldPrice:'1.200',category:'Equipamento',condition:'Novo',city:'São Paulo',seller:'Dra. Ana Silva',rating:'4.8',whatsapp:'11999990001'})" style="cursor:pointer;">
          <div style="height:120px;background:linear-gradient(135deg,#e8eaf8,#c8ccf0);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:48px;position:relative;">🔬<span style="position:absolute;top:6px;left:6px;background:#059669;color:white;font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;">NOVO</span></div>
          <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:4px;">Fotopolimerizador LED</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;"><span style="font-size:16px;font-weight:800;color:#059669;">R$ 890</span><span style="font-size:11px;color:var(--text3);text-decoration:line-through;">R$ 1.200</span></div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px;">📍 São Paulo</div>
          <button class="btn-apply" style="width:100%;">Ver detalhes</button>
        </div>
        <div class="card-neon card-neon-purple" onclick="openProduto({title:'Kit Anestesia Completo',desc:'Kit completo com seringa carpule, agulhas curtas e longas, e carpules de mepivacaína. Ideal para consultório. Embalagem original lacrada.',price:'320',oldPrice:'',category:'Material',condition:'Novo',city:'Rio de Janeiro',seller:'Dr. Carlos Lima',rating:'4.6',whatsapp:'21999990002'})" style="cursor:pointer;">
          <div style="height:120px;background:linear-gradient(135deg,#f0eaf6,#dcc8ee);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:48px;">💉</div>
          <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:4px;">Kit Anestesia Completo</div>
          <div style="margin-bottom:8px;"><span style="font-size:16px;font-weight:800;color:#059669;">R$ 320</span></div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px;">📍 Rio de Janeiro</div>
          <button class="btn-apply" style="width:100%;">Ver detalhes</button>
        </div>
        <div class="card-neon card-neon-blue" onclick="openProduto({title:'Cadeira Odontológica',desc:'Cadeira odontológica em excelente estado de conservação, com refletor incluso. Marca Dabi Atlante, modelo Star 1000. Retirada local.',price:'4.500',oldPrice:'8.000',category:'Móvel',condition:'Usado',city:'Curitiba',seller:'Dr. Paulo Ramos',rating:'5.0',whatsapp:'41999990003'})" style="cursor:pointer;">
          <div style="height:120px;background:linear-gradient(135deg,#e8eeff,#ccd4f8);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:48px;position:relative;">🪑<span style="position:absolute;top:6px;left:6px;background:#f59e0b;color:white;font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;">USADO</span></div>
          <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:4px;">Cadeira Odontológica</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;"><span style="font-size:16px;font-weight:800;color:#059669;">R$ 4.500</span><span style="font-size:11px;color:var(--text3);text-decoration:line-through;">R$ 8.000</span></div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px;">📍 Curitiba</div>
          <button class="btn-apply" style="width:100%;">Ver detalhes</button>
        </div>
        <div class="card-neon card-neon-teal" onclick="openProduto({title:'Resina Z350 3M',desc:'Resina composta Z350 3M ESPE, cor A2, seringa de 4g. Validade 2027. Produto original com nota fiscal. Entrega por Correios.',price:'180',oldPrice:'',category:'Material',condition:'Novo',city:'Belo Horizonte',seller:'Dra. Mariana Costa',rating:'4.9',whatsapp:'31999990004'})" style="cursor:pointer;">
          <div style="height:120px;background:linear-gradient(135deg,#e8f4ff,#d8eeff);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:48px;">🧴</div>
          <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:4px;">Resina Z350 3M</div>
          <div style="margin-bottom:8px;"><span style="font-size:16px;font-weight:800;color:#059669;">R$ 180</span></div>
          <div style="font-size:11px;color:var(--text3);margin-bottom:8px;">📍 Belo Horizonte</div>
          <button class="btn-apply" style="width:100%;">Ver detalhes</button>
        </div>
      </div>
    </div>
    <!-- VAGAS -->
    <div id="screen-jobs" class="page">
      <div class="welcome" style="margin-bottom:16px;">
        <div><h2>💼 Vagas & Oportunidades</h2><p>Clínicas e dentistas conectados.</p></div>
        <button class="btn-white-outline" onclick="document.getElementById('modal-vaga').classList.add('open')">+ Publicar vaga</button>
      </div>
      <div class="tabs-wrap">
        <button class="tab on" id="tab-vagas" onclick="switchTab('vagas')">Vagas abertas</button>
        <button class="tab" id="tab-offer" onclick="switchTab('offer')">Estou disponível</button>
        <button class="tab" id="tab-mine" onclick="switchTab('mine')">Minhas candidaturas</button>
      </div>
      <div class="jobs-layout">
        <div>
          <div id="tab-content-vagas">
            <div class="job">
              <div class="job-top"><div class="clinic-av" style="background:linear-gradient(135deg,#010267,#336699);">OP</div><div><div class="job-ttl">Ortodontista — CLT ou PJ</div><div class="job-clinic">Clínica OdontoPrime · 2 dias atrás</div></div><div class="job-loc">São Paulo, SP</div></div>
              <div class="jtags"><span class="jtag sp">Ortodontia</span><span class="jtag ct">CLT ou PJ</span><span class="jtag lc">SP Capital</span></div>
              <div class="job-desc">Buscamos ortodontista para integrar nossa equipe. Carteira de pacientes já formada. Espaço moderno com scanner intraoral.</div>
              <div class="job-ftr"><div class="job-sal">A combinar · <strong>Clínica est. 2008</strong></div><div style="display:flex;gap:6px;align-items:center;"><button class="btn-apply" onclick="registrarCandidatura(this)">✅ Candidatar-se</button></div></div>
            </div>
            <div class="job">
              <div class="job-top"><div class="clinic-av" style="background:linear-gradient(135deg,#542F62,#7a3d92);">DS</div><div><div class="job-ttl">Auxiliar em Saúde Bucal (ASB)</div><div class="job-clinic">Dr. Sorriso Clínicas · Publicado hoje</div></div><div class="job-loc">Campinas, SP</div></div>
              <div class="jtags"><span class="jtag sp">ASB</span><span class="jtag ct">CLT</span><span class="jtag lc">Campinas</span></div>
              <div class="job-desc">Vaga para ASB com certificado SENAC. Horário: seg a sex, 8h às 18h. Benefícios: VT, VR, plano de saúde.</div>
              <div class="job-ftr"><div class="job-sal"><strong>R$ 2.100 – R$ 2.600/mês</strong></div><div style="display:flex;gap:6px;align-items:center;"><button class="btn-apply" onclick="registrarCandidatura(this)">✅ Candidatar-se</button></div></div>
            </div>
          </div>
          <div id="tab-content-offer" style="display:none;">
            <div style="background:white;border-radius:var(--r);padding:20px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:12px;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                <div class="av l av-grad-2">JV</div>
                <div style="flex:1;"><div style="font-size:15px;font-weight:700;color:var(--text);">Dr. João Viana</div><div style="font-size:12px;color:var(--text3);margin-top:2px;">CRO/SP 44231 · Periodontia</div></div>
                <div style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,.1);color:#059669;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;border:1px solid rgba(16,185,129,.25);"><i class="ti ti-check" style="font-size:13px;"></i> Disponível</div>
              </div>
              <div class="jtags"><span class="jtag sp">Periodontia</span><span class="jtag ct">PJ</span><span class="jtag lc">São Paulo, SP</span></div>
              <div class="job-desc">Periodontista com 8 anos de experiência. Disponível para sociedade ou parceria em clínica.</div>
              <button class="btn-apply" style="background:var(--blue);" onclick="openChat('Dr. João Viana','Oportunidade de parceria')">Entrar em contato</button>
            </div>
          </div>
          <div id="tab-content-mine" style="display:none;">
            <div style="background:white;border-radius:var(--r);padding:20px;box-shadow:var(--shadow);border:1px solid var(--border);text-align:center;">
              <i class="ti ti-file-search" style="font-size:48px;color:var(--border);display:block;margin-bottom:12px;"></i>
              <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:6px;">Nenhuma candidatura ainda</div>
              <div style="font-size:13px;color:var(--text3);margin-bottom:16px;">Candidate-se a vagas e acompanhe o status aqui.</div>
              <button class="btn-apply" onclick="switchTab('vagas')">Ver vagas abertas</button>
            </div>
          </div>
        </div>
        <div>
          <div class="upgrade-card"><h4>🚀 Em breve: Plano Pro</h4><p>Publique vagas ilimitadas, destaque seu perfil e acesse relatórios de candidaturas.</p><button class="btn-upgrade" onclick="alert('Plano Pro em breve! Durante o beta tudo é gratuito 🎉')">Quero ser avisado</button></div>
          <div class="card">
            <div class="card-hdr"><span class="card-ttl">Filtrar vagas</span></div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <select style="padding:8px 10px;border-radius:var(--rs);border:1.5px solid var(--border);font-family:inherit;font-size:12px;color:var(--text2);background:white;outline:none;"><option>Todas as especialidades</option><option>Ortodontia</option><option>Implantodontia</option><option>Endodontia</option></select>
              <select style="padding:8px 10px;border-radius:var(--rs);border:1.5px solid var(--border);font-family:inherit;font-size:12px;color:var(--text2);background:white;outline:none;"><option>Todo o Brasil</option><option>São Paulo</option><option>Rio de Janeiro</option><option>Minas Gerais</option></select>
              <button style="padding:9px;border-radius:var(--rs);background:var(--navy);color:white;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">Buscar vagas</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- AGENDA -->
    <div id="screen-agenda" class="page">
      <div style="display:flex;gap:0;height:calc(100vh - 120px);min-height:600px;">

        <!-- SIDEBAR -->
        <div style="width:220px;background:white;border-right:1px solid var(--border);padding:14px;flex-shrink:0;overflow-y:auto;border-radius:var(--r) 0 0 var(--r);">
          <!-- Mini cal -->
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:800;color:var(--navy);margin-bottom:8px;">
            <button onclick="agMudaSemana(-1)" style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--navy);">‹</button>
            <span id="ag-mini-title"></span>
            <button onclick="agMudaSemana(1)" style="background:none;border:none;cursor:pointer;font-size:16px;color:var(--navy);">›</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;text-align:center;font-size:9px;margin-bottom:4px;">
            <div style="font-weight:700;color:var(--text3);">D</div><div style="font-weight:700;color:var(--text3);">S</div>
            <div style="font-weight:700;color:var(--text3);">T</div><div style="font-weight:700;color:var(--text3);">Q</div>
            <div style="font-weight:700;color:var(--text3);">Q</div><div style="font-weight:700;color:var(--text3);">S</div>
            <div style="font-weight:700;color:var(--text3);">S</div>
          </div>
          <div id="ag-mini-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;text-align:center;margin-bottom:14px;"></div>

          <!-- Profissionais -->
          <div style="font-size:10px;font-weight:700;color:var(--text3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            Profissionais
            <span style="font-size:10px;color:var(--purple);cursor:pointer;" onclick="agFiltrarProfs('todos')">Todos</span>
          </div>
          <div id="ag-profs-list"></div>
          <button onclick="abrirModalProf()" style="margin-top:8px;width:100%;padding:7px;border-radius:7px;font-size:10px;font-weight:700;color:var(--purple);border:1.5px dashed var(--border);background:transparent;cursor:pointer;">+ Adicionar profissional</button>

          <!-- Alertas retorno -->
          <div style="font-size:10px;font-weight:700;color:var(--text3);letter-spacing:.08em;text-transform:uppercase;margin-top:14px;margin-bottom:8px;">Alertas de Retorno</div>
          <div id="ag-alertas"></div>
        </div>

        <!-- MAIN CALENDAR -->
        <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
          <!-- Toolbar -->
          <div style="background:white;border-bottom:1px solid var(--border);padding:10px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0;">
            <button onclick="abrirModalAgendamento()" style="background:linear-gradient(135deg,var(--navy),var(--purple));color:white;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:5px;"><i class="ti ti-plus"></i> Novo</button>
            <button onclick="agHoje()" style="background:#f0eaf6;color:var(--purple);border:1.5px solid var(--border);padding:6px 12px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;">Hoje</button>
            <button onclick="agMudaSemana(-1)" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--text3);">‹</button>
            <span id="ag-week-title" style="font-size:13px;font-weight:800;color:var(--navy);min-width:200px;"></span>
            <button onclick="agMudaSemana(1)" style="background:none;border:none;cursor:pointer;font-size:18px;color:var(--text3);">›</button>
            <div style="margin-left:auto;display:flex;gap:4px;">
              <button onclick="agSetView('day')" id="btn-view-day" style="padding:6px 12px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid var(--border);background:#f3f4f9;color:var(--text3);">Dia</button>
              <button onclick="agSetView('week')" id="btn-view-week" style="padding:6px 12px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;border:none;background:linear-gradient(135deg,var(--navy),var(--purple));color:white;">Semana</button>
              <button onclick="agSetView('month')" id="btn-view-month" style="padding:6px 12px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid var(--border);background:#f3f4f9;color:var(--text3);">Mês</button>
            </div>
          </div>

          <!-- Calendar grid -->
          <div style="flex:1;overflow:auto;position:relative;" id="ag-cal-scroll">
            <div id="ag-cal-grid" style="min-width:600px;"></div>
          </div>
        </div>
      </div>

      <!-- Pacientes section -->
      <div style="margin-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="font-size:16px;font-weight:800;color:var(--navy);">👥 Pacientes cadastrados</div>
          <button class="btn-primary" onclick="abrirModalPaciente()"><i class="ti ti-user-plus"></i> Novo paciente</button>
        </div>
        <div id="pacientes-lista" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;"></div>
      </div>

      <!-- Importador -->
      <div style="margin-top:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="font-size:16px;font-weight:800;color:var(--navy);">📥 Importar Pacientes</div>
          <button onclick="toggleImportador()" id="btn-importador" style="background:#f0eaf6;color:#542F62;border:1.5px solid #d4c0e0;padding:7px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">+ Importar de outro sistema</button>
        </div>
        <div id="importador-box" style="display:none;">
          <div class="card" style="padding:20px;margin-bottom:14px;">
            <div style="font-size:15px;font-weight:800;color:var(--navy);margin-bottom:6px;">Sistemas suportados</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
              <span style="background:#f3f4f9;border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;color:#010267;">🦷 Clinicorp</span>
              <span style="background:#f3f4f9;border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;color:#010267;">📋 Dental Manager</span>
              <span style="background:#f3f4f9;border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;color:#010267;">💻 OrthoNotes</span>
              <span style="background:#f3f4f9;border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;color:#010267;">🗂️ EasyDental</span>
              <span style="background:#f3f4f9;border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;color:#010267;">📊 Excel/CSV</span>
              <span style="background:#f3f4f9;border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:11px;font-weight:600;color:#010267;">⚡ Qualquer sistema</span>
            </div>
            <div style="font-size:12px;color:#8889aa;margin-bottom:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px;">
              💡 <strong>Como exportar:</strong> No seu sistema atual vá em <em>Relatórios → Pacientes → Exportar CSV</em> ou <em>Salvar como Excel</em>.
            </div>
            <div id="drop-zone" ondragover="event.preventDefault()" ondrop="handleFileDrop(event)"
              style="border:2px dashed #542F62;border-radius:12px;padding:28px;text-align:center;background:#f9f7fc;cursor:pointer;" onclick="document.getElementById('import-file').click()">
              <div style="font-size:36px;margin-bottom:8px;">📂</div>
              <div style="font-size:15px;font-weight:800;color:#542F62;margin-bottom:4px;">Arraste seu arquivo aqui</div>
              <div style="font-size:12px;color:#8889aa;margin-bottom:10px;">ou clique para selecionar</div>
              <div style="display:flex;gap:6px;justify-content:center;">
                <span style="background:#f0eaf6;color:#542F62;font-size:10px;font-weight:700;padding:3px 8px;border-radius:12px;">.CSV</span>
                <span style="background:#e8eaf8;color:#010267;font-size:10px;font-weight:700;padding:3px 8px;border-radius:12px;">.XLSX</span>
              </div>
              <input type="file" id="import-file" accept=".csv,.xlsx,.xls" style="display:none;" onchange="handleFileSelect(this)">
            </div>
          </div>
          <div class="card" id="mapeamento-box" style="padding:20px;display:none;">
            <div style="font-size:15px;font-weight:800;color:var(--navy);margin-bottom:4px;">🗂️ Mapeie as colunas</div>
            <div id="arquivo-info" style="font-size:12px;color:#8889aa;margin-bottom:14px;"></div>
            <div id="mapeamento-campos" style="margin-bottom:16px;"></div>
            <div id="preview-table-wrap" style="overflow-x:auto;margin-bottom:16px;"></div>
            <button onclick="executarImportacao()" style="width:100%;background:linear-gradient(135deg,#010267,#542F62);color:white;padding:14px;border-radius:10px;font-size:14px;font-weight:800;border:none;cursor:pointer;" id="btn-executar-import">⚡ Importar pacientes</button>
          </div>
        </div>
      </div>
    </div>
    <!-- FICHA PACIENTE -->
    <div id="screen-ficha" class="page">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <button onclick="nav(document.querySelector('[data-s=agenda]'),'agenda','Agenda')" style="background:#f3f4f9;border:1.5px solid #e3e5f0;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;color:var(--navy);">‹ Voltar</button>
        <div style="font-size:18px;font-weight:800;color:var(--navy);" id="ficha-nome-titulo">Ficha do Paciente</div>
      </div>
      <div id="ficha-content"></div>
    </div>

    <!-- ESPECIALISTAS -->
    <div id="screen-experts" class="page">
      <div class="help-banner">
        <div class="help-banner-ico">🆘</div>
        <div><h2>Ajuda do Especialista</h2><p>Escolha a especialidade e inicie uma consulta para segunda opinião, diagnóstico e planejamento.</p></div>
      </div>
      <div class="spec-grid" style="display:flex;flex-wrap:wrap;gap:16px;width:100%;box-sizing:border-box;">
        <div class="spec-card" onclick="openChat('Consulta — Clínico Geral','Diagnóstico e dúvidas clínicas gerais')">
          <div class="spec-top" style="background:linear-gradient(145deg,#e8f4ff,#bfdbfe);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><defs><radialGradient id="cg1" cx="40%" cy="30%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#bfdbfe"/></radialGradient></defs><path d="M30 28 C30 20 40 15 50 15 C60 15 70 20 70 28 C72 36 70 44 68 50 C66 58 64 68 62 76 C61 82 58 84 56 80 C54 76 52 68 50 68 C48 68 46 76 44 80 C42 84 39 82 38 76 C36 68 34 58 32 50 C30 44 28 36 30 28Z" fill="url(#cg1)" stroke="#2563eb" stroke-width="1.8"/><path d="M38 26 C36 20 42 16 46 20" stroke="#2563eb" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M62 26 C64 20 58 16 54 20" stroke="#2563eb" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M42 35 Q50 40 58 35" stroke="#93c5fd" stroke-width="1" fill="none"/><path d="M50 30 L50 45" stroke="#93c5fd" stroke-width="1"/><ellipse cx="40" cy="26" rx="6" ry="3" fill="white" opacity=".5" transform="rotate(-20 40 26)"/><circle cx="78" cy="72" r="10" fill="#e0f2fe" stroke="#2563eb" stroke-width="1.5"/><line x1="74" y1="80" x2="88" y2="94" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/><circle cx="78" cy="72" r="6" fill="white" opacity=".6"/></svg></div>
          <div class="spec-body"><div class="spec-name">Clínico Geral</div><div class="spec-desc">Diagnóstico inicial, triagem clínica e dúvidas do dia a dia da prática odontológica.</div><button class="btn-help" style="background:linear-gradient(135deg,#010267,#0d1faa);color:white;"><i class="ti ti-message-question"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Implantodontista','Planejamento de implantes e cirurgia')">
          <div class="spec-top" style="background:linear-gradient(145deg,#f5f0ff,#e0ccff);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><defs><linearGradient id="ig1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient><linearGradient id="ig2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ede9fe"/><stop offset="100%" stop-color="#c4b5fd"/></linearGradient></defs><path d="M15 82 Q50 72 85 82 L88 95 Q50 86 12 95Z" fill="#e9d5ff" stroke="#7c3aed" stroke-width="1" opacity=".7"/><rect x="43" y="35" width="14" height="52" rx="7" fill="url(#ig1)" stroke="#6d28d9" stroke-width="1"/><rect x="43" y="40" width="14" height="2" rx="1" fill="white" opacity=".25"/><rect x="43" y="46" width="14" height="2" rx="1" fill="white" opacity=".25"/><rect x="43" y="52" width="14" height="2" rx="1" fill="white" opacity=".25"/><rect x="43" y="58" width="14" height="2" rx="1" fill="white" opacity=".25"/><rect x="43" y="64" width="14" height="2" rx="1" fill="white" opacity=".25"/><rect x="43" y="70" width="14" height="2" rx="1" fill="white" opacity=".25"/><path d="M46 28 L54 28 L56 38 L44 38Z" fill="#a78bfa" stroke="#7c3aed" stroke-width="1"/><path d="M38 10 Q50 4 62 10 L60 28 Q50 22 40 28Z" fill="url(#ig2)" stroke="#7c3aed" stroke-width="1.5"/><path d="M42 12 Q50 8 58 12" stroke="white" stroke-width="1.5" opacity=".6" stroke-linecap="round"/></svg></div>
          <div class="spec-body"><div class="spec-name">Implantodontista</div><div class="spec-desc">Planejamento de implantes, pino, coroa, carga imediata e enxertos ósseos.</div><button class="btn-help" style="background:linear-gradient(135deg,#542F62,#7a3d92);color:white;"><i class="ti ti-tooth"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Ortodontista','Planejamento ortodôntico e alinhadores')">
          <div class="spec-top" style="background:linear-gradient(145deg,#eff6ff,#bfdbfe);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><defs><linearGradient id="og1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs><path d="M10 55 Q25 30 50 28 Q75 30 90 55" stroke="#1d4ed8" stroke-width="2" fill="none"/><rect x="12" y="46" width="13" height="18" rx="5" fill="url(#og1)" stroke="#1d4ed8" stroke-width="1.5"/><rect x="28" y="40" width="13" height="22" rx="5" fill="url(#og1)" stroke="#1d4ed8" stroke-width="1.5"/><rect x="44" y="38" width="13" height="24" rx="5" fill="url(#og1)" stroke="#1d4ed8" stroke-width="1.5"/><rect x="60" y="40" width="13" height="22" rx="5" fill="url(#og1)" stroke="#1d4ed8" stroke-width="1.5"/><rect x="76" y="46" width="13" height="18" rx="5" fill="url(#og1)" stroke="#1d4ed8" stroke-width="1.5"/><rect x="15" y="51" width="7" height="6" rx="1.5" fill="#1d4ed8"/><rect x="31" y="47" width="7" height="6" rx="1.5" fill="#1d4ed8"/><rect x="47" y="46" width="7" height="6" rx="1.5" fill="#1d4ed8"/><rect x="63" y="47" width="7" height="6" rx="1.5" fill="#1d4ed8"/><rect x="79" y="51" width="7" height="6" rx="1.5" fill="#1d4ed8"/><line x1="15" y1="54" x2="22" y2="54" stroke="white" stroke-width="1"/><line x1="31" y1="50" x2="38" y2="50" stroke="white" stroke-width="1"/><line x1="47" y1="49" x2="54" y2="49" stroke="white" stroke-width="1"/><line x1="63" y1="50" x2="70" y2="50" stroke="white" stroke-width="1"/><line x1="79" y1="54" x2="86" y2="54" stroke="white" stroke-width="1"/><path d="M18 54 Q34 50 50 49 Q66 50 82 54" stroke="#93c5fd" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M18 54 Q18 70 25 74" stroke="#f87171" stroke-width="1.2" fill="none" stroke-dasharray="2 2"/></svg></div>
          <div class="spec-body"><div class="spec-name">Ortodontista</div><div class="spec-desc">Planejamento de aparelhos fixos, alinhadores, mordida e correções esqueléticas.</div><button class="btn-help" style="background:linear-gradient(135deg,#336699,#4d82b8);color:white;"><i class="ti ti-adjustments"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Endodontista','Tratamentos de canal e dor pulpar')">
          <div class="spec-top" style="background:linear-gradient(145deg,#ecfdf5,#a7f3d0);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><defs><linearGradient id="eg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#d1fae5"/></linearGradient><linearGradient id="eg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fca5a5"/><stop offset="100%" stop-color="#ef4444"/></linearGradient></defs><path d="M50 10 C40 10 30 18 28 30 C26 42 30 54 32 64 L34 82 C34 86 38 87 40 83 L42 72 C43 76 46 82 48 84 C49 82 50 78 50 76 C51 78 51 82 52 84 C54 82 57 76 58 72 L60 83 C62 87 66 86 66 82 L68 64 C70 54 74 42 72 30 C70 18 60 10 50 10Z" fill="url(#eg1)" stroke="#059669" stroke-width="1.8"/><path d="M50 18 C46 18 44 24 43 30 C42 38 44 50 45 60 L46 72 L48 80 L50 76 L52 80 L54 72 L55 60 C56 50 58 38 57 30 C56 24 54 18 50 18Z" fill="url(#eg2)" opacity=".7"/><line x1="80" y1="5" x2="54" y2="65" stroke="#059669" stroke-width="2" stroke-linecap="round"/><path d="M78 9 C80 11 82 9 80 13 C82 15 80 17 82 19 C80 21 82 23 80 25" stroke="#059669" stroke-width="1.2" fill="none"/><rect x="77" y="2" width="8" height="6" rx="2" fill="#34d399" stroke="#059669" stroke-width="1"/></svg></div>
          <div class="spec-body"><div class="spec-name">Endodontista</div><div class="spec-desc">Tratamento de canal, retratamento, dor aguda e casos de difícil instrumentação.</div><button class="btn-help" style="background:linear-gradient(135deg,#0f6e56,#1d9e75);color:white;"><i class="ti ti-activity"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Harmonização Facial','Procedimentos estéticos faciais')">
          <div class="spec-top" style="background:linear-gradient(145deg,#fff0f6,#ffc0dc);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 110 80" width="90" height="65" fill="none"><defs><radialGradient id="lipBot" cx="50%" cy="60%"><stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#be123c"/></radialGradient><radialGradient id="lipTop" cx="50%" cy="30%"><stop offset="0%" stop-color="#fda4af"/><stop offset="100%" stop-color="#e11d48"/></radialGradient><radialGradient id="shine" cx="50%" cy="20%"><stop offset="0%" stop-color="white" stop-opacity=".7"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs><rect x="10" y="5" width="90" height="20" rx="10" fill="#fddcb5"/><path d="M48 22 C50 18 52 18 54 22" stroke="#d4917a" stroke-width="1" fill="none"/><path d="M15 28 C20 22 30 18 40 20 C44 21 47 24 50 24 C53 24 56 21 60 20 C70 18 90 22 95 28 C85 24 75 23 68 25 C62 27 57 29 54 28 C53 27.5 52 27 50 27 C48 27 47 27.5 46 28 C43 29 38 27 32 25 C25 23 20 24 15 28Z" fill="url(#lipTop)" stroke="#be123c" stroke-width=".8"/><path d="M15 28 C20 38 30 50 40 54 C44 56 47 57 50 57 C53 57 56 56 60 54 C70 50 90 38 95 28 C82 36 72 44 62 48 C58 50 55 51 50 51 C45 51 42 50 38 48 C28 44 18 36 15 28Z" fill="url(#lipBot)" stroke="#be123c" stroke-width=".8"/><path d="M15 28 C28 30 38 31 50 31 C62 31 72 30 95 28" stroke="#9f1239" stroke-width="1" fill="none"/><ellipse cx="50" cy="44" rx="18" ry="5" fill="url(#shine)"/><ellipse cx="36" cy="23" rx="7" ry="2.5" fill="white" opacity=".35" transform="rotate(-15 36 23)"/><ellipse cx="64" cy="23" rx="7" ry="2.5" fill="white" opacity=".35" transform="rotate(15 64 23)"/><rect x="10" y="55" width="90" height="18" rx="10" fill="#fddcb5"/><g transform="translate(82,5) rotate(30)"><rect x="0" y="0" width="8" height="16" rx="4" fill="#db2777"/><rect x="1" y="14" width="6" height="26" rx="2" fill="white" stroke="#db2777" stroke-width="1.2"/><rect x="2" y="20" width="4" height="16" rx="1" fill="#f9a8d4" opacity=".8"/><rect x="0" y="14" width="8" height="3" rx="1.5" fill="#9f1239"/><rect x="3" y="40" width="2" height="12" rx="1" fill="#9f1239"/><path d="M3 52 L4 58 L5 52Z" fill="#9f1239"/></g><circle cx="44" cy="42" r="2" fill="white" opacity=".5"/><circle cx="56" cy="43" r="1.5" fill="white" opacity=".4"/></svg></div>
          <div class="spec-body"><div class="spec-name">Harmonização Facial</div><div class="spec-desc">Toxina botulínica, preenchimentos, fios, bichectomia e estética facial integrativa.</div><button class="btn-help" style="background:linear-gradient(135deg,#9d174d,#db2777);color:white;"><i class="ti ti-sparkles"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Gestão & Marketing','Gestão de clínica e marketing odontológico')">
          <div class="spec-top" style="background:linear-gradient(145deg,#fffbeb,#fde68a);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><rect x="15" y="50" width="70" height="42" rx="4" fill="#1e1b4b"/><rect x="19" y="54" width="62" height="34" rx="2" fill="#0f172a"/><rect x="8" y="91" width="84" height="5" rx="2.5" fill="#78530a" opacity=".7"/><polyline points="26,80 34,72 42,75 52,64 62,58 72,50" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M26,80 L34,72 L42,75 L52,64 L62,58 L72,50 L72,82 L26,82Z" fill="#fbbf24" opacity=".15"/><circle cx="26" cy="80" r="2.5" fill="#fbbf24"/><circle cx="34" cy="72" r="2.5" fill="#fbbf24"/><circle cx="42" cy="75" r="2.5" fill="#fbbf24"/><circle cx="52" cy="64" r="2.5" fill="#fbbf24"/><circle cx="62" cy="58" r="2.5" fill="#fbbf24"/><circle cx="72" cy="50" r="3.5" fill="#f59e0b"/><line x1="26" y1="82" x2="74" y2="82" stroke="#374151" stroke-width="1"/><line x1="26" y1="58" x2="26" y2="82" stroke="#374151" stroke-width="1"/><path d="M68 46 L76 44 L74 52" fill="#f59e0b"/><text x="22" y="66" font-size="7" fill="#6ee7b7" font-weight="bold" font-family="monospace">R$↑</text></svg></div>
          <div class="spec-body"><div class="spec-name">Gestão & Marketing</div><div class="spec-desc">Administração de clínica, finanças, marketing digital e captação de pacientes.</div><button class="btn-help" style="background:linear-gradient(135deg,#854f0b,#ef9f27);color:white;"><i class="ti ti-chart-line"></i> Consultar agora</button></div>
        <div class="spec-card" onclick="openChat('Consulta — Perito Odontológico','Identificação, laudos e perícias odontológicas')">
          <div class="spec-top" style="background:linear-gradient(145deg,#f1f5f9,#dde4ee);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><circle cx="40" cy="42" r="26" fill="white" stroke="#334155" stroke-width="2.5"/><circle cx="40" cy="42" r="20" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/><path d="M40 28 C35 28 30 32 29 38 C28 43 30 48 31 53 L32 60 C32 62 34 62 35 60 L36 55 C36.5 57 38 61 40 62 C42 61 43.5 57 44 55 L45 60 C46 62 48 62 48 60 L49 53 C50 48 52 43 51 38 C50 32 45 28 40 28Z" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/><path d="M36 36 Q40 39 44 36" stroke="#94a3b8" stroke-width="1" fill="none"/><line x1="40" y1="33" x2="40" y2="42" stroke="#94a3b8" stroke-width="1"/><line x1="60" y1="62" x2="82" y2="84" stroke="#334155" stroke-width="5" stroke-linecap="round"/><line x1="60" y1="62" x2="82" y2="84" stroke="#475569" stroke-width="3" stroke-linecap="round"/><path d="M28 30 Q32 26 38 28" stroke="white" stroke-width="2" opacity=".5" stroke-linecap="round"/><line x1="72" y1="18" x2="72" y2="28" stroke="#64748b" stroke-width="2" stroke-linecap="round"/><line x1="67" y1="21" x2="77" y2="25" stroke="#64748b" stroke-width="2" stroke-linecap="round"/><line x1="67" y1="25" x2="77" y2="21" stroke="#64748b" stroke-width="2" stroke-linecap="round"/></svg></div>
          <div class="spec-body"><div class="spec-name">Perito Odontológico</div><div class="spec-desc">Identificação, laudos periciais e odontologia legal forense.</div><button class="btn-help" style="background:linear-gradient(135deg,#334155,#64748b);color:white;"><i class="ti ti-message-question"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Direito Odontológico','Ética profissional, contratos e questões jurídicas')">
          <div class="spec-top" style="background:linear-gradient(145deg,#faf7ee,#ede8cc);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><rect x="44" y="84" width="12" height="8" rx="2" fill="#92400e"/><rect x="36" y="90" width="28" height="4" rx="2" fill="#78350f"/><rect x="49" y="16" width="3" height="68" rx="1.5" fill="#92400e"/><rect x="18" y="24" width="64" height="4" rx="2" fill="#92400e"/><line x1="26" y1="28" x2="22" y2="52" stroke="#b45309" stroke-width="1.5" stroke-dasharray="2 1"/><line x1="74" y1="28" x2="78" y2="52" stroke="#b45309" stroke-width="1.5" stroke-dasharray="2 1"/><path d="M10 52 Q22 48 34 52 Q22 56 10 52Z" fill="#fef3c7" stroke="#92400e" stroke-width="1.5"/><path d="M66 56 Q78 52 90 56 Q78 60 66 56Z" fill="#fef3c7" stroke="#92400e" stroke-width="1.5"/><ellipse cx="22" cy="52" rx="12" ry="2.5" fill="none" stroke="#d97706" stroke-width="1"/><ellipse cx="78" cy="56" rx="12" ry="2.5" fill="none" stroke="#d97706" stroke-width="1"/><path d="M50 8 C47 8 44 10 44 13 C44 16 45 18 46 20 L46.5 23 C46.5 24 47.5 24 48 23 L48.5 21 C49 22 50 24 50 24 C50 24 51 22 51.5 21 L52 23 C52.5 24 53.5 24 53.5 23 L54 20 C55 18 56 16 56 13 C56 10 53 8 50 8Z" fill="#fef3c7" stroke="#92400e" stroke-width="1"/></svg></div>
          <div class="spec-body"><div class="spec-name">Direito Odontológico</div><div class="spec-desc">Ética profissional, contratos e questões jurídicas odontológicas.</div><button class="btn-help" style="background:linear-gradient(135deg,#78530a,#b45309);color:white;"><i class="ti ti-message-question"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Dentística Restauradora','Restaurações estéticas, facetas e resinas')">
          <div class="spec-top" style="background:linear-gradient(145deg,#fdf2f8,#f5c8e8);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><defs><linearGradient id="dg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#fce7f3"/></linearGradient><radialGradient id="dglow" cx="50%" cy="30%"><stop offset="0%" stop-color="white" stop-opacity=".8"/><stop offset="100%" stop-color="#f9a8d4" stop-opacity="0"/></radialGradient></defs><path d="M50 10 C40 10 30 18 29 28 C28 38 31 49 33 57 L34 72 C34 76 37 77 39 73 L41 63 C42 67 45 74 48 76 C49 74 50 70 50 68 C51 70 51 74 52 76 C55 74 58 67 59 63 L61 73 C63 77 66 76 66 72 L67 57 C69 49 72 38 71 28 C70 18 60 10 50 10Z" fill="url(#dg1)" stroke="#be185d" stroke-width="2"/><ellipse cx="40" cy="22" rx="7" ry="3.5" fill="url(#dglow)" transform="rotate(-15 40 22)"/><path d="M36 16 Q46 11 56 16" stroke="white" stroke-width="2" stroke-linecap="round" opacity=".7"/><rect x="68" y="8" width="6" height="36" rx="3" fill="#be185d" transform="rotate(35 71 26)"/><rect x="72" y="30" width="6" height="10" rx="1" fill="#9f1239" transform="rotate(35 75 35)"/><path d="M80 44 L86 56 L76 58 L74 46Z" fill="#f9a8d4" stroke="#be185d" stroke-width="1"/><path d="M83 55 L86 62 L80 63Z" fill="#fce7f3" stroke="#be185d" stroke-width="1"/><path d="M55 30 Q62 36 60 44 Q58 52 50 52" stroke="#ec4899" stroke-width="1.5" stroke-linecap="round" fill="none" stroke-dasharray="2 1"/><circle cx="60" cy="44" r="4" fill="#f9a8d4" opacity=".8"/><circle cx="61" cy="43" r="1.5" fill="white" opacity=".7"/><circle cx="36" cy="28" r="2" fill="white" opacity=".8"/><path d="M64 20 L66 16 M68 22 L72 20 M66 26 L70 26" stroke="#f9a8d4" stroke-width="1.2" stroke-linecap="round"/></svg></div>
          <div class="spec-body"><div class="spec-name">Dentística Restauradora</div><div class="spec-desc">Restaurações estéticas, facetas de porcelana e resinas compostas.</div><button class="btn-help" style="background:linear-gradient(135deg,#be185d,#ec4899);color:white;"><i class="ti ti-message-question"></i> Consultar agora</button></div>
        </div>
        <div class="spec-card" onclick="openChat('Consulta — Odontopediatria','Tratamento dental infantil e odontologia para crianças')">
          <div class="spec-top" style="background:linear-gradient(145deg,#ecfdf5,#bbf7d0);display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 100 100" width="80" height="80" fill="none"><path d="M50 18 C40 18 32 25 31 34 C30 42 33 50 34 57 L35 68 C35 71 37.5 72 39 69 L40 62 C41 65 44 71 46 73 C47 71 49 66 50 64 C51 66 53 71 54 73 C56 71 59 65 60 62 L61 69 C62.5 72 65 71 65 68 L66 57 C67 50 70 42 69 34 C68 25 60 18 50 18Z" fill="white" stroke="#16a34a" stroke-width="2"/><circle cx="43" cy="36" r="3.5" fill="#16a34a" opacity=".15"/><circle cx="57" cy="36" r="3.5" fill="#16a34a" opacity=".15"/><circle cx="43" cy="36" r="2" fill="#16a34a" opacity=".7"/><circle cx="57" cy="36" r="2" fill="#16a34a" opacity=".7"/><circle cx="43.8" cy="35.2" r=".7" fill="white"/><circle cx="57.8" cy="35.2" r=".7" fill="white"/><path d="M41 45 Q50 54 59 45" stroke="#16a34a" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="36" cy="44" rx="4" ry="2.5" fill="#fca5a5" opacity=".4"/><ellipse cx="64" cy="44" rx="4" ry="2.5" fill="#fca5a5" opacity=".4"/><path d="M22 24 L23 20 L24 24 L28 25 L24 26 L23 30 L22 26 L18 25Z" fill="#16a34a" opacity=".5"/><path d="M76 22 L77 19 L78 22 L81 23 L78 24 L77 27 L76 24 L73 23Z" fill="#16a34a" opacity=".5"/><circle cx="18" cy="38" r="3" fill="#86efac" opacity=".6"/><circle cx="82" cy="34" r="2.5" fill="#86efac" opacity=".6"/></svg></div>
          <div class="spec-body"><div class="spec-name">Odontopediatria</div><div class="spec-desc">Tratamento dental infantil, prevenção e saúde bucal da criança.</div><button class="btn-help" style="background:linear-gradient(135deg,#16a34a,#22c55e);color:white;"><i class="ti ti-message-question"></i> Consultar agora</button></div>
        </div>
      </div>
    </div>

    <!-- CURSOS -->
    <div id="screen-cursos" class="page">
      <div class="welcome" style="margin-bottom:16px;">
        <div><h2>📚 Cursos Odontológicos</h2><p>Presencial, online e híbrido para dentistas</p></div>
        <button class="btn-white-outline" onclick="document.getElementById('modal-curso').classList.add('open')">+ Publicar meu curso</button>
      </div>

      <!-- FILTROS -->
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;" id="cursos-filtros">
        <button class="filter-btn on" onclick="filtrarCursos(this,'todos')">Todos</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'presencial')">🏫 Presencial</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'online')">💻 Online</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'hibrido')">🔀 Híbrido</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Clínico Geral')">Clínico Geral</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Implantodontia')">Implantodontia</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Ortodontia')">Ortodontia</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Endodontia')">Endodontia</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Periodontia')">Periodontia</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Prótese')">Prótese</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Cirurgia')">Cirurgia</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Harmonização')">Harmonização</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Dentística')">Dentística</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Odontopediatria')">Odontopediatria</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Radiologia')">Radiologia</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Fotografia')">📷 Fotografia Odontológica</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Gestão')">Gestão & Marketing</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Direito')">Direito Odontológico</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Perito')">Perito Odontológico</button>
        <button class="filter-btn" onclick="filtrarCursos(this,'Estomatologia')">Estomatologia</button>
      </div>

      <!-- GRID -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;" id="cursos-grid">
        <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);">
          <i class="ti ti-loader" style="font-size:32px;display:block;margin-bottom:10px;animation:spin 1s linear infinite;"></i>
          Carregando cursos...
        </div>
      </div>

      <!-- BANNER BOTTOM -->
      <div style="background:linear-gradient(135deg,#010267,#542F62);border-radius:var(--r);padding:22px 26px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-size:16px;font-weight:800;color:white;margin-bottom:5px;">Quer divulgar seu curso aqui?</div>
          <div style="font-size:13px;color:rgba(255,255,255,.7);">Gratuito durante o beta. Alcance milhares de dentistas.</div>
        </div>
        <button class="btn-white-outline" onclick="document.getElementById('modal-curso').classList.add('open')">+ Anunciar agora</button>
      </div>
    </div>
  </div><!-- /main -->

  <!-- MODAL ANUNCIAR CURSO -->
  <div class="modal-overlay" id="modal-curso" onclick="if(event.target===this)this.classList.remove('open')" style="z-index:200;">
    <div class="modal" style="height:auto;max-height:90vh;overflow-y:auto;width:480px;">
      <div class="modal-hdr">
        <div style="font-size:20px;line-height:1;">📚</div>
        <div class="modal-hdr-info"><div class="modal-hdr-name">Anunciar Curso</div><div class="modal-hdr-spec">Preencha os dados do seu curso</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('modal-curso').classList.remove('open')"></i>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:12px;">
        <div><label class="lbl">Título do curso</label><input id="curso-title" class="inp" style="margin-bottom:0;" placeholder="Ex: Implantes Imediatos — Avançado"></div>
        <div><label class="lbl">Especialidade</label>
          <select id="curso-specialty" class="inp" style="margin-bottom:0;background:white;">
            <option>Dentística</option><option>Clínica Geral</option><option>Implantodontia</option><option>Ortodontia</option>
            <option>Endodontia</option><option>Periodontia</option><option>Prótese</option>
            <option>Bucomaxilofacial</option><option>Harmonização Facial</option>
            <option>Odontopediatria</option><option>Gestão & Marketing</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Modalidade</label><select id="curso-modality" class="inp" style="margin-bottom:0;background:white;"><option value="in_person">Presencial</option><option value="online">Online</option><option value="hybrid">Híbrido</option></select></div>
          <div><label class="lbl">Carga horária</label><input id="curso-hours" class="inp" style="margin-bottom:0;" placeholder="Ex: 12"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Cidade</label><input id="curso-city" class="inp" style="margin-bottom:0;" placeholder="São Paulo"></div>
          <div><label class="lbl">Valor (R$)</label><input id="curso-price" class="inp" style="margin-bottom:0;" placeholder="1800"></div>
        </div>
        <div><label class="lbl">Foto de capa do curso</label>
          <div style="border:2px dashed var(--border);border-radius:var(--rs);padding:14px;text-align:center;font-size:12px;color:var(--text3);cursor:pointer;" onclick="document.getElementById('curso-cover-input').click()">
            <i class="ti ti-cloud-upload" style="font-size:22px;display:block;margin-bottom:4px;"></i>
            <span id="curso-cover-label">Clique para enviar imagem de capa</span>
            <input type="file" id="curso-cover-input" accept="image/*" style="display:none;" onchange="previewCursoCover(this)">
          </div>
          <img id="curso-cover-preview" style="display:none;width:100%;height:120px;object-fit:cover;border-radius:var(--rs);margin-top:8px;">
        </div>
        <div><label class="lbl">WhatsApp para contato</label><input id="curso-whatsapp" class="inp" style="margin-bottom:0;" placeholder="11999999999"></div>
        <div><label class="lbl">Descrição</label><textarea id="curso-desc" class="inp" style="margin-bottom:0;min-height:72px;resize:vertical;" placeholder="Conteúdo, público-alvo e diferenciais..."></textarea></div>
        <button class="btn-primary" onclick="submitCurso()"><i class="ti ti-check"></i> Publicar curso</button>
      </div>
    </div>
  </div>

  <!-- MODAL CHAT -->
  <div class="modal-overlay" id="chat-modal" onclick="closeChat(event)">
    <div class="modal">
      <div class="modal-hdr">
        <div class="av m av-grad-1">?</div>
        <div class="modal-hdr-info"><div class="modal-hdr-name" id="chat-name">Nome</div><div class="modal-hdr-spec" id="chat-spec">Especialidade</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('chat-modal').classList.remove('open')"></i>
      </div>
      <div class="modal-msgs" id="chat-msgs">
        <div class="msg them"><div class="msg-bubble">Olá! Como posso ajudar?</div><div class="msg-time">agora</div></div>
      </div>
      <div class="modal-input">
        <input type="text" id="chat-input" placeholder="Digite sua mensagem..." onkeydown="if(event.key==='Enter')sendMsg()">
        <button class="btn-send" onclick="sendMsg()"><i class="ti ti-send"></i></button>
      </div>
    </div>
  </div>

  <!-- MODAL PERFIL -->
  <div class="modal-overlay" id="profile-modal" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal" style="width:420px;height:auto;max-height:85vh;overflow-y:auto;">
      <div class="modal-hdr">
        <div class="modal-hdr-info"><div class="modal-hdr-name">Perfil do Dentista</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('profile-modal').classList.remove('open')"></i>
      </div>
      <div id="profile-content"></div>
    </div>
  </div>



    <!-- LABS & TECNICOS -->
    <div id="screen-labs" class="page">
      <div class="welcome" style="margin-bottom:16px;background:linear-gradient(135deg,#010267,#336699);border-radius:var(--r);padding:20px 24px;">
        <div><h2 style="color:white;">🔬 Labs & Técnicos</h2><p style="color:rgba(255,255,255,.7);">Avalie e encontre os melhores parceiros</p></div>
        <button class="btn-white-outline" style="cursor:pointer;white-space:nowrap;" onclick="document.getElementById('modal-lab').classList.add('open')">+ Quero me cadastrar</button>
      </div>
      <div class="tabs-wrap" style="margin-bottom:16px;">
        <button class="tab on" id="tab-labs" onclick="switchLabTab('labs')">🔬 Laboratórios</button>
        <button class="tab" id="tab-tecs" onclick="switchLabTab('tecs')">🔧 Técnicos</button>
      </div>

      <div id="tab-content-labs">
        <div id="labs-list">
          <div class="card" style="margin-bottom:12px;padding:16px;">
            <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;">
              <div class="av l" style="background:linear-gradient(135deg,#010267,#336699);border-radius:10px;width:44px;height:44px;font-size:13px;">LG</div>
              <div style="flex:1;">
                <div style="font-size:15px;font-weight:800;color:var(--navy);">Lab. Prótese Gold</div>
                <div style="font-size:12px;color:var(--text3);">📍 São Paulo, SP · Prótese Cerâmica</div>
                <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                  <span style="color:#f59e0b;font-size:16px;">★★★★★</span>
                  <span style="font-size:12px;color:var(--text3);">4.8 (32 avaliações)</span>
                </div>
              </div>
            </div>
            <p style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:10px;">Próteses cerâmicas, zircônia e protocolo sobre implantes. Entrega em 5 dias úteis.</p>
            <div style="background:var(--bg);border-radius:8px;padding:10px;margin-bottom:10px;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                <div class="av s av-grad-me" style="width:24px;height:24px;font-size:9px;">TM</div>
                <span style="font-size:12px;font-weight:700;color:var(--text);">Dra. Taisa</span>
                <span style="color:#f59e0b;">★★★★★</span>
              </div>
              <p style="font-size:12px;color:var(--text2);">Excelente qualidade! Entrega rápida e precisa.</p>
            </div>
            <div style="display:flex;gap:8px;">
              <button onclick="avaliarParceiro('Lab. Prótese Gold')" style="flex:1;padding:9px;border-radius:8px;font-size:12px;font-weight:700;color:var(--purple);border:1.5px solid var(--border);background:white;cursor:pointer;">⭐ Avaliar</button>
              <a href="https://wa.me/5511999990000" target="_blank" style="background:#25d366;color:white;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;text-decoration:none;box-shadow:0 3px 10px rgba(37,211,102,.3);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      <div id="tab-content-tecs" style="display:none;">
        <div class="card" style="padding:16px;">
          <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;">
            <div class="av l" style="background:linear-gradient(135deg,#336699,#4d82b8);border-radius:10px;width:44px;height:44px;font-size:13px;">CT</div>
            <div style="flex:1;">
              <div style="font-size:15px;font-weight:800;color:var(--navy);">Carlos Técnico</div>
              <div style="font-size:12px;color:var(--text3);">📍 Rio de Janeiro, RJ</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
                <span style="color:#f59e0b;font-size:16px;">★★★★</span><span style="color:#ddd;font-size:16px;">★</span>
                <span style="font-size:12px;color:var(--text3);">4.2 (18 avaliações)</span>
              </div>
            </div>
          </div>
          <p style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:10px;">Especialista em aparelhos removíveis e placa miorrelaxante. 12 anos de experiência.</p>
          <div style="display:flex;gap:8px;">
            <button onclick="avaliarParceiro('Carlos Técnico')" style="flex:1;padding:9px;border-radius:8px;font-size:12px;font-weight:700;color:var(--purple);border:1.5px solid var(--border);background:white;cursor:pointer;">⭐ Avaliar</button>
            <a href="https://wa.me/5521999990000" target="_blank" style="background:#25d366;color:white;padding:9px 14px;border-radius:8px;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;text-decoration:none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>

  


  <!-- MODAL NOVO PROFISSIONAL -->
  <div class="modal-overlay" id="modal-prof" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal" style="width:420px;height:auto;max-height:90vh;overflow-y:auto;">
      <div class="modal-hdr">
        <div class="modal-hdr-info"><div class="modal-hdr-name">👨‍⚕️ Adicionar Profissional</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('modal-prof').classList.remove('open')"></i>
      </div>
      <div style="padding:4px 0 16px;display:flex;flex-direction:column;gap:10px;">
        <div><label class="lbl">Nome completo *</label><input id="prof-nome" class="inp" placeholder="Dr. / Dra. Nome"></div>
        <div><label class="lbl">Especialidade</label><input id="prof-spec" class="inp" placeholder="Ex: Ortodontia, Implantodontia..."></div>
        <div><label class="lbl">CRO</label><input id="prof-cro" class="inp" placeholder="CRO-SP 00000"></div>
        <div><label class="lbl">Cor na agenda</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;" id="prof-cores">
            <div onclick="selectProfCor('#542F62')" style="width:28px;height:28px;border-radius:6px;background:#542F62;cursor:pointer;border:3px solid #333;" data-cor="#542F62"></div>
            <div onclick="selectProfCor('#3b82f6')" style="width:28px;height:28px;border-radius:6px;background:#3b82f6;cursor:pointer;border:2px solid transparent;" data-cor="#3b82f6"></div>
            <div onclick="selectProfCor('#f59e0b')" style="width:28px;height:28px;border-radius:6px;background:#f59e0b;cursor:pointer;border:2px solid transparent;" data-cor="#f59e0b"></div>
            <div onclick="selectProfCor('#ef4444')" style="width:28px;height:28px;border-radius:6px;background:#ef4444;cursor:pointer;border:2px solid transparent;" data-cor="#ef4444"></div>
            <div onclick="selectProfCor('#059669')" style="width:28px;height:28px;border-radius:6px;background:#059669;cursor:pointer;border:2px solid transparent;" data-cor="#059669"></div>
            <div onclick="selectProfCor('#ec4899')" style="width:28px;height:28px;border-radius:6px;background:#ec4899;cursor:pointer;border:2px solid transparent;" data-cor="#ec4899"></div>
            <div onclick="selectProfCor('#0ea5e9')" style="width:28px;height:28px;border-radius:6px;background:#0ea5e9;cursor:pointer;border:2px solid transparent;" data-cor="#0ea5e9"></div>
            <div onclick="selectProfCor('#8b5cf6')" style="width:28px;height:28px;border-radius:6px;background:#8b5cf6;cursor:pointer;border:2px solid transparent;" data-cor="#8b5cf6"></div>
          </div>
          <input type="hidden" id="prof-cor" value="#542F62">
        </div>
        <button class="btn-primary" onclick="salvarProfissional()"><i class="ti ti-user-check"></i> Adicionar profissional</button>
      </div>
    </div>
  </div>

  <!-- MODAL AGENDAMENTO -->
  <div class="modal-overlay" id="modal-agendamento" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal" style="width:480px;height:auto;max-height:90vh;overflow-y:auto;">
      <div class="modal-hdr">
        <div class="modal-hdr-info"><div class="modal-hdr-name">📅 Nova consulta</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('modal-agendamento').classList.remove('open')"></i>
      </div>
      <div style="padding:4px 0 16px;display:flex;flex-direction:column;gap:10px;">
        <div><label class="lbl">Paciente *</label><select id="ag-paciente" class="inp" style="background:white;"><option value="">Selecione o paciente</option></select></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Data *</label><input id="ag-data" class="inp" type="date"></div>
          <div><label class="lbl">Horário *</label><input id="ag-hora" class="inp" type="time"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Procedimento</label><input id="ag-proc" class="inp" placeholder="Ex: Clareamento, Extração..."></div>
          <div><label class="lbl">Duração</label><select id="ag-dur" class="inp" style="background:white;"><option>30 min</option><option>45 min</option><option selected>1 hora</option><option>1h30</option><option>2 horas</option></select></div>
        </div>
        <div><label class="lbl">Observações</label><textarea id="ag-obs" class="inp" style="min-height:60px;" placeholder="Observações sobre a consulta..."></textarea></div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;">
          <div style="font-size:12px;font-weight:700;color:#059669;margin-bottom:4px;">📱 Confirmação via WhatsApp</div>
          <div style="font-size:11px;color:#4a4b6a;">Após salvar, você poderá enviar confirmação e lembrete ao paciente pelo WhatsApp.</div>
        </div>
        <button class="btn-primary" onclick="salvarAgendamento()"><i class="ti ti-calendar-check"></i> Confirmar agendamento</button>
      </div>
    </div>
  </div>

  <!-- MODAL NOVO PACIENTE -->
  <div class="modal-overlay" id="modal-paciente" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal" style="width:520px;height:auto;max-height:92vh;overflow-y:auto;">
      <div class="modal-hdr">
        <div class="modal-hdr-info"><div class="modal-hdr-name">👤 Novo paciente</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('modal-paciente').classList.remove('open')"></i>
      </div>
      <div style="padding:4px 0 16px;display:flex;flex-direction:column;gap:10px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Nome completo *</label><input id="pac-nome" class="inp" placeholder="Nome do paciente"></div>
          <div><label class="lbl">Apelido</label><input id="pac-apelido" class="inp" placeholder="Como prefere ser chamado"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div><label class="lbl">Nascimento</label><input id="pac-nasc" class="inp" type="date"></div>
          <div><label class="lbl">Sexo</label><select id="pac-sexo" class="inp" style="background:white;"><option>Feminino</option><option>Masculino</option><option>Outro</option></select></div>
          <div><label class="lbl">Estado civil</label><select id="pac-ecivil" class="inp" style="background:white;"><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option></select></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">CPF</label><input id="pac-cpf" class="inp" placeholder="000.000.000-00"></div>
          <div><label class="lbl">RG</label><input id="pac-rg" class="inp" placeholder="00.000.000-0"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">WhatsApp *</label><input id="pac-whatsapp" class="inp" placeholder="(11) 99999-9999"></div>
          <div><label class="lbl">Profissão</label><input id="pac-profissao" class="inp" placeholder="Profissão"></div>
        </div>
        <div><label class="lbl">E-mail</label><input id="pac-email" class="inp" placeholder="email@exemplo.com" type="email"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">CEP</label><input id="pac-cep" class="inp" placeholder="00000-000"></div>
          <div><label class="lbl">Cidade</label><input id="pac-cidade" class="inp" placeholder="Cidade"></div>
        </div>
        <div><label class="lbl">Endereço</label><input id="pac-endereco" class="inp" placeholder="Rua, número, bairro"></div>
        <div><label class="lbl">Como nos conheceu?</label><select id="pac-origem" class="inp" style="background:white;"><option>Instagram</option><option>Indicação</option><option>Google</option><option>Facebook</option><option>Outro</option></select></div>
        <button class="btn-primary" onclick="salvarPaciente()"><i class="ti ti-user-check"></i> Cadastrar paciente</button>
      </div>
    </div>
  </div>

  <!-- MODAL PUBLICAR VAGA -->
  <div class="modal-overlay" id="modal-vaga" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal" style="width:480px;height:auto;max-height:92vh;overflow-y:auto;padding:0 4px;">
      <div class="modal-hdr">
        <div class="modal-hdr-info"><div class="modal-hdr-name">📋 Publicar no mural de vagas</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('modal-vaga').classList.remove('open')"></i>
      </div>
      <div style="padding:4px 0 16px;display:flex;flex-direction:column;gap:10px;">

        <!-- OPÇÕES -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div id="opcao-clinica" onclick="selectVagaOpcao('clinica')" style="border:2px solid #542F62;border-radius:12px;padding:14px;text-align:center;cursor:pointer;background:#f0eaf6;box-shadow:0 0 14px rgba(84,47,98,.12);">
            <svg viewBox="0 0 80 72" width="56" height="50" fill="none">
              <rect x="10" y="28" width="60" height="40" rx="3" fill="#e8eaf8" stroke="#010267" stroke-width="2"/>
              <path d="M6 30 L40 10 L74 30" fill="#010267" opacity=".12" stroke="#010267" stroke-width="2" stroke-linejoin="round"/>
              <rect x="18" y="36" width="12" height="10" rx="2" fill="white" stroke="#010267" stroke-width="1.5"/>
              <rect x="50" y="36" width="12" height="10" rx="2" fill="white" stroke="#010267" stroke-width="1.5"/>
              <rect x="31" y="48" width="18" height="20" rx="2" fill="white" stroke="#010267" stroke-width="1.5"/>
              <text x="40" y="70" text-anchor="middle" font-size="7" font-weight="800" fill="#010267" font-family="system-ui">ODONTO</text>
            </svg>
            <div style="font-size:12px;font-weight:800;color:#12133a;margin-top:7px;">Busco um profissional</div>
            <div style="font-size:10px;color:#8889aa;margin-top:2px;">Clínica procura dentista</div>
          </div>
          <div id="opcao-dentista" onclick="selectVagaOpcao('dentista')" style="border:2px solid #e3e5f0;border-radius:12px;padding:14px;text-align:center;cursor:pointer;background:white;">
            <svg viewBox="0 0 80 90" width="56" height="63" fill="none">
              <circle cx="40" cy="22" r="14" fill="#f0eaf6" stroke="#542F62" stroke-width="1.5"/>
              <path d="M26 18 C26 10 32 6 40 6 C48 6 54 10 54 18" fill="#542F62" opacity=".7"/>
              <circle cx="35" cy="21" r="2" fill="#542F62"/>
              <circle cx="45" cy="21" r="2" fill="#542F62"/>
              <path d="M35 27 Q40 31 45 27" stroke="#542F62" stroke-width="1.2" fill="none" stroke-linecap="round"/>
              <path d="M20 42 C20 38 28 36 40 36 C52 36 60 38 60 42 L60 80 L20 80Z" fill="#f0eaf6" stroke="#542F62" stroke-width="1.5"/>
              <rect x="28" y="46" width="24" height="28" rx="3" fill="white" stroke="#542F62" stroke-width="1.2"/>
              <rect x="32" y="48" width="8" height="8" rx="2" fill="#f0eaf6" stroke="#542F62" stroke-width="1"/>
              <circle cx="36" cy="51" r="2" fill="#542F62" opacity=".4"/>
              <line x1="32" y1="59" x2="48" y2="59" stroke="#d4c0e0" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="32" y1="64" x2="48" y2="64" stroke="#d4c0e0" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="32" y1="69" x2="44" y2="69" stroke="#d4c0e0" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <div style="font-size:12px;font-weight:800;color:#12133a;margin-top:7px;">Quero me candidatar</div>
            <div style="font-size:10px;color:#8889aa;margin-top:2px;">Dentista disponível</div>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;"><div style="flex:1;height:1px;background:#e3e5f0;"></div><span style="font-size:10px;font-weight:700;color:#8889aa;text-transform:uppercase;letter-spacing:.08em;">Preencha os dados</span><div style="flex:1;height:1px;background:#e3e5f0;"></div></div>

        <!-- CAMPOS CLÍNICA -->
        <div id="campos-clinica">
          <div><label class="lbl">Título da vaga *</label><input id="vaga-title" class="inp" placeholder="Ex: Dentista Clínico para clínica em SP"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label class="lbl">Especialidade</label><select id="vaga-specialty" class="inp" style="margin-bottom:0;background:white;"><option value="">Selecione</option><option>Clínico Geral</option><option>Implantodontia</option><option>Ortodontia</option><option>Endodontia</option><option>Periodontia</option><option>Harmonização Orofacial</option><option>Prótese Dentária</option><option>Odontopediatria</option><option>Outro</option></select></div>
            <div><label class="lbl">Tipo de contrato</label><select id="vaga-tipo" class="inp" style="margin-bottom:0;background:white;"><option>CLT</option><option>PJ</option><option>Freelance</option><option>Sócio</option><option>A combinar</option></select></div>
          </div>
          <div style="height:8px;"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label class="lbl">Cidade *</label><input id="vaga-city" class="inp" placeholder="São Paulo" style="margin-bottom:0;"></div>
            <div><label class="lbl">Estado</label><input id="vaga-state" class="inp" placeholder="SP" style="margin-bottom:0;"></div>
          </div>
          <div style="height:8px;"></div>
          <div><label class="lbl">Salário / Remuneração</label><input id="vaga-salario" class="inp" placeholder="Ex: R$ 4.000 ou A combinar"></div>
          <div><label class="lbl">Nome da clínica</label><input id="vaga-clinica" class="inp" placeholder="Clínica Sorriso Perfeito"></div>
          <div><label class="lbl">WhatsApp para contato *</label><input id="vaga-whatsapp" class="inp" placeholder="11 99999-9999"></div>
          <div><label class="lbl">Descrição da vaga</label><textarea id="vaga-desc" class="inp" style="min-height:80px;resize:vertical;" placeholder="Requisitos, benefícios, horários..."></textarea></div>
        </div>

        <!-- CAMPOS DENTISTA -->
        <div id="campos-dentista" style="display:none;">
          <div><label class="lbl">Como quer se apresentar? *</label><input id="cand-titulo" class="inp" placeholder="Ex: Ortodontista disponível para sócio em SP"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label class="lbl">Especialidade</label><select id="cand-specialty" class="inp" style="margin-bottom:0;background:white;"><option>Clínico Geral</option><option>Implantodontia</option><option>Ortodontia</option><option>Endodontia</option><option>Periodontia</option><option>Harmonização Orofacial</option><option>Prótese Dentária</option><option>Odontopediatria</option></select></div>
            <div><label class="lbl">Tipo</label><select id="cand-tipo" class="inp" style="margin-bottom:0;background:white;"><option>CLT</option><option>PJ</option><option>Freelance</option><option>Sócio</option><option>A combinar</option></select></div>
          </div>
          <div style="height:8px;"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label class="lbl">Cidade</label><input id="cand-city" class="inp" placeholder="São Paulo" style="margin-bottom:0;"></div>
            <div><label class="lbl">Anos de experiência</label><input id="cand-exp" class="inp" placeholder="Ex: 5 anos" style="margin-bottom:0;"></div>
          </div>
          <div style="height:8px;"></div>
          <div><label class="lbl">WhatsApp para contato *</label><input id="cand-whatsapp" class="inp" placeholder="11 99999-9999"></div>
          <div><label class="lbl">Sobre você</label><textarea id="cand-desc" class="inp" style="min-height:80px;resize:vertical;" placeholder="Experiência, diferenciais, disponibilidade..."></textarea></div>
        </div>

        <button class="btn-primary" id="btn-vaga-submit" onclick="submitVaga()"><i class="ti ti-send"></i> Publicar vaga</button>
      </div>
    </div>
  </div>


  <!-- MODAL PRODUTO -->
  <div class="modal-overlay" id="modal-produto" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal" style="width:480px;height:auto;max-height:90vh;overflow-y:auto;">
      <div class="modal-hdr">
        <div class="modal-hdr-info"><div class="modal-hdr-name">🛒 Publicar produto</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('modal-produto').classList.remove('open')"></i>
      </div>
      <div style="padding:4px 0 16px;display:flex;flex-direction:column;gap:10px;">
        <div><label class="lbl">Nome do produto *</label><input id="prod-title" class="inp" placeholder="Ex: Fotopolimerizador LED Dabi"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Categoria</label><select id="prod-cat" class="inp" style="background:white;"><option>Equipamento</option><option>Material</option><option>Móvel</option><option>Instrumento</option><option>Outro</option></select></div>
          <div><label class="lbl">Condição</label><select id="prod-cond" class="inp" style="background:white;"><option>Novo</option><option>Usado</option><option>Recondicionado</option></select></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Preço *</label><input id="prod-price" class="inp" placeholder="R$ 0,00"></div>
          <div><label class="lbl">Cidade</label><input id="prod-city" class="inp" placeholder="São Paulo"></div>
        </div>
        <div><label class="lbl">Descrição *</label><textarea id="prod-desc" class="inp" style="min-height:80px;resize:vertical;" placeholder="Descreva o produto, marca, modelo, estado..."></textarea></div>
        <div><label class="lbl">WhatsApp para contato *</label><input id="prod-whatsapp" class="inp" placeholder="11 99999-9999"></div>
        <div><label class="lbl">Foto do produto (URL)</label><input id="prod-img" class="inp" placeholder="https://..."></div>
        <button class="btn-primary" onclick="submitProduto()"><i class="ti ti-upload"></i> Publicar produto</button>
      </div>
    </div>
  </div>

  <!-- MODAL CADASTRO LAB/TECNICO -->
  <div class="modal-overlay" id="modal-lab" onclick="if(event.target===this)this.classList.remove('open')">
    <div class="modal" style="width:480px;height:auto;max-height:90vh;overflow-y:auto;">
      <div class="modal-hdr">
        <div class="modal-hdr-info"><div class="modal-hdr-name">🔬 Quero me cadastrar</div></div>
        <i class="ti ti-x modal-close" onclick="document.getElementById('modal-lab').classList.remove('open')"></i>
      </div>
      <div style="padding:4px 0 16px;display:flex;flex-direction:column;gap:10px;">
        <div><label class="lbl">Tipo de cadastro</label><select id="lab-tipo" class="inp" style="background:white;"><option>Laboratório de Prótese</option><option>Técnico em Prótese</option><option>Laboratório de Radiologia</option><option>Técnico em Radiologia</option><option>Outro</option></select></div>
        <div><label class="lbl">Nome / Razão social *</label><input id="lab-nome" class="inp" placeholder="Lab. Prótese Gold"></div>
        <div><label class="lbl">Especialidades oferecidas</label><input id="lab-specs" class="inp" placeholder="Ex: Zircônia, E-max, protocolo, removível..."></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div><label class="lbl">Cidade *</label><input id="lab-city" class="inp" placeholder="São Paulo" style="margin-bottom:0;"></div>
          <div><label class="lbl">Estado</label><input id="lab-state" class="inp" placeholder="SP" style="margin-bottom:0;"></div>
        </div>
        <div><label class="lbl">WhatsApp para contato *</label><input id="lab-whatsapp" class="inp" placeholder="11 99999-9999"></div>
        <div><label class="lbl">Descrição e diferenciais</label><textarea id="lab-desc" class="inp" style="min-height:80px;resize:vertical;" placeholder="Prazo de entrega, materiais usados, experiência..."></textarea></div>
        <button class="btn-primary" onclick="submitLab()"><i class="ti ti-check"></i> Enviar cadastro</button>
      </div>
    </div>
  </div>

  <!-- MENU MOBILE -->
<nav class="mobile-nav" id="mobile-nav">
  <div class="mobile-nav-item active" id="mnav-dashboard" onclick="nav(this,'dashboard','Dashboard');setMobileNav('mnav-dashboard')">
    <i class="ti ti-layout-dashboard"></i>
    <span>Início</span>
    <div class="mobile-nav-dot"></div>
  </div>
  <div class="mobile-nav-item" id="mnav-community" onclick="nav(this,'community','Comunidade');setMobileNav('mnav-community')">
    <i class="ti ti-messages"></i>
    <span>Feed</span>
    <div class="mobile-nav-dot"></div>
  </div>
  <div class="mobile-nav-item" id="mnav-experts" onclick="nav(this,'experts','Ajuda do Especialista');setMobileNav('mnav-experts')">
    <i class="ti ti-message-question"></i>
    <span>Especialistas</span>
    <div class="mobile-nav-dot"></div>
  </div>
  <div class="mobile-nav-item" id="mnav-jobs" onclick="nav(this,'jobs','Vagas & Oportunidades');setMobileNav('mnav-jobs')">
    <i class="ti ti-briefcase"></i>
    <span>Vagas</span>
    <div class="mobile-nav-dot"></div>
  </div>
  <div class="mobile-nav-item" id="mnav-more" onclick="toggleMobileDrawer()">
    <i class="ti ti-dots"></i>
    <span>Mais</span>
    <div class="mobile-nav-dot"></div>
  </div>
</nav>

<!-- DRAWER MOBILE -->
<div id="mobile-drawer-overlay" onclick="toggleMobileDrawer()"></div>
<div id="mobile-drawer">
  <div style="width:40px;height:4px;background:#e3e5f0;border-radius:2px;margin:0 auto 16px;"></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    <div onclick="nav(document.querySelector('[data-s=market]'),'market','Marketplace');toggleMobileDrawer();setMobileNav('')" style="display:flex;align-items:center;gap:10px;padding:14px;background:#f3f4f9;border-radius:12px;cursor:pointer;">
      <i class="ti ti-shopping-cart" style="font-size:22px;color:#010267;"></i>
      <span style="font-size:13px;font-weight:600;color:#010267;">Dental Marketplace</span>
    </div>
    <div onclick="nav(document.querySelector('[data-s=agenda]'),'agenda','Agenda Clínica');toggleMobileDrawer();setMobileNav('')" style="display:flex;align-items:center;gap:10px;padding:14px;background:#f3f4f9;border-radius:12px;cursor:pointer;"><i class="ti ti-calendar" style="font-size:22px;color:#010267;"></i><span style="font-size:13px;font-weight:600;color:#010267;">Agenda</span></div>
    <div onclick="showLabs();toggleMobileDrawer();" style="display:flex;align-items:center;gap:10px;padding:14px;background:#f3f4f9;border-radius:12px;cursor:pointer;">
      <i class="ti ti-flask" style="font-size:22px;color:#010267;"></i>
      <span style="font-size:13px;font-weight:600;color:#010267;">Labs & Técnicos</span>
    </div>
    <div onclick="nav(document.querySelector('[data-s=cursos]'),'cursos','Cursos');toggleMobileDrawer();setMobileNav('');setTimeout(loadCursos,100)" style="display:flex;align-items:center;gap:10px;padding:14px;background:#f3f4f9;border-radius:12px;cursor:pointer;">
      <i class="ti ti-school" style="font-size:22px;color:#010267;"></i>
      <span style="font-size:13px;font-weight:600;color:#010267;">Cursos</span>
    </div>
    <div onclick="toggleMobileDrawer();alert('Perfil em breve!')" style="display:flex;align-items:center;gap:10px;padding:14px;background:#f3f4f9;border-radius:12px;cursor:pointer;">
      <i class="ti ti-user" style="font-size:22px;color:#010267;"></i>
      <span style="font-size:13px;font-weight:600;color:#010267;">Meu Perfil</span>
    </div>
    <div onclick="toggleMobileDrawer();alert('Configurações em breve!')" style="display:flex;align-items:center;gap:10px;padding:14px;background:#f3f4f9;border-radius:12px;cursor:pointer;">
      <i class="ti ti-settings" style="font-size:22px;color:#010267;"></i>
      <span style="font-size:13px;font-weight:600;color:#010267;">Configurações</span>
    </div>
    <div onclick="toggleMobileDrawer();doLogout()" style="display:flex;align-items:center;gap:10px;padding:14px;background:#fff0f0;border-radius:12px;cursor:pointer;grid-column:1/-1;">
      <i class="ti ti-logout" style="font-size:22px;color:#ef4444;"></i>
      <span style="font-size:13px;font-weight:600;color:#ef4444;">Sair da conta</span>
    </div>
  </div>
</div>
</div><!-- /app-screen -->

<script>
const API = 'https://odont-hub-backend-production.up.railway.app'
let TOKEN = localStorage.getItem('odont_token') || ''
let USER  = JSON.parse(localStorage.getItem('odont_user') || 'null')

async function api(method, path, body, _retries = 2) {
  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(), 15000)
  const opts = {
    method,
    signal: controller.signal,
    headers: { 'Content-Type': 'application/json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  }
  if (body) opts.body = JSON.stringify(body)
  try {
    const res = await fetch(API + path, opts)
    clearTimeout(tid)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Erro na requisição')
    return data
  } catch (e) {
    clearTimeout(tid)
    if (_retries > 0 && (e.name === 'AbortError' || e.message.includes('Load failed') || e.message.includes('Failed to fetch'))) {
      await new Promise(r => setTimeout(r, 2000))
      return api(method, path, body, _retries - 1)
    }
    throw e
  }
}

function setLoading(btnId, loading, text = '') {
  const btn = document.getElementById(btnId)
  if (!btn) return
  btn.disabled = loading
  btn.innerHTML = loading ? '<i class="ti ti-loader" style="animation:spin 1s linear infinite;display:inline-block;"></i> Aguarde...' : text
}

function showError(elId, msg) {
  const el = document.getElementById(elId)
  if (!el) return
  el.textContent = msg
  el.style.display = 'block'
  setTimeout(() => { el.style.display = 'none' }, 4000)
}

async function togglePass(inputId, iconId) {
  const input = document.getElementById(inputId)
  const icon = document.getElementById(iconId)
  if (!input) return
  if (input.type === 'password') {
    input.type = 'text'
    if (icon) icon.className = 'ti ti-eye-off'
  } else {
    input.type = 'password'
    if (icon) icon.className = 'ti ti-eye'
  }
}

async function doLogin() {
  const email    = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value
  if (!email || !password) { showError('login-error', 'Preencha e-mail e senha.'); return }
  setLoading('login-btn', true)
  try {
    const res = await api('POST', '/api/auth/login', { email, password })
    TOKEN = res.token
    USER  = res.user
    localStorage.setItem('odont_token', TOKEN)
    localStorage.setItem('odont_user', JSON.stringify(USER))
    goApp()
  } catch (e) {
    showError('login-error', e.message || 'E-mail ou senha incorretos.')
  } finally {
    setLoading('login-btn', false, '<i class="ti ti-login"></i> Entrar na plataforma')
  }
}

function showRegister() { document.getElementById('register-modal').style.display = 'flex' }
function hideRegister() { document.getElementById('register-modal').style.display = 'none' }

async function doRegister() {
  const name      = document.getElementById('reg-name').value.trim()
  const email     = document.getElementById('reg-email').value.trim()
  const password  = document.getElementById('reg-password').value
  const cro       = document.getElementById('reg-cro').value.trim()
  const specialty = document.getElementById('reg-specialty').value
  if (!name || !email || !password) { showError('reg-error', 'Nome, e-mail e senha são obrigatórios.'); return }
  if (password.length < 8) { showError('reg-error', 'Senha deve ter ao menos 8 caracteres.'); return }
  setLoading('reg-btn', true)
  try {
    const res = await api('POST', '/api/auth/register', { name, email, password, cro, specialty })
    TOKEN = res.token
    USER  = res.user
    localStorage.setItem('odont_token', TOKEN)
    localStorage.setItem('odont_user', JSON.stringify(USER))
    hideRegister()
    goApp()
  } catch (e) {
    showError('reg-error', e.message || 'Erro ao criar conta.')
  } finally {
    setLoading('reg-btn', false, '<i class="ti ti-user-plus"></i> Criar conta')
  }
}

function goApp() {
  document.getElementById('login-screen').style.display = 'none'
  document.getElementById('app-screen').style.display   = 'flex'
  if (USER) {
    const nameEl = document.querySelector('.user-name')
    const croEl  = document.querySelector('.user-cro')
    const avEls  = document.querySelectorAll('.av-grad-me')
    if (nameEl) nameEl.textContent = USER.name || 'Usuário'
    if (croEl)  croEl.textContent  = USER.cro ? `CRO/${USER.cro_uf || ''} ${USER.cro}` : 'CRO pendente'
    const ini = initials(USER.name)
    avEls.forEach(el => { el.textContent = ini })
    const feedAv = document.getElementById('feed-av')
    if (feedAv) feedAv.textContent = ini
    const mobileAv = document.getElementById('mobile-av')
    if (mobileAv) mobileAv.textContent = ini
    const welcomeMsg = document.getElementById('welcome-msg')
    if (welcomeMsg) {
      const firstName = (USER.name || 'Dentista').split(' ')[0]
      welcomeMsg.textContent = `Bem-vindo(a), Dr(a). ${firstName}! 🦷`
    }
  }
}

if (TOKEN && USER) {
  window.addEventListener('DOMContentLoaded', () => { goApp(); loadFeed() })
}

function nav(el, screen, title) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  el.classList.add('active')
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  const labsScreen = document.getElementById('screen-labs'); if(labsScreen) labsScreen.classList.remove('active')
  document.getElementById('screen-' + screen).classList.add('active')
  document.getElementById('page-title').textContent = title
  if (screen === 'community') loadFeed()
  if (screen === 'cursos') loadCursos()
}

function filterMkt(el) {
  const parent = el.closest('.mkt-top') || el.parentElement
  parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('on'))
  el.classList.add('on')
}

function switchTab(t) {
  ;['vagas', 'offer', 'mine'].forEach(id => {
    document.getElementById('tab-' + id).classList.remove('on')
    document.getElementById('tab-content-' + id).style.display = 'none'
  })
  document.getElementById('tab-' + t).classList.add('on')
  document.getElementById('tab-content-' + t).style.display = 'block'
}

var chatName = ''
function openChat(name, spec) {
  chatName = name
  document.getElementById('chat-name').textContent = name
  document.getElementById('chat-spec').textContent = spec
  document.getElementById('chat-msgs').innerHTML = `<div class="msg them"><div class="msg-bubble">Olá! Como posso te ajudar?</div><div class="msg-time">agora</div></div>`
  document.getElementById('chat-modal').classList.add('open')
  document.getElementById('chat-input').focus()
}
function closeChat(e) {
  if (e.target === document.getElementById('chat-modal')) document.getElementById('chat-modal').classList.remove('open')
}
function sendMsg() {
  const inp = document.getElementById('chat-input')
  const txt = inp.value.trim(); if (!txt) return
  const msgs = document.getElementById('chat-msgs')
  const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  msgs.innerHTML += `<div class="msg me"><div class="msg-bubble">${txt}</div><div class="msg-time">${now}</div></div>`
  inp.value = ''
  msgs.scrollTop = msgs.scrollHeight
  setTimeout(() => {
    const replies = ['Entendido! Posso orientar sobre isso.', 'Ótima pergunta! Me manda mais detalhes.', 'Isso é muito comum na prática clínica.']
    const r = replies[Math.floor(Math.random() * replies.length)]
    const t = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    msgs.innerHTML += `<div class="msg them"><div class="msg-bubble">${r}</div><div class="msg-time">${t}</div></div>`
    msgs.scrollTop = msgs.scrollHeight
  }, 1000)
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m}min atrás`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

function initials(name) {
  return (name || 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function renderPost(post) {
  const author = post.author || {}
  const ini = initials(author.name)
  const likes = post.likes_count?.[0]?.count || post.likes_count || 0
  const comments = post.comments_count?.[0]?.count || post.comments_count || 0
  const userId = USER ? USER.id : (JSON.parse(localStorage.getItem('odont_user')||'{}').id || '')
  const isMe = (author.id && userId && author.id === userId) || (post.user_id && userId && post.user_id === userId)
  const gradients = ['av-grad-1', 'av-grad-2', 'av-grad-3', 'av-grad-4', 'av-grad-5', 'av-grad-6']
  const grad = isMe ? 'av-grad-me' : gradients[Math.abs((ini.charCodeAt(0) || 65) - 65) % 6]

  return `
  <div class="post" id="post-${post.id}">
    <div class="post-hdr">
      <div class="av l ${grad}">${ini}</div>
      <div class="post-uinfo">
        <div class="post-name" style="cursor:pointer;" onclick="openProfile('${author.id}')">${author.name || 'Dentista'}</div>
        <div class="post-meta">
          ${author.cro ? `<span class="cro-badge">CRO/${author.cro_uf || ''} ${author.cro}</span> · ` : ''}
          ${author.specialty || ''} · ${timeAgo(post.created_at)}
        </div>
      </div>
      <div style="display:flex;gap:4px;">
        ${isMe ? `<button onclick="editPost('${post.id}','${post.content.replace(/'/g,"\\'")}'.replace(/<br>/g,'\\n'))" style="width:30px;height:30px;border-radius:8px;background:#f0eaf6;border:1px solid #d4c0e0;color:#542F62;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;" title="Editar post"><i class="ti ti-pencil" style="font-size:14px;"></i></button>` : ''}
        ${isMe ? `<button onclick="deletePost('${post.id}')" style="width:30px;height:30px;border-radius:8px;background:#fff0f0;border:1px solid #fecaca;color:#ef4444;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;" title="Excluir post"><i class="ti ti-x" style="font-size:14px;"></i></button>` : ''}
      </div>
    </div>
    ${post.specialty_tag ? `<div class="tags"><span class="tag">#${post.specialty_tag}</span></div>` : ''}
    <div class="post-txt">${post.content.replace(/\n/g, '<br>')}</div>
    ${post.image_url ? `<img src="${post.image_url}" style="width:100%;border-radius:8px;margin-bottom:11px;max-height:400px;object-fit:cover;">` : ''}
    <div class="post-acts">
      <button class="pact ${post.liked_by_me ? 'liked' : ''}" onclick="toggleLike(this,'${post.id}',${!!post.liked_by_me})">
        <i class="ti ti-heart"></i><span>${likes}</span>
      </button>
      <button class="pact" onclick="toggleComments('${post.id}')"><i class="ti ti-message-circle"></i><span id="cmt-count-${post.id}">${comments}</span> comentários</button>
      <button class="pact"><i class="ti ti-share"></i>Compartilhar</button>
      <button class="pact ml"><i class="ti ti-bookmark"></i>Salvar</button>
    </div>
    <div id="comments-${post.id}" style="display:none;margin-top:12px;border-top:1px solid var(--border);padding-top:12px;">
      <div id="comments-list-${post.id}" style="margin-bottom:10px;"></div>
      <div style="display:flex;gap:8px;">
        <textarea id="comment-input-${post.id}" placeholder="Escreva um comentário..." style="flex:1;padding:8px 12px;border:1.5px solid var(--border);border-radius:var(--rs);font-family:inherit;font-size:13px;resize:none;height:36px;outline:none;" onfocus="this.style.height='72px'" onblur="if(!this.value)this.style.height='36px'"></textarea>
        <button onclick="submitComment('${post.id}')" style="background:var(--navy);color:white;border:none;padding:8px 14px;border-radius:var(--rs);font-size:12px;font-weight:700;cursor:pointer;">Enviar</button>
      </div>
    </div>
  </div>`
}

// CURSOS
function openCursoDetail(c) {
  const wa = c.whatsapp ? c.whatsapp.replace(/\D/g,'') : null
  const waLink = wa ? `https://wa.me/55${wa}?text=Olá! Vi seu curso "${c.title}" no ODONT HUB e tenho interesse!` : null
  const modLabel = c.modality === 'in_person' ? 'Presencial' : c.modality === 'online' ? 'Online' : c.modality === 'hybrid' ? 'Híbrido' : c.modality
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-end;'
  overlay.innerHTML = `
    <div style="background:white;width:100%;border-radius:20px 20px 0 0;padding:20px;max-height:88vh;overflow-y:auto;">
      <div style="width:40px;height:4px;background:#e3e5f0;border-radius:2px;margin:0 auto 16px;"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <div style="font-size:17px;font-weight:800;color:#010267;flex:1;margin-right:10px;">${c.title}</div>
        <button onclick="this.closest('[style*=fixed]').remove()" style="background:#f3f4f9;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✕</button>
      </div>
      ${c.cover_url ? `<img src="${c.cover_url}" style="width:100%;height:180px;object-fit:cover;border-radius:14px;margin-bottom:14px;">` : `<div style="width:100%;height:120px;background:linear-gradient(135deg,#542F62,#7a3d92);border-radius:14px;margin-bottom:14px;display:flex;align-items:center;justify-content:center;"><i class="ti ti-school" style="font-size:48px;color:rgba(255,255,255,.4);"></i></div>`}
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
        <span style="background:#f0eaf6;color:#542F62;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">${c.specialty}</span>
        <span style="background:#e8eaf8;color:#010267;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">${modLabel}</span>
        ${c.city ? `<span style="background:#e8f4ff;color:#336699;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">📍 ${c.city}</span>` : ''}
        ${c.hours ? `<span style="background:#f3f4f9;color:#4a4b6a;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">⏱ ${c.hours}h</span>` : ''}
      </div>
      ${c.description ? `<div style="font-size:13px;color:#4a4b6a;line-height:1.6;margin-bottom:14px;">${c.description}</div>` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:12px;background:#f3f4f9;border-radius:10px;">
        <div>
          <div style="font-size:22px;font-weight:900;color:#010267;">R$ ${Number(c.price||0).toLocaleString('pt-BR')}</div>
          <div style="font-size:11px;color:#8889aa;">por ${c.instructor?.name || 'Professor'}</div>
        </div>
        ${c.specialty ? `<span style="background:#f0eaf6;color:#542F62;font-size:11px;font-weight:700;padding:6px 12px;border-radius:20px;">${c.specialty}</span>` : ''}
      </div>
      ${waLink ? `<a href="${waLink}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25d366;color:white;padding:16px;border-radius:14px;font-size:15px;font-weight:800;text-decoration:none;box-shadow:0 4px 16px rgba(37,211,102,.4);"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Falar com a clínica no WhatsApp</a>` : '<div style="text-align:center;padding:14px;background:#f3f4f9;border-radius:12px;color:#8889aa;font-size:13px;">WhatsApp não cadastrado</div>'}
    </div>
  `
  overlay.onclick = e => { if(e.target === overlay) overlay.remove() }
  document.body.appendChild(overlay)
}

async function loadCursos() {
  const grid = document.getElementById('cursos-grid')
  if (!grid) return
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);"><i class="ti ti-loader" style="font-size:32px;display:block;margin-bottom:10px;animation:spin 1s linear infinite;"></i>Carregando cursos...</div>'
  try {
    const BACKEND = 'https://odont-hub-backend-production.up.railway.app'
    const res = await fetch(BACKEND + '/api/courses')
    const cursos = await res.json()
    if (!cursos || !cursos.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);"><i class="ti ti-school" style="font-size:48px;display:block;margin-bottom:12px;"></i>Nenhum curso publicado ainda. Seja o primeiro!</div>'
      return
    }
    window._cursosData = cursos
    renderCursosGrid(cursos)
  } catch(e) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#ef4444;">Erro ao carregar: ' + e.message + '</div>'
  }
}

function renderCursosGrid(cursos) {
  const grid = document.getElementById('cursos-grid')
  if (!grid) return
  if (!cursos.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);">Nenhum curso encontrado.</div>'
    return
  }
  grid.innerHTML = cursos.map((c, idx) => {
    const mod = c.modality === 'in_person' ? 'Presencial' : c.modality === 'online' ? 'Online' : 'Híbrido'
    const modColor = c.modality === 'in_person' ? '#542F62' : c.modality === 'online' ? '#336699' : '#010267'
    const modIcon = c.modality === 'in_person' ? '🏫' : c.modality === 'online' ? '💻' : '🔀'
    return `<div class="card" style="padding:0;overflow:hidden;cursor:pointer;" onclick="openCursoModal(${idx})">
      <div style="height:120px;position:relative;display:flex;align-items:flex-end;padding:8px;background:linear-gradient(135deg,#542F62,#010267);">
        ${c.cover_url ? `<img src="${c.cover_url}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">` : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><i class="ti ti-school" style="font-size:40px;color:rgba(255,255,255,.2);"></i></div>`}
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.65));"></div>
        <span style="position:absolute;top:8px;right:8px;background:${modColor};color:white;font-size:9px;font-weight:700;padding:3px 8px;border-radius:12px;z-index:1;">${modIcon} ${mod}</span>
        ${c.city ? `<div style="position:relative;z-index:1;color:white;font-size:9px;font-weight:700;">📍 ${c.city}</div>` : ''}
      </div>
      <div style="padding:12px;">
        <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:4px;">${c.title}</div>
        ${c.description ? `<div style="font-size:11px;color:var(--text3);margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.4;">${c.description}</div>` : ''}
        <div style="font-size:10px;color:var(--text3);margin-bottom:8px;">👤 ${c.instructor?.name || 'Professor'} · ${c.specialty}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="font-size:16px;font-weight:900;color:var(--navy);">R$ ${Number(c.price||0).toLocaleString('pt-BR')}</div>
          <button onclick="event.stopPropagation();openCursoModal(${idx})" style="background:linear-gradient(135deg,#542F62,#010267);color:white;font-size:10px;font-weight:700;padding:7px 12px;border-radius:8px;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(84,47,98,.4);">✨ Inscreva-se</button>
        </div>
      </div>
    </div>`
  }).join('')
}

function filtrarCursos(btn, filtro) {
  document.querySelectorAll('#cursos-filtros .filter-btn').forEach(b => b.classList.remove('on'))
  btn.classList.add('on')
  const cursos = window._cursosData || []
  if (filtro === 'todos') { renderCursosGrid(cursos); return }
  const filtered = cursos.filter(c => {
    if (filtro === 'presencial') return c.modality === 'in_person'
    if (filtro === 'online') return c.modality === 'online'
    if (filtro === 'hibrido') return c.modality === 'hybrid'
    return (c.specialty || '').toLowerCase().includes(filtro.toLowerCase())
  })
  renderCursosGrid(filtered)
}

function openCursoModal(idx) {
  const cursos = window._cursosData || []
  const c = cursos[idx]
  if (!c) return
  const wa = c.whatsapp ? c.whatsapp.replace(/\D/g,'') : null
  const waLink = wa ? `https://wa.me/55${wa}?text=Olá! Vi o curso "${c.title}" no ODONT HUB e gostaria de me inscrever!` : null
  const mod = c.modality === 'in_person' ? 'Presencial' : c.modality === 'online' ? 'Online' : 'Híbrido'
  const modColor = c.modality === 'in_person' ? '#542F62' : c.modality === 'online' ? '#336699' : '#010267'
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;'
  overlay.innerHTML = `<div style="background:white;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:20px;max-height:88vh;overflow-y:auto;">
    <div style="width:36px;height:4px;background:#e3e5f0;border-radius:2px;margin:0 auto 14px;"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-size:17px;font-weight:800;color:var(--navy);flex:1;margin-right:10px;">${c.title}</div>
      <button onclick="this.closest('[style*=fixed]').remove()" style="background:#f3f4f9;border:none;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:16px;flex-shrink:0;">✕</button>
    </div>
    ${c.cover_url ? `<img src="${c.cover_url}" style="width:100%;height:180px;object-fit:cover;border-radius:14px;margin-bottom:14px;">` : `<div style="width:100%;height:120px;background:linear-gradient(135deg,#542F62,#010267);border-radius:14px;margin-bottom:14px;display:flex;align-items:center;justify-content:center;"><i class="ti ti-school" style="font-size:48px;color:rgba(255,255,255,.3);"></i></div>`}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
      <span style="background:#f0eaf6;color:#542F62;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">${c.specialty}</span>
      <span style="background:${modColor}22;color:${modColor};font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">${mod}</span>
      ${c.city ? `<span style="background:#e8f4ff;color:#336699;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">📍 ${c.city}</span>` : ''}
      ${c.hours ? `<span style="background:#f3f4f9;color:#4a4b6a;font-size:11px;padding:4px 10px;border-radius:20px;">⏱ ${c.hours}h</span>` : ''}
    </div>
    ${c.description ? `<div style="font-size:13px;color:#4a4b6a;line-height:1.6;margin-bottom:14px;">${c.description}</div>` : ''}
    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px;background:#f3f4f9;border-radius:12px;margin-bottom:16px;">
      <div>
        <div style="font-size:24px;font-weight:900;color:var(--navy);">R$ ${Number(c.price||0).toLocaleString('pt-BR')}</div>
        <div style="font-size:11px;color:#8889aa;">por ${c.instructor?.name || 'Professor'}</div>
      </div>
      <span style="background:#fef3c7;color:#d97706;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">📅 Vagas limitadas</span>
    </div>
    ${waLink ? `<a href="${waLink}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25d366;color:white;padding:16px;border-radius:14px;font-size:15px;font-weight:800;text-decoration:none;box-shadow:0 4px 16px rgba(37,211,102,.4);"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Falar com a clínica no WhatsApp</a>
    <div style="text-align:center;margin-top:8px;font-size:11px;color:#8889aa;">Você será redirecionado para o WhatsApp da clínica</div>` : '<div style="text-align:center;padding:14px;background:#f3f4f9;border-radius:12px;color:#8889aa;">WhatsApp não cadastrado</div>'}
  </div>`
  overlay.onclick = e => { if(e.target===overlay) overlay.remove() }
  document.body.appendChild(overlay)
}


async function submitCurso() {
  const title    = document.getElementById('curso-title').value.trim()
  const specialty= document.getElementById('curso-specialty').value
  const modality = document.getElementById('curso-modality').value
  const hours    = document.getElementById('curso-hours').value
  const city     = document.getElementById('curso-city').value.trim()
  const price    = document.getElementById('curso-price').value
  const whatsapp = document.getElementById('curso-whatsapp').value.trim()
  const description = document.getElementById('curso-desc').value.trim()
  if (!title) { alert('Preencha o título do curso.'); return }
  try {
    let cover_url = null
    const coverFile = document.getElementById('curso-cover-input')?.files[0]
    if (coverFile) {
      cover_url = await uploadImageToServer(coverFile)
    }
    await api('POST', '/api/courses', { title, specialty, modality, hours: Number(hours)||null, city, price: Number(price)||0, whatsapp, description, cover_url })
    document.getElementById('modal-curso').classList.remove('open')
    const preview = document.getElementById('curso-cover-preview')
    if (preview) { preview.style.display = 'none'; preview.src = '' }
    const label = document.getElementById('curso-cover-label')
    if (label) label.textContent = 'Clique para enviar imagem de capa'
    const input = document.getElementById('curso-cover-input')
    if (input) input.value = ''
    alert('Curso publicado com sucesso! ✅')
    loadCursos()
  } catch(e) {
    alert('Erro ao publicar curso: ' + e.message)
  }
}

async function deleteCurso(cursoId) {
  if (!confirm('Remover este curso?')) return
  try {
    await api('DELETE', '/api/courses/' + cursoId)
    document.getElementById('curso-card-' + cursoId)?.remove()
  } catch(e) {
    alert('Erro ao remover curso: ' + e.message)
  }
}

function previewCursoCover(input) {
  const file = input.files[0]; if (!file) return
  const reader = new FileReader()
  reader.onload = e => {
    const preview = document.getElementById('curso-cover-preview')
    if (preview) { preview.src = e.target.result; preview.style.display = 'block' }
    const label = document.getElementById('curso-cover-label')
    if (label) label.textContent = '✅ ' + file.name
  }
  reader.readAsDataURL(file)
}

// FEED
async function loadFeed() {
  const list = document.getElementById('feed-list')
  if (!list) return
  list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text3);"><i class="ti ti-loader" style="font-size:32px;display:block;margin-bottom:10px;animation:spin 1s linear infinite;"></i>Carregando posts...</div>`
  try {
    const posts = await api('GET', '/api/feed?page=1')
    const arr = Array.isArray(posts) ? posts : (posts.posts || posts.data || [])
    if (!arr.length) {
      list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text3);"><i class="ti ti-messages" style="font-size:48px;display:block;margin-bottom:12px;"></i>Nenhum post ainda. Seja o primeiro! 🦷</div>`
      return
    }
    list.innerHTML = arr.map(renderPost).join('')
  } catch (e) {
    list.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text3);">Erro ao carregar posts: ${e.message}</div>`
  }
}

async function submitPost() {
  const content   = document.getElementById('post-content').value.trim()
  const specialty = document.getElementById('post-specialty').value
  if (!content) { alert('Escreva algo antes de publicar!'); return }
  const btn = document.getElementById('btn-pub')
  btn.disabled = true; btn.textContent = 'Publicando...'
  try {
    let image_url = null
    if (selectedImageFile) {
      btn.textContent = 'Enviando foto...'
      try { image_url = await uploadImageToServer(selectedImageFile) }
      catch(uploadErr) { alert('Erro no upload da foto: ' + uploadErr.message); btn.disabled = false; btn.textContent = 'Publicar'; return }
    }
    await api('POST', '/api/feed', { content, specialty_tag: specialty || undefined, image_url })
    document.getElementById('post-content').value = ''
    document.getElementById('post-specialty').value = ''
    removeImage()
    await loadFeed()
  } catch (e) { alert('Erro ao publicar: ' + e.message) }
  finally { btn.disabled = false; btn.textContent = 'Publicar' }
}

async function toggleLike(btn, postId, currentlyLiked) {
  const countEl = btn.querySelector('span')
  const count = parseInt(countEl.textContent)
  if (currentlyLiked) {
    btn.classList.remove('liked'); countEl.textContent = Math.max(0, count - 1)
    btn.onclick = () => toggleLike(btn, postId, false)
    await api('DELETE', `/api/feed/${postId}/like`).catch(() => {})
  } else {
    btn.classList.add('liked'); countEl.textContent = count + 1
    btn.onclick = () => toggleLike(btn, postId, true)
    await api('POST', `/api/feed/${postId}/like`).catch(() => {})
  }
}

function editPost(postId, currentContent) {
  const newContent = prompt('Editar post:', currentContent)
  if (!newContent || newContent === currentContent) return
  api('PATCH', '/api/feed/' + postId, { content: newContent })
    .then(() => loadFeed())
    .catch(e => alert('Erro ao editar: ' + e.message))
}

async function deletePost(postId) {
  if (!confirm('Remover este post?')) return
  await api('DELETE', `/api/feed/${postId}`).catch(() => {})
  document.getElementById(`post-${postId}`)?.remove()
}

// UPLOAD DE IMAGEM
let selectedImageFile = null

function previewImage(input) {
  const file = input.files[0]; if (!file) return
  selectedImageFile = file
  const reader = new FileReader()
  reader.onload = e => { document.getElementById('preview-img').src = e.target.result; document.getElementById('image-preview').style.display = 'block' }
  reader.readAsDataURL(file)
}

function removeImage() {
  selectedImageFile = null
  document.getElementById('post-image').value = ''
  document.getElementById('image-preview').style.display = 'none'
  document.getElementById('preview-img').src = ''
}

async function compressImage(f) {
  return new Promise(function(r) {
    var img = new Image(), u = URL.createObjectURL(f)
    img.onload = function() {
      var c = document.createElement('canvas'), w = img.width, h = img.height
      if (w > 800) { h = Math.round(h * 900 / w); w = 900 }
      c.width = w; c.height = h
      c.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(u)
      c.toBlob(function(b) { r(b) }, 'image/jpeg', 0.50)
    }
    img.src = u
  })
}

async function uploadImageToServer(file) {
  var token = localStorage.getItem('odont_token') || TOKEN
  var fd = new FormData()
  var comp = await compressImage(file)
  fd.append('file', comp, 'foto.jpg')
  var res = await fetch(API + '/api/uploads/image', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd })
  var d = await res.json().catch(function() { return {} })
  if (!res.ok) throw new Error(d.message || d.error || 'Erro ' + res.status)
  return d.url
}


// COMENTÁRIOS
async function toggleComments(postId) {
  const div = document.getElementById('comments-' + postId)
  if (!div) return
  if (div.style.display === 'none') { div.style.display = 'block'; await loadComments(postId) }
  else { div.style.display = 'none' }
}

async function loadComments(postId) {
  const list = document.getElementById('comments-list-' + postId)
  if (!list) return
  list.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:4px 0;">Carregando...</div>'
  try {
    const comments = await api('GET', '/api/feed/' + postId + '/comments')
    if (!comments.length) { list.innerHTML = '<div style="color:var(--text3);font-size:12px;padding:4px 0;">Nenhum comentário ainda.</div>'; return }
    list.innerHTML = comments.map(c => {
      const ini = initials(c.author?.name)
      const isMe = String(c.user_id) === String(USER?.id||'')
      return `<div style="display:flex;gap:8px;margin-bottom:10px;" id="comment-${c.id}">
        <div class="av s av-grad-1" style="flex-shrink:0;">${ini}</div>
        <div style="flex:1;background:var(--bg);border-radius:var(--rs);padding:8px 12px;">
          <div style="font-size:12px;font-weight:700;color:var(--text);">${c.author?.name || 'Dentista'}</div>
          <div style="font-size:13px;color:var(--text2);margin-top:2px;">${c.content}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:4px;display:flex;align-items:center;gap:8px;">
            ${timeAgo(c.created_at)}
            ${isMe ? `<span style="cursor:pointer;color:#ef4444;" onclick="deleteComment('${postId}','${c.id}')">Excluir</span>` : ''}
          </div>
        </div>
      </div>`
    }).join('')
  } catch(e) { list.innerHTML = '<div style="color:#ef4444;font-size:12px;">Erro ao carregar comentários.</div>' }
}

async function submitComment(postId) {
  const input = document.getElementById('comment-input-' + postId)
  const content = input?.value?.trim(); if (!content) return
  try {
    await api('POST', '/api/feed/' + postId + '/comments', { content })
    input.value = ''; input.style.height = '36px'
    await loadComments(postId)
    const countEl = document.getElementById('cmt-count-' + postId)
    if (countEl) countEl.textContent = parseInt(countEl.textContent || 0) + 1
  } catch(e) { alert('Erro ao enviar comentário: ' + e.message) }
}

async function deleteComment(postId, commentId) {
  if (!confirm('Remover comentário?')) return
  await api('DELETE', '/api/feed/' + postId + '/comments/' + commentId).catch(() => {})
  document.getElementById('comment-' + commentId)?.remove()
  const countEl = document.getElementById('cmt-count-' + postId)
  if (countEl) countEl.textContent = Math.max(0, parseInt(countEl.textContent || 0) - 1)
}

// PERFIL
async function openProfile(userId) {
  if (!userId) return
  document.getElementById('profile-modal').classList.add('open')
  document.getElementById('profile-content').innerHTML = `<div style="text-align:center;padding:40px;color:var(--text3);"><i class="ti ti-loader" style="font-size:32px;display:block;margin-bottom:10px;animation:spin 1s linear infinite;"></i>Carregando perfil...</div>`
  try {
    const user = await api('GET', '/api/users/' + userId)
    const ini = initials(user.name)
    const isMe = String(userId) === String(USER?.id||'')
    document.getElementById('profile-content').innerHTML = `
      <div style="text-align:center;padding:24px 20px 16px;">
        <div class="av xl av-grad-me" style="margin:0 auto 12px;font-size:22px;">${ini}</div>
        <div style="font-size:18px;font-weight:800;color:var(--navy);">${user.name}</div>
        ${user.specialty ? `<div style="font-size:13px;color:var(--purple);font-weight:600;margin-top:3px;">${user.specialty}</div>` : ''}
        ${user.cro ? `<div style="display:inline-block;background:rgba(1,2,103,.07);color:var(--navy2);padding:2px 10px;border-radius:4px;font-size:11px;font-weight:600;margin-top:6px;">CRO/${user.cro_uf||''} ${user.cro}</div>` : ''}
        ${user.city ? `<div style="font-size:12px;color:var(--text3);margin-top:6px;display:flex;align-items:center;justify-content:center;gap:4px;"><i class="ti ti-map-pin" style="font-size:13px;"></i>${user.city}${user.state ? ', '+user.state : ''}</div>` : ''}
        ${user.bio ? `<div style="font-size:13px;color:var(--text2);margin-top:12px;line-height:1.6;text-align:left;background:var(--bg);padding:12px;border-radius:var(--rs);">${user.bio}</div>` : ''}
        ${!isMe ? `<div style="display:flex;gap:8px;margin-top:16px;"><button onclick="startPrivateChat('${user.id}','${user.name}')" style="flex:1;background:var(--navy);color:white;border:none;padding:10px;border-radius:var(--rs);font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;"><i class="ti ti-message"></i> Mensagem privada</button></div>` : `<div style="margin-top:16px;"><button onclick="document.getElementById('profile-modal').classList.remove('open')" style="width:100%;background:var(--bg);border:1.5px solid var(--border);color:var(--text2);padding:10px;border-radius:var(--rs);font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">Este é seu perfil</button></div>`}
      </div>`
  } catch(e) {
    document.getElementById('profile-content').innerHTML = `<div style="text-align:center;padding:30px;color:#ef4444;">Erro ao carregar perfil.</div>`
  }
}

function startPrivateChat(userId, userName) {
  document.getElementById('profile-modal').classList.remove('open')
  openChat(userName, 'Chat privado')
}

function toggleLogoutMenu() {
  const menu = document.getElementById('logout-menu')
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none'
}


function setMobileNav(id) {
  document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.remove('active'))
  if (id) { const el = document.getElementById(id); if (el) el.classList.add('active') }
}

function toggleMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer')
  const overlay = document.getElementById('mobile-drawer-overlay')
  if (!drawer || !overlay) return
  const isOpen = drawer.style.display === 'block'
  drawer.style.display = isOpen ? 'none' : 'block'
  overlay.style.display = isOpen ? 'none' : 'block'
}
function doLogout() {
  localStorage.removeItem('odont_token')
  localStorage.removeItem('odont_user')
  TOKEN = ''; USER = null
  document.getElementById('app-screen').style.display = 'none'
  document.getElementById('login-screen').style.display = 'flex'
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin() })
  document.getElementById('post-content')?.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submitPost() })
})

const _style = document.createElement('style')
_style.textContent = '@keyframes spin { to { transform: rotate(360deg) } }'
document.head.appendChild(_style)

// ===== CURSOS =====
function openProduto(p) {
  const wa = p.whatsapp ? p.whatsapp.replace(/\D/g,'') : null
  const waLink = wa ? `https://wa.me/55${wa}?text=Olá! Vi seu anúncio "${p.title}" no Dental Marketplace do ODONT HUB e tenho interesse!` : null
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:flex-end;'
  overlay.innerHTML = `
    <div style="background:white;width:100%;border-radius:20px 20px 0 0;padding:20px;max-height:88vh;overflow-y:auto;">
      <div style="width:40px;height:4px;background:#e3e5f0;border-radius:2px;margin:0 auto 14px;"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-size:17px;font-weight:800;color:#010267;flex:1;margin-right:10px;">${p.title}</div>
        <button onclick="this.closest('[style*=fixed]').remove()" style="background:#f3f4f9;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">✕</button>
      </div>
      ${p.img ? `<img src="${p.img}" style="width:100%;height:200px;object-fit:cover;border-radius:14px;margin-bottom:12px;">` : `<div style="width:100%;height:160px;background:linear-gradient(135deg,#e8eaf8,#f0eaf6);border-radius:14px;margin-bottom:12px;display:flex;align-items:center;justify-content:center;font-size:64px;">🛒</div>`}
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
        ${p.category ? `<span style="background:#e8eaf8;color:#010267;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">${p.category}</span>` : ''}
        ${p.condition ? `<span style="background:${p.condition==='Novo'?'#ecfdf5':'#fffbeb'};color:${p.condition==='Novo'?'#059669':'#d97706'};font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">${p.condition}</span>` : ''}
        ${p.city ? `<span style="background:#e8f4ff;color:#336699;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">📍 ${p.city}</span>` : ''}
      </div>
      ${p.desc ? `<div style="font-size:13px;color:#4a4b6a;line-height:1.6;margin-bottom:14px;">${p.desc}</div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:#f3f4f9;border-radius:10px;margin-bottom:14px;">
        <div>
          <div style="font-size:24px;font-weight:900;color:#059669;">R$ ${p.price}</div>
          ${p.oldPrice ? `<div style="font-size:12px;color:#8889aa;text-decoration:line-through;">R$ ${p.oldPrice}</div>` : ''}
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px;font-weight:700;color:#010267;">${p.seller||'Vendedor'}</div>
          ${p.rating ? `<div style="font-size:11px;color:#f59e0b;">⭐ ${p.rating}</div>` : ''}
        </div>
      </div>
      ${waLink ? `<a href="${waLink}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25d366;color:white;padding:16px;border-radius:14px;font-size:15px;font-weight:800;text-decoration:none;box-shadow:0 4px 16px rgba(37,211,102,.4);"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Falar com o vendedor</a>` : ''}
    </div>
  `
  overlay.onclick = e => { if(e.target===overlay) overlay.remove() }
  document.body.appendChild(overlay)
}

async function submitProduto() {
  const title = document.getElementById('prod-title')?.value.trim()
  const whatsapp = document.getElementById('prod-whatsapp')?.value.trim()
  if (!title) { alert('Preencha o nome do produto'); return }
  if (!whatsapp) { alert('Preencha o WhatsApp para contato'); return }
  alert('Produto publicado com sucesso! ✅')
  document.getElementById('modal-produto').classList.remove('open')
}

function showCursos() {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  const sc = document.getElementById('screen-cursos')
  if (sc) { sc.classList.add('active'); sc.style.display = 'block'; }
  const title = document.getElementById('page-title')
  if (title) title.textContent = 'Cursos'
  setTimeout(loadCursos, 200)
}

// ===== LABS & TÉCNICOS =====
function showLabs() {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  const labs = document.getElementById('screen-labs')
  if (labs) labs.classList.add('active')
  if (document.getElementById('page-title')) document.getElementById('page-title').textContent = 'Labs & Técnicos'
  setMobileNav('')
}

function switchLabTab(tab) {
  document.getElementById('tab-content-labs').style.display = tab === 'labs' ? 'block' : 'none'
  document.getElementById('tab-content-tecs').style.display = tab === 'tecs' ? 'block' : 'none'
  document.getElementById('tab-labs').className = tab === 'labs' ? 'tab on' : 'tab'
  document.getElementById('tab-tecs').className = tab === 'tecs' ? 'tab on' : 'tab'
}

function avaliarParceiro(nome) {
  const stars = prompt(`Quantas estrelas para ${nome}? (1 a 5)`)
  if (!stars || isNaN(stars) || stars < 1 || stars > 5) return
  const comentario = prompt('Deixe um comentário (opcional):')
  if (comentario !== null) alert(`Avaliação de ${stars}⭐ enviada para ${nome}! Obrigado.`)
}

// ===== CANDIDATURA VAGAS =====
function registrarCandidatura(btn) {
  if (btn.disabled) return
  btn.textContent = '✅ Candidatura enviada!'
  btn.disabled = true
  btn.style.background = '#059669'
  alert('Candidatura registrada! 🎉 A clínica receberá seus dados.')
}

// ===== VAGAS FORM =====
function selectVagaOpcao(tipo) {
  const camposClinica = document.getElementById('campos-clinica')
  const camposDentista = document.getElementById('campos-dentista')
  const opcaoClinica = document.getElementById('opcao-clinica')
  const opcaoDentista = document.getElementById('opcao-dentista')
  const btn = document.getElementById('btn-vaga-submit')
  if (!camposClinica || !camposDentista) return
  if (tipo === 'clinica') {
    camposClinica.style.display = 'block'
    camposDentista.style.display = 'none'
    opcaoClinica.style.borderColor = '#542F62'
    opcaoClinica.style.background = '#f0eaf6'
    opcaoDentista.style.borderColor = '#e3e5f0'
    opcaoDentista.style.background = 'white'
    if (btn) btn.innerHTML = '<i class="ti ti-send"></i> Publicar vaga'
  } else {
    camposClinica.style.display = 'none'
    camposDentista.style.display = 'block'
    opcaoDentista.style.borderColor = '#542F62'
    opcaoDentista.style.background = '#f0eaf6'
    opcaoClinica.style.borderColor = '#e3e5f0'
    opcaoClinica.style.background = 'white'
    if (btn) btn.innerHTML = '🦷 Me candidatar'
  }
}

async function submitVaga() {
  const isCand = document.getElementById('campos-dentista') && document.getElementById('campos-dentista').style.display !== 'none'
  if (isCand) {
    const titulo = document.getElementById('cand-titulo')?.value.trim()
    const whatsapp = document.getElementById('cand-whatsapp')?.value.trim()
    if (!titulo) { alert('Preencha como quer se apresentar'); return }
    if (!whatsapp) { alert('Preencha o WhatsApp'); return }
    alert('Candidatura publicada com sucesso! 🦷')
  } else {
    const title = document.getElementById('vaga-title')?.value.trim()
    const whatsapp = document.getElementById('vaga-whatsapp')?.value.trim()
    if (!title) { alert('Preencha o título da vaga'); return }
    if (!whatsapp) { alert('Preencha o WhatsApp para contato'); return }
    alert('Vaga publicada com sucesso! ✅')
  }
  document.getElementById('modal-vaga').classList.remove('open')
}

async function submitLab() {
  const nome = document.getElementById('lab-nome')?.value.trim()
  const whatsapp = document.getElementById('lab-whatsapp')?.value.trim()
  if (!nome) { alert('Preencha o nome'); return }
  if (!whatsapp) { alert('Preencha o WhatsApp'); return }
  alert('Cadastro enviado com sucesso! ✅ Em breve entraremos em contato.')
  document.getElementById('modal-lab').classList.remove('open')
}


// ============================================================
// SECURITY — Session timeout + token check
// ============================================================

// Auto logout after 8h inactivity
let _lastActivity = Date.now()
document.addEventListener('click', () => { _lastActivity = Date.now() })
setInterval(() => {
  if (typeof TOKEN !== 'undefined' && TOKEN && Date.now() - _lastActivity > 8*60*60*1000) {
    localStorage.removeItem('odont_token')
    localStorage.removeItem('odont_user')
    location.reload()
  }
}, 60000)

// Token integrity check
;(function() {
  const token = localStorage.getItem('odont_token')
  if (!token) return
  if (token.split('.').length !== 3) {
    localStorage.removeItem('odont_token')
    localStorage.removeItem('odont_user')
  }
})()


// ============================================================
// AGENDA CLÍNICA
// ============================================================

let PACIENTES = JSON.parse(localStorage.getItem('odont_pacientes') || '[]')
let CONSULTAS = JSON.parse(localStorage.getItem('odont_consultas') || '[]')
let calData = { mes: new Date().getMonth(), ano: new Date().getFullYear(), diaSel: new Date().getDate() }

function salvarDados() {
  localStorage.setItem('odont_pacientes', JSON.stringify(PACIENTES))
  localStorage.setItem('odont_consultas', JSON.stringify(CONSULTAS))
}

function abrirModalAgendamento() {
  // Populate patient select
  const sel = document.getElementById('ag-paciente')
  if (sel) {
    sel.innerHTML = '<option value="">Selecione o paciente</option>' +
      PACIENTES.map(p => `<option value="${p.id}">${p.nome}</option>`).join('')
  }
  const hoje = new Date().toISOString().split('T')[0]
  if (document.getElementById('ag-data')) document.getElementById('ag-data').value = hoje
  document.getElementById('modal-agendamento').classList.add('open')
}

function abrirModalPaciente() {
  document.getElementById('modal-paciente').classList.add('open')
}

function salvarPaciente() {
  const nome = document.getElementById('pac-nome')?.value.trim()
  const whatsapp = document.getElementById('pac-whatsapp')?.value.trim()
  if (!nome) { alert('Preencha o nome do paciente'); return }
  if (!whatsapp) { alert('Preencha o WhatsApp'); return }
  const pac = {
    id: Date.now().toString(),
    nome, whatsapp,
    apelido: document.getElementById('pac-apelido')?.value.trim(),
    nasc: document.getElementById('pac-nasc')?.value,
    sexo: document.getElementById('pac-sexo')?.value,
    ecivil: document.getElementById('pac-ecivil')?.value,
    cpf: document.getElementById('pac-cpf')?.value.trim(),
    rg: document.getElementById('pac-rg')?.value.trim(),
    profissao: document.getElementById('pac-profissao')?.value.trim(),
    email: document.getElementById('pac-email')?.value.trim(),
    cep: document.getElementById('pac-cep')?.value.trim(),
    cidade: document.getElementById('pac-cidade')?.value.trim(),
    endereco: document.getElementById('pac-endereco')?.value.trim(),
    origem: document.getElementById('pac-origem')?.value,
    evolucao: [], orcamentos: [], pagamentos: [], fotos: [], docs: []
  }
  PACIENTES.push(pac)
  salvarDados()
  document.getElementById('modal-paciente').classList.remove('open')
  renderPacientes()
  alert(`✅ Paciente ${nome} cadastrado com sucesso!`)
}

function salvarAgendamento() {
  const pacId = document.getElementById('ag-paciente')?.value
  const data = document.getElementById('ag-data')?.value
  const hora = document.getElementById('ag-hora')?.value
  const proc = document.getElementById('ag-proc')?.value.trim()
  if (!pacId) { alert('Selecione o paciente'); return }
  if (!data || !hora) { alert('Preencha data e horário'); return }
  const pac = PACIENTES.find(p => p.id === pacId)
  const consulta = {
    id: Date.now().toString(), pacId, data, hora,
    proc: proc || 'Consulta', dur: document.getElementById('ag-dur')?.value,
    obs: document.getElementById('ag-obs')?.value.trim(),
    status: 'pendente', pacNome: pac?.nome || '', pacWa: pac?.whatsapp || ''
  }
  CONSULTAS.push(consulta)
  salvarDados()
  document.getElementById('modal-agendamento').classList.remove('open')
  renderCalendario()
  renderAgendaDia()

  // Offer WhatsApp confirmation
  if (pac?.whatsapp) {
    const wa = pac.whatsapp.replace(/\D/g,'')
    const dataFmt = new Date(data + 'T12:00:00').toLocaleDateString('pt-BR')
    const msg = encodeURIComponent(`Olá ${pac.nome}! 😊 Sua consulta foi agendada para ${dataFmt} às ${hora}${proc ? ' — ' + proc : ''}. Confirme sua presença respondendo SIM. Qualquer dúvida estou à disposição! — ${USER?.name || 'Dra.'}`)
    const url = `https://wa.me/55${wa}?text=${msg}`
    if (confirm('Deseja enviar confirmação via WhatsApp agora?')) {
      window.open(url, '_blank')
    }
  }
}

function confirmarConsulta(id) {
  const c = CONSULTAS.find(x => x.id === id)
  if (!c) return
  c.status = 'confirmado'
  salvarDados()
  renderAgendaDia()

  // WhatsApp reminder
  if (c.pacWa) {
    const wa = c.pacWa.replace(/\D/g,'')
    const dataFmt = new Date(c.data + 'T12:00:00').toLocaleDateString('pt-BR')
    const msg = encodeURIComponent(`Olá ${c.pacNome}! 😊 Lembrando sua consulta amanhã ${dataFmt} às ${c.hora}${c.proc ? ' — ' + c.proc : ''}. Até lá! — ${USER?.name || 'Dra.'}`)
    window.open(`https://wa.me/55${wa}?text=${msg}`, '_blank')
  }
}

function renderCalendario() {
  const { mes, ano, diaSel } = calData
  const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const el = document.getElementById('cal-title')
  if (el) el.textContent = nomes[mes] + ' ' + ano
  const dias = document.getElementById('cal-days')
  if (!dias) return
  const primeiro = new Date(ano, mes, 1).getDay()
  const total = new Date(ano, mes + 1, 0).getDate()
  const hoje = new Date()
  // Days with consultas
  const diasComConsulta = new Set(CONSULTAS.filter(c => {
    const d = new Date(c.data + 'T12:00:00')
    return d.getMonth() === mes && d.getFullYear() === ano
  }).map(c => new Date(c.data + 'T12:00:00').getDate()))

  let html = ''
  for (let i = 0; i < primeiro; i++) html += '<div></div>'
  for (let d = 1; d <= total; d++) {
    const isHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
    const isSel = d === diaSel
    const temConsulta = diasComConsulta.has(d)
    let style = 'font-size:11px;padding:4px 2px;border-radius:50%;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;margin:0 auto;'
    if (isHoje) style += 'background:var(--navy);color:white;font-weight:700;'
    else if (isSel) style += 'background:#f0eaf6;color:#542F62;font-weight:700;border:1.5px solid #542F62;'
    else if (temConsulta) style += 'background:#fef3c7;color:#d97706;font-weight:600;'
    html += `<div style="${style}" onclick="selecionaDia(${d})">${d}</div>`
  }
  dias.innerHTML = html
}

function selecionaDia(d) {
  calData.diaSel = d
  renderCalendario()
  renderAgendaDia()
}

function mudaMes(dir) {
  calData.mes += dir
  if (calData.mes > 11) { calData.mes = 0; calData.ano++ }
  if (calData.mes < 0) { calData.mes = 11; calData.ano-- }
  renderCalendario()
  renderAgendaDia()
}

function renderAgendaDia() {
  const { mes, ano, diaSel } = calData
  const dataStr = `${ano}-${String(mes+1).padStart(2,'0')}-${String(diaSel).padStart(2,'0')}`
  const consultasDia = CONSULTAS.filter(c => c.data === dataStr).sort((a,b) => a.hora.localeCompare(b.hora))
  const titulo = document.getElementById('agenda-dia-title')
  const count = document.getElementById('agenda-dia-count')
  const lista = document.getElementById('agenda-lista')
  if (!lista) return
  const dataFmt = new Date(dataStr + 'T12:00:00').toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long'})
  if (titulo) titulo.textContent = dataFmt.charAt(0).toUpperCase() + dataFmt.slice(1)
  if (count) count.textContent = consultasDia.length + ' consulta' + (consultasDia.length !== 1 ? 's' : '')
  if (!consultasDia.length) {
    lista.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3);"><i class="ti ti-calendar-off" style="font-size:36px;display:block;margin-bottom:8px;"></i>Nenhuma consulta neste dia</div>'
    return
  }
  lista.innerHTML = consultasDia.map(c => {
    const statusColor = c.status === 'confirmado' ? '#059669' : c.status === 'cancelado' ? '#ef4444' : '#d97706'
    const statusBg = c.status === 'confirmado' ? '#ecfdf5' : c.status === 'cancelado' ? '#fff0f0' : '#fef3c7'
    const statusLabel = c.status === 'confirmado' ? 'Confirmado' : c.status === 'cancelado' ? 'Cancelado' : 'Pendente'
    const wa = c.pacWa ? c.pacWa.replace(/\D/g,'') : null
    const dataFmt2 = new Date(c.data + 'T12:00:00').toLocaleDateString('pt-BR')
    const msgConf = encodeURIComponent(`Olá ${c.pacNome}! 😊 Sua consulta foi confirmada para ${dataFmt2} às ${c.hora}${c.proc ? ' — ' + c.proc : ''}. Qualquer dúvida estou à disposição!`)
    return `<div style="border-left:3px solid ${statusColor};padding:12px 14px;background:white;border-radius:0 10px 10px 0;margin-bottom:10px;border:1px solid var(--border);border-left:3px solid ${statusColor};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <div>
          <div style="font-size:14px;font-weight:800;color:var(--navy);">${c.hora} — ${c.pacNome}</div>
          <div style="font-size:12px;color:var(--text3);">${c.proc}${c.dur ? ' · ' + c.dur : ''}</div>
          ${c.obs ? `<div style="font-size:11px;color:var(--text3);margin-top:3px;font-style:italic;">${c.obs}</div>` : ''}
        </div>
        <span style="background:${statusBg};color:${statusColor};font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap;">${statusLabel}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
        ${wa ? `<a href="https://wa.me/55${wa}?text=${msgConf}" target="_blank" style="background:#25d366;color:white;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;text-decoration:none;display:flex;align-items:center;gap:4px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> Confirmar</a>` : ''}
        <button onclick="abrirFicha('${c.pacId}')" style="background:#f0eaf6;color:#542F62;border:1.5px solid #d4c0e0;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;cursor:pointer;">📋 Ver ficha</button>
        <button onclick="cancelarConsulta('${c.id}')" style="background:#fff0f0;color:#ef4444;border:1.5px solid #fecaca;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;cursor:pointer;">✕ Cancelar</button>
      </div>
    </div>`
  }).join('')
}

function cancelarConsulta(id) {
  if (!confirm('Cancelar esta consulta?')) return
  const c = CONSULTAS.find(x => x.id === id)
  if (c) { c.status = 'cancelado'; salvarDados(); renderAgendaDia() }
}

function renderPacientes() {
  const lista = document.getElementById('pacientes-lista')
  if (!lista) return
  if (!PACIENTES.length) {
    lista.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3);"><i class="ti ti-users" style="font-size:48px;display:block;margin-bottom:12px;"></i>Nenhum paciente cadastrado ainda.</div>'
    return
  }
  lista.innerHTML = PACIENTES.map(p => {
    const ini = p.nome.split(' ').map(x=>x[0]).join('').substring(0,2).toUpperCase()
    const totalConsultas = CONSULTAS.filter(c => c.pacId === p.id).length
    return `<div class="card" style="cursor:pointer;" onclick="abrirFicha('${p.id}')">
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;">
        <div class="av m av-grad-me" style="border-radius:50%;width:40px;height:40px;flex-shrink:0;">${ini}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:14px;font-weight:800;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.nome}</div>
          <div style="font-size:11px;color:var(--text3);">${p.whatsapp}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:11px;color:var(--text3);">${totalConsultas} consulta${totalConsultas!==1?'s':''}</span>
        <span style="background:#f0eaf6;color:#542F62;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;">Ver ficha →</span>
      </div>
    </div>`
  }).join('')
}

function abrirFicha(pacId) {
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac) return
  const titulo = document.getElementById('ficha-nome-titulo')
  if (titulo) titulo.textContent = pac.nome
  const content = document.getElementById('ficha-content')
  if (!content) return

  const wa = pac.whatsapp ? pac.whatsapp.replace(/\D/g,'') : null
  const msgWa = wa ? encodeURIComponent(`Olá ${pac.nome}! Entrando em contato da nossa clínica.`) : null

  content.innerHTML = `
    <div style="background:white;border-radius:12px;padding:16px;margin-bottom:14px;display:flex;gap:14px;align-items:flex-start;">
      <div class="av l av-grad-me" style="border-radius:50%;width:56px;height:56px;flex-shrink:0;font-size:18px;">${pac.nome.split(' ').map(x=>x[0]).join('').substring(0,2).toUpperCase()}</div>
      <div style="flex:1;">
        <div style="font-size:20px;font-weight:800;color:var(--navy);">${pac.nome}</div>
        ${pac.whatsapp ? `<div style="font-size:12px;color:var(--text3);margin-top:3px;">📞 ${pac.whatsapp}</div>` : ''}
        ${pac.email ? `<div style="font-size:12px;color:var(--text3);">✉️ ${pac.email}</div>` : ''}
        ${pac.nasc ? `<div style="font-size:12px;color:var(--text3);">🎂 ${new Date(pac.nasc+'T12:00:00').toLocaleDateString('pt-BR')}</div>` : ''}
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
          ${wa ? `<a href="https://wa.me/55${wa}?text=${msgWa}" target="_blank" style="background:#25d366;color:white;font-size:11px;font-weight:700;padding:7px 14px;border-radius:8px;text-decoration:none;display:flex;align-items:center;gap:5px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp</a>` : ''}
          <button onclick="abrirModalAgendamentoParaPac('${pacId}')" style="background:linear-gradient(135deg,var(--navy),var(--purple));color:white;border:none;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;"><i class="ti ti-calendar-plus"></i> Nova consulta</button>
        </div>
      </div>
    </div>

    <!-- Abas da ficha -->
    <div style="display:flex;background:white;border-radius:12px;overflow:hidden;margin-bottom:14px;border:1px solid var(--border);overflow-x:auto;">
      ${['📋 Cadastro','🩺 Anamnese','🦷 Tratamentos','💰 Financeiro','📷 Fotos','📄 Documentos','🔬 Exames'].map((t,i) =>
        `<div onclick="fichaTab(this,'${pacId}',${i})" style="padding:11px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;border-bottom:2px solid ${i===0?'var(--navy)':'transparent'};color:${i===0?'var(--navy)':'var(--text3)'}">${t}</div>`
      ).join('')}
    </div>
    <div id="ficha-tab-content"></div>
  `
  fichaTab(null, pacId, 0)
  nav(document.querySelector('[data-s=agenda]'), 'ficha', pac.nome)
  document.getElementById('screen-ficha').classList.add('active')
  document.getElementById('screen-agenda').classList.remove('active')
}

function abrirModalAgendamentoParaPac(pacId) {
  const sel = document.getElementById('ag-paciente')
  if (sel) {
    sel.innerHTML = '<option value="">Selecione o paciente</option>' +
      PACIENTES.map(p => `<option value="${p.id}" ${p.id===pacId?'selected':''}>${p.nome}</option>`).join('')
  }
  document.getElementById('modal-agendamento').classList.add('open')
}

function fichaTab(el, pacId, idx) {
  // Update tab styles
  const tabs = document.querySelectorAll('#ficha-content [onclick^="fichaTab"]')
  tabs.forEach((t,i) => {
    t.style.borderBottom = i===idx ? '2px solid var(--navy)' : '2px solid transparent'
    t.style.color = i===idx ? 'var(--navy)' : 'var(--text3)'
  })
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac) return
  const cont = document.getElementById('ficha-tab-content')
  if (!cont) return

  if (idx === 0) { // Cadastro
    cont.innerHTML = `<div class="card" style="padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div><label class="lbl">Nome completo</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.nome||'—'}</div></div>
        <div><label class="lbl">Apelido</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.apelido||'—'}</div></div>
        <div><label class="lbl">Nascimento</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.nasc ? new Date(pac.nasc+'T12:00:00').toLocaleDateString('pt-BR') : '—'}</div></div>
        <div><label class="lbl">Sexo</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.sexo||'—'}</div></div>
        <div><label class="lbl">CPF</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.cpf||'—'}</div></div>
        <div><label class="lbl">RG</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.rg||'—'}</div></div>
        <div><label class="lbl">WhatsApp</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.whatsapp||'—'}</div></div>
        <div><label class="lbl">E-mail</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.email||'—'}</div></div>
        <div><label class="lbl">Profissão</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.profissao||'—'}</div></div>
        <div><label class="lbl">Estado civil</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.ecivil||'—'}</div></div>
        <div style="grid-column:1/-1;"><label class="lbl">Endereço</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.endereco ? pac.endereco + (pac.cidade ? ', ' + pac.cidade : '') : '—'}</div></div>
        <div><label class="lbl">Como nos conheceu?</label><div style="font-size:13px;font-weight:600;color:var(--text);">${pac.origem||'—'}</div></div>
      </div>
    </div>`
  } else if (idx === 1) { // Anamnese
    const an = pac.anamnese || {}
    cont.innerHTML = `<div class="card" style="padding:16px;">
      <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:14px;">Ficha de Anamnese</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
        ${[['Pressão alta','hipertensao'],['Diabetes','diabetes'],['Doença cardíaca','cardiaca'],['Alergia a anestésicos','alergia_anest'],['Alergia a medicamentos','alergia_med'],['Gestante','gestante'],['Usa anticoagulante','anticoag'],['HIV/AIDS','hiv'],['Hepatite','hepatite'],['Problema renal','renal']].map(([label,key]) => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#f3f4f9;border-radius:8px;">
            <span style="font-size:12px;color:var(--text2);">${label}</span>
            <div style="display:flex;gap:8px;">
              <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;"><input type="radio" name="an_${key}_${pacId}" value="sim" ${an[key]==='sim'?'checked':''} onchange="salvarAnamnese('${pacId}','${key}','sim')"> Sim</label>
              <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;"><input type="radio" name="an_${key}_${pacId}" value="nao" ${an[key]!=='sim'?'checked':''} onchange="salvarAnamnese('${pacId}','${key}','nao')"> Não</label>
            </div>
          </div>`).join('')}
      </div>
      <div><label class="lbl">Medicamentos em uso</label><textarea class="inp" style="min-height:60px;" placeholder="Liste os medicamentos..." onblur="salvarAnamnese('${pacId}','medicamentos',this.value)">${an.medicamentos||''}</textarea></div>
      <div style="margin-top:10px;"><label class="lbl">Observações / Alergias</label><textarea class="inp" style="min-height:60px;" placeholder="Observações importantes..." onblur="salvarAnamnese('${pacId}','obs_anam',this.value)">${an.obs_anam||''}</textarea></div>
    </div>`
  } else if (idx === 2) { // Tratamentos / Evolução
    const consultas = CONSULTAS.filter(c => c.pacId === pacId).sort((a,b) => b.data.localeCompare(a.data))
    cont.innerHTML = `<div class="card" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <div style="font-size:13px;font-weight:800;color:var(--navy);">Histórico e Evolução</div>
        <button onclick="addEvolucao('${pacId}')" style="background:linear-gradient(135deg,var(--navy),var(--purple));color:white;border:none;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">+ Adicionar evolução</button>
      </div>
      ${(pac.evolucao||[]).map(ev => `<div style="border-left:3px solid var(--purple);padding:10px 14px;background:#f9f7fc;border-radius:0 8px 8px 0;margin-bottom:10px;">
        <div style="font-size:11px;font-weight:700;color:var(--purple);margin-bottom:4px;">${ev.data} — ${ev.dentista||USER?.name||'Dra.'}</div>
        <div style="font-size:13px;color:var(--text2);">${ev.texto}</div>
      </div>`).join('') || '<div style="text-align:center;padding:30px;color:var(--text3);">Nenhuma evolução registrada ainda.</div>'}
      ${consultas.length ? '<div style="font-size:11px;font-weight:700;color:var(--text3);margin-top:14px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.08em;">Consultas agendadas</div>' : ''}
      ${consultas.map(c => `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#f3f4f9;border-radius:8px;margin-bottom:6px;">
        <div><div style="font-size:12px;font-weight:700;color:var(--navy);">${new Date(c.data+'T12:00:00').toLocaleDateString('pt-BR')} ${c.hora}</div><div style="font-size:11px;color:var(--text3);">${c.proc}</div></div>
        <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;background:${c.status==='confirmado'?'#ecfdf5':c.status==='cancelado'?'#fff0f0':'#fef3c7'};color:${c.status==='confirmado'?'#059669':c.status==='cancelado'?'#ef4444':'#d97706'};">${c.status}</span>
      </div>`).join('')}
    </div>`
  } else if (idx === 3) { // Financeiro
    const pags = pac.pagamentos || []
    const total = pags.reduce((s,p) => s + Number(p.valor||0), 0)
    const pago = pags.filter(p=>p.status==='pago').reduce((s,p) => s + Number(p.valor||0), 0)
    cont.innerHTML = `<div class="card" style="padding:16px;">
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="background:linear-gradient(135deg,#059669,#34d399);border-radius:10px;padding:12px;color:white;"><div style="font-size:10px;opacity:.8;">RECEBIDO</div><div style="font-size:20px;font-weight:900;">R$ ${pago.toLocaleString('pt-BR')}</div></div>
        <div style="background:linear-gradient(135deg,#f59e0b,#fbbf24);border-radius:10px;padding:12px;color:white;"><div style="font-size:10px;opacity:.8;">A RECEBER</div><div style="font-size:20px;font-weight:900;">R$ ${(total-pago).toLocaleString('pt-BR')}</div></div>
        <div style="background:linear-gradient(135deg,var(--navy),var(--purple));border-radius:10px;padding:12px;color:white;"><div style="font-size:10px;opacity:.8;">TOTAL</div><div style="font-size:20px;font-weight:900;">R$ ${total.toLocaleString('pt-BR')}</div></div>
      </div>
      <button onclick="addPagamento('${pacId}')" style="background:linear-gradient(135deg,#059669,#34d399);color:white;border:none;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;margin-bottom:14px;">+ Registrar pagamento</button>
      ${pags.length ? pags.map(p => `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#f3f4f9;border-radius:8px;margin-bottom:6px;">
        <div><div style="font-size:12px;font-weight:700;color:var(--navy);">${p.desc}</div><div style="font-size:11px;color:var(--text3);">${p.data} · ${p.forma}</div></div>
        <div style="text-align:right;"><div style="font-size:14px;font-weight:800;color:${p.status==='pago'?'#059669':'#f59e0b'};">R$ ${Number(p.valor).toLocaleString('pt-BR')}</div><span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:${p.status==='pago'?'#ecfdf5':'#fef3c7'};color:${p.status==='pago'?'#059669':'#d97706'};">${p.status}</span></div>
      </div>`).join('') : '<div style="text-align:center;padding:20px;color:var(--text3);">Nenhum pagamento registrado.</div>'}
    </div>`
  } else if (idx === 4) { // Fotos
    cont.innerHTML = `<div class="card" style="padding:16px;">
      <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:14px;">Fotos do Tratamento</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div><div style="font-size:11px;font-weight:700;color:var(--text3);margin-bottom:6px;">📷 Foto inicial</div>
        <div style="height:120px;background:#f3f4f9;border-radius:10px;border:2px dashed var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;" onclick="document.getElementById('foto-ini-${pacId}').click()">
          <i class="ti ti-camera-plus" style="font-size:28px;color:var(--text3);"></i>
          <span style="font-size:11px;color:var(--text3);">Adicionar foto</span>
          <input type="file" id="foto-ini-${pacId}" accept="image/*" style="display:none;" onchange="salvarFoto('${pacId}','inicial',this)">
        </div></div>
        <div><div style="font-size:11px;font-weight:700;color:#059669;margin-bottom:6px;">✨ Foto final</div>
        <div style="height:120px;background:#f3f4f9;border-radius:10px;border:2px dashed #bbf7d0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;" onclick="document.getElementById('foto-fin-${pacId}').click()">
          <i class="ti ti-camera-plus" style="font-size:28px;color:#34d399;"></i>
          <span style="font-size:11px;color:#34d399;">Adicionar foto</span>
          <input type="file" id="foto-fin-${pacId}" accept="image/*" style="display:none;" onchange="salvarFoto('${pacId}','final',this)">
        </div></div>
      </div>
      ${(pac.fotos||[]).map(f => `<div style="display:flex;align-items:center;gap:8px;padding:8px;background:#f3f4f9;border-radius:8px;margin-bottom:6px;">
        <i class="ti ti-photo" style="font-size:20px;color:var(--purple);"></i>
        <div style="flex:1;font-size:12px;font-weight:600;color:var(--navy);">${f.tipo === 'inicial' ? '📷 Foto inicial' : '✨ Foto final'} — ${f.data}</div>
      </div>`).join('')}
    </div>`
  } else if (idx === 5) { // Documentos
    cont.innerHTML = `<div class="card" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <div style="font-size:13px;font-weight:800;color:var(--navy);">📄 Termos e Documentos</div>
        <button onclick="addDocumento('${pacId}')" style="background:linear-gradient(135deg,var(--navy),var(--purple));color:white;border:none;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">+ Adicionar</button>
      </div>
      <div style="border:2px dashed var(--border);border-radius:10px;padding:20px;text-align:center;margin-bottom:14px;cursor:pointer;" onclick="document.getElementById('doc-upload-${pacId}').click()">
        <i class="ti ti-file-upload" style="font-size:32px;color:var(--text3);display:block;margin-bottom:8px;"></i>
        <div style="font-size:12px;color:var(--text3);">Clique para anexar PDF, imagem ou documento</div>
        <input type="file" id="doc-upload-${pacId}" accept=".pdf,.jpg,.png,.doc,.docx" style="display:none;" onchange="salvarDoc('${pacId}',this)">
      </div>
      ${(pac.docs||[]).map(d => `<div style="display:flex;align-items:center;gap:8px;padding:10px;background:#f3f4f9;border-radius:8px;margin-bottom:6px;">
        <i class="ti ti-file-description" style="font-size:20px;color:var(--purple);"></i>
        <div style="flex:1;"><div style="font-size:12px;font-weight:700;color:var(--navy);">${d.nome}</div><div style="font-size:10px;color:var(--text3);">${d.data}</div></div>
      </div>`).join('') || ''}
    </div>`
  } else if (idx === 6) { // Exames/Rx
    cont.innerHTML = `<div class="card" style="padding:16px;">
      <div style="font-size:13px;font-weight:800;color:var(--navy);margin-bottom:14px;">🔬 Exames e Radiografias</div>
      <div style="border:2px dashed var(--border);border-radius:10px;padding:24px;text-align:center;margin-bottom:14px;cursor:pointer;" onclick="document.getElementById('rx-upload-${pacId}').click()">
        <i class="ti ti-x-ray" style="font-size:36px;color:var(--text3);display:block;margin-bottom:8px;"></i>
        <div style="font-size:13px;font-weight:700;color:var(--text3);margin-bottom:4px;">Anexar Rx ou Exames</div>
        <div style="font-size:11px;color:var(--text3);">Suporta JPG, PNG e PDF</div>
        <input type="file" id="rx-upload-${pacId}" accept=".pdf,.jpg,.png" style="display:none;" onchange="salvarRx('${pacId}',this)">
      </div>
      ${(pac.exames||[]).map(e => `<div style="display:flex;align-items:center;gap:8px;padding:10px;background:#f3f4f9;border-radius:8px;margin-bottom:6px;">
        <i class="ti ti-x-ray" style="font-size:20px;color:var(--blue);"></i>
        <div style="flex:1;"><div style="font-size:12px;font-weight:700;color:var(--navy);">${e.nome}</div><div style="font-size:10px;color:var(--text3);">${e.data}</div></div>
      </div>`).join('') || '<div style="text-align:center;padding:20px;color:var(--text3);">Nenhum exame anexado.</div>'}
    </div>`
  }
}

function salvarAnamnese(pacId, key, val) {
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac) return
  if (!pac.anamnese) pac.anamnese = {}
  pac.anamnese[key] = val
  salvarDados()
}

function addEvolucao(pacId) {
  const texto = prompt('Descreva a evolução da consulta:')
  if (!texto) return
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac) return
  if (!pac.evolucao) pac.evolucao = []
  pac.evolucao.unshift({ texto, data: new Date().toLocaleDateString('pt-BR'), dentista: USER?.name || 'Dra.' })
  salvarDados()
  fichaTab(null, pacId, 2)
}

function addPagamento(pacId) {
  const desc = prompt('Descrição do pagamento/procedimento:')
  if (!desc) return
  const valor = prompt('Valor (R$):')
  if (!valor) return
  const forma = prompt('Forma de pagamento (Pix, Cartão, Dinheiro...):') || 'Pix'
  const status = confirm('Já foi pago?') ? 'pago' : 'pendente'
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac) return
  if (!pac.pagamentos) pac.pagamentos = []
  pac.pagamentos.push({ desc, valor: valor.replace(',','.'), forma, status, data: new Date().toLocaleDateString('pt-BR') })
  salvarDados()
  fichaTab(null, pacId, 3)
}

function addDocumento(pacId) {
  const nome = prompt('Nome do documento:')
  if (!nome) return
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac) return
  if (!pac.docs) pac.docs = []
  pac.docs.push({ nome, data: new Date().toLocaleDateString('pt-BR') })
  salvarDados()
  fichaTab(null, pacId, 5)
}

function salvarFoto(pacId, tipo, input) {
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac || !input.files[0]) return
  if (!pac.fotos) pac.fotos = []
  pac.fotos.push({ tipo, nome: input.files[0].name, data: new Date().toLocaleDateString('pt-BR') })
  salvarDados()
  alert('Foto registrada! ✅')
  fichaTab(null, pacId, 4)
}

function salvarDoc(pacId, input) {
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac || !input.files[0]) return
  if (!pac.docs) pac.docs = []
  pac.docs.push({ nome: input.files[0].name, data: new Date().toLocaleDateString('pt-BR') })
  salvarDados()
  alert('Documento anexado! ✅')
  fichaTab(null, pacId, 5)
}

function salvarRx(pacId, input) {
  const pac = PACIENTES.find(p => p.id === pacId)
  if (!pac || !input.files[0]) return
  if (!pac.exames) pac.exames = []
  pac.exames.push({ nome: input.files[0].name, data: new Date().toLocaleDateString('pt-BR') })
  salvarDados()
  alert('Exame/Rx anexado! ✅')
  fichaTab(null, pacId, 6)
}

// Init agenda on nav
const _origNav = nav
window.nav = function(el, screen, title) {
  _origNav(el, screen, title)
  if (screen === 'agenda') {
    setTimeout(() => { renderCalendario(); renderAgendaDia(); renderPacientes() }, 100)
  }
}


// ============================================================
// IMPORTADOR UNIVERSAL DE PACIENTES
// ============================================================

let _importData = { headers: [], rows: [], mapeamento: {} }

function toggleImportador() {
  const box = document.getElementById('importador-box')
  if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none'
}

function handleFileDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  if (file) processarArquivo(file)
}

function handleFileSelect(input) {
  if (input.files[0]) processarArquivo(input.files[0])
}

function processarArquivo(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  const reader = new FileReader()

  if (ext === 'csv') {
    reader.onload = e => {
      const text = e.target.result
      const rows = text.split('\n').filter(r => r.trim())
      const sep = rows[0].includes(';') ? ';' : ','
      const headers = rows[0].split(sep).map(h => h.trim().replace(/"/g,''))
      const data = rows.slice(1).map(r => r.split(sep).map(c => c.trim().replace(/"/g,'')))
      _importData = { headers, rows: data, mapeamento: {}, fileName: file.name }
      mostrarMapeamento()
    }
    reader.readAsText(file, 'UTF-8')
  } else if (ext === 'xlsx' || ext === 'xls') {
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        const headers = json[0].map(h => String(h||'').trim())
        const rows = json.slice(1).map(r => headers.map((_,i) => String(r[i]||'').trim()))
        _importData = { headers, rows, mapeamento: {}, fileName: file.name }
        mostrarMapeamento()
      } catch(err) {
        alert('Erro ao ler Excel. Tente exportar como CSV.')
      }
    }
    reader.readAsArrayBuffer(file)
  } else {
    alert('Formato não suportado. Use CSV ou Excel (.xlsx/.xls)')
  }
}

function mostrarMapeamento() {
  const box = document.getElementById('mapeamento-box')
  const info = document.getElementById('arquivo-info')
  const campos = document.getElementById('mapeamento-campos')
  if (!box || !info || !campos) return

  box.style.display = 'block'
  info.textContent = `Arquivo: ${_importData.fileName} — ${_importData.rows.length} pacientes encontrados`

  const camposODONT = [
    { key: 'nome', label: 'Nome completo *', keywords: ['nome','name','paciente','patient','cliente'] },
    { key: 'whatsapp', label: 'WhatsApp / Celular *', keywords: ['whatsapp','celular','telefone','fone','phone','mobile','cel'] },
    { key: 'email', label: 'E-mail', keywords: ['email','e-mail','mail'] },
    { key: 'nasc', label: 'Data de nascimento', keywords: ['nasc','nascimento','birth','data_nasc','dt_nasc','aniversario'] },
    { key: 'cpf', label: 'CPF', keywords: ['cpf','documento','doc'] },
    { key: 'rg', label: 'RG', keywords: ['rg'] },
    { key: 'sexo', label: 'Sexo / Gênero', keywords: ['sexo','genero','gender','sex'] },
    { key: 'cidade', label: 'Cidade', keywords: ['cidade','city','municipio','localidade'] },
    { key: 'profissao', label: 'Profissão', keywords: ['profissao','profissão','ocupacao','ocupação','job','profession'] },
  ]

  // Auto-detect mapping
  camposODONT.forEach(c => {
    const match = _importData.headers.find(h =>
      c.keywords.some(k => h.toLowerCase().includes(k))
    )
    _importData.mapeamento[c.key] = match || ''
  })

  campos.innerHTML = camposODONT.map(c => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="font-size:12px;color:#8889aa;width:160px;flex-shrink:0;">${c.label}</div>
      <select onchange="_importData.mapeamento['${c.key}']=this.value" style="flex:1;background:#f3f4f9;border:1.5px solid #e3e5f0;border-radius:7px;padding:7px 10px;font-size:12px;">
        <option value="">— Não importar —</option>
        ${_importData.headers.map(h => `<option value="${h}" ${_importData.mapeamento[c.key]===h?'selected':''}>${h}</option>`).join('')}
      </select>
      <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:14px;${_importData.mapeamento[c.key] ? 'background:#ecfdf5;color:#059669;' : 'background:#f3f4f9;color:#8889aa;'}">
        ${_importData.mapeamento[c.key] ? '✓ OK' : '—'}
      </span>
    </div>
  `).join('')

  // Preview table
  const preview = document.getElementById('preview-table-wrap')
  if (preview) {
    const cols = ['nome','whatsapp','email','nasc'].filter(k => _importData.mapeamento[k])
    const previewRows = _importData.rows.slice(0,3)
    preview.innerHTML = `
      <div style="font-size:12px;font-weight:700;color:var(--navy);margin-bottom:8px;">Preview (primeiros 3 registros):</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <tr>${cols.map(k => `<th style="background:#f3f4f9;padding:7px;text-align:left;font-weight:700;color:#542F62;border-bottom:1px solid #e3e5f0;">${k}</th>`).join('')}</tr>
        ${previewRows.map(row => `<tr>${cols.map(k => {
          const idx = _importData.headers.indexOf(_importData.mapeamento[k])
          return `<td style="padding:7px;border-bottom:1px solid #f3f4f9;color:#4a4b6a;">${idx>=0 ? row[idx] : '—'}</td>`
        }).join('')}</tr>`).join('')}
      </table>
    `
  }

  const btn = document.getElementById('btn-executar-import')
  if (btn) btn.textContent = `⚡ Importar ${_importData.rows.length} pacientes agora`
}

function executarImportacao() {
  const { headers, rows, mapeamento } = _importData
  const nomeCol = headers.indexOf(mapeamento.nome)
  const waCol = headers.indexOf(mapeamento.whatsapp)

  if (nomeCol < 0) { alert('Selecione a coluna de Nome do paciente!'); return }
  if (waCol < 0 && !confirm('Nenhuma coluna de WhatsApp selecionada. Continuar mesmo assim?')) return

  let importados = 0
  let duplicados = 0

  rows.forEach(row => {
    const nome = row[nomeCol]?.trim()
    if (!nome) return

    // Check duplicate
    const jaExiste = PACIENTES.find(p => p.nome.toLowerCase() === nome.toLowerCase())
    if (jaExiste) { duplicados++; return }

    const getCol = key => {
      const idx = headers.indexOf(mapeamento[key] || '')
      return idx >= 0 ? row[idx]?.trim() || '' : ''
    }

    PACIENTES.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2,5),
      nome,
      whatsapp: getCol('whatsapp'),
      email: getCol('email'),
      nasc: getCol('nasc'),
      cpf: getCol('cpf'),
      rg: getCol('rg'),
      sexo: getCol('sexo'),
      cidade: getCol('cidade'),
      profissao: getCol('profissao'),
      evolucao: [], orcamentos: [], pagamentos: [], fotos: [], docs: [], exames: []
    })
    importados++
  })

  salvarDados()
  renderPacientes()

  document.getElementById('mapeamento-box').style.display = 'none'
  document.getElementById('importador-box').style.display = 'none'
  _importData = { headers: [], rows: [], mapeamento: {} }

  alert(`✅ Importação concluída!\n\n✓ ${importados} pacientes importados\n${duplicados > 0 ? `⚠ ${duplicados} já existiam e foram ignorados` : ''}`)
}

// Load SheetJS for Excel support
if (!window.XLSX) {
  const s = document.createElement('script')
  s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
  document.head.appendChild(s)
}


// ============================================================
// AGENDA SEMANAL VISUAL — CLINICORP STYLE
// ============================================================

let AG = {
  view: 'week',
  semanaBase: new Date(),
  profsFiltro: [],
}

let PROFISSIONAIS = JSON.parse(localStorage.getItem('odont_profs') || '[]')

// Cores padrão para novos profissionais
const PROF_CORES = ['#542F62','#3b82f6','#f59e0b','#ef4444','#059669','#ec4899','#0ea5e9','#8b5cf6']

function agInit() {
  // Add default professional if none
  if (!PROFISSIONAIS.length && USER) {
    PROFISSIONAIS.push({ id:'prof_default', nome: USER.name || 'Dra. ' + (USER.nome || ''), spec: '', cro: '', cor: '#542F62', ativo: true })
    localStorage.setItem('odont_profs', JSON.stringify(PROFISSIONAIS))
  }
  agRenderMiniCal()
  agRenderProfs()
  agRenderGrid()
  agRenderAlertas()
  // Scroll to 8am
  setTimeout(() => {
    const sc = document.getElementById('ag-cal-scroll')
    if (sc) sc.scrollTop = 8 * 60 // 8h * 60px/h
  }, 200)
}

function agHoje() {
  AG.semanaBase = new Date()
  agRenderMiniCal()
  agRenderGrid()
}

function agMudaSemana(dir) {
  const d = new Date(AG.semanaBase)
  if (AG.view === 'week') d.setDate(d.getDate() + dir * 7)
  else if (AG.view === 'day') d.setDate(d.getDate() + dir)
  else d.setMonth(d.getMonth() + dir)
  AG.semanaBase = d
  agRenderMiniCal()
  agRenderGrid()
}

function agSetView(v) {
  AG.view = v
  ;['day','week','month'].forEach(x => {
    const btn = document.getElementById('btn-view-'+x)
    if (btn) {
      btn.style.background = x===v ? 'linear-gradient(135deg,var(--navy),var(--purple))' : '#f3f4f9'
      btn.style.color = x===v ? 'white' : 'var(--text3)'
      btn.style.border = x===v ? 'none' : '1px solid var(--border)'
    }
  })
  agRenderGrid()
}

function agGetSemana() {
  const base = new Date(AG.semanaBase)
  const dom = new Date(base)
  dom.setDate(base.getDate() - base.getDay())
  dom.setHours(0,0,0,0)
  const dias = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(dom)
    d.setDate(dom.getDate() + i)
    dias.push(d)
  }
  return dias
}

function agRenderMiniCal() {
  const base = new Date(AG.semanaBase)
  const mes = base.getMonth(), ano = base.getFullYear()
  const nomes = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const el = document.getElementById('ag-mini-title')
  if (el) el.textContent = nomes[mes] + ' ' + ano
  const dias = document.getElementById('ag-mini-days')
  if (!dias) return

  const primeiro = new Date(ano, mes, 1).getDay()
  const total = new Date(ano, mes + 1, 0).getDate()
  const hoje = new Date()
  const diasConsulta = new Set(CONSULTAS.filter(c => {
    const d = new Date(c.data + 'T12:00:00')
    return d.getMonth() === mes && d.getFullYear() === ano
  }).map(c => new Date(c.data + 'T12:00:00').getDate()))

  let html = ''
  for (let i = 0; i < primeiro; i++) html += '<div></div>'
  for (let d = 1; d <= total; d++) {
    const isHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
    const isSel = d === base.getDate() && mes === base.getMonth() && ano === base.getFullYear()
    const temC = diasConsulta.has(d)
    let style = 'font-size:9px;padding:3px 1px;border-radius:50%;cursor:pointer;width:20px;height:20px;display:flex;align-items:center;justify-content:center;margin:0 auto;'
    if (isHoje) style += 'background:var(--navy);color:white;font-weight:700;'
    else if (isSel) style += 'background:#f0eaf6;color:var(--purple);font-weight:700;border:1px solid var(--purple);'
    else if (temC) style += 'color:#d97706;font-weight:700;'
    html += `<div style="${style}" onclick="agClickMiniDia(${d},${mes},${ano})">${d}</div>`
  }
  dias.innerHTML = html

  // Update week title
  if (AG.view === 'week') {
    const sem = agGetSemana()
    const title = document.getElementById('ag-week-title')
    if (title) title.textContent = `De ${sem[0].getDate()} a ${sem[6].getDate()} de ${nomes[sem[0].getMonth()]} de ${sem[6].getFullYear()}`
  } else if (AG.view === 'day') {
    const title = document.getElementById('ag-week-title')
    if (title) title.textContent = base.toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})
  } else {
    const title = document.getElementById('ag-week-title')
    if (title) title.textContent = nomes[mes] + ' ' + ano
  }
}

function agClickMiniDia(d, mes, ano) {
  AG.semanaBase = new Date(ano, mes, d)
  agRenderMiniCal()
  agRenderGrid()
}

function agRenderProfs() {
  const lista = document.getElementById('ag-profs-list')
  if (!lista) return
  if (!PROFISSIONAIS.length) { lista.innerHTML = '<div style="font-size:11px;color:var(--text3);padding:4px 0;">Nenhum profissional. Adicione um!</div>'; return }
  lista.innerHTML = PROFISSIONAIS.map(p => `
    <div style="display:flex;align-items:center;gap:7px;padding:5px 0;font-size:11px;font-weight:600;color:var(--text);">
      <div style="width:12px;height:12px;border-radius:3px;background:${p.cor};flex-shrink:0;"></div>
      <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.nome}</span>
    </div>`
  ).join('')
}

function agRenderAlertas() {
  const el = document.getElementById('ag-alertas')
  if (!el) return
  // Find patients with no recent appointment in 6 months
  const alertas = PACIENTES.filter(p => {
    const ultConsulta = CONSULTAS.filter(c => c.pacId === p.id).sort((a,b) => b.data.localeCompare(a.data))[0]
    if (!ultConsulta) return false
    const diff = (new Date() - new Date(ultConsulta.data + 'T12:00:00')) / (1000*60*60*24)
    return diff > 120 // 4 months
  }).slice(0, 5)
  if (!alertas.length) { el.innerHTML = '<div style="font-size:10px;color:var(--text3);">Nenhum alerta.</div>'; return }
  el.innerHTML = alertas.map(p => `
    <div style="font-size:10px;color:#ef4444;padding:4px 0;border-bottom:1px solid var(--bg);display:flex;justify-content:space-between;cursor:pointer;" onclick="abrirFicha('${p.id}')">
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;">${p.nome}</span>
      <span style="flex-shrink:0;margin-left:4px;color:var(--text3);">retorno</span>
    </div>`
  ).join('')
}

function agRenderGrid() {
  const grid = document.getElementById('ag-cal-grid')
  if (!grid) return
  agRenderMiniCal()

  if (AG.view === 'week' || AG.view === 'day') {
    const dias = AG.view === 'week' ? agGetSemana() : [new Date(AG.semanaBase)]
    const cols = dias.length
    const HORAS = Array.from({length:24}, (_,i) => i)
    const SLOT_H = 60 // px per hour
    const hoje = new Date()
    const nDias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

    // Count consultas per day
    const contDia = {}
    CONSULTAS.forEach(c => { contDia[c.data] = (contDia[c.data]||0) + 1 })

    // Header
    let headerHtml = `<div style="display:flex;position:sticky;top:0;z-index:20;background:white;border-bottom:1px solid var(--border);">
      <div style="width:56px;flex-shrink:0;border-right:1px solid var(--border);"></div>
      ${dias.map(d => {
        const isHoje = d.toDateString() === hoje.toDateString()
        const dataStr = d.toISOString().split('T')[0]
        const count = contDia[dataStr] || 0
        return `<div style="flex:1;text-align:center;padding:8px 4px;border-right:1px solid var(--border);">
          <div style="font-size:10px;font-weight:700;color:var(--text3);">${nDias[d.getDay()]}</div>
          <div style="font-size:${isHoje?'16':'15'}px;font-weight:900;color:${isHoje?'white':'var(--navy)'};background:${isHoje?'var(--navy)':'transparent'};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:2px auto;">${d.getDate()}</div>
          <div style="font-size:9px;color:var(--text3);">${count > 0 ? count + ' pac.' : ''}</div>
        </div>`
      }).join('')}
    </div>`

    // Body
    let bodyHtml = `<div style="display:flex;position:relative;">`
    // Time column
    bodyHtml += `<div style="width:56px;flex-shrink:0;border-right:1px solid var(--border);">
      ${HORAS.map(h => `<div style="height:${SLOT_H}px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;padding-top:3px;justify-content:flex-end;padding-right:6px;">
        <span style="font-size:9px;color:var(--text3);font-weight:600;">${String(h).padStart(2,'0')}:00</span>
      </div>`).join('')}
    </div>`

    // Day columns
    dias.forEach(d => {
      const dataStr = d.toISOString().split('T')[0]
      const isHoje = d.toDateString() === hoje.toDateString()
      const consultasDia = CONSULTAS.filter(c => c.data === dataStr && c.status !== 'cancelado')

      // Current time line
      let nowLine = ''
      if (isHoje) {
        const now = new Date()
        const topPx = (now.getHours() + now.getMinutes()/60) * SLOT_H
        nowLine = `<div style="position:absolute;left:0;right:0;top:${topPx}px;height:2px;background:#ef4444;z-index:10;">
          <div style="width:8px;height:8px;background:#ef4444;border-radius:50%;position:absolute;left:-4px;top:-3px;"></div>
        </div>`
      }

      // Appointment blocks
      const apptBlocks = consultasDia.map(c => {
        const [hh, mm] = c.hora.split(':').map(Number)
        const topPx = (hh + mm/60) * SLOT_H
        const durMin = parseInt(c.dur) || 60
        const heightPx = Math.max((durMin / 60) * SLOT_H, 30)
        const prof = PROFISSIONAIS.find(p => p.id === c.profId) || PROFISSIONAIS[0]
        const cor = prof?.cor || '#542F62'
        const bgLight = cor + '22'
        return `<div style="position:absolute;top:${topPx}px;left:2px;right:2px;height:${heightPx}px;background:${bgLight};border-left:3px solid ${cor};border-radius:0 6px 6px 0;padding:4px 5px;font-size:10px;font-weight:700;color:${cor};cursor:pointer;overflow:hidden;z-index:5;" onclick="abrirFicha('${c.pacId}')">
          <div style="font-weight:800;">${c.pacNome||'Paciente'}</div>
          <div style="font-weight:400;opacity:.8;">${c.hora} — ${c.proc||'Consulta'}</div>
          ${prof ? `<div style="font-size:9px;opacity:.6;">${prof.nome}</div>` : ''}
        </div>`
      }).join('')

      bodyHtml += `<div style="flex:1;border-right:1px solid var(--border);position:relative;background:${isHoje?'rgba(84,47,98,.02)':'white'};">
        ${HORAS.map(h => `<div style="height:${SLOT_H}px;border-bottom:1px solid ${h%1===0?'var(--border)':'#f9f9f9'};"></div>`).join('')}
        ${nowLine}
        ${apptBlocks}
      </div>`
    })
    bodyHtml += '</div>'

    grid.innerHTML = headerHtml + bodyHtml

  } else if (AG.view === 'month') {
    // Month view
    const base = new Date(AG.semanaBase)
    const mes = base.getMonth(), ano = base.getFullYear()
    const primeiro = new Date(ano, mes, 1).getDay()
    const total = new Date(ano, mes + 1, 0).getDate()
    const hoje = new Date()
    const nDias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

    let html = `<div style="display:grid;grid-template-columns:repeat(7,1fr);background:white;position:sticky;top:0;z-index:20;border-bottom:1px solid var(--border);">
      ${nDias.map(n => `<div style="text-align:center;padding:8px;font-size:11px;font-weight:700;color:var(--text3);border-right:1px solid var(--border);">${n}</div>`).join('')}
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);">`

    for (let i = 0; i < primeiro; i++) html += `<div style="height:90px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:#fafafa;"></div>`

    for (let d = 1; d <= total; d++) {
      const dataStr = `${ano}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      const isHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
      const consultasDia = CONSULTAS.filter(c => c.data === dataStr && c.status !== 'cancelado')
      html += `<div style="height:90px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);padding:4px;cursor:pointer;background:${isHoje?'rgba(1,2,103,.04)':'white'};" onclick="agClickMiniDia(${d},${mes},${ano});agSetView('day')">
        <div style="font-size:12px;font-weight:700;color:${isHoje?'white':'var(--text)'};background:${isHoje?'var(--navy)':'transparent'};width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:4px;">${d}</div>
        ${consultasDia.slice(0,2).map(c => {
          const prof = PROFISSIONAIS.find(p => p.id === c.profId) || PROFISSIONAIS[0]
          const cor = prof?.cor || '#542F62'
          return `<div style="font-size:9px;font-weight:700;background:${cor}22;color:${cor};border-radius:4px;padding:2px 4px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.hora} ${c.pacNome||''}</div>`
        }).join('')}
        ${consultasDia.length > 2 ? `<div style="font-size:9px;color:var(--text3);">+${consultasDia.length-2} mais</div>` : ''}
      </div>`
    }
    html += '</div>'
    grid.innerHTML = html
  }
}

function abrirModalProf() {
  document.getElementById('modal-prof')?.classList.add('open')
}

function selectProfCor(cor) {
  document.querySelectorAll('#prof-cores > div').forEach(d => d.style.border = '2px solid transparent')
  const el = document.querySelector(`[data-cor="${cor}"]`)
  if (el) el.style.border = '3px solid var(--text)'
  const input = document.getElementById('prof-cor')
  if (input) input.value = cor
}

function salvarProfissional() {
  const nome = document.getElementById('prof-nome')?.value.trim()
  if (!nome) { alert('Preencha o nome'); return }
  const prof = {
    id: 'prof_' + Date.now(),
    nome,
    spec: document.getElementById('prof-spec')?.value.trim(),
    cro: document.getElementById('prof-cro')?.value.trim(),
    cor: document.getElementById('prof-cor')?.value || '#542F62',
    ativo: true
  }
  PROFISSIONAIS.push(prof)
  localStorage.setItem('odont_profs', JSON.stringify(PROFISSIONAIS))
  document.getElementById('modal-prof')?.classList.remove('open')
  agRenderProfs()
  agRenderGrid()
  alert(`✅ ${nome} adicionado(a) à agenda!`)
}

function agFiltrarProfs(modo) {
  AG.profsFiltro = []
  agRenderGrid()
}

// Override nav to init agenda
const _origNavAg = window.nav
window.nav = function(el, screen, title) {
  _origNavAg(el, screen, title)
  if (screen === 'agenda') setTimeout(agInit, 100)
  if (screen === 'cursos') setTimeout(loadCursos, 300)
}

// Update salvarAgendamento to include profissional
const _origSalvarAg = salvarAgendamento
window.salvarAgendamento = function() {
  _origSalvarAg()
  // After saving, refresh grid
  setTimeout(agRenderGrid, 200)
}

</script>
</body>
</html>
