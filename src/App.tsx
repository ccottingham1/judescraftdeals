import { useMemo, useState } from "react";
import { deals, stores, storeLogos, type Deal, type Store } from "./data/deals";

const money=(n:number)=>`$${n.toFixed(2)}`;
// If a self-hosted product image is missing, fall back to the original retailer URL.
const useSourceOnError=(d:Deal)=>(e:React.SyntheticEvent<HTMLImageElement>)=>{
  if(d.sourceImage&&e.currentTarget.src!==d.sourceImage)e.currentTarget.src=d.sourceImage;
};

function StoreBadge({store}:{store:Store}){
  return <span className={`store-badge store-${store.toLowerCase().replaceAll(" ","-")}`}>
    <b>{store}</b><img src={storeLogos[store]} alt={`${store} logo`}/>
  </span>
}

function Card({deal,large,onOpen}:{deal:Deal;large?:boolean;onOpen:(d:Deal)=>void}) {
  const pct=Math.round((1-deal.sale/deal.regular)*100);
  return <article className={`deal-card ${large?"large":""}`} onClick={()=>onOpen(deal)}>
    <div className="deal-photo">
      <img src={deal.image} alt={deal.title} loading={large?"eager":"lazy"} onError={useSourceOnError(deal)}/>
      <span className="discount">{pct}% off</span>
      <span className="craft-tag">{deal.kind}</span>
      {deal.fresh&&<span className="new-flag">New today</span>}
    </div>
    <div className="deal-info">
      <div className="store-line"><StoreBadge store={deal.store}/><span>Online</span></div>
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
  const [selected,setSelected]=useState<Deal|null>(null);
  const featured=deals.filter(d=>(1-d.sale/d.regular)>=.33)
    .sort((a,b)=>(1-b.sale/b.regular)-(1-a.sale/a.regular)).slice(0,9);
  const feed=useMemo(()=>deals.filter(d=>
    (craft==="All"||d.craft===craft)&&(kind==="All supplies"||d.kind===kind)&&(store==="All stores"||d.store===store)&&
    `${d.title} ${d.store} ${d.kind} ${d.detail}`.toLowerCase().includes(query.toLowerCase())
  ).sort((a,b)=>b.id-a.id),[craft,kind,store,query]);

  return <main>
    <header>
      <a className="brand" href="#top"><span>J</span><b>Jude’s Craft Deals</b></a>
      <nav><a href="#featured">Top deals</a><a href="#all">All deals</a><a href="#garage-sales">Garage sales</a><a href="#stores">Stores</a></nav>
      <a className="header-search" href="#all">Search deals ⌕</a>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">EDMOND + ONLINE · REFRESHED JULY 20, 2026 AT 10:00 PM CENTRAL</p>
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
      <div className="featured-grid">{featured.map((d,i)=><Card key={d.id} deal={d} large={i===0} onOpen={setSelected}/>)}</div>
    </section>

    <section className="all-deals" id="all">
      <div className="section-title"><div><p>VERIFIED DEAL FEED</p><h2>Search everything</h2></div><span>Newest verified additions first · next audit tomorrow at 5 AM</span></div>
      <div className="deal-tools">
        <label className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search yarn, seed beads, tools, store…"/></label>
        <select value={craft} onChange={e=>setCraft(e.target.value)} aria-label="Filter by craft"><option>All</option><option>Crochet</option><option>Beading</option></select>
        <select value={kind} onChange={e=>setKind(e.target.value)} aria-label="Filter by supply type"><option>All supplies</option><option>Yarn</option><option>Crochet tools</option><option>Single-color beads</option><option>Bead assortments</option><option>Stringing</option><option>Beading tools</option><option>Craft machines</option></select>
        <select value={store} onChange={e=>setStore(e.target.value)} aria-label="Filter by store"><option>All stores</option><option>Walmart</option><option>Michaels</option><option>Hobby Lobby</option><option>Hobbii</option></select>
        <b>{feed.length} results</b>
      </div>
      <div className="dense-grid">{feed.map(d=><Card key={d.id} deal={d} onOpen={setSelected}/>)}</div>
      {!feed.length&&<div className="empty">No deals match that search. Try a product type or store name.</div>}
    </section>

    <section className="garage-sales" id="garage-sales">
      <div className="section-title"><div><p>CRAFT-SUPPLY SIDE QUEST</p><h2>Garage &amp; estate sales</h2></div><span>Only active or upcoming listings</span></div>
      <article className="garage-card">
        <div><span className="garage-date">ACTIVE THROUGH JULY 23</span><h3>Signature Eclectic</h3><p>Multi-family online estate sale advertising crafting supplies, furniture, housewares, décor and pottery.</p></div>
        <div><b>Oklahoma City, OK 73114</b><span>Listing checked July 19, 2026</span><a href="https://garagesalefinder.com/s/NIjoC/oklahoma-city-ok-73114" target="_blank" rel="noreferrer">Open sale advertisement ↗</a></div>
      </article>
      <p className="garage-note">Sale inventory changes quickly. The link goes to the original advertisement; confirm its status before driving or bidding.</p>
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
