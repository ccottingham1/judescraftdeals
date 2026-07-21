import { useMemo, useState } from "react";
import { deals, garageSales, meta, stores, storeLogos, type Deal, type Store } from "./data/deals";

const money=(n:number)=>`$${n.toFixed(2)}`;
// "New today" is only true on the calendar day (Central) the deal was added;
// comparing against the verified date auto-expires the badge between audits.
const todayCentral=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"America/Chicago"});
// If a self-hosted product image is missing, fall back to the original retailer URL.
const useSourceOnError=(d:Deal)=>(e:React.SyntheticEvent<HTMLImageElement>)=>{
  if(d.sourceImage&&e.currentTarget.src!==d.sourceImage)e.currentTarget.src=d.sourceImage;
};

function StoreBadge({store}:{store:Store}){
  return <span className={`store-badge store-${store.toLowerCase().replaceAll(" ","-")}`}>
    <b>{store}</b><img src={storeLogos[store]} alt={`${store} logo`}/>
  </span>
}

function Card({deal,large,saved,onToggleSave,onOpen}:{deal:Deal;large?:boolean;saved:boolean;onToggleSave:(d:Deal)=>void;onOpen:(d:Deal)=>void}) {
  const pct=Math.round((1-deal.sale/deal.regular)*100);
  return <article className={`deal-card ${large?"large":""}`} onClick={()=>onOpen(deal)}>
    <div className="deal-photo">
      <img src={deal.image} alt={deal.title} loading={large?"eager":"lazy"} onError={useSourceOnError(deal)}/>
      <span className="discount">{pct}% off</span>
      <span className="craft-tag">{deal.kind}</span>
      {deal.fresh&&deal.verified===todayCentral&&<span className="new-flag">New today</span>}
      <button className={`save-heart ${saved?"saved":""}`} aria-pressed={saved} aria-label={saved?"Remove from wishlist":"Save to wishlist"} onClick={e=>{e.stopPropagation();onToggleSave(deal);}}>{saved?"♥":"♡"}</button>
    </div>
    <div className="deal-info">
      <div className="store-line"><StoreBadge store={deal.store}/><span>{deal.availability??"Online"}</span></div>
      <h3>{deal.title}</h3><p>{deal.detail}</p>
      <div className="price"><strong>{money(deal.sale)}</strong><s>{money(deal.regular)}</s><em>Save {money(deal.regular-deal.sale)}</em></div>
      <span className="promo">Verified {deal.verified}</span>
      <button>Deal details <span>→</span></button>
    </div>
  </article>
}

function Chicken(){
  return <div className="chicken-egg" aria-label="Chicken the brown tabby cat easter egg">
    <span className="chicken-label">Chicken <i>↘</i></span>
    <img src="chicken-v2.png" alt="Chicken, Jude’s brown tabby cat"/>
  </div>
}

export default function Home(){
  const [query,setQuery]=useState("");
  const [craft,setCraft]=useState("All");
  const [kind,setKind]=useState("All supplies");
  const [store,setStore]=useState("All stores");
  const [avail,setAvail]=useState("All availability");
  const [selected,setSelected]=useState<Deal|null>(null);
  const [wishlist,setWishlist]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem("jcd-wishlist")||"[]")}catch{return []}});
  const [wishOnly,setWishOnly]=useState(false);
  const toggleSave=(d:Deal)=>setWishlist(w=>{
    const next=w.includes(d.url)?w.filter(u=>u!==d.url):[...w,d.url];
    try{localStorage.setItem("jcd-wishlist",JSON.stringify(next))}catch{/* private mode */}
    return next;
  });
  // Rank genuine limited-time discounts above everyday/perpetual "sale" prices.
  const genuine=(d:Deal)=>d.saleType==="everyday"?0:1;
  const featured=deals.filter(d=>(1-d.sale/d.regular)>=.33)
    .sort((a,b)=>genuine(b)-genuine(a)||(1-b.sale/b.regular)-(1-a.sale/a.regular)).slice(0,9);
  const feed=useMemo(()=>deals.filter(d=>
    (craft==="All"||d.craft===craft)&&(kind==="All supplies"||d.kind===kind)&&(store==="All stores"||d.store===store)&&
    (avail==="All availability"||(d.availability??"Online")===avail)&&
    (!wishOnly||wishlist.includes(d.url))&&
    `${d.title} ${d.store} ${d.kind} ${d.detail}`.toLowerCase().includes(query.toLowerCase())
  ).sort((a,b)=>b.id-a.id),[craft,kind,store,avail,query,wishOnly,wishlist]);

  return <main>
    <header>
      <a className="brand" href="#top"><span>J</span><b>Jude’s Craft Deals</b></a>
      <nav><a href="#featured">Top deals</a><a href="#all">All deals</a><a href="#garage-sales">Garage sales</a><a href="#stores">Stores</a></nav>
      <a className="header-search" href="#all">Search deals ⌕</a>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">EDMOND + ONLINE · LAST CHECKED {meta.lastChecked.toUpperCase()}</p>
        <h1>Craft supplies.<br/><em>Better prices.</em></h1>
        <p>Individually checked crochet and beading offers with exact product listings and photos.</p>
        <a href="#featured">Browse the deals <span>↓</span></a>
      </div>
      <div className="hero-collage">
        <img src="hero-yarn.avif" alt="Red Heart Amethyst yarn"/>
        <img src="hero-beads.avif" alt="Clear Bead Landing seed beads"/>
        <div className="heart-stamp"><i aria-hidden="true"/><span>For Jude<br/><small>from Connor</small></span></div>
      </div>
      <Chicken/>
    </section>

    <section className="featured" id="featured">
      <div className="section-title"><div><p>33% OFF OR BETTER</p><h2>Worth checking first</h2></div><span>Only the strongest verified discounts</span></div>
      <div className="featured-grid">{featured.map((d,i)=><Card key={d.id} deal={d} large={i===0} saved={wishlist.includes(d.url)} onToggleSave={toggleSave} onOpen={setSelected}/>)}</div>
    </section>

    <section className="all-deals" id="all">
      <div className="section-title"><div><p>VERIFIED DEAL FEED</p><h2>Search everything</h2></div><span>Newest verified additions first · last checked {meta.lastChecked}</span></div>
      <div className="deal-tools">
        <label className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search yarn, seed beads, tools, store…"/></label>
        <select value={craft} onChange={e=>setCraft(e.target.value)} aria-label="Filter by craft"><option>All</option><option>Crochet</option><option>Beading</option></select>
        <select value={kind} onChange={e=>setKind(e.target.value)} aria-label="Filter by supply type"><option>All supplies</option><option>Yarn</option><option>Crochet tools</option><option>Single-color beads</option><option>Bead assortments</option><option>Stringing</option><option>Beading tools</option><option>Craft machines</option></select>
        <select value={store} onChange={e=>setStore(e.target.value)} aria-label="Filter by store"><option>All stores</option><option>Walmart</option><option>Michaels</option><option>Hobby Lobby</option><option>Hobbii</option></select>
        <select value={avail} onChange={e=>setAvail(e.target.value)} aria-label="Filter by availability"><option>All availability</option><option>Online</option><option>In-store nearby</option></select>
        <button className={`wishlist-toggle ${wishOnly?"active":""}`} aria-pressed={wishOnly} onClick={()=>setWishOnly(w=>!w)}>♥ Saved{wishlist.length?` (${wishlist.length})`:""}</button>
        <b>{feed.length} results</b>
      </div>
      <div className="dense-grid">{feed.map(d=><Card key={d.id} deal={d} saved={wishlist.includes(d.url)} onToggleSave={toggleSave} onOpen={setSelected}/>)}</div>
      {!feed.length&&<div className="empty">{wishOnly?"No saved deals yet. Tap the ♡ on any deal card to save it for Jude's wishlist.":"No deals match that search. Try a product type or store name."}</div>}
    </section>

    <section className="garage-sales" id="garage-sales">
      <div className="section-title"><div><p>CRAFT-SUPPLY SIDE QUEST</p><h2>Garage &amp; estate sales</h2></div><span>Only active or upcoming listings</span></div>
      {garageSales.map(s=><article className="garage-card" key={s.id}>
        <div><span className="garage-date">{s.status}</span><h3>{s.name}</h3><p>{s.blurb}</p></div>
        <div><b>{s.area}</b><span>Listing checked {s.checked}</span><a href={s.url} target="_blank" rel="noreferrer">Open sale advertisement ↗</a></div>
      </article>)}
      {!garageSales.length&&<div className="garage-empty">No active craft-supply sales right now. New Edmond/OKC listings get added here as they appear — worth a peek after the next refresh.</div>}
      {garageSales.length===1&&<p className="garage-note">Only one active sale right now — new Edmond/OKC listings get added as they appear.</p>}
      {garageSales.length>0&&<p className="garage-note">Sale inventory changes quickly. The link goes to the original advertisement; confirm its status before driving or bidding.</p>}
    </section>

    <section className="store-strip" id="stores">
      <div><p>NEARBY STORES</p><h2>Directions from Edmond</h2><small>Check pickup availability on the product listing before driving.</small></div>
      {Object.entries(stores).map(([key,s])=><a href={s.maps} target="_blank" rel="noreferrer" key={key}><b>{s.name}</b><span>{s.address}</span><em>Route in Maps ↗</em></a>)}
    </section>

    <footer><div className="brand"><span>J</span><b>Jude’s Craft Deals</b></div><p>Prices and stock can change. Every card links to the exact product page; confirm before ordering or driving.</p></footer>

    {selected&&<div className="modal-backdrop" onMouseDown={()=>setSelected(null)}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={`${selected.title} details`} onMouseDown={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setSelected(null)} aria-label="Close">×</button>
        <img src={selected.image} alt={selected.title} onError={useSourceOnError(selected)}/>
        <div className="modal-copy">
          <div className="modal-meta"><StoreBadge store={selected.store}/><span>{selected.craft}</span></div><h2>{selected.title}</h2>
          <div className="modal-price"><strong>{money(selected.sale)}</strong><s>{money(selected.regular)}</s></div>
          {selected.saleType&&<p className={`price-note ${selected.saleType}`}>{selected.saleType==="everyday"
            ?"Everyday sale price — this store runs this discount most of the time, so no rush."
            :"Genuine limited-time or clearance discount — likely gone once stock sells out."}</p>}
          <p className="description">{selected.detail}. Price, comparison price, photo and listing checked {selected.verified}.</p>
          {selected.store==="Hobbii"?
            <div className="location"><span>ONLINE ONLY</span><b>Ships from Hobbii</b><p>{selected.shipping}. The card price does not include tax or shipping.</p></div>:
            <div className="location"><span>ORDER / CHECK PICKUP</span><b>Exact retailer product page</b><p>Local inventory is not assumed. Select an Edmond-area store on the retailer page to confirm pickup.</p></div>}
          <a className="retailer" href={selected.url} target="_blank" rel="noreferrer">Open Product ↗</a>
        </div>
      </section>
    </div>}
  </main>
}
