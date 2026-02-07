const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔐 Supabase 설정 (옵션)
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const sbAdmin = createClient(supabaseUrl, supabaseKey);

// ==========================================================================
// 1. DATA_SHEET (인테리어 전문가용 풀 데이터셋)
// ==========================================================================
const DATA_SHEET = {
    // A. CONTEXT
    "country": [
        "Luxury Penthouse", "Modern Apartment", "Parisian Haussmann Apartment", "Industrial Loft", 
        "Minimalist Villa", "Hanok Traditional House", "Tropical Resort Villa", "Country Cottage", 
        "Glass House", "Basement Studio", "High-rise Office", "Retail Flagship Store"
    ],
    "region": [
        "City Skyline", "Central Park Greenery", "Ocean Horizon", "Forest Panorama", 
        "Rainy Street", "Snowy Mountain", "Night City Lights", "Private Courtyard", 
        "Old Brick Wall", "River View"
    ],
    "site": [
        "Double Height Ceiling", "Standard Ceiling Height", "Low Cozy Ceiling", 
        "Vaulted Ceiling", "Sloped Attic Ceiling", "Exposed Concrete Ceiling", 
        "Coffered Ceiling", "Glass Ceiling"
    ],
    "usage_mapping": {
        "1.Residential": ["Living Room", "Master Bedroom", "Open Kitchen & Dining", "Luxury Bathroom", "Powder Room", "Walk-in Closet", "Home Office", "Entrance Hall", "Kids Room", "Balcony Garden"],
        "2.Commercial": ["Hip Cafe", "Artisan Bakery", "Fine Dining Restaurant", "Whiskey Bar", "Fashion Boutique", "Flagship Store", "Pop-up Store", "Hair Salon", "Flower Shop"],
        "3.Office": ["Open Workstation", "CEO Office", "Conference Room", "Creative Lounge", "Studio"],
        "4.Hospitality": ["Hotel Lobby", "Hotel Suite", "Library", "Art Gallery", "Museum Hall", "Spa & Wellness"],
        "5.Special": ["Home Gym", "Home Cinema", "Gaming Room", "Wine Cellar", "Indoor Garden"]
    },
    // B. STYLE
    "style": [
        "Modern", "Contemporary", "Minimalist", "Industrial", "Mid-Century Modern", 
        "Scandinavian", "Traditional", "Transitional", "Art Deco", "French Country", 
        "Rustic", "Bohemian", "Coastal Hamptons", "Japandi", "Hollywood Regency"
    ],
    // C. MATERIALS
    "mat": [
        "White Plaster", "Venetian Plaster", "Exposed Concrete", "White Painted Brick", 
        "Red Brick", "Natural Stone", "Oak Wood Paneling", "Walnut Wood Paneling", 
        "Tambour Board", "Silk Wallpaper", "Patterned Wallpaper", "Wainscoting", 
        "Marble Slab", "Glass Wall", "Mirror Wall", "Stainless Steel"
    ],
    "floor": [
        "Herringbone Parquet", "Chevron Parquet", "Wide Plank Oak", "Dark Walnut", 
        "Polished Concrete", "Microcement", "Terrazzo", "White Marble", "Black Marble", 
        "Travertine Tile", "Porcelain Tile", "Sisal Rug", "Wall-to-wall Carpet", "Epoxy"
    ],
    "form": [ // Ceiling Details
        "Wooden Beams", "Decorative Molding", "Recessed Lighting Cove", 
        "Industrial Pipes", "Skylight Window", "Minimal Flat"
    ],
    // D. FURNISHING
    "detail": [ // Furniture
        "Modular Low Sofa", "Curved Velvet Sofa", "Leather Chesterfield", 
        "Pierre Jeanneret Chairs", "Eames Lounge Chair", "Wishbone Chairs", 
        "Marble Dining Table", "Solid Wood Slab", "Glass Coffee Table", 
        "Built-in Cabinetry", "Floating Shelves", "Rattan Furniture", "Steel Tube Furniture"
    ],
    "concept": [ // Colors
        "All White", "Warm Beige & Cream", "Greige Tone", "Monochromatic Grey", 
        "Black & White", "Earthy Terracotta", "Pastel Tones", "Deep Green & Gold", 
        "Navy Blue & Wood", "Burgundy & Brass", "Vibrant Pop Colors", "Dark & Moody"
    ],
    "car": [ // Decor
        "Large Potted Plants", "Abstract Painting", "Sculptural Ceramics", 
        "Coffee Table Books", "Vintage Vinyls", "Luxury Perfumes", 
        "Minimal Objects", "Travel Souvenirs"
    ],
    "road": [ // Textiles
        "Persian Rug", "Geometric Wool Rug", "Jute Rug", "Sheepskin Throw", 
        "Silk Curtains", "Linen Drapes", "No Rug"
    ],
    "land": [ // Plants
        "Monstera Plant", "Olive Tree", "Fiddle Leaf Fig", "Dried Flowers", 
        "Fresh Tulips", "Vertical Garden", "No Plants"
    ],
    // E. LIGHTING
    "weather": [ // Fixtures
        "Crystal Chandelier", "Modern Pendant", "Linear LED", "Track Lighting", 
        "Floor Lamp", "Table Lamp", "Neon Sign", "Paper Lantern", "Architectural Slot Light"
    ],
    "light": [ // Effects
        "Soft Morning Light", "Strong Sunlight", "Golden Hour", "Blue Hour", 
        "Diffused Light", "God Rays", "Moonlight", "Dramatic Contrast", "Artificial Light Only"
    ],
    "mood": [
        "Cozy & Warm", "Clean & Sterile", "Luxurious", "Moody & Atmospheric", 
        "Airy & Breezy", "Masculine", "Romantic", "Professional", "Zen"
    ],
    "time": ["Early Morning", "Midday", "Late Afternoon", "Sunset", "Night", "Midnight"],
    "season": ["Spring Blossom", "Summer Greenery", "Autumn Leaves", "Winter Snow"],
    
    // F. TECH SPECS
    "rep": ["Hyper-realistic Photo", "3D Render", "Architectural Sketch", "Watercolor"],
    "engine": ["Unreal Engine 5.5", "Corona Render", "V-Ray 6", "Midjourney V6.1"],
    "view": ["Eye-level", "Low Angle", "High Angle", "Top-down Plan", "Wide Angle", "Close-up", "Isometric"],
    "lens": ["16mm Wide", "24mm Std Wide", "35mm Standard", "50mm Portrait", "85mm Detail", "Macro"],
    "ratio": ["--ar 16:9", "--ar 4:3", "--ar 3:4", "--ar 9:16", "--ar 1:1"],
    "motion": ["Still Life", "Motion Blur", "Long Exposure"]
};

// 💎 15 THEME PRESETS (Complete)
const COMMON_SPECS = { s14: "Hyper-realistic Photo", s15: "Unreal Engine 5.5", s16: "Eye-level", s22: "24mm Std Wide", s18: "--ar 4:3" };

const THEME_PRESETS = {
    'modern': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Modern", s6: "Glass Wall", s7: "Polished Concrete", s2: "Open Plan", s24: "Neutral Palette", boost: "Bauhaus, clean lines, functional, no clutter" }],
    'contemporary': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Lounge", s5: "Contemporary", s6: "Natural Stone", s7: "Wide Plank Oak", s23: "Curved Velvet Sofa", s24: "Bold Contrast", boost: "fluid curves, trendy, sculptural, current fashion" }],
    'minimal': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Bedroom", s5: "Minimalist", s6: "White Plaster", s7: "Microcement", s25: "Minimal Objects", s24: "All White", boost: "negative space, zen, clutter-free, essentialism" }],
    'industrial': [{ ...COMMON_SPECS, s3: "2.Commercial", s4: "Hip Cafe", s5: "Industrial", s6: "Exposed Concrete", s7: "Epoxy", s8: "Industrial Pipes", s23: "Steel Tube Furniture", boost: "loft style, raw texture, brooklyn, rusted metal" }],
    'midcentury': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Home Office", s5: "Mid-Century Modern", s6: "Walnut Wood Paneling", s7: "Dark Walnut", s23: "Eames Lounge Chair", s24: "Deep Green & Gold", boost: "vintage, mad men style, organic curves, 1950s" }],
    'scandi': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Dining Room", s5: "Scandinavian", s6: "White Painted Brick", s7: "Herringbone Parquet", s19: "Monstera Plant", s24: "Warm Beige & Cream", boost: "hygge, cozy, bright, natural light, functional" }],
    'traditional': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Library", s5: "Traditional", s6: "Wainscoting", s7: "Dark Walnut", s23: "Leather Chesterfield", s24: "Burgundy & Brass", boost: "classic, symmetry, luxury, molding, dignity" }],
    'transitional': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Transitional", s6: "Patterned Wallpaper", s7: "Wide Plank Oak", s23: "Modular Low Sofa", s24: "Greige Tone", boost: "refined, elegant, comfort, balance of old and new" }],
    'artdeco': [{ ...COMMON_SPECS, s3: "4.Hospitality", s4: "Hotel Lobby", s5: "Art Deco", s6: "Marble Slab", s7: "Black Marble", s10: "Crystal Chandelier", s24: "Black & White", boost: "glamour, geometric patterns, gold accents, great gatsby" }],
    'french': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Kitchen", s5: "French Country", s6: "Venetian Plaster", s7: "Travertine Tile", s25: "Dried Flowers", s24: "Pastel Tones", boost: "rustic elegance, provence, romantic, soft curves" }],
    'rustic': [{ ...COMMON_SPECS, s3: "5.Special", s4: "Wine Cellar", s5: "Rustic", s6: "Natural Stone", s7: "Raw Wood Log", s8: "Wooden Beams", s24: "Earthy Terracotta", boost: "primitive, raw nature, cozy cabin, unrefined" }],
    'boho': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Bedroom", s5: "Bohemian", s6: "Patterned Wallpaper", s7: "Sisal Rug", s23: "Rattan Furniture", s24: "Vibrant Pop Colors", boost: "eclectic, plants, layered textures, free spirit" }],
    'coastal': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Coastal Hamptons", s6: "White Plaster", s7: "Wide Plank Oak", s20: "Linen Drapes", s24: "Navy Blue & Wood", boost: "beach house, airy, relaxed luxury, breeezy" }],
    'japandi': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Japandi", s6: "Tambour Board", s7: "Microcement", s23: "Modular Low Sofa", s24: "Warm Beige", boost: "wabi-sabi, warm minimalism, wood & stone, meditation" }],
    'hollywood': [{ ...COMMON_SPECS, s3: "1.Residential", s4: "Walk-in Closet", s5: "Hollywood Regency", s6: "Mirror Wall", s7: "White Marble", s23: "Curved Velvet Sofa", s24: "Vibrant Pop Colors", boost: "opulence, glam, high gloss, drama, cinema" }]
};

// API Endpoints
app.get('/api/data', (req, res) => res.json({ dataSheet: DATA_SHEET }));
app.get('/api/preset/:themeKey', (req, res) => {
    const presets = THEME_PRESETS[req.params.themeKey];
    res.json(presets ? presets[0] : { error: "No preset" });
});

// 🍌 [Nano Banana Optimized Generation Logic]
app.post('/api/generate', async (req, res) => {
    const { choices, themeBoost, userId } = req.body;
    
    // Clean inputs
    const getV = (k) => choices[k] ? choices[k].replace(/\([^)]*\)/g, "").trim() : "";

    // Build the Narrative
    const style = getV('s5') || "Modern";
    const room = getV('s4') || getV('s3') || "Interior Space";
    const context = getV('s0') ? `situated within a ${getV('s0')}` : "";
    
    // 1. Main Subject Sentence
    let prompt = `Create a **photorealistic interior design image** of a **${style} ${room}** ${context}.`;
    
    // 2. Architectural Features
    let features = [];
    if(getV('s2')) features.push(`a ${getV('s2')}`);
    if(getV('s8')) features.push(`architectural details like ${getV('s8')}`);
    if(getV('s1')) features.push(`large windows revealing a ${getV('s1')}`);
    
    if(features.length > 0) prompt += ` The space is characterized by ${features.join(', ')}.`;

    // 3. Materials & Finishes
    prompt += ` The design features **${getV('s6') || "clean walls"}** paired with **${getV('s7') || "matching flooring"}**.`;

    // 4. Decor & Furnishing
    prompt += ` The room is furnished with **${getV('s23') || "contemporary furniture"}**`;
    if(getV('s24')) prompt += ` following a **${getV('s24')} color palette**`;
    prompt += `.`;
    
    if(getV('s25') || getV('s20')) {
        prompt += ` Decor highlights include ${[getV('s25'), getV('s20')].filter(Boolean).join(' and ')}.`;
    }

    // 5. Lighting & Atmosphere (Crucial for Banana)
    prompt += ` The atmosphere is **${getV('s11') || "inviting"}**, illuminated by ${getV('s10') || "ambient lighting"} creating ${getV('s17') || "soft shadows"}.`;
    if(getV('s9')) prompt += ` The time is ${getV('s9')}.`;

    // 6. Artistic Boost (Gemini loves style descriptors)
    if(themeBoost) prompt += `\n\n**Artistic Style**: Capture the essence of ${themeBoost}.`;

    // 7. Technical Specs
    prompt += `\n\n**Technical Details**: Shot from a ${getV('s16') || "eye-level"} perspective using a ${getV('s22') || "24mm lens"}.`;
    prompt += ` Rendered in ${getV('s15') || "Unreal Engine 5"} style, achieving ${getV('s14') || "Hyper-realism"}.`;
    
    // 8. Quality & Constraints
    prompt += `\n**Quality Requirements**: 8k resolution, award-winning interior photography, sharp focus, perfectly balanced composition.`;
    prompt += `\n**Negative Constraints**: Do not include text, watermarks, blurred foregrounds, or distorted geometry.`;
    
    const ratio = (choices['s18'] || "--ar 4:3").replace("--ar ", "");
    prompt += `\n(Target Aspect Ratio: ${ratio})`;

    res.json({ result: prompt, remainingCredits: 99 });
});

app.listen(port, () => console.log(`🚀 MY INTERIOR PRO Server running on http://localhost:${port}`));