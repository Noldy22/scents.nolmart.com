// js/bottle-palette.js
// Liquid & cap colours for each NolMart bottle, sampled directly from the
// product photography in img/products/ so the 3D bottles match the photos.
// Bundles and car fresheners are not single bottles, so they are not listed.

export const BOTTLE_PALETTE = {
    "212-vip-men": { top: "#43a6d8", bottom: "#1e6fa1", cap: "navy" },
    "azure-vip": { top: "#60abe7", bottom: "#296fb5", cap: "gold" },
    "burberry-weekend": { top: "#e8ca9d", bottom: "#c3a06f", cap: "navy" },
    "cashmere-bloom": { top: "#f3bfca", bottom: "#d28da0", cap: "gold" },
    "club-de-nuit": { top: "#b9802b", bottom: "#231a12", cap: "navy" },
    "coastal-dream": { top: "#4dcece", bottom: "#1f8d97", cap: "navy" },
    "coconut-passion": { top: "#f3ca83", bottom: "#d29c51", cap: "navy" },
    "crown-noir": { top: "#ab6926", bottom: "#261a14", cap: "gold" },
    "electric-rush": { top: "#3ea1f1", bottom: "#1960b0", cap: "navy" },
    "lagoon": { top: "#34a1d7", bottom: "#0f6092", cap: "navy" },
    "marshmallow": { top: "#fdd9e9", bottom: "#e6b4c8", cap: "navy" },
    "midnight-velvet": { top: "#8d3579", bottom: "#4c1942", cap: "navy" },
    "now-rave": { top: "#4db5f1", bottom: "#1f79bf", cap: "navy" },
    "obsidian-reef": { top: "#2b87a0", bottom: "#144251", cap: "navy" },
    "ocean-breeze": { top: "#39bae2", bottom: "#1479ab", cap: "navy" },
    "onyx-bloom": { top: "#9c3a7e", bottom: "#5b1e4c", cap: "gold" },
    "paradise-mist": { top: "#f3a1ca", bottom: "#d26fa0", cap: "navy" },
    "pink-chiffon": { top: "#fdc0d5", bottom: "#eb92b4", cap: "navy" },
    "reef": { top: "#48c9d3", bottom: "#1a8892", cap: "navy" },
    "rose-cream": { top: "#f3abb6", bottom: "#d77988", cap: "navy" },
    "sauvage-dior": { top: "#3473bc", bottom: "#10274a", cap: "navy" },
    "strawberry": { top: "#f64c6f", bottom: "#bf1535", cap: "navy" },
    "tom-ford-noir-extreme": { top: "#995b2b", bottom: "#2f1f19", cap: "navy" },
    "tropical-bloom": { top: "#f8b584", bottom: "#e18356", cap: "navy" },
    "vanilla-28": { top: "#dea65c", bottom: "#b07437", cap: "navy" },
    "velvet-noir": { top: "#693043", bottom: "#1f1419", cap: "navy" },
};

export function getBottlePalette(id) {
    return BOTTLE_PALETTE[id] || null;
}
