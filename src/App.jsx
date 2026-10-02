import React, { useEffect, useMemo, useRef, useState } from 'react'

const ASSET = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const events = [
  { id:'mehendi', title:'Mehendi', date:'22 Feb 2026', time:'10:00 AM', place:'The Grand Lawn', image:ASSET('images/mehendi.jpg'), tone:'sage', description:'An intimate afternoon of mehendi, florals, laughter and close family moments.' },
  { id:'haldi', title:'Haldi', date:'23 Feb 2026', time:'10:00 AM', place:'Sunset Villa', image:ASSET('images/haldi.jpg'), tone:'sun', description:'A golden morning filled with haldi, playful rituals and candid family photographs.' },
  { id:'sangeet', title:'Sangeet', date:'23 Feb 2026', time:'07:00 PM', place:'Royal Banquet', image:ASSET('images/sangeet.jpg'), tone:'violet', description:'Music, movement and a night of performances under velvet-blue lights.' },
  { id:'wedding', title:'Wedding', date:'24 Feb 2026', time:'07:00 PM', place:'The Grand Palace', image:ASSET('images/wedding.jpg'), tone:'rose', description:'The ceremony that brings both families together for the beginning of forever.' },
  { id:'reception', title:'Reception', date:'25 Feb 2026', time:'08:00 PM', place:'Royal Banquet', image:ASSET('images/finale.jpg'), tone:'copper', description:'A candlelit dinner, hugs, photographs and one last celebration.' }
]

const gallery = [
  {cat:'Story', image:ASSET('images/hero.jpg'), title:'A quiet beginning'},
  {cat:'Mehendi', image:ASSET('images/mehendi.jpg'), title:'Henna & laughter'},
  {cat:'Haldi', image:ASSET('images/haldi.jpg'), title:'Sunshine ritual'},
  {cat:'Sangeet', image:ASSET('images/sangeet.jpg'), title:'Dance under the lights'},
  {cat:'Wedding', image:ASSET('images/wedding.jpg'), title:'The ceremony'},
  {cat:'Finale', image:ASSET('images/finale.jpg'), title:'One last sunset'}
]

function Icon({name,size=20}){
  const common={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'}
  const paths={
    home:<><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.8V21h13V9.8"/><path d="M9.5 21v-6h5v6"/></>,
    heart:<><path d="M20.8 8.6c0 5.8-8.8 10.2-8.8 10.2S3.2 14.4 3.2 8.6A4.9 4.9 0 0 1 12 6.1a4.9 4.9 0 0 1 8.8 2.5Z"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
    image:<><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m5 17 4.5-4 3 3 2.5-2 4 3"/></>,
    map:<><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></>,
    music:<><path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    mail:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></>,
    arrow:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    play:<path d="m8 5 11 7-11 7Z"/>,
    pause:<><path d="M8 5v14M16 5v14"/></>,
    volume:<><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19 7a7 7 0 0 1 0 10"/></>,
    x:<><path d="m6 6 12 12M18 6 6 18"/></>,
    chevron:<path d="m9 18 6-6-6-6"/>,
    clock:<><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></>,
    share:<><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></>,
    check:<path d="m6 12 4 4 8-8"/>,
    gift:<><rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M12 10v10M3 10h18M5 6.5h14a2 2 0 0 1 0 4H5a2 2 0 0 1 0-4Z"/><path d="M12 6.5c-2.8 0-5-1.1-5-2.6S8.3 1.5 10 3c1.6 1.5 2 3.5 2 3.5ZM12 6.5c2.8 0 5-1.1 5-2.6S15.7 1.5 14 3c-1.6 1.5-2 3.5-2 3.5Z"/></>,
  }
  return <svg {...common}>{paths[name] || paths.heart}</svg>
}

function App(){
  const audioRef=useRef(null)
  const [started,setStarted]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)
  const [playing,setPlaying]=useState(false)
  const [activeEvent,setActiveEvent]=useState(null)
  const [lightbox,setLightbox]=useState(null)
  const [filter,setFilter]=useState('All')
  const [toast,setToast]=useState('')
  const [rsvp,setRsvp]=useState({name:'',guests:'2',attend:'Yes',message:''})

  const filters=['All','Story','Mehendi','Haldi','Sangeet','Wedding','Finale']
  const filteredGallery=useMemo(()=> filter==='All'?gallery:gallery.filter(x=>x.cat===filter),[filter])

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('in-view')
    }),{threshold:0.12})
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el))
    return ()=>obs.disconnect()
  },[started])

  useEffect(()=>{
    const a=audioRef.current
    if(!a) return
    a.loop=true
    a.volume=.72
    const tryAutoplay=()=>a.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))
    tryAutoplay()
    return ()=>a.pause()
  },[started])

  useEffect(()=>{
    const onKey=e=>{
      if(e.key==='Escape'){setActiveEvent(null);setLightbox(null)}
      if(lightbox && e.key==='ArrowRight') changeLightbox(1)
      if(lightbox && e.key==='ArrowLeft') changeLightbox(-1)
    }
    window.addEventListener('keydown',onKey)
    return ()=>window.removeEventListener('keydown',onKey)
  })

  const nav=id=>{
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
    setMenuOpen(false)
  }
  const notify=msg=>{setToast(msg);setTimeout(()=>setToast(''),2600)}
  const toggleMusic=async()=>{
    const a=audioRef.current
    if(!a) return
    if(a.paused){try{await a.play();setPlaying(true)}catch{notify('Tap again to allow music')}}
    else{a.pause();setPlaying(false)}
  }
  const enter=async()=>{
    setStarted(true)
    requestAnimationFrame(()=>window.scrollTo({top:0}))
    const a=audioRef.current
    try{await a.play();setPlaying(true)}catch{}
  }
  const saveDate=()=>{
    const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20260224T190000\nDTEND:20260224T220000\nSUMMARY:Harsh & Aaravi — Wedding\nLOCATION:The Grand Palace, Meerut, Uttar Pradesh\nEND:VEVENT\nEND:VCALENDAR`
    const blob=new Blob([ics],{type:'text/calendar'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a');a.href=url;a.download='Harsh-Aaravi-Wedding.ics';a.click();URL.revokeObjectURL(url)
    notify('Wedding date file downloaded')
  }
  const submitRsvp=e=>{
    e.preventDefault()
    if(!rsvp.name.trim()) return notify('Please enter your name')
    notify(`Thank you, ${rsvp.name}. RSVP saved.`)
  }
  const shareSite=async()=>{
    const data={title:'Knot & Katha',text:'Stories worth inviting people to.',url:location.href}
    if(navigator.share){try{await navigator.share(data);return}catch{}}
    try{await navigator.clipboard.writeText(location.href);notify('Website link copied')}catch{notify('Share link: '+location.href)}
  }
  const changeLightbox=dir=>{
    if(!lightbox)return
    const idx=gallery.findIndex(g=>g.title===lightbox.title)
    const next=gallery[(idx+dir+gallery.length)%gallery.length]
    setLightbox(next)
  }

  if(!started) return <>
    <audio ref={audioRef} src="wedding-song.m4a" preload="auto" />
    <div className="gate">
      <div className="gate-noise" />
      <div className="gate-orb orb-a"/><div className="gate-orb orb-b"/>
      <div className="gate-card reveal in-view">
        <p className="eyebrow">A wedding story by Knot & Katha</p>
        <h1>Harsh <span>&</span> Aaravi</h1>
        <p className="gate-date">24 FEB 2026 · THE GRAND PALACE, MEERUT</p>
        <div className="gate-visual"><img src={ASSET('images/hero.jpg')} alt="AI generated wedding couple"/></div>
        <button className="btn btn-primary glow" onClick={enter}><span>Enter the experience</span><Icon name="arrow"/></button>
        <p className="gate-note">Tap to open · music starts with your first touch</p>
      </div>
    </div>
  </>

  return <div className="site">
    <audio ref={audioRef} src="wedding-song.m4a" preload="auto" />
    <div className="grain"/>
    <div className="petals" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i} style={{'--i':i}}/>)}</div>

    <header className="topbar">
      <div className="brand" onClick={()=>nav('home')}><div className="brand-mark">✦</div><div><strong>Knot & Katha</strong><small>Stories worth inviting people to.</small></div></div>
      <nav className={menuOpen?'nav open':'nav'}>
        {[['home','Home','home'],['story','Story','heart'],['events','Events','calendar'],['gallery','Gallery','image'],['venue','Venue','map'],['rsvp','RSVP','mail']].map(([id,label,icon])=><button key={id} onClick={()=>nav(id)}><Icon name={icon} size={15}/>{label}</button>)}
      </nav>
      <div className="top-actions"><button className="icon-btn" onClick={toggleMusic} aria-label="Music"><Icon name={playing?'pause':'music'} size={18}/></button><button className="btn btn-small" onClick={()=>nav('rsvp')}>Let's celebrate <Icon name="arrow" size={15}/></button><button className="menu-btn" onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?'×':'☰'}</button></div>
    </header>

    <main>
      <section id="home" className="hero section-grid">
        <div className="hero-copy reveal">
          <span className="eyebrow">Together with our families</span>
          <h1>Knot <em>&</em> Katha</h1>
          <p className="hero-sub">A beautiful wedding story, designed like a living editorial.</p>
          <div className="couple-line"><span>Harsh</span><i>♥</i><span>Aaravi</span></div>
          <div className="hero-meta"><span>24 FEB 2026</span><span>MEERUT, UP</span></div>
          <div className="hero-actions"><button className="btn btn-primary" onClick={()=>nav('events')}>Explore our events <Icon name="arrow" size={15}/></button><button className="btn btn-ghost" onClick={shareSite}><Icon name="share" size={15}/> Share story</button></div>
          <div className="mini-stats"><div><strong>5</strong><span>celebrations</span></div><div><strong>∞</strong><span>little moments</span></div><div><strong>1</strong><span>new chapter</span></div></div>
        </div>
        <div className="hero-media reveal">
          <div className="hero-frame"><img src={ASSET('images/hero.jpg')} alt="AI generated wedding couple portrait"/><span className="frame-tag">AI wedding portrait · cinematic</span></div>
          <div className="floating-note note-1"><small>save the date</small><strong>24 · 02 · 2026</strong></div>
          <div className="floating-note note-2"><small>our mood</small><strong>lavender · dusty blue</strong></div>
        </div>
      </section>

      <section id="story" className="story section-shell">
        <div className="section-head reveal"><div><span className="eyebrow">The beginning</span><h2>Our story, in little scenes.</h2></div><button className="btn btn-ghost" onClick={()=>notify('Story timeline is ready to personalize')}>Personalize story</button></div>
        <div className="story-grid">
          <div className="story-image reveal tilt"><img src={ASSET('images/story.jpg')} alt="AI generated couple story scene"/></div>
          <div className="story-copy reveal">
            {[
              ['01','First meet','A conversation that started like any other, then stayed on our minds.'],
              ['02','Friendship','Long calls, road trips, shared jokes and the comfort of being ourselves.'],
              ['03','The proposal','A quiet question, a very loud yes, and a new chapter waiting to begin.']
            ].map(([n,t,d])=><div className="timeline-item" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}
            <button className="btn btn-primary" onClick={()=>nav('gallery')}>See the little moments <Icon name="arrow" size={15}/></button>
          </div>
        </div>
      </section>

      <section id="events" className="events section-shell alt">
        <div className="section-head reveal"><div><span className="eyebrow">Save the dates</span><h2>Every ritual gets its own frame.</h2></div><span className="section-kicker">scroll / hover / click</span></div>
        <div className="event-grid">
          {events.map((ev,i)=><article className={`event-card reveal ${ev.tone}`} style={{'--delay':`${i*70}ms`}} key={ev.id} onClick={()=>setActiveEvent(ev)}>
            <div className="event-image"><img src={ev.image} alt={`${ev.title} AI generated couple scene`}/><span className="event-index">0{i+1}</span><span className="event-wave"/></div>
            <div className="event-content"><div className="event-top"><span>{ev.date}</span><span>{ev.time}</span></div><h3>{ev.title}</h3><p>{ev.place}</p><button className="text-btn" onClick={(e)=>{e.stopPropagation();setActiveEvent(ev)}}>View details <Icon name="arrow" size={14}/></button></div>
          </article>)}
        </div>
      </section>

      <section id="gallery" className="gallery section-shell">
        <div className="section-head reveal"><div><span className="eyebrow">AI scene collection</span><h2>See the story from every angle.</h2></div><button className="btn btn-ghost" onClick={()=>nav('venue')}>Next: venue <Icon name="arrow" size={15}/></button></div>
        <div className="filter-row reveal">{filters.map(f=><button key={f} className={filter===f?'filter active':'filter'} onClick={()=>setFilter(f)}>{f}</button>)}</div>
        <div className="masonry reveal">{filteredGallery.map((g,i)=><button className="gallery-card" key={g.title} onClick={()=>setLightbox(g)}><img src={g.image} alt={g.title}/><span><small>{g.cat}</small>{g.title}</span></button>)}</div>
      </section>

      <section id="venue" className="venue section-shell alt">
        <div className="venue-art reveal"><img src={ASSET('images/venue.jpg')} alt="AI generated luxury wedding venue"/><div className="venue-badge"><span>The Grand Palace</span><small>Meerut · Uttar Pradesh</small></div></div>
        <div className="venue-copy reveal"><span className="eyebrow">Where we meet</span><h2>Golden hour, palace lights, and everyone we love.</h2><p>Come early for photographs, stay late for the stories. The venue section is designed as a living postcard, with the location, map and celebration schedule in one place.</p><div className="venue-actions"><button className="btn btn-primary" onClick={()=>window.open('https://www.google.com/maps/search/?api=1&query=The+Grand+Palace+Meerut','_blank')}>Open Google Maps <Icon name="arrow" size={15}/></button><button className="btn btn-ghost" onClick={()=>notify('Venue details copied to your clipboard')}><Icon name="share" size={15}/> Share venue</button></div><div className="venue-points"><span>Luxury setting</span><span>Easy location</span><span>Photo-ready ambience</span></div></div>
      </section>

      <section id="rsvp" className="rsvp section-shell">
        <div className="rsvp-intro reveal"><span className="eyebrow">Your seat is waiting</span><h2>Will you join us?</h2><p>Every response gets its own little spark. Submit the form and the page turns the moment into a keepsake.</p><button className="btn btn-ghost" onClick={saveDate}><Icon name="calendar" size={15}/> Save wedding date</button></div>
        <form className="rsvp-card reveal" onSubmit={submitRsvp}><div className="rsvp-glow"/><label>Name<input value={rsvp.name} onChange={e=>setRsvp({...rsvp,name:e.target.value})} placeholder="Your full name"/></label><label>Guests<select value={rsvp.guests} onChange={e=>setRsvp({...rsvp,guests:e.target.value})}><option>1</option><option>2</option><option>3</option><option>4+</option></select></label><label>Will you attend?<select value={rsvp.attend} onChange={e=>setRsvp({...rsvp,attend:e.target.value})}><option>Yes</option><option>No</option><option>Maybe</option></select></label><label>Message<textarea value={rsvp.message} onChange={e=>setRsvp({...rsvp,message:e.target.value})} placeholder="Leave a note for the couple"/></label><button className="btn btn-primary full" type="submit">Send RSVP <Icon name="arrow" size={15}/></button></form>
      </section>

      <section className="music-panel section-shell alt">
        <div className="vinyl reveal"><div className={playing?'record spinning':'record'}><div className="record-label">♪</div></div><div className="needle"/></div>
        <div className="music-copy reveal"><span className="eyebrow">Press play & wander</span><h2>Our special song.</h2><p>Use the floating music control at any time. The uploaded song is included locally with the project.</p><div className="player-row"><button className="circle-btn" onClick={toggleMusic}><Icon name={playing?'pause':'play'} size={20}/></button><div><strong>{playing?'Now playing':'Ready to play'}</strong><span>Uploaded wedding track · autoplay attempts after entry</span></div></div><div className="player-actions"><button className="btn btn-primary" onClick={toggleMusic}>{playing?'Pause music':'Play music'} <Icon name={playing?'pause':'play'} size={15}/></button><button className="btn btn-ghost" onClick={()=>notify('Music will continue as you explore')}>Keep it playing</button></div></div>
      </section>

      <section className="finale section-shell reveal"><div className="finale-bg"><img src={ASSET('images/finale.jpg')} alt="AI generated wedding finale scene"/></div><div className="finale-card"><span className="eyebrow">The last frame</span><h2>Good things take time,<br/>just like our forever.</h2><p>Thank you for stepping into our story.</p><div className="finale-actions"><button className="btn btn-primary" onClick={()=>nav('home')}>Back to beginning <Icon name="arrow" size={15}/></button><button className="btn btn-ghost" onClick={shareSite}><Icon name="share" size={15}/> Share Knot & Katha</button></div></div></section>
    </main>

    <footer className="footer"><div><div className="brand"><div className="brand-mark">✦</div><div><strong>Knot & Katha</strong><small>Stories worth inviting people to.</small></div></div><p>Luxury digital wedding stories, crafted to feel alive.</p></div><div className="footer-links"><button onClick={()=>nav('home')}>Home</button><button onClick={()=>nav('events')}>Events</button><button onClick={()=>nav('gallery')}>Gallery</button><button onClick={()=>nav('venue')}>Venue</button><button onClick={()=>nav('rsvp')}>RSVP</button></div><div className="footer-contact"><button onClick={()=>window.open('https://wa.me/916396486200','_blank')}><Icon name="share" size={16}/> WhatsApp</button><button onClick={()=>window.location.href='mailto:knotkatha@gmail.com'}><Icon name="mail" size={16}/> Email</button></div><div className="footer-bottom"><span>© 2026 Knot & Katha</span><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back to top ↑</button></div></footer>

    {activeEvent&&<div className="modal-backdrop" onClick={()=>setActiveEvent(null)}><div className="modal event-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setActiveEvent(null)}><Icon name="x" size={18}/></button><img src={activeEvent.image} alt=""/><div className="modal-copy"><span className="eyebrow">{activeEvent.date} · {activeEvent.time}</span><h3>{activeEvent.title}</h3><p>{activeEvent.description}</p><p className="modal-place">{activeEvent.place}</p><button className="btn btn-primary" onClick={()=>{setActiveEvent(null);nav('rsvp')}}>RSVP for this event <Icon name="arrow" size={15}/></button></div></div></div>}

    {lightbox&&<div className="modal-backdrop lightbox-backdrop" onClick={()=>setLightbox(null)}><button className="modal-close" onClick={()=>setLightbox(null)}><Icon name="x" size={22}/></button><button className="lb-nav lb-left" onClick={e=>{e.stopPropagation();changeLightbox(-1)}}>‹</button><div className="lightbox" onClick={e=>e.stopPropagation()}><img src={lightbox.image} alt={lightbox.title}/><div><small>{lightbox.cat}</small><strong>{lightbox.title}</strong></div></div><button className="lb-nav lb-right" onClick={e=>{e.stopPropagation();changeLightbox(1)}}>›</button></div>}
    {toast&&<div className="toast"><Icon name="check" size={17}/>{toast}</div>}
  </div>
}

export default App
