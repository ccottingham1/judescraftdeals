"use client";

import { useMemo, useState } from "react";

type Craft = "Crochet" | "Beading";
type Store = "Walmart" | "Michaels" | "Hobby Lobby" | "Hobbii";
type LocalStore = Exclude<Store,"Hobbii">;
type Kind = "Yarn" | "Crochet tools" | "Single-color beads" | "Bead assortments" | "Stringing" | "Beading tools" | "Craft machines";
type Deal = {
  id:number; title:string; store:Store; craft:Craft; kind:Kind; regular:number; sale:number;
  image:string; url:string; detail:string; verified:string; fresh?:boolean; shipping?:string;
};

const photos = {
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
};

const deals: Deal[] = [
  {id:1,title:"Clear Glass Seed Beads, 6/0 by Bead Landing",store:"Michaels",craft:"Beading",kind:"Single-color beads",regular:5.99,sale:2.99,image:photos.clearBeads,url:"https://www.michaels.com/product/clear-glass-seed-beads-60-by-bead-landing-10594049",detail:"Clear AB-finish glass beads · size 6/0 · 112-inch strand",verified:"July 18, 2026"},
  {id:2,title:"Light Gold Glass Seed Beads, 6/0 by Bead Landing",store:"Michaels",craft:"Beading",kind:"Single-color beads",regular:5.99,sale:4.49,image:photos.goldBeads,url:"https://www.michaels.com/product/light-gold-glass-seed-beads-60-by-bead-landing-10594047",detail:"Light-gold glass beads · size 6/0 · 100-inch strand",verified:"July 18, 2026"},
  {id:3,title:"Beadalon Nylon Jaw Flat Nose Pliers",store:"Michaels",craft:"Beading",kind:"Beading tools",regular:14.99,sale:5,image:photos.pliers,url:"https://www.michaels.com/product/beadalon-nylon-jaw-flat-nose-pliers-10157928",detail:"5.75-inch stainless-steel pliers with non-marring nylon jaws",verified:"July 18, 2026"},
  {id:4,title:"22-Piece Ergonomic Crochet Hook Set",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:30,sale:20.10,image:photos.hooks22,url:"https://www.michaels.com/product/22pcs-crochet-hooks-set-ergonomic-crochet-hook-kit-with-big-eye-needles-and-stitch-markers-525940932749836294",detail:"Ergonomic hooks, big-eye needles and stitch markers",verified:"July 18, 2026"},
  {id:5,title:"120-Piece Locking Stitch Marker Set",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:39.72,sale:26.61,image:photos.markers,url:"https://www.michaels.com/product/stitch-markers-for-knitting-and-crochet-120pcs-plastic-crochet-stitch-markers-locking-clips-with-12-colors-lightweight-snagfree-design-for-yarn-crafts-sweater-making-diy-projects-469536103326892038",detail:"12 marker colors, storage box and 9 big-eye needles",verified:"July 18, 2026"},
  {id:6,title:"31-Piece Crochet Hook Kit with Case",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:74.98,sale:56.23,image:photos.hooks31,url:"https://www.michaels.com/product/crochet-hooks-kit-31-piece-set-with-9-ergonomic-hook-sizes-6-yarn-needles-additional-knitting-crochet-supplies-and-carrying-case-228799475995230223",detail:"9 ergonomic hooks, 6 yarn needles, markers, tools and case",verified:"July 18, 2026"},
  {id:7,title:"Red Heart Super Saver Yarn · Buff",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.18,sale:3.76,image:photos.buff,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Acrylic-Buff-Yarn-1-Each/17209250",detail:"7 oz · 364 yd · medium acrylic yarn",verified:"July 18, 2026"},
  {id:8,title:"Red Heart Super Saver Yarn · Amethyst",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.18,sale:3.76,image:photos.amethyst,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Yarn-Medium-Acrylic-Amethyst-Yarn-364-yd/17209256",detail:"7 oz · 364 yd · medium acrylic yarn",verified:"July 18, 2026"},
  {id:9,title:"Red Heart Super Saver Jumbo Yarn · Orchid",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:8.99,sale:7.48,image:photos.orchid,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Yarn-Orchid/52870964",detail:"14 oz · 744 yd · jumbo acrylic skein",verified:"July 18, 2026"},
  {id:10,title:"5-Piece Jewelry Pliers Set",store:"Walmart",craft:"Beading",kind:"Beading tools",regular:22.99,sale:12.95,image:photos.pliers5,url:"https://www.walmart.com/ip/Jewelry-Pliers-Set-Making-Pliers-Tools-Kit-Includes-Round-Chain-Needle-Bent-Zipper-Pliers-for-Repair-Wire-Wrapping-DIY-Crafts/19893321629",detail:"Round, chain, needle, bent and zipper pliers for jewelry work",verified:"July 19, 2026"},
  {id:11,title:"Weloille 59-Piece Beginner Crochet Hook Set",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:20.99,sale:14.51,image:photos.hooks59,url:"https://www.walmart.com/ip/Weloille-Adult-Beginner-Crochet-Hook-Set-59-Pcs-Ergonomic-Crochet-Hooks-2-0-6-0-mm-and-0-6-1-9-mm-Lace-Steel-Needles-Complete-Crochet-Starter-Kit/20214605454",detail:"Ergonomic hooks, steel lace needles, yarn, markers and storage bag",verified:"July 20, 2026"},
  {id:12,title:"BCOOSS 73-Piece Crochet Kit with Yarn",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:39.99,sale:25.99,image:photos.kit73,url:"https://www.walmart.com/ip/BCOOSS-Crochet-Kit-for-Beginners-Adults-73PCS-Crochet-Hook-Set-with-Crochet-Yarn-Canvas-Tote-Bag-Crochet-Accessories-and-Supplies/9250422684",detail:"73-piece hook and yarn kit with crochet accessories and tote bag",verified:"July 20, 2026"},
  {id:13,title:"Techtongda 22-Piece Aluminum Crochet Hook Set",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:6.99,sale:4.99,image:photos.hooks22color,url:"https://www.walmart.com/ip/Techtongda-22pc-Colorful-Aluminum-Crochet-Hooks-Needles-Knit-Weave-Craft-Woolen-Yarn/260088219",detail:"22 aluminum hooks from 0.6 mm to 6.5 mm",verified:"July 19, 2026"},
  {id:14,title:"Czech Glass Seed Beads · 11/0 · Peach Ceylon",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:3.99,sale:1.99,image:photos.czechBeads,url:"https://www.hobbylobby.com/beads-jewelry/beads/czech-glass-beads/czech-glass-seed-beads---11-0/p/80878353",detail:"Single-color Czech glass rocaille beads for loom and off-loom beadwork",verified:"July 20, 2026"},
  {id:15,title:"Heart Bead Threaders",store:"Hobby Lobby",craft:"Beading",kind:"Beading tools",regular:2.49,sale:1.49,image:photos.heartThreaders,url:"https://www.hobbylobby.com/beads-jewelry/jewelry-making-tools-adhesive/beading-needles/heart-bead-threaders/p/81170396",detail:"Two heart-shaped threaders for loading multiple beads onto cord",verified:"July 19, 2026"},
  {id:16,title:"Opaque Turquoise Czech Glass Seed Beads · 11/0",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:3.49,sale:1.74,image:photos.turquoiseCzech,url:"https://www.hobbylobby.com/beads-jewelry/beads/czech-glass-beads/opaque-turquoise---czech-glass-seed-beads---11-0/p/10299",detail:"Single-color opaque turquoise Czech glass rocaille beads",verified:"July 20, 2026"},
  {id:17,title:"Opaque Dark Red Czech Glass Seed Beads · 11/0",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:3.99,sale:1.99,image:photos.darkRedCzech,url:"https://www.hobbylobby.com/beads-jewelry/beads/czech-glass-beads/opaque-dark-red---czech-glass-seed-beads---11-0/p/10303",detail:"Single-color opaque dark-red Czech glass rocaille beads",verified:"July 20, 2026"},
  {id:18,title:"Transparent Glass Beads · 8 mm · 600 Pieces",store:"Walmart",craft:"Beading",kind:"Bead assortments",regular:18.85,sale:15.08,image:photos.transparentGlass,url:"https://www.walmart.com/ip/Glass-Beads-Bulk-for-Bracelet-Making-Round-Transparent-Beads-Craft-DIY-Jewelry-Supplies-Birthday-Gift-for-Beader-8mm-600-pcs/15533055020",detail:"600 round transparent glass beads in assorted colors with 1 mm holes",verified:"July 19, 2026"},
  {id:19,title:"Electric Yarn Winder · 10 oz Capacity",store:"Walmart",craft:"Crochet",kind:"Craft machines",regular:29.99,sale:26.99,image:photos.yarnWinder,url:"https://www.walmart.com/ip/Electric-Yarn-Winder-Crocheting-Yarn-Ball-Winder-10-oz-Large-Capacity-Automatic-Yarn-Cake-Winder-Spinner-Baller-Roller-Swift-Spooler-Crocheting-Tools/13365454369",detail:"Automatic yarn-cake winder with stepless speed control and 10 oz capacity",verified:"July 19, 2026"},
  {id:20,title:"2-in-1 Electric Clay & Seed Bead Spinner",store:"Michaels",craft:"Beading",kind:"Craft machines",regular:73.48,sale:55.11,image:photos.beadSpinner,url:"https://www.michaels.com/product/clay-bead-spinner-and-seed-bead-spinner-2in1-electric-bead-spinner-for-jewelry-making-bracelet-spinner-and-necklace-making-machine-with-bead-needles-and-thread-pink-555713547863031815",detail:"USB-powered machine with separate modes for clay beads and seed beads",verified:"July 19, 2026"},
  {id:21,title:"Pearl White Glass Beads by Creatology",store:"Michaels",craft:"Beading",kind:"Single-color beads",regular:6.79,sale:5.09,image:photos.pearlWhite,url:"https://www.michaels.com/product/pearl-white-beads-by-creatology-10647291",detail:"274 pearl-white glass beads in 8 mm and 12 mm sizes · online-only sale",verified:"July 20, 2026"},
  {id:22,title:"Easy Touch Crochet Hook Set · 6 Sizes",store:"Hobbii",craft:"Crochet",kind:"Crochet tools",regular:31.20,sale:18.72,image:photos.easyTouchHooks,url:"https://hobbii.com/products/hp-1006074-easy-touch-crochet-hook-set-6-sizes",detail:"Six ergonomic stainless-steel hooks from 0.5 mm to 1.75 mm",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:23,title:"Toucan Super-Bulky Chenille Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:9.60,sale:4.80,image:photos.toucanYarn,url:"https://hobbii.com/products/hp-1007324-toucan",detail:"100% polyester chenille · 100 g / 120 m · recommended 7 mm hook",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:24,title:"We Love Yarn Mega Ball · 400 g · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:16.00,sale:10.40,image:photos.megaBallYarn,url:"https://hobbii.com/products/hp-1002107-mega-ball-we-love-yarn",detail:"100% acrylic medium yarn · 1,312 yd · recommended 5.5 mm hook",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:25,title:"Metallico Satin-Shine Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:6.80,sale:4.08,image:photos.metallicoYarn,url:"https://hobbii.com/products/hp-1004245-metallico",detail:"Medium satin-shine blend · 50 g / 115 m · recommended 5.5 mm hook",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:26,title:"Friends Wheel Cotton Blend Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:13.60,sale:6.80,image:photos.friendsWheelYarn,url:"https://hobbii.com/products/hp-1005684-friends-wheel",detail:"55% cotton / 45% acrylic fine yarn · 100 g / 400 m",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:27,title:"Unicorn Solid Merino Blend Yarn · Choose Color",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:18.40,sale:9.19,image:photos.unicornSolidYarn,url:"https://hobbii.com/products/hp-1004439-unicorn-solid",detail:"75% superwash merino / 25% polyamide · 100 g / 400 m",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:28,title:"Crafting Acrylic Yarn · Choose Color · Clearance",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:8.40,sale:4.20,image:photos.craftingAcrylicYarn,url:"https://hobbii.com/products/hp-1008980-crafting-acrylic",detail:"Discontinued 100% premium acrylic · 170 g / 347 m · while stock lasts",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:29,title:"Diablo Wild Print Mohair Blend · Choose Color · Clearance",store:"Hobbii",craft:"Crochet",kind:"Yarn",regular:9.20,sale:4.13,image:photos.diabloWildYarn,url:"https://hobbii.com/products/hp-1004193-diablo-wild-print",detail:"Discontinued lace yarn · acrylic, mohair and polyamide · while stock lasts",verified:"July 20, 2026",fresh:true,shipping:"Online only · shipping starts at $7.99 and is free on orders of $69 or more"},
  {id:30,title:"Jelly Cord · Four 5-Yard Colors",store:"Hobby Lobby",craft:"Beading",kind:"Stringing",regular:5.49,sale:3.29,image:photos.jellyCord,url:"https://www.hobbylobby.com/beads-jewelry/stringing-materials/bead-cord/jelly-cord/p/81247280",detail:"Four 2 mm jelly cords in pink, orange, green and clear · current marked-price discount",verified:"July 20, 2026",fresh:true},
  {id:31,title:"Vibrant Jewelry Cord · 1 mm · Six Colors",store:"Hobby Lobby",craft:"Beading",kind:"Stringing",regular:6.99,sale:4.19,image:photos.vibrantCord,url:"https://www.hobbylobby.com/beads-jewelry/stringing-materials/bead-cord/vibrant-jewelry-cord---1mm/p/81217041",detail:"Six 5-yard fabric cords in bright colors · current marked-price discount",verified:"July 20, 2026",fresh:true},
  {id:32,title:"Multi-Color Stretch Cord · 1 mm",store:"Hobby Lobby",craft:"Beading",kind:"Stringing",regular:4.99,sale:2.99,image:photos.stretchCord,url:"https://www.hobbylobby.com/beads-jewelry/stringing-materials/bead-cord/multi-color-stretch-cord---1mm/p/81118681",detail:"One 15-yard spool of rainbow fabric stretch cord · current marked-price discount",verified:"July 20, 2026",fresh:true},
  {id:33,title:"Iridescent Glass Bead Strand",store:"Hobby Lobby",craft:"Beading",kind:"Single-color beads",regular:5.99,sale:2.99,image:photos.iridescentGlass,url:"https://www.hobbylobby.com/beads-jewelry/beads/glass-beads/iridescent-glass-bead-strand/p/81024610",detail:"One 7-inch strand of clear iridescent 8 x 6.5 mm barrel beads",verified:"July 20, 2026",fresh:true},
  {id:34,title:"Sherry 41-Piece Crochet Hook Kit · Blue Case",store:"Walmart",craft:"Crochet",kind:"Crochet tools",regular:39.99,sale:12.99,image:photos.sherryHooks,url:"https://www.walmart.com/ip/14769457684",detail:"12 ergonomic hook sizes with yarn tools and a blue carrying case",verified:"July 20, 2026",fresh:true},
  {id:35,title:"Red Heart Super Saver Yarn · Blue",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.99,sale:3.76,image:photos.blueYarn,url:"https://www.walmart.com/ip/17209269",detail:"7 oz · 364 yd · medium acrylic yarn · sold and shipped by Walmart",verified:"July 20, 2026",fresh:true},
  {id:36,title:"Red Heart Super Saver Jumbo Yarn · Perfect Pink",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:8.99,sale:7.48,image:photos.perfectPinkYarn,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Jumbo-Yarn-Perfect-Pink/52871117",detail:"14 oz · 744 yd · jumbo acrylic skein · sold and shipped by Walmart",verified:"July 20, 2026",fresh:true},
  {id:37,title:"Toorise USB Electric Wooden Bead Spinner Kit",store:"Walmart",craft:"Beading",kind:"Craft machines",regular:23.99,sale:17.29,image:photos.tooriseSpinner,url:"https://www.walmart.com/ip/Toorise-Electric-Wooden-Bead-Spinner-USB-Powered-Spin-Beading-Bowl-Kit-Adjustable-Speed-Direction-Spin-Bead-Loader-2-Beading-Needles-2000-Beads-Brace/7620014290",detail:"Adjustable speed and direction · 2 needles, thread and 2,000 beads included",verified:"July 20, 2026",fresh:true},
  {id:38,title:"Guozer Seed Bead Spinning Wheel · Clearance",store:"Walmart",craft:"Beading",kind:"Craft machines",regular:5.67,sale:3.37,image:photos.guozerSpinner,url:"https://www.walmart.com/ip/Guozer-Clearance-Plastic-Spinning-Wheel-For-Beading-String-Seed-Beads-Quickly-And-Efficiently-For-Jewelry-Tassels/9796611613",detail:"Manual plastic spinning wheel for quickly loading seed beads onto string",verified:"July 20, 2026",fresh:true},
  {id:39,title:"Etudaw Electric Clay Bead Spinner Kit · Pink",store:"Michaels",craft:"Beading",kind:"Craft machines",regular:69.48,sale:52.11,image:photos.etudawSpinner,url:"https://www.michaels.com/product/electric-bead-spinner-for-jewelry-making-automatic-clay-beads-for-cool-necklaces-and-bracelets-maker-beginner-bracelet-making-kit-diy-arts-and-crafts-birthday-giftspink-555310397604986886",detail:"Electric spinner with beads, needles, thread, scissors and USB cable",verified:"July 20, 2026",fresh:true},
  {id:40,title:"19-Piece Ergonomic Soft-Grip Crochet Hook Kit",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:43.08,sale:32.31,image:photos.hooks19,url:"https://www.michaels.com/product/crochet-hooks-ergonomic-soft-grip-2mm6mm-metal-crochet-set-for-beginners-19pcs-knitting-yarn-hook-kit-w-stitch-marker-knitting-needles-for-arthritic-hands-best-diy-craft-gift-for-christmas-592722990136213512",detail:"2–6 mm soft-grip hooks with stitch markers and knitting needles",verified:"July 20, 2026",fresh:true},
  {id:41,title:"7-Strand Tiger Tail Beading Wire · 300 ft",store:"Michaels",craft:"Beading",kind:"Stringing",regular:46.98,sale:35.23,image:photos.tigerTailWire,url:"https://www.michaels.com/product/300-ft-7strand-beading-wire-0018inch-046mm-tiger-tail-bead-stringing-wire-for-jewelry-making-threading-necklace-bracelet-crafts-350605082684325912",detail:"0.018-inch nylon-coated 7-strand stainless wire in light gray",verified:"July 20, 2026",fresh:true},
  {id:42,title:"CraftBud Digital Counting Crochet Hook Set",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:32.99,sale:28.04,image:photos.digitalHook,url:"https://www.michaels.com/product/craftbud-digital-counting-crochet-hook-set-176476154871644180",detail:"Digital hook set that tracks stitches and rows while crocheting",verified:"July 20, 2026",fresh:true},
  {id:43,title:"Hearth & Harbor DIY Crochet Kit · 20 Yarn Skeins",store:"Michaels",craft:"Crochet",kind:"Crochet tools",regular:48.99,sale:41.64,image:photos.hearthHarborKit,url:"https://www.michaels.com/product/hearth-harbor-diy-crochet-kit-252554070871998465",detail:"20 skeins, 12 hooks, markers, row counter, needles, scissors and organizers",verified:"July 20, 2026",fresh:true},
  {id:44,title:"5-Piece Bead Reamer Set",store:"Michaels",craft:"Beading",kind:"Beading tools",regular:40.98,sale:30.73,image:photos.beadReamers,url:"https://www.michaels.com/product/5-pieces-bead-reamer-for-jewelry-making-bead-spinner-hole-enlarger-tool-for-glass-plastic-metal-wood-beads-remove-burrs-enlarge-holes-smooth-edges-350478118143934470",detail:"Five reamers for smoothing and enlarging holes in glass, plastic, metal and wood beads",verified:"July 20, 2026",fresh:true},
  {id:45,title:"Jewelry Making & Repair Tool Kit",store:"Michaels",craft:"Beading",kind:"Beading tools",regular:48.98,sale:36.73,image:photos.jewelryToolKit,url:"https://www.michaels.com/product/jewelry-making-supplies-kit-jewelry-repair-tool-with-accessories-jewelry-pliers-jewelry-findings-and-beading-wires-for-adults-and-beginners-266309178333577224",detail:"Pliers, tweezers, caliper, cord, wire, elastic and organized jewelry findings",verified:"July 20, 2026",fresh:true},
  {id:46,title:"Red Heart Super Saver Yarn · Saffron",store:"Walmart",craft:"Crochet",kind:"Yarn",regular:4.99,sale:3.77,image:photos.saffronYarn,url:"https://www.walmart.com/ip/Red-Heart-Super-Saver-Medium-Acrylic-Saffron-Yarn-364-yd/844231803",detail:"7 oz · 364 yd · medium acrylic yarn · sold and shipped by Walmart",verified:"July 20, 2026",fresh:true},
];

const stores: Record<LocalStore,{name:string,address:string,maps:string}> = {
  Walmart:{name:"Walmart Supercenter #389",address:"1225 W I-35 Frontage, Edmond, OK 73034",maps:"https://www.google.com/maps/dir/?api=1&destination=1225+W+I-35+Frontage+Edmond+OK+73034"},
  Michaels:{name:"Michaels · Memorial Rd",address:"2201 W Memorial Rd, Oklahoma City, OK 73134",maps:"https://www.google.com/maps/dir/?api=1&destination=2201+W+Memorial+Rd+Oklahoma+City+OK+73134"},
  "Hobby Lobby":{name:"Hobby Lobby · Edmond North",address:"800 W Danforth Rd, Edmond, OK 73003",maps:"https://www.google.com/maps/dir/?api=1&destination=800+W+Danforth+Rd+Edmond+OK+73003"},
};

const money=(n:number)=>`$${n.toFixed(2)}`;
const storeLogos:Record<Store,string>={
  Walmart:"https://www.walmart.com/favicon.ico",
  Michaels:"https://www.michaels.com/favicon.ico",
  "Hobby Lobby":"https://www.hobbylobby.com/favicon.ico",
  Hobbii:"data:image/png;base64,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",
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
      <img src={deal.image} alt={deal.title} loading={large?"eager":"lazy"}/>
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
    <img src="/chicken-v2.png" alt="Chicken, Jude’s brown tabby cat"/>
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
        <img src={photos.amethyst} alt="Red Heart Amethyst yarn"/>
        <img src={photos.clearBeads} alt="Clear Bead Landing seed beads"/>
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
        <img src={selected.image} alt={selected.title}/>
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
