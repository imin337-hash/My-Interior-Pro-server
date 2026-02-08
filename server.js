const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔐 [SECURITY] Supabase Admin 설정
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ CRITICAL ERROR: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.");
}

const sbAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// 🛋️ [DATASET] 인테리어 전용 데이터
const DATA_SHEET = {
    "usage_mapping": {
        "1.Residential": ["Living Room", "Master Bedroom", "Open Kitchen & Dining", "Luxury Bathroom", "Powder Room", "Home Office", "Walk-in Closet", "Entrance Hall", "Kids Room", "Attic Lounge", "Home Bar", "Guest Room"],
        "2.Commercial": ["Hip Cafe", "Fine Dining Restaurant", "Whiskey Bar", "Fashion Boutique", "Flagship Store", "Artisan Bakery", "Flower Shop", "Hair Salon", "Yoga Studio", "Pop-up Store"],
        "3.Office": ["CEO Office", "Open Workstation", "Conference Room", "Creative Lounge", "Lobby & Reception", "Meeting Booth"],
        "4.Hospitality": ["Hotel Lobby", "Luxury Hotel Suite", "Art Gallery", "Museum Hall", "Spa & Wellness Center", "Library", "Resort Lounge"],
        "5.Special": ["Home Cinema", "Gaming Room", "Wine Cellar", "Indoor Garden", "Home Gym", "Recording Studio", "Cat Cafe"]
    },
    "style": ["Modern Minimalist", "Contemporary", "Industrial Loft", "Mid-Century Modern", "Scandinavian (Nordic)", "Traditional Classic", "Art Deco", "French Provincial", "Rustic Farmhouse", "Bohemian (Boho)", "Coastal Hamptons", "Japandi", "Hollywood Regency", "Zen", "Wabi-sabi", "Bauhaus", "Maximalist"],
    "mat": ["Venetian Plaster", "Microcement", "Exposed Concrete", "Oak Wood Paneling", "Walnut Fluted Panels", "White Marble Slab", "Black Marquina Marble", "Red Brick Wall", "White Painted Brick", "Travertine Stone", "Stainless Steel Panels", "Brushed Aluminum", "Terrazzo Wall", "Velvet Fabric Wall", "Tambour Board", "Silk Wallpaper"],
    "floor": ["Herringbone Oak Parquet", "Chevron Walnut Parquet", "Wide Plank Timber", "Polished Concrete", "Microcement", "Terrazzo", "White Carrara Marble", "Black Slate Tile", "Checkered Black&White Marble", "Porcelain Tile", "Sisal Rug", "Wall-to-wall Wool Carpet", "Travertine Tile"],
    "form": ["Vaulted Ceiling", "Coffered Ceiling", "Exposed Wooden Beams", "Recessed Lighting Cove", "Industrial Exposed HVAC Pipes", "Skylight Installation", "Minimalist Flat Ceiling", "Double-height Void", "Sloped Attic Ceiling", "Decorative Molding"],
    "detail": ["Modular Low Sofa", "Pierre Jeanneret Chairs", "Eames Lounge Chair", "Curved Velvet Sofa", "Marble Island Counter", "Solid Wood Slab Table", "Built-in Library Shelves", "Floating Staircase", "Rattan Furniture", "Steel Tube Chairs", "Chesterfield Leather Sofa", "Noguchi Coffee Table"],
    "concept": ["Warm Beige & Cream", "All White Minimal", "Monochromatic Grey", "Greige Tones", "Black & White High Contrast", "Earthy Terracotta & Sage", "Deep Green & Gold", "Navy Blue & Dark Wood", "Burgundy & Brass", "Pastel Sorbet Colors", "Dark & Moody Charcoal"],
    "land": ["Large Monstera Deliciosa", "Olive Tree in Terracotta Pot", "Fiddle Leaf Fig", "Dried Pampas Grass", "Hanging Pothos", "Vertical Moss Wall", "Indoor Bamboo Grove", "Bonsai Collection", "Fresh Cut Tulips", "No Plants"],
    "road": ["Persian Rug", "Geometric Wool Rug", "Jute Rug", "Sheepskin Throw", "Silk Curtains", "Linen Drapes", "Motorized Blinds", "Velvet Cushions", "Knitted Throw Blanket", "No Textiles"],
    "weather": ["Crystal Chandelier", "Bauhaus Pendant Light", "Architectural Magnetic Track Light", "Noguchi Paper Lantern", "Neon Signage", "Minimalist LED Line", "Brass Wall Sconces", "Arco Floor Lamp", "Table Lamp"],
    "light": ["Morning Sunlight", "Golden Hour Glow", "Blue Hour Dusk", "Soft Diffused Light", "Dramatic Chiaroscuro", "Cyberpunk Neon Glow", "Warm Interior Incandescent", "Moonlight through Window", "God Rays"],
    "mood": ["Serene & Zen", "Luxurious & Grand", "Cozy & Warm", "Moody & Atmospheric", "Airy & Breezy", "Professional & Clean", "Romantic", "Futuristic", "Vintage & Nostalgic"],
    "time": ["Early Morning", "Midday", "Late Afternoon", "Sunset", "Night", "Midnight"],
    "season": ["Spring (Blossom)", "Summer (Vibrant)", "Autumn (Warm)", "Winter (Snowy)"],
    "country": ["Seoul, Korea", "Paris, France", "Manhattan, NY", "Tokyo, Japan", "Milan, Italy", "Copenhagen, Denmark", "London, UK", "Santorini, Greece", "Bali, Indonesia", "Berlin, Germany"],
    "region": ["City Skyline View", "Park Greenery View", "Ocean Horizon View", "Rainy Street View", "Private Courtyard View", "Night City Lights View", "Snowy Mountain View", "Eiffel Tower View"],
    "site": ["Penthouse Loft", "Luxury Apartment", "Industrial Loft", "Minimalist Villa", "Hanok House", "Flagship Store", "Basement Studio"],
    "rep": ["Hyper-realistic Photo", "3D Render", "Architectural Photography", "Watercolor Sketch", "Cinematic Shot"],
    "engine": ["Unreal Engine 5.5", "Octane Render", "V-Ray 6", "Corona Render", "Midjourney V6.1"],
    "view": ["Eye-level", "Wide Angle", "Low Angle", "Top-down Plan", "Isometric", "Close-up Macro"],
    "lens": ["16mm Ultra-wide", "24mm Standard Wide", "35mm Narrative", "50mm Portrait", "85mm Detail", "Tilt-shift Lens"],
    "ratio": ["--ar 16:9", "--ar 4:3", "--ar 1:1", "--ar 9:16", "--ar 3:4", "--ar 2:1"],
    "act": ["Standing", "Sitting", "Dining", "Reading", "Working", "Walking", "Relaxing on Sofa"],
    "people_density": ["Empty", "Solitary Figure", "Sparse People", "Bustling Crowd"],
    "nature_density": ["Minimalist Decor", "Balanced Decor", "Maximalist Decor", "Cluttered/Lived-in"],
    "vehicle_density": ["Sparse Objects", "Richly Decorated", "Museum-like"],
    "car": ["Sculpture", "Antique Vase", "Art Collection", "Luxury Bags", "Coffee Table Books", "Vinyl Records"],
    "motion": ["Still Life", "Long Exposure", "Motion Blur"]
};

// 📷 [TECH SPECS] 공통 카메라 설정
const COMMON_SPECS = {
    s14: "Hyper-realistic Photo", 
    s15: "Unreal Engine 5.5", 
    s16: "Eye-level (Standard)", 
    s22: "35mm Narrative (Standard)", 
    s26: "Still Life (Crisp)", 
    s18: "--ar 4:3 (Traditional)"
};

// 🏠 [PRESETS] 15개 테마
const THEME_PRESETS = {
    'modern': { ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Modern Minimalist", s6: "White Stucco", s7: "Polished Concrete", s24: "Monochromatic Grey", boost: "clean lines, bauhaus inspiration, functional, luxury photography" },
    'contemporary': { ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Contemporary", s23: "Curved Velvet Sofa", s24: "Deep Green & Gold", s17: "Dramatic Chiaroscuro", boost: "fluid curves, trendy sculptural furniture, bold accents, vogue living style" },
    'minimalist': { ...COMMON_SPECS, s3: "1.Residential", s4: "Master Bedroom", s5: "Modern Minimalist", s6: "Venetian Plaster", s25: "Minimal Objects", s11: "Serene & Zen", boost: "negative space, meditation room, extreme simplicity, soft natural light" },
    'industrial': { ...COMMON_SPECS, s3: "2.Commercial", s4: "Hip Cafe", s5: "Industrial Loft", s6: "Red Brick Wall", s8: "Industrial Exposed HVAC", s23: "Steel Tube Chairs", boost: "raw textures, brooklyn loft aesthetic, weathered materials, high contrast" },
    'midcentury': { ...COMMON_SPECS, s3: "1.Residential", s4: "Home Office", s5: "Mid-Century Modern", s23: "Eames Lounge Chair", s24: "Navy Blue & Dark Wood", s7: "Chevron Walnut", boost: "vintage 1950s, organic shapes, walnut wood grains, mad men style" },
    'scandi': { ...COMMON_SPECS, s3: "1.Residential", s4: "Open Kitchen & Dining", s5: "Scandinavian (Nordic)", s7: "Herringbone Oak", s24: "Warm Beige & Cream", s19: "Fiddle Leaf Fig", boost: "hygge, cozy, bright and airy, light wood, functional simplicity" },
    'traditional': { ...COMMON_SPECS, s3: "1.Residential", s4: "Library", s5: "Traditional Classic", s6: "Oak Wood Paneling", s8: "Coffered Ceiling", s23: "Chesterfield Leather Sofa", boost: "timeless elegance, symmetry, sophisticated, grand scale" },
    'transitional': { ...COMMON_SPECS, s3: "1.Residential", s4: "Master Bedroom", s5: "Contemporary", s6: "Silk Wallpaper", s23: "Built-in Library Shelves", s24: "Greige Tones", boost: "blend of traditional and modern, balanced, cozy luxury, refined" },
    'artdeco': { ...COMMON_SPECS, s3: "4.Hospitality", s4: "Hotel Lobby", s5: "Art Deco", s6: "Black Marquina Marble", s10: "Crystal Chandelier", s24: "Black & White High Contrast", boost: "glamour, geometric patterns, gold metallic accents, Great Gatsby style" },
    'french': { ...COMMON_SPECS, s3: "1.Residential", s4: "Dining Room", s5: "French Provincial", s6: "Venetian Plaster", s25: "Antique Vase", s21: "Spring (Blossom)", boost: "romantic, rustic elegance, soft curves, provence manor style" },
    'rustic': { ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Rustic Farmhouse", s6: "Exposed Wooden Beams", s7: "Wide Plank Timber", s11: "Cozy & Warm", boost: "primitive, raw nature, log cabin aesthetic, unrefined textures" },
    'bohemian': { ...COMMON_SPECS, s3: "1.Residential", s4: "Attic Lounge", s5: "Bohemian (Boho)", s23: "Rattan Furniture", s20: "Geometric Wool Rug", s19: "Lush Planterior", boost: "eclectic, free spirit, layered textiles, vibrant and cozy" },
    'coastal': { ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Coastal Hamptons", s6: "White Painted Brick", s20: "Linen Drapes", s1: "Ocean Horizon View", boost: "beach house, breezy, relaxed luxury, nautical touches" },
    'japandi': { ...COMMON_SPECS, s3: "1.Residential", s4: "Living Room", s5: "Japandi", s6: "Walnut Fluted Panels", s7: "Microcement", s11: "Wabi-sabi", boost: "east meets west, zen, bamboo and stone, imperfect beauty" },
    'hollywood': { ...COMMON_SPECS, s3: "1.Residential", s4: "Walk-in Closet", s5: "Hollywood Regency", s6: "Mirror Wall", s23: "Curved Velvet Sofa", s24: "Pastel Sorbet Colors", boost: "opulence, high gloss, cinema drama, vibrant pop of color" }
};

// ================= API ENDPOINTS =================

// 1. 데이터 시트
app.get('/api/data', (req, res) => res.json({ dataSheet: DATA_SHEET }));

// 2. 프리셋
app.get('/api/preset/:key', (req, res) => res.json(THEME_PRESETS[req.params.key] || {}));

// 3. [FIXED] 결제 및 충전 (My Architect 로직 적용)
app.post('/api/charge-success', async (req, res) => {
    const { userId, amount, creditsToAdd, daysToAdd } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // 1. 현재 유저 정보 가져오기
        const { data: profile, error: fetchError } = await sbAdmin
            .from('profiles')
            .select('credits, valid_until')
            .eq('id', userId)
            .single();

        let currentCredits = 0;
        let currentExpiry = null;

        // 프로필이 없으면 생성 (Upsert)
        if (fetchError || !profile) {
            console.log("Creating new profile for:", userId);
            const { error: insertError } = await sbAdmin.from('profiles').upsert([{ id: userId, credits: 0 }]);
            if(insertError) throw insertError;
        } else {
            currentCredits = profile.credits || 0;
            currentExpiry = profile.valid_until;
        }

        // 2. 크레딧 계산
        const addedCredits = creditsToAdd ? parseInt(creditsToAdd) : (amount ? Math.floor(amount / 20) : 0);
        const newCredits = currentCredits + addedCredits;

        // 3. 유효기간 계산
        const addedDays = daysToAdd ? parseInt(daysToAdd) : 30;
        let newExpiryDate = new Date();

        if (currentExpiry) {
            const currentExpiryDate = new Date(currentExpiry);
            // 남아있으면 거기서 연장
            if (currentExpiryDate > new Date()) {
                newExpiryDate = currentExpiryDate;
            }
        }
        newExpiryDate.setDate(newExpiryDate.getDate() + addedDays);

        // 4. DB 업데이트
        await sbAdmin.from('profiles').upsert({ 
            id: userId, 
            credits: newCredits, 
            valid_until: newExpiryDate.toISOString() 
        });
        
        console.log(`✅ Charged: User ${userId} (+${addedCredits} Cr)`);
        res.json({ success: true, newCredits, newExpiry: newExpiryDate });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: e.message }); 
    }
});

// 4. [FIXED] 생성 엔진 (My Architect 로직 적용)
app.post('/api/generate', async (req, res) => {
    const { choices, userId } = req.body;

    // 비회원
    if (userId === 'guest') {
        return res.json({ result: generatePrompt(choices), remainingCredits: 'guest' });
    }

    // 회원 검증
    try {
        const { data: user, error: fetchError } = await sbAdmin
            .from('profiles')
            .select('credits, valid_until')
            .eq('id', userId)
            .single();
        
        // 프로필이 없을 경우 (첫 로그인 직후 등)
        if (fetchError || !user) {
             return res.status(404).json({ error: "User profile not found. Please try refreshing or charging." });
        }

        // 유효기간 체크
        if (user.valid_until && new Date(user.valid_until) < new Date()) {
            return res.status(403).json({ error: "Membership Expired. Please Upgrade." });
        }
        
        // 크레딧 체크
        if (user.credits < 1) {
            return res.status(403).json({ error: "No credits remaining. Please Upgrade." });
        }

        // 차감 실행
        const newCreditBalance = user.credits - 1;
        await sbAdmin.from('profiles').update({ credits: newCreditBalance }).eq('id', userId);
        
        console.log(`✂️ Generated: User ${userId} (${user.credits} -> ${newCreditBalance})`);
        res.json({ result: generatePrompt(choices), remainingCredits: newCreditBalance });

    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: e.message }); 
    }
});

function generatePrompt(c) {
    const v = (k) => c[k] ? c[k].replace(/\([^)]*\)/g, "").trim() : "";
    
    let p = `Create a **photorealistic high-end interior design image** of a **${v('s5')} ${v('s4')}**`;
    if (v('s0')) p += ` situated in **${v('s0')}**`;
    p += `.`;

    p += ` The space features **${v('s6') || 'clean'} walls** and **${v('s7') || 'matching'} flooring**, with a **${v('s8') || 'standard ceiling'}**.`;
    p += ` It is meticulously furnished with **${v('s23')}**, following a sophisticated **${v('s24')}** color palette.`;
    
    const details = [v('s19'), v('s25'), v('s20')].filter(Boolean).join(", ");
    if (details) p += ` The interior is enriched with **${details}**, maintaining a **${v('s27') || 'balanced'}** density.`;

    p += ` The atmosphere is **${v('s11') || 'inviting'}**, illuminated by **${v('s10') || 'ambient lighting'}** creating **${v('s17') || 'soft shadows'}**.`;
    if (v('s1')) p += ` Through the window, a **${v('s1')}** is visible.`;
    if (v('s9')) p += ` Time of day: **${v('s9')}** (${v('s21') || 'Normal Season'}).`;

    // Tech Specs
    const art = v('s14') || "Hyper-realistic Photo";
    const angle = v('s16') || "Eye-level";
    const lens = v('s22') || "35mm Narrative";
    const engine = v('s15') || "Unreal Engine 5.5";
    
    p += `\n\n**Technical Specs**: Shot in **${art}** style from an **${angle}** perspective using a **${lens}**. Rendered in **${engine}**.`;
    if(v('s26') && v('s26') !== "Still Life") p += ` Motion: ${v('s26')}.`;
    
    p += `\n**Quality Requirements**: 8k resolution, award-winning interior photography, sharp focus, magazine quality, perfectly balanced composition, no text, no watermarks.`;
    
    const ratio = (c['s18'] || '--ar 4:3').replace('--ar ', '');
    p += `\n(Target Aspect Ratio: ${ratio})`;

    return p;
}

app.listen(port, () => console.log(`🚀 MY INTERIOR PRO Server running on ${port}`));
