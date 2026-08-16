// All deal data, store info, and image references for Jude's Craft Deals.
// The refresh automation edits this file; UI code lives in src/App.tsx.

// Written by the refresh automation after every successful audit — the ONLY
// place the displayed freshness date lives. Never a promise about the next run.
export const meta = {
  lastChecked: "August 16, 2026 at 5:48 PM Central",
};

export type Craft = "Crochet" | "Beading";
export type Store = "Walmart" | "Michaels" | "Hobby Lobby" | "Hobbii";
export type LocalStore = Exclude<Store,"Hobbii">;
export type Kind = "Yarn" | "Crochet tools" | "Single-color beads" | "Bead assortments" | "Stringing" | "Beading tools" | "Craft machines";
export type Deal = {
  id:number; title:string; store:Store; craft:Craft; kind:Kind; regular:number; sale:number;
  image:string; url:string; detail:string; verified:string; fresh?:boolean; shipping?:string;
  // sourceImage: original retailer image URL, kept as fallback/reference for the local copy in image.
  sourceImage?:string;
  // availability: where the deal can be had. Defaults to "Online" when absent.
  availability?:"Online"|"In-store nearby";
  // saleType: "limited" = genuine limited-time/clearance discount;
  // "everyday" = perpetual/rotating sale price (e.g. Hobby Lobby's standing 50% off).
  // Omit when not determinable.
  saleType?:"everyday"|"limited";
};

export const photos = {
  clearBeads:"https://imgs.michaels.com/e8219b8a-f137-4403-adb8-1958d246299e.jpg?fit=inside|540:540",
  goldBeads:"https://imgs.michaels.com/ada3985a-b9b3-4b51-8c64-1ecbbb49221a.jpg?fit=inside|540:540",
  pliers:"https://imgs.michaels.com/c2ce5433-85d3-44c6-80d4-d1cda48b32d0.jpg?fit=inside|540:540",
  hooks22:"https://static.platform.michaels.com/2c-prd/en_US/457043023534448.jpeg",
  markers:"https://static.platform.michaels.com/2c-prd/en_US/6917767265391874224.jpeg",
  hooks31:"https://static.platform.michaels.com/2c-prd/39482760731232.jpeg",
  buff:"https://i5.walmartimages.com/seo/Red-Heart-Super-Saver-4-Medium-Acrylic-Yarn-Buff-7oz-198g-364-Yards_570839bc-025a-4ddf-b0b9-3706125896d7.5ab6b9d5a0745352b7078a68a8171183.jpeg",
  amethyst:"https://i5.walmartimages.com/seo/Red-Heart-Super-Saver-4-Medium-Acrylic-Yarn-Amethyst-7oz-198g-364-Yards_fb721216-44b0-4381-8bd9-e5d51e5264e2.47cd53e46339e8b16197e96af2c55c26.jpeg",
  orchid:"https://i5.walmartimages.com/seo/Red-Heart-Super-Saver-Acrylic-Orchid-Yarn-744-yd_8d1959a8-beee-4b10-93a8-19e7d89948e3.9401ec1726b2f8db440832775e1af1f1.jpeg",
  pliers5:"https://i5.walmartimages.com/seo/Jewelry-Pliers-Set-Making-Pliers-Tools-Kit-Includes-Round-Chain-Needle-Bent-Zipper-Pliers-for-Repair-Wire-Wrapping-DIY-Crafts_6220eba0-6d0e-4546-97c3-210af54148e2.6cbf95902987f8b12fcc77c565138151.jpeg",
  hooks59:"https://i5.walmartimages.com/seo/Weloille-Adult-Beginner-Crochet-Hook-Set-59-Pcs-Ergonomic-Crochet-Hooks-2-0-6-0-mm-and-0-6-1-9-mm-Lace-Steel-Needles-Complete-Crochet-Starter-Kit_7dc93098-a630-484f-9503-7c36a44dd38b.2bc0f0f0d5c490ea903aeef871c1bcb0.jpeg",
  kit73:"https://i5.walmartimages.com/seo/BCOOSS-Crochet-Kit-for-Beginners-Adults-73PCS-Crochet-Hook-Set-with-Crochet-Yarn-Canvas-Tote-Bag-Crochet-Accessories-and-Supplies_c05a1941-6097-4f9a-b09d-0bfaa33abcec.f2d411b1f0f7e8f64de132fb6ea669b9.png",
  hooks22color:"https://i5.walmartimages.com/seo/Techtongda-22pc-Colorful-Aluminum-Crochet-Hooks-Needles-Knit-Weave-Craft-Woolen-Yarn_90a95c28-f608-49e4-9772-c02d0e250a4d.a782c03f4098ad3b6d22d6e96f48d703.jpeg",
  czechBeads:"https://cdn.media.amplience.net/s/hobbylobby/1620608-80878353-01122026-IMGSET?fmt=webp&w=519&h=519&sm=mc",
  heartThreaders:"https://cdn.media.amplience.net/s/hobbylobby/2370013-81170396-04092024-IMGSET?fmt=webp&w=519&h=519&sm=mc",
  turquoiseCzech:"https://cdn.media.amplience.net/s/hobbylobby/839837-10299-01082026-IMGSET?fmt=webp&w=519&h=519&sm=mc",
  darkRedCzech:"https://cdn.media.amplience.net/s/hobbylobby/852731-10303-01082026-IMGSET?fmt=webp&w=519&h=519&sm=mc",
  transparentGlass:"https://i5.walmartimages.com/seo/Glass-Beads-Bulk-for-Bracelet-Making-Round-Transparent-Beads-Craft-DIY-Jewelry-Supplies-Birthday-Gift-for-Beader-8mm-600-pcs_6b5ff2cf-a6b1-4f2b-946e-5d385c25ebba.4c5a582d8ea78c029d0c4f4f7193058f.png",
  yarnWinder:"https://i5.walmartimages.com/seo/Electric-Yarn-Winder-Crocheting-Yarn-Ball-Winder-10-oz-Large-Capacity-Automatic-Yarn-Cake-Winder-Spinner-Baller-Roller-Swift-Spooler-Crocheting-Tools_1eefcd0b-a1ed-4456-8d28-97624aa24d2f.32038f24f1460c46e9c1b8f950f2a2c2.jpeg",
  beadSpinner:"https://static.platform.michaels.com/2c-prd/en_US/639399180016.jpeg",
  pearlWhite:"https://imgs.michaels.com/5a9364c3-09ba-4555-9bc8-48750fc10165.jpg?fit=inside|540:540",
  easyTouchHooks:"https://hobbii.com/cdn/shop/files/crochet-hook-set_830461d3-0e39-4bb8-9d64-2087362ad777.jpg?crop=center&height=557&v=1781787912&width=557",
  toucanYarn:"https://hobbii.com/cdn/shop/files/toucan-font.jpg?crop=center&height=557&v=1781867429&width=557",
  megaBallYarn:"https://hobbii.com/cdn/shop/files/mega_ball_front.jpg?crop=center&height=557&v=1781531430&width=557",
  metallicoYarn:"https://hobbii.com/cdn/shop/files/metallico-relabelled-front.jpg?crop=center&height=557&v=1781168423&width=557",
  friendsWheelYarn:"https://hobbii.com/cdn/shop/files/friends-wheel-front-oekotex.jpg?v=1781158533",
  unicornSolidYarn:"https://hobbii.com/cdn/shop/files/unicorn-solid-front-oekotex_dc2f1eda-df90-42e7-b194-001b4229a5db.jpg?v=1781773834",
  craftingAcrylicYarn:"https://hobbii.com/cdn/shop/files/crafting-acrylic-front_f0f8ed3f-c769-4602-9689-4b58b2c10db2.jpg?crop=center&height=557&v=1776911418&width=557",
  diabloWildYarn:"https://hobbii.com/cdn/shop/files/diablo-wild-print-front_50e569cb-47a7-47cf-8ac3-48e14906b24c.jpg?crop=center&height=557&v=1776875063&width=557",
  jellyCord:"https://cdn.media.amplience.net/s/hobbylobby/2584605-81247280-09112025-IMGSET?fmt=webp&h=544&sm=mc&w=544",
  vibrantCord:"https://cdn.media.amplience.net/s/hobbylobby/2498145-81217041-02202025-IMGSET?fmt=webp&h=544&sm=mc&w=544",
  stretchCord:"https://cdn.media.amplience.net/s/hobbylobby/2261428-81118681-IMGSET?fmt=webp&h=544&sm=mc&w=544",
  iridescentGlass:"https://cdn.media.amplience.net/s/hobbylobby/2035301-81024610-01072026-IMGSET?fmt=webp&h=544&sm=mc&w=544",
  sherryHooks:"https://i5.walmartimages.com/seo/Sherry-Crochet-Hooks-12-Sizes-Crochet-Hook-Set-41-Pack-Yarn-Crochet-Kit-Beginners-Knitting-Needles-Ergonomic-Handles-Arthritic-Hands-Crochet-Needle-K_4556e64c-4048-43e1-8ecd-cde9e8a3821d.c2a89331bb7db27ae1edb1240dc50632.jpeg?odnBg=FFFFFF&odnHeight=573&odnWidth=573",
  blueYarn:"https://i5.walmartimages.com/seo/Red-Heart-Super-Saver-4-Medium-Acrylic-Yarn-Blue-7oz-198g-364-Yards_f5e1c5a9-5e52-45ec-bb6a-0c8e4dbe3e60.e66f8131300aade25d7a583189b39213.jpeg?odnBg=FFFFFF&odnHeight=573&odnWidth=573",
  perfectPinkYarn:"https://i5.walmartimages.com/seo/Red-Heart-Super-Saver-Jumbo-Yarn-Perfect-Pink_0ed734b5-a51e-4593-b375-e87ad0cb5103.01b5fae111058666266803139e10e241.jpeg?odnBg=FFFFFF&odnHeight=573&odnWidth=573",
  tooriseSpinner:"https://i5.walmartimages.com/seo/Toorise-Electric-Wooden-Bead-Spinner-USB-Powered-Spin-Beading-Bowl-Kit-Adjustable-Speed-Direction-Spin-Bead-Loader-2-Beading-Needles-2000-Beads-Brace_9776b633-f524-4a70-8b67-0886c175268c.fcf45cd5ef53e303aa0b964554f14e93.jpeg?odnBg=FFFFFF&odnHeight=573&odnWidth=573",
  guozerSpinner:"https://i5.walmartimages.com/seo/Guozer-Clearance-Plastic-Spinning-Wheel-For-Beading-String-Seed-Beads-Quickly-And-Efficiently-For-Jewelry-Tassels_003b43a7-b203-41ac-925e-a90dec48052d.459e6a20d0ded00c8da50821f0696b80.jpeg?odnBg=FFFFFF&odnHeight=576&odnWidth=576",
  etudawSpinner:"https://static.platform.michaels.com/2c-prd/en_US/90785373329136.jpeg?fit=inside%7C540%3A540",
  hooks19:"https://static.platform.michaels.com/2c-prd/en_US/482080738889224.jpeg?fit=inside%7C540%3A540",
  tigerTailWire:"https://static.platform.michaels.com/2c-prd/145094586719632.jpeg?fit=inside%7C540%3A540",
  digitalHook:"https://static.platform.michaels.com/2c-prd/6108631301433.jpg?fit=inside%7C540%3A540",
  hearthHarborKit:"https://static.platform.michaels.com/2c-prd/212628789936352.jpg?fit=inside%7C540%3A540",
  beadReamers:"https://static.platform.michaels.com/2c-prd/227930153311632.jpeg",
  jewelryToolKit:"https://static.platform.michaels.com/2c-prd/549367282673376.jpeg",
  saffronYarn:"https://i5.walmartimages.com/seo/Red-Heart-Super-Saver-4-Medium-Acrylic-Yarn-Saffron-7oz-198g-364-Yards_93eaf2a0-6b3e-45be-a9e3-29f81e0cd708.043122b88f923bdd03ada472fdb912b3.jpeg?odnBg=FFFFFF&odnHeight=573&odnWidth=573",
  rafaellaPrint:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/rafaella-print-collage_6fc06311-a155-45f0-9019-17ada23bfbb5.jpg",
  coriandoli:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/coriandoli-front.jpg",
  panettone:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/panettone-front.jpg",
  cozyCake:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/cozy-cake-oekotex-front.jpg",
  florence:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/florence-collage_af0c31cf-9e72-4294-87b5-b5a0aa66c7e4.jpg",
  udon:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/udon-front-oekotex_66622bfc-7610-4ee6-baf1-b5ad73b18883.jpg",
  easyTouchBerry:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/easy-stitch-needles-main-crop--1_138e1a04-5ce3-4336-95a7-69abbcf385ee.jpg",
  bambooTunisianSet:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/bamboo-double-ended-tunisian-crochet-hook-20-cm--set_f92d8c0e-0ea2-4944-b360-ccfe48d8ef9d.jpg",
  pompomMaker:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/pompon-maker-larger_6f632247-f4dc-4c4d-b078-bbd312515e9d.jpg",
  gaugeRuler:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/img-6263-1200x1200px_68b24774-cc77-4fae-bbb0-97f8e324ddd6.jpg",
  heartMarkers:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/1693810912_spiral-stitch-marker-3.jpg",
  woolNeedles:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/hobbii-21-10-2021-0544_b20f7813-c759-457e-87f4-85247e97e267.jpg",
  tintTone:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/tint-and-tone-front-2_66ab4f38-459d-4ba0-afda-aae51a0d35ef.jpg",
  sunbird:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/sunbird-front-oekotex.jpg",
  dolceSockDots:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/dolce_sock_wool_front_816d44d6-eaf4-4d7f-8ecb-a6a16cdd3932.jpg",
  kindFeather:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/kind-feather-front-oekotex_ae09a307-76f7-4005-92bf-f4bc728ac709.jpg",
  diablo:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/Diabl-front-relabel.jpg",
  hobbiiYarnWinder:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/yarn-winder-4.jpg",
  bambooTunisian25:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/1745392390_0002-bamboo-tunisian-crochet-hook-25-cm--single-ended-5-0-mm-horizontal_d8fd67df-41a7-4f9c-a17e-f7a4e1150372.jpg",
  stoneMarkers:"https://cdn.shopify.com/s/files/1/0653/3087/2495/files/forside-markrer.jpg",
};

const rawDeals: Deal[] = [
  {id:1,title:"Clear Glass Seed Beads, 6/0 by Bead Landing",store:"Michaels",craft:"Beading",kind:"Single-color beads",regular:5.99,sale:2.99,image:"products/1.webp",sourceImage:photos.clearBeads,url:"https://www.michaels.com/product/clear-glass-seed-beads-60-by-bead-landing-10594049",detail:"Clear AB-finish glass beads · size 6/0 · 112-inch strand",verified:"July 18, 2026"},
  {id:2,title:"Light Gold Glass Seed Beads, 6/0 by Bead Landing",store:"Michaels",craft:"Beading",kind:"Single-color beads",regular:5.99,sale:4.49,image:"products/2.webp",sourceImage:photos.goldBeads,url:"https://www.michaels.com/product/light-gold-glass-seed-beads-60-by-bead-landing-10594047",detail:"Light-gold glass beads · size 6/0 · 100-inch strand",verified:"July 18, 2026"},
  {id:3,title:"Beadalon Nylon Jaw Flat Nose Pliers",store:"Michaels",craft:"Beading",kind:"Beading tools",regular:14.99,sale:5,image:"products/3.webp",sourceImage:photos.pliers,url:"https://www.michaels.com/product/beadalon-nylon-jaw-flat-nose-pliers-10157928",detail:"5.75-inch stainless-steel pliers with non-marring nylon jaws",verified:"July 18, 2026"},
  {id:4,title:"22-Piece Ergonomic Crochet Hook Set",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:30,sale:20.10,image:"products/4.webp",sourceImage:photos.hooks22,url:"https://www.michaels.com/product/22pcs-crochet-hooks-set-ergonomic-crochet-hook-kit-with-big-eye-needles-and-stitch-markers-525940932749836294",detail:"Ergonomic hooks, big-eye needles and stitch markers",verified:"July 18, 2026"},
  {id:5,title:"120-Piece Locking Stitch Marker Set",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:39.72,sale:26.61,image:"products/5.webp",sourceImage:photos.markers,url:"https://www.michaels.com/product/stitch-markers-for-knitting-and-crochet-120pcs-plastic-crochet-stitch-markers-locking-clips-with-12-colors-lightweight-snagfree-design-for-yarn-crafts-sweater-making-diy-projects-469536103326892038",detail:"12 marker colors, storage box and 9 big-eye needles",verified:"July 18, 2026"},
  {id:6,title:"31-Piece Crochet Hook Kit with Case",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:74.98,sale:56.23,image:"products/6.webp",sourceImage:photos.hooks31,url:"https://www.michaels.com/product/crochet-hooks-kit-31-piece-set-with-9-ergonomic-hook-sizes-6-yarn-needles-additional-knitting-crochet-supplies-and-carrying-case-228799475995230223",detail:"9 ergonomic hooks, 6 yarn needles, markers, tools and case",verified:"July 18, 2026"},
  {id:7,title:"Red Heart Super Saver Yarn · Buff",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.18,sale:3.76,image:"products/7.webp",sourceImage:photos.buff,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Acrylic-Buff-Yarn-1-Each/17209250",detail:"7 oz · 364 yd · medium acrylic yarn",verified:"July 18, 2026"},
  {id:8,title:"Red Heart Super Saver Yarn · Amethyst",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.18,sale:3.76,image:"products/8.webp",sourceImage:photos.amethyst,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Yarn-Medium-Acrylic-Amethyst-Yarn-364-yd/17209256",detail:"7 oz · 364 yd · medium acrylic yarn",verified:"July 18, 2026"},
  {id:9,title:"Red Heart Super Saver Jumbo Yarn · Orchid",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:8.99,sale:7.48,image:"products/9.webp",sourceImage:photos.orchid,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Yarn-Orchid/52870964",detail:"14 oz · 744 yd · jumbo acrylic skein",verified:"July 18, 2026"},
  {id:10,title:"5-Piece Jewelry Pliers Set",store:"Walmart",craft:"Beading",kind:"Beading tools",regular:22.99,sale:12.95,image:"products/10.webp",sourceImage:photos.pliers5,url:"https://www.walmart.com/ip/Jewelry-Pliers-Set-Making-Pliers-Tools-Kit-Includes-Round-Chain-Needle-Bent-Zipper-Pliers-for-Repair-Wire-Wrapping-DIY-Crafts/19893321629",detail:"Round, chain, needle, bent and zipper pliers for jewelry work",verified:"July 19, 2026"},
  {id:11,title:"Weloille 59-Piece Beginner Crochet Hook Set",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:20.99,sale:14.51,image:"products/11.webp",sourceImage:photos.hooks59,url:"https://www.walmart.com/ip/Weloille-Adult-Beginner-Crochet-Hook-Set-59-Pcs-Ergonomic-Crochet-Hooks-2-0-6-0-mm-and-0-6-1-9-mm-Lace-Steel-Needles-Complete-Crochet-Starter-Kit/20214605454",detail:"Ergonomic hooks, steel lace needles, yarn, markers and storage bag",verified:"July 20, 2026"},
  {id:12,title:"BCOOSS 73-Piece Crochet Kit with Yarn",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:39.99,sale:25.99,image:"products/12.webp",sourceImage:photos.kit73,url:"https://www.walmart.com/ip/BCOOSS-Crochet-Kit-for-Beginners-Adults-73PCS-Crochet-Hook-Set-with-Crochet-Yarn-Canvas-Tote-Bag-Crochet-Accessories-and-Supplies/9250422684",detail:"73-piece hook and yarn kit with crochet accessories and tote bag",verified:"July 20, 2026"},
  {id:13,title:"Techtongda 22-Piece Aluminum Crochet Hook Set",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:6.99,sale:4.99,image:"products/13.webp",sourceImage:photos.hooks22color,url:"https://www.walmart.com/ip/Techtongda-22pc-Colorful-Aluminum-Crochet-Hooks-Needles-Knit-Weave-Craft-Woolen-Yarn/260088219",detail:"22 aluminum hooks from 0.6 mm to 6.5 mm",verified:"July 19, 2026"},
  {id:14,title:"Czech Glass Seed Beads · 11/0 · Peach Ceylon",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:3.99,sale:2.69,image:"products/14.webp",sourceImage:photos.czechBeads,url:"https://www.hobbylobby.com/beads-jewelry/beads/czech-glass-beads/czech-glass-seed-beads---11-0/p/80878353",detail:"Single-color Czech glass rocaille beads for loom and off-loom beadwork",verified:"August 16, 2026",saleType:"everyday"},
  {id:15,title:"Heart Bead Threaders",store:"Hobby Lobby",craft:"Beading",kind:"Beading tools",regular:2.49,sale:1.49,image:"products/15.webp",sourceImage:photos.heartThreaders,url:"https://www.hobbylobby.com/beads-jewelry/jewelry-making-tools-adhesive/beading-needles/heart-bead-threaders/p/81170396",detail:"Two heart-shaped threaders for loading multiple beads onto cord",verified:"August 16, 2026",saleType:"everyday"},
  {id:16,title:"Opaque Turquoise Czech Glass Seed Beads · 11/0",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:3.49,sale:2.39,image:"products/16.webp",sourceImage:photos.turquoiseCzech,url:"https://www.hobbylobby.com/beads-jewelry/beads/czech-glass-beads/opaque-turquoise---czech-glass-seed-beads---11-0/p/10299",detail:"Single-color opaque turquoise Czech glass rocaille beads",verified:"August 16, 2026",saleType:"everyday"},
  {id:17,title:"Opaque Dark Red Czech Glass Seed Beads · 11/0",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:3.99,sale:2.69,image:"products/17.webp",sourceImage:photos.darkRedCzech,url:"https://www.hobbylobby.com/beads-jewelry/beads/czech-glass-beads/opaque-dark-red---czech-glass-seed-beads---11-0/p/10303",detail:"Single-color opaque dark-red Czech glass rocaille beads",verified:"August 16, 2026",saleType:"everyday"},
  {id:18,title:"Transparent Glass Beads · 8 mm · 600 Pieces",store:"Walmart",craft:"Beading",kind:"Bead assortments",regular:18.85,sale:15.08,image:"products/18.webp",sourceImage:photos.transparentGlass,url:"https://www.walmart.com/ip/Glass-Beads-Bulk-for-Bracelet-Making-Round-Transparent-Beads-Craft-DIY-Jewelry-Supplies-Birthday-Gift-for-Beader-8mm-600-pcs/15533055020",detail:"600 round transparent glass beads in assorted colors with 1 mm holes",verified:"July 19, 2026"},
  {id:19,title:"Electric Yarn Winder · 10 oz Capacity",store:"Walmart",craft:"Crochet",kind:"Craft machines",regular:29.99,sale:26.99,image:"products/19.webp",sourceImage:photos.yarnWinder,url:"https://www.walmart.com/ip/Electric-Yarn-Winder-Crocheting-Yarn-Ball-Winder-10-oz-Large-Capacity-Automatic-Yarn-Cake-Winder-Spinner-Baller-Roller-Swift-Spooler-Crocheting-Tools/13365454369",detail:"Automatic yarn-cake winder with stepless speed control and 10 oz capacity",verified:"July 19, 2026"},
  {id:20,title:"2-in-1 Electric Clay & Seed Bead Spinner",store:"Michaels",craft:"Beading",kind:"Craft machines",regular:73.48,sale:55.11,image:"products/20.webp",sourceImage:photos.beadSpinner,url:"https://www.michaels.com/product/clay-bead-spinner-and-seed-bead-spinner-2in1-electric-bead-spinner-for-jewelry-making-bracelet-spinner-and-necklace-making-machine-with-bead-needles-and-thread-pink-555713547863031815",detail:"USB-powered machine with separate modes for clay beads and seed beads",verified:"July 19, 2026"},
  {id:21,title:"Pearl White Glass Beads by Creatology",store:"Michaels",craft:"Beading",kind:"Single-color beads",regular:6.79,sale:5.09,image:"products/21.webp",sourceImage:photos.pearlWhite,url:"https://www.michaels.com/product/pearl-white-beads-by-creatology-10647291",detail:"274 pearl-white glass beads in 8 mm and 12 mm sizes · online-only sale",verified:"July 20, 2026"},
  {id:28,title:"Crafting Acrylic Yarn · Choose Color · Clearance",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:8.40,sale:4.20,image:"products/28.webp",sourceImage:photos.craftingAcrylicYarn,url:"https://hobbii.com/products/hp-1008980-crafting-acrylic",detail:"Discontinued 100% premium acrylic · 170 g / 347 m · while stock lasts",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more",saleType:"limited"},
  {id:29,title:"Diablo Wild Print Mohair Blend · Choose Color · Clearance",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:9.20,sale:4.13,image:"products/29.webp",sourceImage:photos.diabloWildYarn,url:"https://hobbii.com/products/hp-1004193-diablo-wild-print",detail:"Discontinued lace yarn · acrylic, mohair and polyamide · while stock lasts",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more",saleType:"limited"},
  {id:30,title:"Jelly Cord · Four 5-Yard Colors",store:"Hobby Lobby",craft:"Beading",kind:"Stringing",regular:5.49,sale:3.29,image:"products/30.webp",sourceImage:photos.jellyCord,url:"https://www.hobbylobby.com/beads-jewelry/stringing-materials/bead-cord/jelly-cord/p/81247280",detail:"Four 2 mm jelly cords in pink, orange, green and clear · current marked-price discount",verified:"August 16, 2026",saleType:"everyday"},
  {id:31,title:"Vibrant Jewelry Cord · 1 mm · Six Colors",store:"Hobby Lobby",craft:"Beading",kind:"Stringing",regular:6.99,sale:4.19,image:"products/31.webp",sourceImage:photos.vibrantCord,url:"https://www.hobbylobby.com/beads-jewelry/stringing-materials/bead-cord/vibrant-jewelry-cord---1mm/p/81217041",detail:"Six 5-yard fabric cords in bright colors · current marked-price discount",verified:"August 16, 2026",saleType:"everyday"},
  {id:32,title:"Multi-Color Stretch Cord · 1 mm",store:"Hobby Lobby",craft:"Beading",kind:"Stringing",regular:4.99,sale:2.99,image:"products/32.webp",sourceImage:photos.stretchCord,url:"https://www.hobbylobby.com/beads-jewelry/stringing-materials/bead-cord/multi-color-stretch-cord---1mm/p/81118681",detail:"One 15-yard spool of rainbow fabric stretch cord · current marked-price discount",verified:"August 16, 2026",saleType:"everyday"},
  {id:33,title:"Iridescent Glass Bead Strand",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:5.99,sale:3.59,image:"products/33.webp",sourceImage:photos.iridescentGlass,url:"https://www.hobbylobby.com/beads-jewelry/beads/glass-beads/iridescent-glass-bead-strand/p/81024610",detail:"One 7-inch strand of clear iridescent 8 x 6.5 mm barrel beads",verified:"August 16, 2026",saleType:"everyday"},
  {id:34,title:"Sherry 41-Piece Crochet Hook Kit · Blue Case",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:39.99,sale:12.99,image:"products/34.webp",sourceImage:photos.sherryHooks,url:"https://www.walmart.com/ip/14769457684",detail:"12 ergonomic hook sizes with yarn tools and a blue carrying case",verified:"July 20, 2026"},
  {id:35,title:"Red Heart Super Saver Yarn · Blue",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.99,sale:3.76,image:"products/35.webp",sourceImage:photos.blueYarn,url:"https://www.walmart.com/ip/17209269",detail:"7 oz · 364 yd · medium acrylic yarn · sold and shipped by Walmart",verified:"July 20, 2026"},
  {id:36,title:"Red Heart Super Saver Jumbo Yarn · Perfect Pink",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:8.99,sale:7.48,image:"products/36.webp",sourceImage:photos.perfectPinkYarn,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Jumbo-Yarn-Perfect-Pink/52871117",detail:"14 oz · 744 yd · jumbo acrylic skein · sold and shipped by Walmart",verified:"July 20, 2026"},
  {id:37,title:"Toorise USB Electric Wooden Bead Spinner Kit",store:"Walmart",craft:"Beading",kind:"Craft machines",regular:23.99,sale:17.29,image:"products/37.webp",sourceImage:photos.tooriseSpinner,url:"https://www.walmart.com/ip/Toorise-Electric-Wooden-Bead-Spinner-USB-Powered-Spin-Beading-Bowl-Kit-Adjustable-Speed-Direction-Spin-Bead-Loader-2-Beading-Needles-2000-Beads-Brace/7620014290",detail:"Adjustable speed and direction · 2 needles, thread and 2,000 beads included",verified:"July 20, 2026"},
  {id:38,title:"Guozer Seed Bead Spinning Wheel · Clearance",store:"Walmart",craft:"Beading",kind:"Craft machines",regular:5.67,sale:3.37,image:"products/38.webp",sourceImage:photos.guozerSpinner,url:"https://www.walmart.com/ip/Guozer-Clearance-Plastic-Spinning-Wheel-For-Beading-String-Seed-Beads-Quickly-And-Efficiently-For-Jewelry-Tassels/9796611613",detail:"Manual plastic spinning wheel for quickly loading seed beads onto string",verified:"July 20, 2026",saleType:"limited"},
  {id:39,title:"Etudaw Electric Clay Bead Spinner Kit · Pink",store:"Michaels",craft:"Beading",kind:"Craft machines",regular:69.48,sale:52.11,image:"products/39.webp",sourceImage:photos.etudawSpinner,url:"https://www.michaels.com/product/electric-bead-spinner-for-jewelry-making-automatic-clay-beads-for-cool-necklaces-and-bracelets-maker-beginner-bracelet-making-kit-diy-arts-and-crafts-birthday-giftspink-555310397604986886",detail:"Electric spinner with beads, needles, thread, scissors and USB cable",verified:"July 20, 2026"},
  {id:40,title:"19-Piece Ergonomic Soft-Grip Crochet Hook Kit",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:43.08,sale:32.31,image:"products/40.webp",sourceImage:photos.hooks19,url:"https://www.michaels.com/product/crochet-hooks-ergonomic-soft-grip-2mm6mm-metal-crochet-set-for-beginners-19pcs-knitting-yarn-hook-kit-w-stitch-marker-knitting-needles-for-arthritic-hands-best-diy-craft-gift-for-christmas-592722990136213512",detail:"2–6 mm soft-grip hooks with stitch markers and knitting needles",verified:"July 20, 2026"},
  {id:41,title:"7-Strand Tiger Tail Beading Wire · 300 ft",store:"Michaels",craft:"Beading",kind:"Stringing",regular:46.98,sale:35.23,image:"products/41.webp",sourceImage:photos.tigerTailWire,url:"https://www.michaels.com/product/300-ft-7strand-beading-wire-0018inch-046mm-tiger-tail-bead-stringing-wire-for-jewelry-making-threading-necklace-bracelet-crafts-350605082684325912",detail:"0.018-inch nylon-coated 7-strand stainless wire in light gray",verified:"July 20, 2026"},
  {id:42,title:"CraftBud Digital Counting Crochet Hook Set",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:32.99,sale:28.04,image:"products/42.webp",sourceImage:photos.digitalHook,url:"https://www.michaels.com/product/craftbud-digital-counting-crochet-hook-set-176476154871644180",detail:"Digital hook set that tracks stitches and rows while crocheting",verified:"July 20, 2026"},
  {id:43,title:"Hearth & Harbor DIY Crochet Kit · 20 Yarn Skeins",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:48.99,sale:41.64,image:"products/43.webp",sourceImage:photos.hearthHarborKit,url:"https://www.michaels.com/product/hearth-harbor-diy-crochet-kit-252554070871998465",detail:"20 skeins, 12 hooks, markers, row counter, needles, scissors and organizers",verified:"July 20, 2026"},
  {id:44,title:"5-Piece Bead Reamer Set",store:"Michaels",craft:"Beading",kind:"Beading tools",regular:40.98,sale:30.73,image:"products/44.webp",sourceImage:photos.beadReamers,url:"https://www.michaels.com/product/5-pieces-bead-reamer-for-jewelry-making-bead-spinner-hole-enlarger-tool-for-glass-plastic-metal-wood-beads-remove-burrs-enlarge-holes-smooth-edges-350478118143934470",detail:"Five reamers for smoothing and enlarging holes in glass, plastic, metal and wood beads",verified:"July 20, 2026"},
  {id:45,title:"Jewelry Making & Repair Tool Kit",store:"Michaels",craft:"Beading",kind:"Beading tools",regular:48.98,sale:36.73,image:"products/45.webp",sourceImage:photos.jewelryToolKit,url:"https://www.michaels.com/product/jewelry-making-supplies-kit-jewelry-repair-tool-with-accessories-jewelry-pliers-jewelry-findings-and-beading-wires-for-adults-and-beginners-266309178333577224",detail:"Pliers, tweezers, caliper, cord, wire, elastic and organized jewelry findings",verified:"July 20, 2026"},
  {id:46,title:"Red Heart Super Saver Yarn · Saffron",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.99,sale:3.77,image:"products/46.webp",sourceImage:photos.saffronYarn,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Medium-Acrylic-Saffron-Yarn-364-yd/844231803",detail:"7 oz · 364 yd · medium acrylic yarn · sold and shipped by Walmart",verified:"July 20, 2026"},
  {id:48,title:"Coriandoli Wool Blend Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:17.6,sale:7.04,image:"products/48.webp",sourceImage:photos.coriandoli,url:"https://hobbii.com/products/hp-1008228-coriandoli",detail:"52% wool / 48% acrylic chainette · 6 mm needles or 7 mm hook",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:49,title:"Panettone Glitter Cotton Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:6.4,sale:3.2,image:"products/49.webp",sourceImage:photos.panettone,url:"https://hobbii.com/products/hp-1005200-panettone",detail:"87% cotton with metallic glitter fibers · recommended 4.5 mm needles",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:50,title:"Cozy Cake Gradient Cake Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:28,sale:14,image:"products/50.webp",sourceImage:photos.cozyCake,url:"https://hobbii.com/products/hp-1009460-cozy-cake",detail:"80% acrylic / 20% wool · long, smooth color transitions through the cake",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:52,title:"Udon Super-Bulky Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:19.2,sale:9.6,image:"products/52.webp",sourceImage:photos.udon,url:"https://hobbii.com/products/hp-1006662-udon",detail:"80% acrylic / 20% wool super-bulky · rustic 1-ply with great stitch definition",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:55,title:"Hoop Jumbo Pompom Maker Set · 2 Sizes",store:"Hobbii",craft:"Crochet",kind:"Crochet tools",regular:18.4,sale:7.36,image:"products/55.webp",sourceImage:photos.pompomMaker,url:"https://hobbii.com/products/hp-1006942-hoop-jumbo-pompom-maker-set",detail:"Two jumbo pompom makers (14 and 20 cm) · discounted for cosmetic production scratches only",verified:"August 16, 2026",saleType:"limited",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:57,title:"Metal Heart Stitch Markers · Four Colors",store:"Hobbii",craft:"Crochet",kind:"Crochet tools",regular:11.2,sale:7.27,image:"products/57.webp",sourceImage:photos.heartMarkers,url:"https://hobbii.com/products/hp-1006530-metal-stitch-markers-hearts",detail:"Heart-shaped metal stitch markers in four matte colors",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:58,title:"Aluminium Jumbo Wool Needles",store:"Hobbii",craft:"Crochet",kind:"Crochet tools",regular:3.8,sale:1.9,image:"products/58.webp",sourceImage:photos.woolNeedles,url:"https://hobbii.com/products/hp-1004436-aluminium-wool-needles-jumbo",detail:"Large-eye wool needles (5, 6 and 7 mm) for joining thick yarn",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:59,title:"Tint & Tone Hand-Dyed Merino Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:27.83,sale:9.74,image:"products/59.webp",sourceImage:photos.tintTone,url:"https://hobbii.com/products/hp-1008315-tint-tone",detail:"100% superwash merino · super-bulky semi-solid hand-dyed · 8 mm needles",verified:"August 16, 2026",saleType:"limited",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:61,title:"Dolce Sock Wool Dots · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:16.8,sale:9.24,image:"products/61.webp",sourceImage:photos.dolceSockDots,url:"https://hobbii.com/products/hp-1002855-dolce-sock-wool-dots",detail:"75% wool / 25% polyamide sock yarn with speckled dots · 3 mm hook",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:64,title:"Hobbii Yarn Winder",store:"Hobbii",craft:"Crochet",kind:"Craft machines",regular:90.4,sale:45.2,image:"products/64.webp",sourceImage:photos.hobbiiYarnWinder,url:"https://hobbii.com/products/hp-1005267-yarn-winder-1005267",detail:"Winds yarn into stand-up center-pull cakes · clamps to your table",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:66,title:"Stitch Markers with Real Stones",store:"Hobbii",craft:"Crochet",kind:"Crochet tools",regular:12.8,sale:6.4,image:"products/66.webp",sourceImage:photos.stoneMarkers,url:"https://hobbii.com/products/hp-1005839-stitch-markers-1005839",detail:"Handmade stitch markers adorned with genuine stones",verified:"August 16, 2026",shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
];

// Guard: the site never shows the same product URL twice, even if a refresh
// accidentally inserts a duplicate. scripts/validate-deals.mjs fails the build
// on duplicates so they get fixed at the source; this keeps the UI correct
// regardless. First occurrence (lowest id) wins.
const seenUrls = new Set<string>();
export const deals: Deal[] = rawDeals.filter(d => {
  if (seenUrls.has(d.url)) return false;
  seenUrls.add(d.url);
  return true;
});

export const stores: Record<LocalStore,{name:string,address:string,maps:string}> = {
  Walmart:{name:"Walmart Supercenter #389",address:"1225 W I-35 Frontage, Edmond, OK 73034",maps:"https://www.google.com/maps/dir/?api=1&destination=1225+W+I-35+Frontage+Edmond+OK+73034"},
  Michaels:{name:"Michaels · Memorial Rd",address:"2201 W Memorial Rd, Oklahoma City, OK 73134",maps:"https://www.google.com/maps/dir/?api=1&destination=2201+W+Memorial+Rd+Oklahoma+City+OK+73134"},
  "Hobby Lobby":{name:"Hobby Lobby · Edmond North",address:"800 W Danforth Rd, Edmond, OK 73003",maps:"https://www.google.com/maps/dir/?api=1&destination=800+W+Danforth+Rd+Edmond+OK+73003"},
};

// When each store was last ACTUALLY reached by the scripted refresh.
// auto:true stores (Hobbii, Hobby Lobby) answer scripts, so refresh.mjs
// advances their date every successful run. auto:false stores (Walmart,
// Michaels) block scripts — their dates only move on manual review, so a
// growing gap here is the honest signal that their prices may be stale.
export const storeChecks: Record<Store,{lastChecked:string;auto:boolean}> = {
  Hobbii:{lastChecked:"August 16, 2026",auto:true},
  "Hobby Lobby":{lastChecked:"August 16, 2026",auto:true},
  Walmart:{lastChecked:"July 20, 2026",auto:false},
  Michaels:{lastChecked:"July 20, 2026",auto:false},
};

// Edmond/OKC garage & estate sales that explicitly advertise craft supplies.
// The refresh automation prunes ended sales and adds new ones here; the
// section renders a friendly empty state when this list is empty.
export type GarageSale = {
  id:number;
  status:string;   // e.g. "ACTIVE THROUGH JULY 23" or "SAT–SUN, AUG 2–3"
  name:string;
  blurb:string;
  area:string;
  checked:string;  // date the advertisement was last verified
  url:string;
};
export const garageSales: GarageSale[] = [
  {id:1,status:"ACTIVE THROUGH JULY 23",name:"Signature Eclectic",blurb:"Multi-family online estate sale advertising crafting supplies, furniture, housewares, décor and pottery.",area:"Oklahoma City, OK 73114",checked:"July 19, 2026",url:"https://garagesalefinder.com/s/NIjoC/oklahoma-city-ok-73114"},
];

export const storeLogos:Record<Store,string>={
  Walmart:"store-icons/walmart.ico",
  Michaels:"store-icons/michaels.ico",
  "Hobby Lobby":"store-icons/hobby-lobby.ico",
  Hobbii:"store-icons/hobbii.png",
};
