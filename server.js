const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ⚠️ 실제 Supabase 키값으로 변경 필요 (환경변수 권장)
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';
const sbAdmin = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🛋️ [DATASET] 인테리어 전용 전체 데이터 (30개 카테고리 풀버전)
const DATA_SHEET = {
    "usage_mapping": {
        "1.Residential": ["Living Room", "Master Bedroom", "Open Kitchen & Dining", "Luxury Bathroom", "Powder Room", "Home Office", "Walk-in Closet", "Entrance Hall", "Kids Room", "Attic Lounge", "Home Bar", "Guest Room"],
        "2.Commercial": ["Hip Cafe", "Fine Dining Restaurant", "Whiskey Bar", "Fashion Boutique", "Flagship Store", "Artisan Bakery", "Flower Shop", "Hair Salon", "Yoga Studio", "Pop-up Store"],
        "3.Office": ["CEO Office", "Open Workstation", "Conference Room", "Creative Lounge", "Lobby & Reception", "Meeting Booth"],
        "4.Hospitality": ["Hotel Lobby", "Luxury Hotel Suite", "Art Gallery", "Museum Hall", "Spa & Wellness Center", "Library", "Resort Lounge"],
        "5.Special": ["Home Cinema", "Gaming Room", "Wine Cellar", "Indoor Garden", "Home Gym", "Recording Studio", "Cat Cafe"]
    },
    "style": [
        "Modern Minimalist", "Contemporary", "Industrial Loft", "Mid-Century Modern", "Scandinavian (Nordic)", 
        "Traditional Classic", "Art Deco", "French Provincial", "Rustic Farmhouse", "Bohemian (Boho)", 
        "Coastal Hamptons", "Japandi", "Hollywood Regency", "Zen", "Wabi-sabi", "Bauhaus", "Maximalist"
    ],
    "mat": [ // Wall Finish (s6)
        "Venetian Plaster", "Microcement", "Exposed Concrete", "Oak Wood Paneling", "Walnut Fluted Panels", 
        "White Marble Slab", "Black Marquina Marble", "Red Brick Wall", "White Painted Brick", "Travertine Stone", 
        "Stainless Steel Panels", "Brushed Aluminum", "Terrazzo Wall", "Velvet Fabric Wall", "Tambour Board", 
        "Wallpaper (Floral)", "Silk Wallpaper", "Limestone", "Glass Block Wall"
    ],
    "floor": [ // Flooring (s7)
        "Herringbone Oak Parquet", "Chevron Walnut Parquet", "Wide Plank Timber", "Polished Concrete", 
        "Microcement", "Terrazzo", "White Carrara Marble", "Black Slate Tile", "Checkered Black&White Marble", 
        "Porcelain Tile", "Sisal Rug", "Wall-to-wall Wool Carpet", "Epoxy Resin", "Travertine Tile"
    ],
    "form": [ // Ceiling Detail (s8)
        "Vaulted Ceiling", "Coffered Ceiling", "Exposed Wooden Beams", "Recessed Lighting Cove", 
        "Industrial Exposed HVAC Pipes", "Skylight Installation", "Minimalist Flat Ceiling", "Double-height Void", 
        "Sloped Attic Ceiling", "Decorative Molding", "Drop Ceiling with LED"
    ],
    "detail": [ // Key Furniture (s23)
        "Modular Low Sofa", "Pierre Jeanneret Chairs", "Eames Lounge Chair", "Curved Velvet Sofa", 
        "Marble Island Counter", "Solid Wood Slab Table", "Built-in Library Shelves", "Floating Staircase", 
        "Rattan Furniture", "Steel Tube Chairs", "Chesterfield Leather Sofa", "Noguchi Coffee Table", 
        "Wishbone Chairs", "Four-poster Bed", "Free-standing Bathtub"
    ],
    "concept": [ // Color Palette (s24)
        "Warm Beige & Cream", "All White Minimal", "Monochromatic Grey", "Greige Tones", 
        "Black & White High Contrast", "Earthy Terracotta & Sage", "Deep Green & Gold", 
        "Navy Blue & Dark Wood", "Burgundy & Brass", "Pastel Sorbet Colors", "Dark & Moody Charcoal", 
        "Vibrant Pop Colors", "Neutral with Black Accents"
    ],
    "land": [ // Planterior (s19)
        "Large Monstera Deliciosa", "Olive Tree in Terracotta Pot", "Fiddle Leaf Fig", "Dried Pampas Grass", 
        "Hanging Pothos", "Vertical Moss Wall", "Indoor Bamboo Grove", "Bonsai Collection", 
        "Fresh Cut Tulips", "Palm Tree", "No Plants"
    ],
    "road": [ // Textiles (s20)
        "Persian Rug", "Geometric Wool Rug", "Jute Rug", "Sheepskin Throw", "Silk Curtains", 
        "Linen Drapes", "Motorized Blinds", "Velvet Cushions", "Knitted Throw Blanket", "No Textiles"
    ],
    "weather": [ // Fixtures (s10)
        "Crystal Chandelier", "Bauhaus Pendant Light", "Architectural Magnetic Track Light", 
        "Noguchi Paper Lantern", "Neon Signage", "Minimalist LED Line", "Brass Wall Sconces", 
        "Arco Floor Lamp", "Table Lamp", "Recessed Downlights"
    ],
    "light": [ // Lighting Effect (s17)
        "Morning Sunlight", "Golden Hour Glow", "Blue Hour Dusk", "Soft Diffused Light", 
        "Dramatic Chiaroscuro", "Cyberpunk Neon Glow", "Warm Interior Incandescent", 
        "Moonlight through Window", "God Rays", "Volumetric Fog"
    ],
    "mood": [ // Mood (s11)
        "Serene & Zen", "Luxurious & Grand", "Cozy & Warm", "Moody & Atmospheric", 
        "Airy & Breezy", "Professional & Clean", "Romantic", "Futuristic", "Vintage & Nostalgic"
    ],
    "time": ["Early Morning", "Midday", "Late Afternoon", "Sunset", "Night", "Midnight"],
    "season": ["Spring (Blossom)", "Summer (Vibrant)", "Autumn (Warm)", "Winter (Snowy)"],
    "country": [ // Context (s0)
        "Seoul, Korea", "Paris, France", "Manhattan, NY", "Tokyo, Japan", "Milan, Italy", 
        "Copenhagen, Denmark", "London, UK", "Santorini, Greece", "Bali, Indonesia", "Berlin, Germany"
    ],
    "region": [ // View (s1)
        "City Skyline View", "Park Greenery View", "Ocean Horizon View", "Rainy Street View", 
        "Private Courtyard View", "Night City Lights View", "Snowy Mountain View", "Eiffel Tower View"
    ],
    "site": ["Penthouse Loft", "Luxury Apartment", "Industrial Loft", "Minimalist Villa", "Hanok House", "Flagship Store", "Basement Studio"],
    "rep": ["Hyper-realistic Photo", "3D Render", "Architectural Photography", "Watercolor Sketch", "Cinematic Shot"],
    "engine": ["Unreal Engine 5.5", "Octane Render", "V-Ray 6", "Corona Render", "Midjourney V6.1"],
    "view": ["Eye-level", "Wide Angle", "Low Angle", "Top-down Plan", "Isometric", "Close-up Macro"],
    "lens": ["16mm Ultra-wide", "24mm Standard Wide", "35mm Narrative", "50mm Portrait", "85mm Detail", "Tilt-shift Lens"],
    "ratio": ["--ar 16:9", "--ar 4:3", "--ar 1:1", "--ar 9:16", "--ar 3:4", "--ar 2:1"],
    "act": ["Standing", "Sitting", "Dining", "Reading", "Working", "Walking", "Relaxing on Sofa"],
    "people_density": ["Empty", "Solitary Figure", "Sparse People", "Bustling Crowd"],
    "nature_density": ["None", "Sparse Decor", "Lush Planterior", "Overgrown Garden"],
    "vehicle_density": ["None", "Still Car", "Motion Blur"],
    "car": ["Sculpture", "Antique Vase", "Art Collection", "Luxury Bags", "Coffee Table Books", "Vinyl Records"],
    "motion": ["Still Life", "Long Exposure", "Motion Blur"]
};

// 🏠 [PRESETS] 15개 테마 프리셋 전체 (Full Version)
const THEME_PRESETS = {
    'modern': { s3: "1.Residential", s4: "Living Room", s5: "Modern Minimalist", s6: "White Stucco", s7: "Polished Concrete", s24: "Monochromatic Grey", boost: "clean lines, bauhaus inspiration, functional, luxury photography" },
    'contemporary': { s3: "1.Residential", s4: "Living Room", s5: "Contemporary", s23: "Curved Velvet Sofa", s24: "Deep Green & Gold", s17: "Dramatic Chiaroscuro", boost: "fluid curves, trendy sculptural furniture, bold accents, vogue living style" },
    'minimalist': { s3: "1.Residential", s4: "Master Bedroom", s5: "Modern Minimalist", s6: "Venetian Plaster", s25: "Minimal Objects", s11: "Serene & Zen", boost: "negative space, meditation room, extreme simplicity, soft natural light" },
    'industrial': { s3: "2.Commercial", s4: "Hip Cafe", s5: "Industrial Loft", s6: "Red Brick Wall", s8: "Industrial Exposed HVAC", s23: "Steel Tube Chairs", boost: "raw textures, brooklyn loft aesthetic, weathered materials, high contrast" },
    'midcentury': { s3: "1.Residential", s4: "Home Office", s5: "Mid-Century Modern", s23: "Eames Lounge Chair", s24: "Navy Blue & Dark Wood", s7: "Chevron Walnut", boost: "vintage 1950s, organic shapes, walnut wood grains, mad men style" },
    'scandi': { s3: "1.Residential", s4: "Open Kitchen & Dining", s5: "Scandinavian (Nordic)", s7: "Herringbone Oak", s24: "Warm Beige & Cream", s19: "Fiddle Leaf Fig", boost: "hygge, cozy, bright and airy, light wood, functional simplicity" },
    'traditional': { s3: "1.Residential", s4: "Library", s5: "Traditional Classic", s6: "Oak Wood Paneling", s8: "Coffered Ceiling", s23: "Leather Chesterfield Sofa", boost: "timeless elegance, symmetry, sophisticated, grand scale" },
    'transitional': { s3: "1.Residential", s4: "Master Bedroom", s5: "Contemporary", s6: "Silk Wallpaper", s23: "Custom Built-in Shelves", s24: "Greige Tones", boost: "blend of traditional and modern, balanced, cozy luxury, refined" },
    'artdeco': { s3: "4.Hospitality", s4: "Hotel Lobby", s5: "Art Deco", s6: "Black Marquina Marble", s10: "Crystal Chandelier", s24: "Black & White High Contrast", boost: "glamour, geometric patterns, gold metallic accents, Great Gatsby style" },
    'french': { s3: "1.Residential", s4: "Dining Room", s5: "French Provincial", s6: "Venetian Plaster", s25: "Antique Vase", s21: "Spring (Blossom)", boost: "romantic, rustic elegance, soft curves, provence manor style" },
    'rustic': { s3: "1.Residential", s4: "Living Room", s5: "Rustic Farmhouse", s6: "Exposed Wooden Beams", s7: "Wide Plank Timber", s11: "Cozy & Warm", boost: "primitive, raw nature, log cabin aesthetic, unrefined textures" },
    'bohemian': { s3: "1.Residential", s4: "Attic Lounge", s5: "Bohemian (Boho)", s23: "Rattan Furniture", s20: "Geometric Wool Rug", s19: "Lush Planterior", boost: "eclectic, free spirit, layered textiles, vibrant and cozy" },
    'coastal': { s3: "1.Residential", s4: "Living Room", s5: "Coastal Hamptons", s6: "White Painted Brick", s20: "Linen Drapes", s1: "Ocean Horizon View", boost: "beach house, breezy, relaxed luxury, nautical touches" },
    'japandi': { s3: "1.Residential", s4: "Living Room", s5: "Japandi", s6: "Walnut Fluted Panels", s7: "Microcement", s11: "Wabi-sabi", boost: "east meets west, zen, bamboo and stone, imperfect beauty" },
    'hollywood': { s3: "1.Residential", s4: "Walk-in Closet", s5: "Hollywood Regency", s6: "Mirror Wall", s23: "Curved Velvet Sofa", s24: "Pastel Sorbet Colors", boost: "opulence, high gloss, cinema drama, vibrant pop of color" }
};

// ================= API ENDPOINTS =================

// 1. 데이터 시트 제공
app.get('/api/data', (req, res) => {
    res.json({ dataSheet: DATA_SHEET });
});

// 2. 프리셋 제공
app.get('/api/preset/:themeKey', (req, res) => {
    const key = req.params.themeKey;
    const preset = THEME_PRESETS[key];
    if (preset) {
        res.json(preset);
    } else {
        res.json({}); // 빈 객체 반환
    }
});

// 3. 결제 성공 처리 (크레딧 + 유효기간 연장)
app.post('/api/charge-success', async (req, res) => {
    const { userId, amount, creditsToAdd, daysToAdd } = req.body;
    
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    try {
        const { data: profile } = await sbAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        let newExpiryDate = new Date();
        
        // 기존 유효기간이 남아있다면 거기서부터 연장
        if (profile?.valid_until) {
            const currentExpiry = new Date(profile.valid_until);
            if (currentExpiry > new Date()) {
                newExpiryDate = currentExpiry;
            }
        }
        
        // 30일(기본) 연장
        const addDays = daysToAdd || 30;
        newExpiryDate.setDate(newExpiryDate.getDate() + addDays);

        const newCredits = (profile?.credits || 0) + (creditsToAdd || 0);

        const { error } = await sbAdmin
            .from('profiles')
            .upsert({ 
                id: userId, 
                credits: newCredits, 
                valid_until: newExpiryDate.toISOString() 
            });

        if (error) throw error;

        res.json({ success: true, newCredits, newExpiry: newExpiryDate });
    } catch (err) {
        console.error("Charge Error:", err);
        res.status(500).json({ error: "Payment update failed" });
    }
});

// 4. 프롬프트 생성 (크레딧 차감 포함)
app.post('/api/generate', async (req, res) => {
    const { choices, userId } = req.body;

    // 비회원(guest) 처리
    if (userId === 'guest') {
        const prompt = generateInteriorPrompt(choices);
        return res.json({ result: prompt, remainingCredits: 'guest' });
    }

    // 회원 처리
    try {
        const { data: userProfile } = await sbAdmin
            .from('profiles')
            .select('credits, valid_until')
            .eq('id', userId)
            .single();

        if (!userProfile) return res.status(404).json({ error: "User not found" });

        // 유효기간 체크
        if (userProfile.valid_until && new Date(userProfile.valid_until) < new Date()) {
            return res.status(403).json({ error: "Membership expired. Please upgrade." });
        }

        // 크레딧 체크
        if (userProfile.credits < 1) {
            return res.status(403).json({ error: "Not enough credits." });
        }

        // 크레딧 차감
        await sbAdmin
            .from('profiles')
            .update({ credits: userProfile.credits - 1 })
            .eq('id', userId);

        const prompt = generateInteriorPrompt(choices);
        res.json({ result: prompt, remainingCredits: userProfile.credits - 1 });

    } catch (err) {
        console.error("Generate Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 📝 나노 바나나 최적화 프롬프트 생성 로직
function generateInteriorPrompt(choices) {
    const getV = (k) => choices[k] ? choices[k].replace(/\([^)]*\)/g, "").trim() : "";
    const getRaw = (k) => choices[k] ? choices[k].trim() : "";

    // Boost Logic (프리셋에서 전달된 boost 값이 있으면 추가)
    // *클라이언트에서 choices 객체 안에 boost 값을 포함해서 보내지는 않으므로, 
    // 보통은 테마 선택 시 별도로 처리하거나, 여기서 스타일별로 하드코딩할 수 있음.
    // 여기서는 사용자가 선택한 값들을 자연스럽게 문장으로 연결함.

    let p = `Create a **photorealistic high-end interior design image** of a **${getV('s5')} ${getV('s4')}**`;
    
    if (getV('s0')) p += `, situated in **${getV('s0')}**`;
    p += `.`;

    // Finishes
    p += ` The space is characterized by **${getV('s6')}** walls and **${getV('s7')} flooring**, featuring a **${getV('s8')}**.`;

    // Furnishing & Style
    p += ` It is meticulously furnished with **${getV('s23')}**, following a sophisticated **${getV('s24')}** color palette.`;

    // Details & Density
    const details = [getV('s19'), getV('s25'), getV('s20')].filter(Boolean).join(", ");
    if (details) p += ` The interior is enriched with **${details}**, maintaining a **${getV('s27') || 'balanced'}** density.`;

    // Atmosphere
    p += ` The atmosphere is **${getV('s11')}**, illuminated by **${getV('s10')}** creating **${getV('s17')}**.`;
    
    // Context
    if (getV('s1')) p += ` A **${getV('s1')}** is visible through the windows.`;
    if (getV('s9')) p += ` Time of day: **${getV('s9')}** (${getV('s21')}).`;

    // Tech Specs
    p += `\n\n**Technical Specs**: Shot in **${getV('s14')}** style from an **${getV('s16')}** perspective using a **${getV('s22')}**. Rendered in **${getV('s15')}**.`;
    
    // Quality & Ratio
    p += `\n**Quality Requirements**: 8k resolution, award-winning interior photography, sharp focus, magazine quality, perfectly balanced composition, no text, no watermarks.`;
    
    const ratio = getRaw('s18').replace('--ar ', '') || '4:3';
    p += `\n(Target Aspect Ratio: ${ratio})`;

    return p;
}

app.listen(port, () => {
    console.log(`🚀 MY INTERIOR PRO Server running on port ${port}`);
});
