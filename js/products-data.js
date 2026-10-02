// js/products-data.js
// Complete perfume catalog derived directly from NolMart Perfume Business SOP v3.1

export const PRODUCTS = [
    // --- 👑 FLAGSHIP SIGNATURE SCENTS (EXCLUSIVE NOLMART HOUSE BLENDS) ---
    {
        id: "crown-noir",
        name: "Crown Noir",
        tagline: "The Entrance Maker — Commanding, Dark & Fresh",
        category: "flagship",
        gender: "men",
        badge: "FLAGSHIP EXCLUSIVE",
        isFlagship: true,
        isBestseller: true,
        prices: {
            "10ml": 18000,
            "30ml": 50000
        },
        defaultSize: "30ml",
        description: "NolMart's flagship men's signature scent. A crisp, sparkling citrus-aromatic opening from 212 VIP Men gives way to the deep, smoky oud-oriental power of Tom Ford Noir Extreme. Fresh and confident up top, commanding and dark underneath — engineered to transition seamlessly from boardroom meetings to evening nightlife without reapplication.",
        bestFor: "Day-to-night signature wear, high-stakes meetings, dates, evening events.",
        character: "Bold • Smoky Oud • Sparkling Citrus • Commanding",
        formula: "Proprietary NolMart House Blend (212 VIP Men 55% + Tom Ford Noir Extreme 45% + 60% Oil Formula)",
        notes: {
            top: ["Sparkling Citrus", "Frozen Mint", "Passionfruit"],
            heart: ["Cardamom", "Kulfi Accord", "Nutmeg"],
            base: ["Smoky Oud", "Amber", "Sandalwood", "Rich Tonka"]
        },
        longevity: "12–16 Hours",
        sillage: "Strong (Commanding)",
        imageUrl: "img/products/crown-noir.png"
    },
    {
        id: "cashmere-bloom",
        name: "Cashmere Bloom",
        tagline: "Approachable Luxury — Powdery Florals & Sweet Warmth",
        category: "flagship",
        gender: "women",
        badge: "FLAGSHIP EXCLUSIVE",
        isFlagship: true,
        isBestseller: true,
        prices: {
            "10ml": 18000,
            "30ml": 50000
        },
        defaultSize: "30ml",
        description: "NolMart's flagship women's signature scent. The soft, sugary comfort of Marshmallow is gently wrapped in the powdery, mature floral elegance of Burberry Weekend. Sweet without being childish, elegant without being distant — approachable luxury in one bottle that draws constant compliments.",
        bestFor: "Everyday signature wear, romantic dates, daytime elegance, luxury gifting.",
        character: "Elegant • Powdery Floral • Cozy Gourmand • Sophisticated",
        formula: "Proprietary NolMart House Blend (Marshmallow 55% + Burberry Weekend 45% + 60% Oil Formula)",
        notes: {
            top: ["Mandarin", "Sage", "Zesty Citrus Lift"],
            heart: ["Hyacinth", "Iris", "Peach Blossom", "Soft Marshmallow"],
            base: ["Creamy Vanilla", "Sandalwood", "Cashmere Wood", "Clean White Musk"]
        },
        longevity: "10–14 Hours",
        sillage: "Moderate to Heavy (Radiant)",
        imageUrl: "img/products/cashmere-bloom.png"
    },
    {
        id: "azure-vip",
        name: "Azure VIP",
        tagline: "Quiet Confidence — Fresh Citrus & Warm Vanilla",
        category: "flagship",
        gender: "men",
        badge: "FLAGSHIP CALM",
        isFlagship: true,
        isBestseller: false,
        prices: {
            "10ml": 18000,
            "30ml": 50000
        },
        defaultSize: "30ml",
        description: "NolMart's men's calm flagship scent. A fresh, bright citrus-aromatic opening from 212 VIP Men settles into a smooth, warm Madagascar vanilla base. Clean and effortless — quiet confidence and refined charm that projects sophistication without shouting.",
        bestFor: "Daily office wear, casual daytime outings, warm weather, understated elegance.",
        character: "Clean • Smooth Vanilla • Fresh Citrus • Refined",
        formula: "Proprietary NolMart House Blend (212 VIP Men 35% + Vanilla 28 65% + 60% Oil Formula)",
        notes: {
            top: ["Bergamot", "Lime Zest", "Crisp Mint"],
            heart: ["Soft Spices", "Tonka Bean", "White Floral Accord"],
            base: ["Madagascar Vanilla Orchid", "Brown Sugar", "Amber Woods"]
        },
        longevity: "10–12 Hours",
        sillage: "Intimate to Moderate (Alluring)",
        imageUrl: "img/products/azure-vip.png"
    },
    {
        id: "onyx-bloom",
        name: "Onyx Bloom",
        tagline: "The Statement — Dark Oud & Romantic Floral",
        category: "flagship",
        gender: "women",
        badge: "FLAGSHIP BOLD",
        isFlagship: true,
        isBestseller: false,
        prices: {
            "10ml": 18000,
            "30ml": 50000
        },
        defaultSize: "30ml",
        description: "NolMart's bold women's flagship. Bold, smoky oud-oriental power from Tom Ford Noir Extreme is softened and contrasted by the delicate romantic heart of Pink Chiffon. The scent a woman wears when she wants to own the room and be unforgettable.",
        bestFor: "Evening galas, formal dinners, red carpets, special romantic celebrations.",
        character: "Sensual • Smoky Oriental • Rosy Floral • Unforgettable",
        formula: "Proprietary NolMart House Blend (Tom Ford Noir Extreme 55% + Pink Chiffon 45% + 60% Oil Formula)",
        notes: {
            top: ["Sparkling Red Pear", "Cardamom", "Citrus Sparkle"],
            heart: ["Pink Chiffon Petals", "Jasmine", "Kulfi Accord"],
            base: ["Dark Oud Wood", "Golden Amber", "Smoky Vanilla"]
        },
        longevity: "12–16 Hours",
        sillage: "Strong (Enveloping)",
        imageUrl: "img/products/onyx-bloom.png"
    },

    // --- 🌊 SIGNATURE BLENDS ---
    {
        id: "obsidian-reef",
        name: "Obsidian Reef",
        tagline: "Dark Aquatic Mystery — Oud Meets Ocean Breeze",
        category: "signature",
        gender: "unisex",
        badge: "CUSTOMER FAVORITE",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "10ml": 14000,
            "30ml": 40000
        },
        defaultSize: "30ml",
        description: "A dark-aquatic revelation. The deep oriental-oud depth of Tom Ford Noir Extreme is sliced open and elevated by the crisp marine sharpness of Reef. Dark, mysterious, yet surprisingly fresh and light on skin. A truly unique signature scent with validated repeat buyers.",
        bestFor: "Nightlife, ocean evenings, distinctive signature wear for both men and women.",
        character: "Aquatic • Woody Oud • Ozone • Mysterious",
        formula: "Tom Ford Noir Extreme (75%) + Reef (25%)",
        notes: {
            top: ["Marine Ozone", "Sea Salt Breeze", "Clean Citrus"],
            heart: ["Cardamom Spice", "Aquatic Driftwood"],
            base: ["Smoky Dark Oud", "Ambergris", "Clean Cedar"]
        },
        longevity: "10–14 Hours",
        sillage: "Moderate to Strong",
        imageUrl: "img/products/obsidian-reef.png"
    },
    {
        id: "coastal-dream",
        name: "Coastal Dream",
        tagline: "Sun-Drenched Island Vanilla & Coconut",
        category: "signature",
        gender: "women",
        badge: "POPULAR BLEND",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "10ml": 12000,
            "30ml": 35000
        },
        defaultSize: "30ml",
        description: "The warmth of golden tropical sun. Ripe island coconut layered over warm Madagascar bourbon vanilla. Inviting, sweet, and comforting like a beachside luxury resort in Zanzibar.",
        bestFor: "Daytime casual, vacations, sunny days, weekend brunches.",
        character: "Tropical • Warm Vanilla • Coconut Cream • Sunny",
        formula: "Coconut Passion (60%) + Vanilla 28 (40%)",
        notes: {
            top: ["Toasted Coconut", "Solar Notes"],
            heart: ["Vanilla Blossom", "Warm Coconut Milk"],
            base: ["Brown Sugar", "Amber", "Madagascar Vanilla"]
        },
        longevity: "8–12 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/coastal-dream.png"
    },
    {
        id: "electric-rush",
        name: "Electric Rush",
        tagline: "High-Energy Freshness with a Sweet Twist",
        category: "signature",
        gender: "unisex",
        badge: "TRENDING",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 12000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "A burst of dynamic, modern energy. Fresh zesty melon and energetic green notes from Now Rave balanced with the smooth creamy tropical warmth of Coconut Passion.",
        bestFor: "Workout, active mornings, social outings, hot summer days.",
        character: "Zesty • Energetic • Fresh Aquatic • Sweet Twist",
        formula: "Now Rave (70%) + Coconut Passion (30%)",
        notes: {
            top: ["Green Mandarin", "Crisp Melon", "Watery Notes"],
            heart: ["Lavender", "Subtle Coconut Flesh"],
            base: ["White Cedar", "Soft Musk", "Golden Amber"]
        },
        longevity: "8–10 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/electric-rush.png"
    },
    {
        id: "velvet-noir",
        name: "Velvet Noir",
        tagline: "Sensual Citrus & Rich Madagascar Vanilla",
        category: "signature",
        gender: "unisex",
        badge: "SIGNATURE BLEND",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 12000,
            "30ml": 35000
        },
        defaultSize: "30ml",
        description: "A velvety smooth union of crisp energetic top notes and deep vanilla comfort. Perfectly balanced 50/50 blend that wraps the wearer in an intoxicating aura.",
        bestFor: "Evenings, movie dates, cool weather, stylish outings.",
        character: "Sensual • Velvety • Warm Sweet • Magnetic",
        formula: "Now Rave (50%) + Vanilla 28 (50%)",
        notes: {
            top: ["Fresh Bergamot", "Sparkling Watermelon"],
            heart: ["Bourbon Vanilla", "Tonka Bean"],
            base: ["Brown Sugar Accord", "Cedarwood", "Musk"]
        },
        longevity: "10–12 Hours",
        sillage: "Moderate to Heavy",
        imageUrl: "img/products/velvet-noir.png"
    },
    {
        id: "paradise-mist",
        name: "Paradise Mist",
        tagline: "Exotic Triple-Blend Masterpiece",
        category: "signature",
        gender: "unisex",
        badge: "TRIPLE BLEND",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 15000,
            "30ml": 45000
        },
        defaultSize: "30ml",
        description: "An intricate 3-part blend combining tropical coconut, decadent Madagascar vanilla, and fresh zesty energetic notes. Rich, evolving, and opulent.",
        bestFor: "Luxury events, personal pampering, warm tropical evenings.",
        character: "Opulent • Multi-Layered • Creamy Coconut • Bright Fresh",
        formula: "Coconut Passion (40%) + Vanilla 28 (35%) + Now Rave (25%)",
        notes: {
            top: ["Green Mandarin", "Crisp Melon"],
            heart: ["Island Coconut", "Vanilla Orchid"],
            base: ["Madagascar Vanilla", "Soft Amber", "Cashmere Musk"]
        },
        longevity: "10–14 Hours",
        sillage: "Strong",
        imageUrl: "img/products/paradise-mist.png"
    },
    {
        id: "tropical-bloom",
        name: "Tropical Bloom",
        tagline: "Pink Florals & Sweet Island Breeze",
        category: "signature",
        gender: "women",
        badge: "ROMANTIC BLEND",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 12000,
            "30ml": 35000
        },
        defaultSize: "30ml",
        description: "The youthful, airy romantic floral heart of Pink Chiffon enriched by creamy warm island coconut. Radiates charm and effortless joy.",
        bestFor: "Day dates, brunch, warm sunny days, casual glam.",
        character: "Feminine • Sweet Floral • Coconut Cream • Playful",
        formula: "Pink Chiffon (55%) + Coconut Passion (45%)",
        notes: {
            top: ["Pink Lily", "Sweet Peach Nectar"],
            heart: ["Chiffon Florals", "Coconut Milk"],
            base: ["Warm Vanilla", "Creamy Woods", "Cotton Musk"]
        },
        longevity: "8–11 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/tropical-bloom.png"
    },
    {
        id: "ocean-breeze",
        name: "Ocean Breeze",
        tagline: "Pure Marine Vitality & Zesty Energy",
        category: "signature",
        gender: "unisex",
        badge: "CRISP FRESH",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 12000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "The ultimate revitalizing fragrance. Salty ocean waves and marine ozone colliding with the crisp, modern citrus energy of Now Rave.",
        bestFor: "Gym, morning commute, outdoor sports, high-energy days.",
        character: "Aquatic • Salty Air • Crisp Citrus • Revitalizing",
        formula: "Reef (60%) + Now Rave (40%)",
        notes: {
            top: ["Sea Spray", "Watermelon Rind", "Bergamot"],
            heart: ["Marine Accord", "Fresh Mint Leaf"],
            base: ["Driftwood", "Clean Amber", "White Musk"]
        },
        longevity: "8–10 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/ocean-breeze.png"
    },
    {
        id: "midnight-velvet",
        name: "Midnight Velvet",
        tagline: "Smoky Oud Wrapped in Golden Vanilla",
        category: "signature",
        gender: "unisex",
        badge: "NIGHT LUXURY",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 15000,
            "30ml": 45000
        },
        defaultSize: "30ml",
        description: "Deep, intoxicating indulgence. The dark, resinous, smoky cardamom and oud of Tom Ford Noir Extreme softened by decadent, sweet Madagascar vanilla.",
        bestFor: "Cold nights, intimate dinners, black-tie occasions.",
        character: "Decadent • Smoky Oud • Warm Amber Vanilla • Intoxicating",
        formula: "Tom Ford Noir Extreme (60%) + Vanilla 28 (40%)",
        notes: {
            top: ["Cardamom", "Mandarin Oil", "Saffron"],
            heart: ["Kulfi Accord", "Rose Absolute", "Vanilla Orchid"],
            base: ["Dark Oud", "Sandalwood", "Amber", "Rich Vanilla"]
        },
        longevity: "12–16 Hours",
        sillage: "Strong (Magnetic)",
        imageUrl: "img/products/midnight-velvet.png"
    },
    {
        id: "rose-cream",
        name: "Rose Cream",
        tagline: "Velvety Soft Petals & Sweet Custard",
        category: "signature",
        gender: "women",
        badge: "SOFT GLAM",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 12000,
            "30ml": 35000
        },
        defaultSize: "30ml",
        description: "A tender, gourmand floral delicacy. Soft, velvety pink rose petals whipped into rich vanilla cream. Demure, graceful, and deeply affectionate.",
        bestFor: "Daytime dates, quiet luxury, gifting, weddings.",
        character: "Soft • Creamy Rose • Warm Sweet • Gentle",
        formula: "Pink Chiffon (50%) + Vanilla 28 (50%)",
        notes: {
            top: ["Sparkling Pear", "Sweet Red Berries"],
            heart: ["Pink Chiffon Rose", "Vanilla Cream"],
            base: ["Brown Sugar", "Sandalwood", "Powdery Musk"]
        },
        longevity: "8–12 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/rose-cream.png"
    },
    {
        id: "lagoon",
        name: "Lagoon",
        tagline: "Tropical Reef & Island Coconut",
        category: "signature",
        gender: "unisex",
        badge: "SUMMER ESSENTIAL",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 12000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "Like diving into a pristine turquoise coral lagoon surrounded by palm trees. Refreshing sea salt meets velvety island coconut milk.",
        bestFor: "Beach getaways, sunny afternoons, easygoing daily wear.",
        character: "Aquatic • Coconut Water • Clean • Refreshing",
        formula: "Reef (55%) + Coconut Passion (45%)",
        notes: {
            top: ["Sea Salt Breeze", "Coconut Water"],
            heart: ["Ocean Lotus", "Creamy Coconut Flesh"],
            base: ["Driftwood", "Solar Amber", "Soft Musk"]
        },
        longevity: "8–10 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/lagoon.png"
    },

    // --- 🍬 PURE SCENTS (60% OIL EXTRAIT DE PARFUM) ---
    {
        id: "marshmallow",
        name: "Marshmallow",
        tagline: "Sweet, Cozy, Irresistible Gourmand",
        category: "pure",
        gender: "women",
        badge: "NEW ARRIVAL",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "A confectionery dream. Fluffy spun sugar, sweet vanilla cream, and cozy marshmallow accords. Universally adored, comforting, and an instant mood-lifter.",
        bestFor: "Casual outings, daily sweet signature, younger crowds, mood boost.",
        character: "Gourmand • Sugary Sweet • Cozy • Fluffy",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Spun Sugar", "Sweet Lemon Zest"],
            heart: ["Fluffy Marshmallow", "Cotton Candy Accord"],
            base: ["Vanilla Bean", "Whipped Cream", "Soft Musk"]
        },
        longevity: "8–12 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/marshmallow.png"
    },
    {
        id: "burberry-weekend",
        name: "Burberry Weekend",
        tagline: "Soft Powdery Floral & Zesty Citrus",
        category: "pure",
        gender: "women",
        badge: "NEW ARRIVAL",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "Relaxed, composed, and undeniably elegant. A zesty mandarin and sage opening transitioning gracefully into a powdery floral bouquet of hyacinth, iris, and nectarine.",
        bestFor: "Office wear, daytime luxury, professional meetings, weekends.",
        character: "Powdery Floral • Citrus Lift • Composed • Sophisticated",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Mandarin", "Sage", "Mignonette"],
            heart: ["Hyacinth", "Iris", "Peach Blossom", "Nectarine"],
            base: ["Sandalwood", "Cedar", "Soft Musk"]
        },
        longevity: "8–11 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/burberry-weekend.png"
    },
    {
        id: "212-vip-men",
        name: "212 VIP Men",
        tagline: "Fruity-Aromatic Nightlife Energy",
        category: "pure",
        gender: "men",
        badge: "NEW ARRIVAL",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "Modern, magnetic, and ready for the spotlight. Crisp frozen mint and sparkling passionfruit top notes over a smooth, slightly spicy woody amber base.",
        bestFor: "Nightlife, clubbing, parties, social gatherings, dates.",
        character: "Crisp • Fruity Aromatic • Nightlife • Confident",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Frozen Mint", "Passionfruit", "Caviar Lime"],
            heart: ["Vodka / Gin Accord", "Ginger", "Black Pepper"],
            base: ["King Wood", "Amber", "Leather Accord"]
        },
        longevity: "9–12 Hours",
        sillage: "Strong",
        imageUrl: "img/products/212-vip-men.png"
    },
    {
        id: "coconut-passion",
        name: "Coconut Passion",
        tagline: "Warm Tropical Coconut & Sensual Vanilla",
        category: "pure",
        gender: "women",
        badge: "TOP SELLER",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "The gold standard of sweet island fragrances. Decadent warm coconut kissed by soothing vanilla and calming aloe vera. Like warm sunbeams on bare skin.",
        bestFor: "Daily signature, beach outings, casual comfort, gifting.",
        character: "Sweet • Tropical • Warm • Comforting",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Toasted Island Coconut"],
            heart: ["Warm Vanilla Flower", "Aloe Accord"],
            base: ["Chamomile", "Amber Sugar"]
        },
        longevity: "8–11 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/coconut-passion.png"
    },
    {
        id: "vanilla-28",
        name: "Vanilla 28",
        tagline: "Deep, Rich, Madagascar Brown Sugar Vanilla",
        category: "pure",
        gender: "unisex",
        badge: "BESTSELLER",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "Not your ordinary sweet vanilla. A rich, mature, boozy Madagascar vanilla infused with brown sugar, amber, and tonka bean. An intoxicating masterpiece on its own or layered.",
        bestFor: "Anytime signature, date nights, layering with fresh scents, cozy evenings.",
        character: "Warm Gourmand • Madagascar Vanilla • Brown Sugar • Boozy",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Vanilla Orchid", "Creamy Jasmine"],
            heart: ["Tonka Absolute", "Brown Sugar"],
            base: ["Amber Woods", "Musk", "Patchouli"]
        },
        longevity: "10–14 Hours",
        sillage: "Moderate to Heavy",
        imageUrl: "img/products/vanilla-28.png"
    },
    {
        id: "pink-chiffon",
        name: "Pink Chiffon",
        tagline: "Romantic Floral Kiss & Sparkling Red Pear",
        category: "pure",
        gender: "women",
        badge: "ROMANTIC CLASSIC",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "An airy, fluttery blend of sparkling pear, peach nectar, and delicate pink florals wrapped in sheer vanilla chiffon. Soft, feminine, and utterly charming.",
        bestFor: "Daytime wear, church, brunch, romantic dates, gift for her.",
        character: "Feminine • Sheer Floral • Fruity Sparkle • Delicate",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Sparkling Pear", "Peach Nectar", "Wild Berries"],
            heart: ["Pink Chiffon Petals", "Water Lily", "Apple Blossom"],
            base: ["Sheer Vanilla", "Sandalwood", "Chiffon Musk"]
        },
        longevity: "8–11 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/pink-chiffon.png"
    },
    {
        id: "tom-ford-noir-extreme",
        name: "Tom Ford Noir Extreme",
        tagline: "Dark, Resinous, Cardamom & Smoky Amber",
        category: "pure",
        gender: "unisex",
        badge: "DARK LUXURY",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "10ml": 12000,
            "30ml": 40000
        },
        defaultSize: "30ml",
        description: "An amber-drenched, woody oriental fragrance with a tantalizing, delectable heart. Captures the aspect of the person who relishes in immoderation and dares to be extraordinary.",
        bestFor: "Evenings, formal suits, night events, statement signature scent.",
        character: "Dark • Oriental • Rich Cardamom • Smoky Woods",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Cardamom", "Nutmeg", "Saffron", "Mandarin Oil"],
            heart: ["Kulfi Accord", "Rose Absolute", "Jasmine", "Orange Blossom"],
            base: ["Dark Amber", "Sandalwood", "Smoky Vanilla"]
        },
        longevity: "12–16 Hours",
        sillage: "Heavy (Magnetic)",
        imageUrl: "img/products/tom-ford-noir-extreme.png"
    },
    {
        id: "reef",
        name: "Reef",
        tagline: "Pure Marine Wave & Salty Clean Air",
        category: "pure",
        gender: "unisex",
        badge: "CLEAN AQUATIC",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "The cleanest breath of ocean air. Crisp marine water, sea salt crystals, and bleached driftwood. Crisp, non-greasy, and infinitely refreshing.",
        bestFor: "Warm weather, office, gym, casual weekends, daily reset.",
        character: "Aquatic • Sea Salt • Driftwood • Crisp",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Sea Salt Crystals", "Ozone", "Bergamot"],
            heart: ["Marine Algae", "Clean Water Accord"],
            base: ["Driftwood", "Ambergris", "White Cedar"]
        },
        longevity: "8–10 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/reef.png"
    },
    {
        id: "now-rave",
        name: "Now Rave",
        tagline: "Electric Freshness & Modern Unisex Spark",
        category: "pure",
        gender: "unisex",
        badge: "FRESH & BOLD",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "10ml": 10000,
            "30ml": 30000
        },
        defaultSize: "30ml",
        description: "Bright, zesty, and pulsating with life. Energetic watermelon rind, green mandarin, and crisp herbs over clean woods. A modern crowd-pleaser that never feels heavy.",
        bestFor: "Daytime, energetic outings, hot afternoons, crowd gatherings.",
        character: "Zesty • Crisp Watermelon • Modern • Refreshing",
        formula: "60% Pure Essential Oil + 40% Perfumer's Ethanol + Fixative",
        notes: {
            top: ["Watermelon", "Green Mandarin", "Lemon Leaf"],
            heart: ["Lavender", "Crisp Thyme"],
            base: ["Cedarwood", "Clean Amber", "Musk"]
        },
        longevity: "8–10 Hours",
        sillage: "Moderate",
        imageUrl: "img/products/now-rave.png"
    },

    // --- 🎁 DISCOVERY BUNDLES & GIFT SETS (HIGH CONVERSION UP-SELLS) ---
    {
        id: "bundle-try-and-buy",
        name: "Try & Buy Discovery Set",
        tagline: "3 × 10ml Pocket Atomizers (Pick Any 3 Scents!)",
        category: "bundle",
        gender: "unisex",
        badge: "BEST VALUE (SAVE 5,000 TZS)",
        isFlagship: false,
        isBestseller: true,
        prices: {
            "3x10ml": 25000
        },
        defaultSize: "3x10ml",
        description: "The ultimate trial pack! Choose any 3 pure scents or signature blends in sleek 10ml handbag/pocket atomizers. Experience different vibes for work, dates, and weekends without committing to full bottles. Saves 5,000 TZS instantly!",
        bestFor: "First-time buyers, scent exploring, gifts, frequent travelers.",
        character: "Value Set • 3 Fragrances • 100% Customizable • Pocket Ready",
        formula: "Three individual 10ml bottles with 60% Oil Extrait de Parfum formula",
        notes: {
            top: ["Your Choice of 3 Scents", "Customizable at Checkout"],
            heart: ["Extrait de Parfum Strength", "High Oil Concentration"],
            base: ["Includes Premium Mifuko Packaging", "Atomizer Sprayers"]
        },
        longevity: "8–14 Hours Each",
        sillage: "Customizable",
        imageUrl: "img/products/bundle-try-and-buy.png"
    },
    {
        id: "bundle-his-hers",
        name: "His & Hers Flagship Couple Pack",
        tagline: "1 × 30ml Crown Noir + 1 × 30ml Cashmere Bloom",
        category: "bundle",
        gender: "unisex",
        badge: "COUPLE LUXURY (SAVE 5,000 TZS)",
        isFlagship: true,
        isBestseller: true,
        prices: {
            "Set": 95000
        },
        defaultSize: "Set",
        description: "The pinnacle of NolMart Scents. Includes a full 30ml bottle of Crown Noir (Men's Flagship) and a full 30ml bottle of Cashmere Bloom (Women's Flagship). The ultimate anniversary, wedding, or couple's luxury gift set.",
        bestFor: "Couples, anniversary gifts, weddings, Valentine's Day, premium luxury gifting.",
        character: "Flagship Duo • Men + Women • Royal Sillage • Premium Gift Box",
        formula: "Two full 30ml bottles (Crown Noir + Cashmere Bloom)",
        notes: {
            top: ["Crown Noir (Citrus & Mint)", "Cashmere Bloom (Mandarin & Sage)"],
            heart: ["Crown Noir (Smoky Oud & Cardamom)", "Cashmere Bloom (Hyacinth & Peach)"],
            base: ["Crown Noir (Dark Amber & Woods)", "Cashmere Bloom (Creamy Vanilla & Musk)"]
        },
        longevity: "12–16 Hours",
        sillage: "Commanding & Radiant",
        imageUrl: "img/products/bundle-his-hers.png"
    },
    {
        id: "bundle-new-arrivals",
        name: "New Arrivals Trio",
        tagline: "1 × 10ml Burberry Weekend + Marshmallow + 212 VIP Men",
        category: "bundle",
        gender: "unisex",
        badge: "NEW RELEASES (SAVE 2,000 TZS)",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "3x10ml": 28000
        },
        defaultSize: "3x10ml",
        description: "Experience all three of our latest releases in one curated collection: Burberry Weekend (Powdery Floral), Marshmallow (Confectionery Sweet), and 212 VIP Men (Fruity Aromatic Nightlife).",
        bestFor: "Trendsetters, trying the newest releases, portable variety pack.",
        character: "Fresh • Sweet • Powdery • High Versatility",
        formula: "Three 10ml bottles of our newest release formulas",
        notes: {
            top: ["Burberry Weekend (Floral)", "Marshmallow (Sweet)", "212 VIP Men (Fresh Nightlife)"],
            heart: ["High Scent Definition", "60% Pure Oil Formula"],
            base: ["Long Lasting Fixative", "Pocket Atomizers"]
        },
        longevity: "8–12 Hours",
        sillage: "Moderate to Strong",
        imageUrl: "img/products/bundle-new-arrivals.png"
    },
    {
        id: "bundle-luxury-duo",
        name: "Luxury Duo Gift Box",
        tagline: "2 × 30ml Signature Blends of Your Choice",
        category: "bundle",
        gender: "unisex",
        badge: "PREMIUM GIFT",
        isFlagship: false,
        isBestseller: false,
        prices: {
            "2x30ml": 70000
        },
        defaultSize: "2x30ml",
        description: "Choose any two 30ml bottles from our Signature Blends collection (e.g. Obsidian Reef, Coastal Dream, Midnight Velvet, Electric Rush, Rose Cream). Packaged in a NolMart luxury gift bag.",
        bestFor: "Birthday gifts, executive presents, personal fragrance wardrobe upgrade.",
        character: "Customizable • Luxury 30ml Bottles • Big Savings",
        formula: "Two full 30ml bottles of your selected Signature Blends",
        notes: {
            top: ["Select Any 2 Blends", "Full 30ml Luxury Bottles"],
            heart: ["Extrait de Parfum Strength", "Artisanal Maturation"],
            base: ["Deluxe Gift Packaging", "Free Dar es Salaam Delivery Eligible"]
        },
        longevity: "10–14 Hours",
        sillage: "High",
        imageUrl: "img/products/bundle-luxury-duo.png"
    }
];

// Helper functions for filtering and lookup
export function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

export function getFlagshipProducts() {
    return PRODUCTS.filter(p => p.isFlagship);
}

export function getBestsellerProducts() {
    return PRODUCTS.filter(p => p.isBestseller);
}

export function getProductsByCategory(category) {
    if (!category || category === "all") return PRODUCTS;
    return PRODUCTS.filter(p => p.category === category);
}

export function getProductsByGender(gender) {
    if (!gender || gender === "all") return PRODUCTS;
    return PRODUCTS.filter(p => p.gender === gender || p.gender === "unisex");
}
