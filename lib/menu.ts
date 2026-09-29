/* ════════════════════════════════════════════════════════════════
   FULL MENU — Café de Bangkok, Kochi
   Transcribed from the printed menu. Prices in ₹.
   Variant keys: V=Veg · C=Chicken · P=Prawn · B=Beef · Cr=Crab
   `tag`: "veg" | "non" — drives the dietary filter & dot colour.
   Kept in its own module so the heavy data only loads on /menu.
   ════════════════════════════════════════════════════════════════ */

export type Variant = { k: string; p: number };
export type Dish = {
  name: string;
  desc?: string;
  price?: number;      // single price
  variants?: Variant[]; // multi-price (V/C/P/B…)
  unit?: string;       // e.g. "per gram"
  tag: "veg" | "non";
  chef?: boolean;      // chef's special
  hot?: boolean;       // spicy flag
};
export type MenuSection = {
  id: string;
  title: string;
  blurb?: string;
  items: Dish[];
};

export const MENU: MenuSection[] = [
  {
    id: "soups",
    title: "Soups",
    blurb: "Where every Thai table begins — bright, aromatic, alive.",
    items: [
      { name: "Tom Yum Soup", desc: "A spicy Thai soup with lemongrass, aromatic herbs and vibrant flavours that excite the senses.", variants: [{ k: "V", p: 250 }, { k: "C", p: 270 }, { k: "P", p: 290 }], tag: "veg", hot: true },
      { name: "Tom Kha Soup", desc: "Creamy coconut soup with galangal, kaffir lime leaves and delicate spices.", variants: [{ k: "V", p: 250 }, { k: "C", p: 270 }, { k: "P", p: 290 }], tag: "veg" },
      { name: "Hot and Sour Soup", desc: "Spicy, sour and hot flavourful soup.", variants: [{ k: "V", p: 250 }, { k: "C", p: 270 }, { k: "P", p: 290 }], tag: "veg", hot: true },
      { name: "Chicken Wonton Soup", desc: "Comforting soup with succulent chicken-filled wontons in a savoury broth.", variants: [{ k: "C", p: 250 }], tag: "non" },
      { name: "Spicy Seafood Thick Soup", desc: "Rich and flavorful soup loaded with a variety of seafood.", price: 240, tag: "non", hot: true },
      { name: "Thai Spicy Beef Stew Soup", desc: "Rich and flavorful slow-stewed beef soup.", variants: [{ k: "B", p: 270 }], tag: "non", hot: true },
      { name: "Vietnamese Crab Soup", desc: "Rich, savoury crab-meat soup with chunks of fresh crab, creamy broth and a hint of delicate herbs.", price: 290, tag: "non" },
    ],
  },
  {
    id: "dimsum",
    title: "Dim Sum",
    blurb: "Folded by hand through the afternoon, steamed to order.",
    items: [
      { name: "Broccoli Corn and Water Chestnut Dim Sum", desc: "Steamed dumplings with a delightful crunch and goodness of vegetable.", price: 320, tag: "veg" },
      { name: "Wild Mushroom Dumpling", desc: "Delicate dumplings filled with a medley of wild mushrooms.", price: 320, tag: "veg" },
      { name: "Koli Dim Sum", desc: "Dim sum filled with cheese & mushroom.", price: 349, tag: "veg", chef: true },
      { name: "Asian Beef Dumpling", desc: "Steamed dumplings filled with minced beef, ginger and rich flavours.", price: 360, tag: "non" },
      { name: "Spicy Chicken Celery Dim Sum", desc: "Spicy, fragrant dumplings with tender chicken and crunchy celery.", price: 360, tag: "non", hot: true },
      { name: "Chicken Siu Mai", desc: "Steamed open-faced dumplings packed with flavourful minced chicken.", price: 340, tag: "non" },
      { name: "Har Gao Prawn Dim Sum", desc: "Steamed dumplings with succulent prawns under a translucent wrapper — as delicious as they look.", price: 390, tag: "non" },
      { name: "Japanese Chicken Gyoza", desc: "Pan-fried dumplings filled with seasoned chicken and aromatic herbs.", price: 360, tag: "non" },
    ],
  },
  {
    id: "baos",
    title: "Baos",
    blurb: "Soft, pillowy steamed buns with bold fillings.",
    items: [
      { name: "Cottage Cheese Sun Dried Tomato Bao", desc: "Soft buns stuffed with cottage cheese and tangy sundried tomatoes for heightened flavour.", price: 360, tag: "veg" },
      { name: "Stir Fry Sweet Basil Chicken Bao", desc: "Stir-fried basil chicken in a soft, fluffy bao — a perfect blend of flavours and textures.", price: 390, tag: "non" },
      { name: "Larb Gai Bao (Chicken)", desc: "Steamed buns with tender, flavourful chicken filling.", price: 390, tag: "non" },
      { name: "Red Curry Chicken Bao", desc: "Steamed buns with tender, flavourful red-curry chicken.", price: 390, tag: "non" },
    ],
  },
  {
    id: "appveg",
    title: "Appetizers · Veg",
    items: [
      { name: "Crispy Corn Nibled", desc: "Crunchy golden nuggets bursting with sweet corn flavour.", price: 290, tag: "veg" },
      { name: "Thai Spring Rolls Veg", desc: "Crispy spring rolls filled with vegetables, herbs and seasonings.", price: 260, tag: "veg" },
      { name: "Crispy Tangy Vegetables", desc: "Crispy mixed vegetables in a tangy, zesty dressing.", price: 290, tag: "veg" },
      { name: "Lotus Stem Chilli Plum", desc: "Steamed lotus roots cooked with chilli-plum sauce — a unique combination of textures and tastes.", price: 370, tag: "veg", hot: true },
      { name: "Tempura Vegetables", desc: "Assorted vegetables in a light, crispy batter, fried golden and served with a dipping sauce.", price: 320, tag: "veg" },
      { name: "Tofu Satay", desc: "Skewered, grilled marinated tofu — a savoury vegetarian take on satay.", price: 360, tag: "veg" },
      { name: "Asian BBQ Cottage Cheese", desc: "Grilled cottage cheese in a flavourful Asian barbecue sauce, savoury and smoky.", price: 370, tag: "veg" },
      { name: "Plain Fries", price: 150, tag: "veg" },
      { name: "Peri Peri Fries", price: 180, tag: "veg" },
      { name: "Lime Chilli Hulk Fries", price: 180, tag: "veg", hot: true },
    ],
  },
  {
    id: "appnon",
    title: "Appetizers · Non-Veg",
    items: [
      { name: "Crunchy Noodle Prawn with Sweet Tamarind Sauce", desc: "Crispy noodle prawns with sweet tamarind sauce.", price: 450, tag: "non" },
      { name: "Thai Herbs Marinated Beef Skewer", desc: "Succulent beef skewers marinated with fragrant Thai herbs.", price: 410, tag: "non" },
      { name: "Chicken Dynamite", desc: "A tantalizing chicken dish with a punch of mayo in every bite.", price: 380, tag: "non" },
      { name: "Bangkok Prawn", desc: "Succulent prawns sautéed in a spicy, tangy Bangkok-inspired sauce.", price: 420, tag: "non", hot: true },
      { name: "Beef Meat Balls (6 pcs)", desc: "Savoury ground-beef meatballs with Thai herbs and spices, sweet-and-sour dip.", price: 270, tag: "non" },
      { name: "Larb Gai Tod", desc: "Crispy fried chicken slices coated in a flavourful Thai marinade.", price: 390, tag: "non" },
      { name: "Chicken Wonton Fried", desc: "Crispy fried chicken wontons, tasty and crunchy.", price: 290, tag: "non" },
      { name: "Java Chicken Lollipop", desc: "Chicken drumsticks with Indonesian-inspired flavours, deep-fried and served with a dip.", price: 380, tag: "non" },
      { name: "Mountain Chilli Chicken", desc: "Wok-charred chicken with dried mountain chillies — smoky, fierce, most-ordered.", price: 370, tag: "non", hot: true },
      { name: "Satay Chicken", desc: "Skewered, grilled chicken supreme marinated in a savoury sauce.", price: 380, tag: "non" },
      { name: "Thai Spring Rolls Chicken", desc: "Crispy spring rolls with seasoned chicken and Thai spices.", price: 290, tag: "non" },
      { name: "Peri Peri Chicken Wings", desc: "Chicken wings in a fiery, tangy peri peri sauce.", price: 320, tag: "non", hot: true },
      { name: "Chicken Fry & Cream", desc: "Breaded chicken fried crisp, served with a creamy dip.", price: 350, tag: "non" },
      { name: "Thai Style Fried Beef", desc: "Fried beef tenderloin with Thai seasoning.", price: 450, tag: "non" },
      { name: "Xing Zang Beef", desc: "Slow-fried sliced beef with roasted cumin, coriander and capsicum.", price: 490, tag: "non" },
      { name: "Beef Fry in Roasted Chilli Paste", desc: "Flavour-rich beef cooked in a spicy, aromatic Thai chilli sauce.", price: 490, tag: "non", hot: true },
      { name: "Tempura Prawns", desc: "Juicy prawns in light, crispy batter, deep-fried and served with a dip.", price: 520, tag: "non" },
      { name: "XO Prawn", desc: "Juicy prawns in a rich XO sauce, intense and aromatic.", price: 570, tag: "non" },
      { name: "Thai Omelet", desc: "Fluffy omelette with cooked prawn / crab meat and Thai herbs.", variants: [{ k: "P", p: 240 }, { k: "C", p: 240 }], tag: "non" },
      { name: "Squid Rings Salt & Garlic", desc: "Battered, fried squid rings with lime-chilli flavours.", price: 470, tag: "non" },
      { name: "Crab Lollipop", desc: "Crab meat shaped into a lollipop, crisp-coated, with a flavourful dip.", price: 360, tag: "non" },
    ],
  },
  {
    id: "salad",
    title: "Salads · Veg & Non-Veg",
    items: [
      { name: "Raw Papaya Salad (Som Tam)", desc: "Shredded papaya, herbs and tangy dressing in a burst of flavour.", variants: [{ k: "V", p: 290 }, { k: "P", p: 390 }], tag: "veg", hot: true },
      { name: "Broccoli Salad", desc: "Broccoli in a tangy dressing — a healthy, satisfying blend with veg, chicken or prawns.", variants: [{ k: "V", p: 280 }, { k: "C", p: 350 }, { k: "P", p: 390 }], tag: "veg" },
      { name: "Thai Minced Chicken Salad", desc: "A zesty chicken salad with Thai spices, lime juice and fresh herbs.", variants: [{ k: "C", p: 390 }], tag: "non", hot: true },
    ],
  },
  {
    id: "mainveg",
    title: "Main Course · Veg",
    items: [
      { name: "Sizzling Hot Plate Tofu with Mix Vegetables", desc: "A sizzling mix of tofu and veggies, bursting with flavour.", price: 420, tag: "veg" },
      { name: "Thai Stir Fry Vegetables", desc: "A colourful mix of vegetables in a savoury sauce.", price: 290, tag: "veg" },
      { name: "Bok Choy Stir Fry", desc: "Baby bok choy stir-fried in garlic and vegetarian oyster-mushroom sauce.", price: 360, tag: "veg" },
      { name: "Teriyaki Vegetables & Wild Mushroom", desc: "Vegetables and wild mushrooms glazed in sweet-savoury teriyaki.", price: 320, tag: "veg" },
    ],
  },
  {
    id: "mainnon",
    title: "Main Course · Non-Veg",
    items: [
      { name: "Stir Fry Beef with Black Pepper", desc: "Savoury beef with aromatic black-pepper spices.", price: 430, tag: "non" },
      { name: "Sizzling Hot Plate Tofu with Minced Chicken", desc: "Sizzling tofu and minced chicken on a hot plate.", price: 470, tag: "non" },
      { name: "Thai Stir Fry Vegetables with Chicken", desc: "Stir-fried fresh vegetables and tender chicken with aromatic spices.", price: 390, tag: "non" },
      { name: "Stir Fry Chicken with Red Curry Paste", desc: "Succulent chicken with red curry paste, long beans and fragrant basil.", price: 390, tag: "non", hot: true },
      { name: "Steamed Chicken with Lemon Sauce", desc: "Tender steamed chicken in zesty lemon sauce with aromatic herbs.", price: 390, tag: "non" },
      { name: "Stir Fry Chicken Pepper Garlic Sauce", desc: "Tender chicken with garlic, soya, pepper — bursting with aroma.", price: 390, tag: "non" },
      { name: "Stir Fry Chicken with Cashewnut", desc: "Cashew nut and chicken stir-fry in perfect balance.", price: 430, tag: "non" },
      { name: "Stir Fry Fish with Roasted Chilli Paste", desc: "Slow-fried fish with Thai roasted chilli paste.", price: 470, tag: "non", hot: true },
      { name: "Steamed Fish with Lemon Sauce (Basa)", desc: "Steamed fish in zesty lemon sauce with aromatic herbs.", price: 390, tag: "non" },
      { name: "Stir Fry Fish with Pepper Garlic Sauce", desc: "Deep-fried basa in pepper-garlic sauce — crispy and savoury.", price: 385, tag: "non" },
      { name: "Stir Fry Prawn with Mix Vegetables", desc: "Fresh vegetables and succulent prawns in a seafood fusion.", price: 470, tag: "non" },
      { name: "Stir Fry Prawn with Cashewnut", desc: "Prawns with cashew nuts — tender and crunchy.", price: 490, tag: "non" },
      { name: "Stir Fry Curry Powder", desc: "Stir-fried chicken / crab / prawn with aromatic curry powder.", variants: [{ k: "C", p: 390 }, { k: "Cr", p: 490 }, { k: "P", p: 470 }], tag: "non", hot: true },
    ],
  },
  {
    id: "friedrice",
    title: "Fried Rice",
    items: [
      { name: "Moon Fan Fried Rice", desc: "Fried rice with exotic vegetables, mushrooms and tantalizing seasonings.", variants: [{ k: "V", p: 380 }, { k: "C", p: 460 }, { k: "P", p: 490 }], tag: "veg" },
      { name: "Tom Yum Fried Rice", desc: "Fragrant fried rice with the bold, spicy flavours of tom yum.", variants: [{ k: "V", p: 420 }, { k: "C", p: 460 }, { k: "P", p: 490 }], tag: "veg", hot: true },
      { name: "Green Curry Fried Rice", desc: "Rice stir-fried with signature green-curry paste and Thai spices.", variants: [{ k: "V", p: 420 }, { k: "C", p: 460 }, { k: "P", p: 490 }], tag: "veg", hot: true },
      { name: "Burnt Garlic Coriander Fried Rice", desc: "Aromatic rice with smoky garlic and fresh coriander.", variants: [{ k: "V", p: 390 }, { k: "C", p: 420 }, { k: "P", p: 450 }], tag: "veg" },
      { name: "Wok Tossed Schezwan Fried Rice", desc: "Fiery rice stir-fried with Schezwan sauce and exotic vegetables.", variants: [{ k: "V", p: 350 }, { k: "C", p: 420 }, { k: "P", p: 450 }], tag: "veg", hot: true },
      { name: "Pineapple Fried Rice", desc: "Pineapple fried rice with cashew nuts — sweet-savoury fusion.", variants: [{ k: "V", p: 370 }, { k: "C", p: 420 }], tag: "veg" },
      { name: "Mix Seafood Fried Rice", desc: "Succulent seafood tossed with fragrant rice and light sauces.", price: 480, tag: "non" },
      { name: "Jasmine Rice", price: 150, tag: "veg" },
    ],
  },
  {
    id: "noodles",
    title: "Noodles",
    items: [
      { name: "Pad Thai", desc: "Classic Thai stir-fried flat noodles balancing sweet, sour and savoury.", variants: [{ k: "V", p: 420 }, { k: "C", p: 460 }, { k: "P", p: 490 }], tag: "veg" },
      { name: "Pad See Ew", desc: "Traditional stir-fried flat noodles in a delectable savoury sauce.", variants: [{ k: "V", p: 420 }, { k: "C", p: 460 }, { k: "P", p: 490 }], tag: "veg" },
      { name: "Mee Goreng", desc: "Popular Malaysian stir-fried noodles with a harmonious blend of flavours.", variants: [{ k: "V", p: 390 }, { k: "C", p: 450 }, { k: "P", p: 470 }], tag: "veg" },
      { name: "Rad Na Fried Noodle with Gravy Sauce", desc: "Fried noodles drenched in rich, savoury gravy.", variants: [{ k: "V", p: 330 }, { k: "C", p: 390 }, { k: "P", p: 490 }], tag: "veg" },
      { name: "Butter Pepper Garlic Noodles", desc: "Noodles in a buttery, aromatic garlic sauce.", variants: [{ k: "V", p: 360 }, { k: "C", p: 420 }, { k: "P", p: 450 }], tag: "veg" },
      { name: "Burnt Chilli Noodles", desc: "Spicy, smoky noodles with a hint of burnt chilli.", variants: [{ k: "V", p: 390 }, { k: "C", p: 450 }, { k: "P", p: 470 }], tag: "veg", hot: true },
      { name: "Stir Fried Noodle with Hot & Spicy Sauce", desc: "Fiery noodles tossed in a tantalizing hot-and-spicy sauce.", variants: [{ k: "V", p: 350 }, { k: "C", p: 420 }, { k: "P", p: 490 }], tag: "veg", hot: true },
      { name: "Chili Garlic Noodles", desc: "Noodles in a spicy, garlicky sauce — bold, zesty and fragrant.", variants: [{ k: "V", p: 350 }, { k: "C", p: 390 }, { k: "P", p: 450 }], tag: "veg", hot: true },
      { name: "Hakka Noodle", desc: "Stir-fried Chinese-style noodles with a mix of vegetables and seasonings.", variants: [{ k: "V", p: 325 }, { k: "C", p: 390 }, { k: "P", p: 450 }], tag: "veg" },
    ],
  },
  {
    id: "curries",
    title: "Thai Curries · with Jasmine Rice",
    blurb: "Stone-pounded pastes, simmered in coconut, served with jasmine rice.",
    items: [
      { name: "Thai Red Curry", desc: "Rich, aromatic curry with a fiery red colour and balanced spice.", variants: [{ k: "V", p: 470 }, { k: "C", p: 550 }, { k: "P", p: 590 }, { k: "B", p: 570 }], tag: "veg", hot: true },
      { name: "Thai Green Curry", desc: "Vibrant, flavourful curry made with fresh green herbs.", variants: [{ k: "V", p: 470 }, { k: "C", p: 550 }, { k: "P", p: 590 }, { k: "B", p: 570 }], tag: "veg", hot: true },
      { name: "Thai Yellow Curry", desc: "Mild, creamy curry with a sunny hue and fragrant spices.", variants: [{ k: "V", p: 470 }, { k: "C", p: 550 }, { k: "P", p: 590 }, { k: "B", p: 570 }], tag: "veg" },
      { name: "Thai Massaman Curry", desc: "Rich curry with potatoes, peanuts and a harmonious blend of spices.", variants: [{ k: "V", p: 470 }, { k: "C", p: 550 }, { k: "P", p: 590 }, { k: "B", p: 570 }], tag: "veg" },
      { name: "Thai Holy Basil Stir Fry (Pad Krapow)", desc: "Holy basil stir-fry with your choice of meat, prawns or tofu, garlic and chilli.", variants: [{ k: "V", p: 470 }, { k: "C", p: 550 }, { k: "P", p: 590 }, { k: "B", p: 570 }], tag: "veg", hot: true },
      { name: "Thai Red Curry Beef Meat Balls", desc: "Rich, aromatic beef-meatball curry with a fiery red colour.", price: 490, tag: "non", hot: true },
    ],
  },
  {
    id: "ramen",
    title: "Ramen & Khao Soi",
    items: [
      { name: "Five Spice Thai Duck Ramen", desc: "Thai duck ramen with an aromatic five-spice blend.", price: 650, tag: "non" },
      { name: "Gouchuchan Vegetables Ramen", desc: "Noodles in a savoury broth with umami from gochujang and soy, loaded with veggies.", price: 560, tag: "veg" },
      { name: "Hokkaido Miso Broth Chicken Ramen", desc: "Creamy chicken-bone broth and miso, with thin noodles and varied toppings.", price: 630, tag: "non" },
      { name: "Sichuan Mala Broth Pulled Beef Ramen", desc: "Rich beef-broth noodle soup with meats, vegetables and a boiled egg.", price: 690, tag: "non", hot: true },
      { name: "Khao Soi", desc: "Noodles, aromatic spices and a savoury sauce — harmonious and satisfying.", variants: [{ k: "V", p: 560 }, { k: "C", p: 630 }, { k: "P", p: 690 }], tag: "veg" },
    ],
  },
  {
    id: "sushi",
    title: "Sushi",
    items: [
      { name: "Coconut Shrimp Roll", desc: "Crispy shrimp and coconut wrapped in rice paper with spicy mayo.", price: 625, tag: "non" },
      { name: "California Roll", desc: "Crab stick, avocado, cucumber and sushi rice in harmony.", price: 600, tag: "non" },
      { name: "Spicy Tuna Maki", desc: "Tingling spices, lettuce and spicy mayo wrapped in rice and seaweed.", price: 690, tag: "non", hot: true },
      { name: "Salmon Maki", desc: "Fresh and smoked salmon over seasoned rice in crisp nori — a classic.", price: 800, tag: "non", chef: true },
      { name: "Ebi Maki", desc: "Tempura shrimp, seasoned rice, spicy mayo and roasted sesame.", price: 625, tag: "non" },
      { name: "Spicy Chicken Roll", desc: "Succulent chicken, tingling spices, lettuce and spicy mayo.", price: 590, tag: "non", hot: true },
      { name: "Veg California Maki", desc: "Avocado, cucumber and sushi rice in harmony.", price: 450, tag: "veg" },
    ],
  },
  {
    id: "exclusive",
    title: "Exclusive Dishes",
    blurb: "Priced per gram — fresh lobster, your way.",
    items: [
      { name: "Lobster Fry in Thai Roasted Chilli Paste", desc: "Lobster stir-fried with Thai roasted chilli paste — a spicy, flavourful twist.", price: 4, unit: "per gram", tag: "non", hot: true },
      { name: "Grilled Lobster", desc: "Lobster grilled Thai-style — succulent, juicy, authentic.", price: 4, unit: "per gram", tag: "non" },
      { name: "Lobster Curry Powder", desc: "Stir-fried lobster in aromatic curry powder with a balance of spices.", price: 4, unit: "per gram", tag: "non" },
    ],
  },
  {
    id: "bubbletea",
    title: "Bubble Teas",
    items: [
      { name: "Mango Sticky Rice Flavour Bubble Tea", price: 295, tag: "veg" },
      { name: "Original Taiwan Bubble Tea", price: 250, tag: "veg" },
      { name: "Authentic Thai Bubble Tea", price: 250, tag: "veg" },
      { name: "Matcha Green Bubble Tea", price: 250, tag: "veg" },
      { name: "Coffee Bubble Tea", price: 250, tag: "veg" },
      { name: "Cocoa Bubble Tea", price: 250, tag: "veg" },
      { name: "Mocca Bubble Tea", price: 250, tag: "veg" },
      { name: "Taro Bubble Tea", price: 250, tag: "veg" },
    ],
  },
  {
    id: "smoothies",
    title: "Smoothies & Frappé",
    items: [
      { name: "Mixed Berry Smoothies", price: 200, tag: "veg" },
      { name: "Lychee Smoothie", price: 200, tag: "veg" },
      { name: "Mango Smoothie", price: 200, tag: "veg" },
      { name: "Cappuccino Frappe", price: 250, tag: "veg" },
      { name: "Caramel Frappe", price: 250, tag: "veg" },
      { name: "Chocolate Frappe", price: 250, tag: "veg" },
    ],
  },
  {
    id: "juices",
    title: "Juices & Iced Teas",
    items: [
      { name: "Lemon Iced Tea", price: 120, tag: "veg" },
      { name: "Lemon Mint Cooler", price: 120, tag: "veg" },
      { name: "Honey Lemon Iced Tea", price: 140, tag: "veg" },
      { name: "Peach Lemon Iced Tea", price: 140, tag: "veg" },
      { name: "Blue Hawai Lemon", price: 140, tag: "veg" },
      { name: "Yuzu Orange Juice", price: 120, tag: "veg" },
    ],
  },
  {
    id: "thaidrinks",
    title: "Thai Refreshment Drinks",
    items: [
      { name: "Thai Pink Milk", price: 180, tag: "veg" },
      { name: "Thai Sala Soda", price: 180, tag: "veg" },
      { name: "Roselle", price: 220, tag: "veg" },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      { name: "Mango Sticky Rice", price: 290, tag: "veg" },
      { name: "Tub Tim Krob", price: 290, tag: "veg" },
    ],
  },
  {
    id: "bingsu",
    title: "Special Korean Dessert · Bingsu",
    blurb: "Mountains of feather-light shaved milk ice, built to share.",
    items: [
      { name: "Milk Bingsu", price: 399, tag: "veg" },
      { name: "Taiwan Tea Bingsu", price: 399, tag: "veg" },
      { name: "Thai Tea Bingsu", price: 399, tag: "veg" },
      { name: "Choco Bingsu", price: 399, tag: "veg" },
      { name: "Strawberry Bingsu", price: 449, tag: "veg", chef: true },
      { name: "Matcha Bingsu", price: 449, tag: "veg" },
      { name: "Taro Bingsu", price: 449, tag: "veg" },
    ],
  },
  {
    id: "beverages",
    title: "Hot & Cold Beverages",
    items: [
      { name: "Green Tea", price: 90, tag: "veg" },
      { name: "Black Tea", price: 90, tag: "veg" },
      { name: "Iced Coffee", price: 230, tag: "veg" },
    ],
  },
];

/* variant key → full label, for legend & tooltips */
export const VARIANT_LABELS: Record<string, string> = {
  V: "Veg",
  C: "Chicken",
  P: "Prawn",
  B: "Beef",
  Cr: "Crab",
};