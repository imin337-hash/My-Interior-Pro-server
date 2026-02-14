const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

// [CORS 허용] 워드프레스 등 외부 접속 허용
app.use(cors());
app.use(express.json());

// 🔐 [SECURITY] Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Warning: Supabase credentials missing. Using placeholder.");
}

const sbAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// ==========================================================================
// 1. DATA_SHEET (조경 전문 데이터셋 - Full Data)
// ==========================================================================
const DATA_SHEET = {
    "config": { "masters": [] },
    // A. SUBJECT & SPACE
    "country": [ // s0
        "South Korea (대한민국)", "Kyoto, Japan (일본 교토)", "New York, USA (미국 뉴욕)", 
        "London, UK (영국 런던)", "Paris, France (프랑스 파리)", "Singapore (싱가포르)", 
        "Bali, Indonesia (인도네시아 발리)", "Dubai, UAE (두바이)", "Scandinavian (북유럽)", 
        "Mediterranean (지중해)", "Tuscany, Italy (이탈리아 토스카나)", "Amazon Rainforest (아마존)"
    ],
    "region": [ // s1
        "Urban High-Density (도심 고밀도)", "Suburban Residential (교외 주거지)", "Coastal Area (해안가)", 
        "Mountainous Terrain (산악 지형)", "Riverfront (강변)", "Historic District (역사 지구)", 
        "Industrial Complex (산업 단지)", "University Campus (대학 캠퍼스)", "Rooftop Level (옥상층)"
    ],
    "site": [ // s2
        "Flat Terrain (평지)", "Gentle Slope (완만한 경사)", "Steep Hillside (급경사/법면)", 
        "Sunken Courtyard (성큰/지하 정원)", "Narrow Linear Space (좁은 선형 공간)", 
        "Open Plaza (광활한 광장)", "Wetland Edge (습지 경계)", "Cliff Edge (절벽 끝)",
        "Artificial Ground (인공지반)", "Atrium Interior (실내 아트리움)"
    ],
    "usage_mapping": { // s3 & s4
        "1.주거 정원": [
            "Private Villa Garden (단독주택 정원)", "Penthouse Rooftop (펜트하우스 루프탑)", 
            "Apartment Central Park (아파트 중앙광장)", "Courtyard (중정/Maddang)", "Entrance Garden (진입부 정원)"
        ],
        "2.도시 & 공공": [
            "Urban Plaza (도시 광장)", "Linear Park (선형 공원/경의선숲길)", "Pocket Park (포켓 공원)", 
            "Riverfront Promenade (수변 산책로)", "Streetscape (가로수길)"
        ],
        "3.상업 & 리조트": [
            "Luxury Resort Pool (리조트 인피니티풀)", "Hotel Entrance (호텔 진입부)", 
            "Shopping Mall Atrium (쇼핑몰 아트리움)", "Cafe Terrace (카페 테라스)", "Theme Park Zone (테마파크)"
        ],
        "4.생태 & 치유": [
            "Healing Garden (치유 정원/병원)", "Rain Garden (빗물 정원)", "Biotope (비오톱/생태서식지)", 
            "Community Farm (공동체 텃밭)", "Meditation Garden (명상 정원)"
        ],
        "5.특수 & 미래": [
            "Smart City Plaza (스마트 시티 광장)", "Vertical Forest (수직 숲/Bosco Verticale)", 
            "Industrial Park Green (산업단지 녹지)", "Campus Green (캠퍼스 잔디광장)", "Mars Colony Garden (화성 식민지 정원)"
        ]
    },
    "style": [ // s5
        "Modern Minimalist (모던 미니멀리즘)", "Naturalistic Planting (자연주의/Piet Oudolf)", 
        "Traditional Korean (한국 전통/Huwon)", "Japanese Zen (일본식 젠/Karesansui)", 
        "English Cottage (영국식 코티지)", "French Formal (프랑스 정형식)", 
        "Tropical Balinese (열대 발리식)", "Parametric/Futuristic (파라메트릭)", 
        "Industrial Chic (인더스트리얼)", "Xeriscape (건조 조경/다육)"
    ],
    
    // B. LANDSCAPE ELEMENTS
    "hardscape": [ // s6
        "Granite Pavers (화강석 판석)", "Basalt Brick (현무암 벽돌)", "Limestone Slab (라임스톤 슬랩)", 
        "Travertine (트래버틴)", "Cobblestone (사고석/코블스톤)", "Decomposed Granite (마사토)", 
        "River Gravel (강자갈)", "Wood Decking (목재 데크)", "Composite Decking (합성목재)", 
        "Exposed Concrete (노출 콘크리트)", "Corten Steel Edging (코르텐강)", "Permeable Pavers (투수 블록)",
        "Solar Pavers (태양광 블록)", "White Sand (백사장 모래)"
    ],
    "softscape": [ // s19
        "Lush Canopy Trees (대형 녹음수 위주)", "Wildflower Meadow (야생화 초원)", 
        "Ornamental Grasses (그라스류 혼식)", "Pine Tree Grove (소나무 군락)", 
        "Bamboo Forest (대나무 숲)", "Tropical Palms & Ferns (야자수와 고사리)", 
        "Moss Garden (이끼 정원)", "Succulents & Cacti (다육 및 선인장)", 
        "Vertical Green Wall (벽면 녹화)", "Cherry Blossoms (벚꽃 터널)", 
        "Ginkgo Avenue (은행나무 길)", "Aquatic Plants (수생 식물)", "Zelkova Trees (느티나무)"
    ],
    "feature": [ // s23
        "Mirror Pond (거울 연못)", "Floor Fountain (바닥 분수)", "Cascading Waterfall (계단식 폭포)", 
        "Modern Pergola (모던 파고라)", "Glass Pavilion (유리 파빌리온)", "Fire Pit Lounge (파이어핏 라운지)", 
        "Art Sculpture (예술 조형물)", "Stone Pagoda (석탑)", "Smart Media Pole (미디어 폴)", 
        "Infinity Edge Pool (인피니티 풀)", "Mist Fog System (쿨링 포그)", "Wooden Bridge (목재 데크로드)"
    ],
    "furniture": [ // s25
        "Minimalist Bench (미니멀 벤치)", "Sunbeds & Parasols (썬베드와 파라솔)", 
        "Rattan Sofa Set (라탄 소파)", "Concrete Stool (콘크리트 스툴)", "Hammock (해먹)", 
        "Bistro Table Set (야외 테이블)", "Swing Bench (그네 벤치)", "Smart Bench (스마트 벤치)"
    ],
    "pattern": [ // s8
        "Grid & Linear (격자 및 선형)", "Fluid & Organic (유기적 곡선)", "Geometric (기하학적)", 
        "Fractal Pattern (프랙탈)", "Stepped Terraces (계단식 테라스)", "Meandering Path (구불구불한 길)", 
        "Circular Layout (원형 배치)", "Random Mosaic (랜덤 모자이크)"
    ],

    // C. ATMOSPHERE
    "season": [ // s21
        "Early Spring (초봄/새싹)", "Cherry Blossom Season (벚꽃 만개)", "Lush Summer (한여름 녹음)", 
        "Rainy Season (장마/비)", "Early Autumn (초가을)", "Golden Autumn (단풍 절정)", 
        "Late Autumn (낙엽)", "Snowy Winter (설경)", "Frosty Morning (서리 낀 아침)"
    ],
    "time": [ // s9
        "Dawn Mist (새벽 안개)", "Morning Sunlight (아침 햇살)", "High Noon (정오)", 
        "Golden Hour (해질녘)", "Blue Hour (매직아워)", "Moonlight (달빛)", "Starry Night (별밤)"
    ],
    "weather": [ // s10
        "Clear Sky (맑음)", "Partly Cloudy (구름 조금)", "Overcast (흐림)", 
        "Light Drizzle (가랑비)", "Heavy Rain (폭우)", "Foggy (안개)", "Windy (바람부는)"
    ],
    "mood": [ // s11
        "Serene/Zen (고요한)", "Vibrant/Active (활기찬)", "Romantic (낭만적인)", 
        "Mysterious (신비로운)", "Luxurious (고급스러운)", "Rustic/Cozy (소박한)", "Melancholic (우울한)"
    ],
    "light": [ // s17
        "Dappled Sunlight (나뭇잎 사이 햇살)", "Up-lighting on Trees (수목 투사등)", 
        "Linear Strip Lights (라인 조명)", "Bollard Lights (볼라드 등)", "Underwater Lights (수중등)", 
        "Warm String Lights (줄전구)", "Moonlight Shadow (달빛 그림자)", "Neon Lights (네온)"
    ],

    // D. TECH SPECS
    "art": [ // s14
        "Photorealistic (실사)", "Architectural Watercolor (건축 수채화)", "Pencil Sketch (연필 스케치)", 
        "Digital Painting (디지털 페인팅)", "Cinematic Movie Shot (영화 같은)"
    ],
    "engine": [ // s15
        "Lumion 2024", "Twinmotion", "Unreal Engine 5.2", "V-Ray 6", "Corona Render", "D5 Render", "Enscape"
    ],
    "view": [ // s16
        "Eye-level (눈높이)", "Low Angle (로우 앵글/초화류 강조)", "High Angle (하이 앵글/전체 조망)", 
        "Bird's Eye View (조감도)", "Top-Down Plan (평면도 뷰)", "Through the Window (창문 너머)"
    ],
    "lens": [ // s22
        "16mm Ultra Wide (초광각)", "24mm Wide (광각)", "35mm Standard (표준)", 
        "50mm Portrait (표준/왜곡없음)", "85mm Telephoto (망원/압축효과)", "Macro (접사/텍스처)"
    ],
    "ratio": [ // s18
        "--ar 16:9", "--ar 4:3", "--ar 3:2", "--ar 1:1", "--ar 9:16", "--ar 21:9"
    ]
};

// ==========================================================================
// 2. THEME PRESETS (15 Distinct Themes)
// ==========================================================================
const C = {
    s14: "Hyper-realistic Photo (극사실 사진)",
    s15: "Unreal Engine 5.5",
    s16: "Eye-level (눈높이)",
    s22: "35mm Lens (표준 광각)",
    s26: "Still Life (정적인)",
    s18: "--ar 1:1 (Square)"
};

const THEME_PRESETS = {
    // [Group 1] Residential (주거)
    'res_villa':    { ...C, s3: "1.주거 정원", s4: "Private Villa Garden", s5: "Modern Minimalist", s6: "Travertine", s19: "Manicured Lawn", s23: "Infinity Edge Pool", s21: "Lush Summer", boost: "luxury private house, clean lines, expensive furniture, sunny vibe" },
    'res_zen':      { ...C, s3: "1.주거 정원", s4: "Courtyard", s5: "Japanese Zen", s6: "River Gravel", s19: "Moss Garden", s23: "Stone Pagoda", s11: "Serene/Zen", s9: "Dawn Mist", boost: "karesansui, raked gravel, maple tree, meditative silence, dark wood" },
    'res_roof':     { ...C, s3: "1.주거 정원", s4: "Penthouse Rooftop", s5: "Industrial Chic", s6: "Wood Decking", s19: "Ornamental Grasses", s23: "Fire Pit Lounge", s9: "Blue Hour", s17: "Warm String Lights", boost: "rooftop party, city skyline view, cozy fire, night atmosphere" },

    // [Group 2] Urban (도시)
    'urb_plaza':    { ...C, s3: "2.도시 & 공공", s4: "Urban Plaza", s5: "Modern Minimalist", s6: "Granite Pavers", s19: "Zelkova Trees", s23: "Floor Fountain", s8: "Grid & Linear", s9: "High Noon", boost: "busy city plaza, glass buildings, reflection, people walking" },
    'urb_street':   { ...C, s3: "2.도시 & 공공", s4: "Streetscape", s5: "Modern Minimalist", s6: "Permeable Pavers", s19: "Ginkgo Avenue", s23: "Art Sculpture", s21: "Golden Autumn", boost: "yellow ginkgo leaves, clean street furniture, modern city street, falling leaves" },
    'urb_linear':   { ...C, s3: "2.도시 & 공공", s4: "Linear Park", s5: "Ecological/Wild", s6: "Decomposed Granite", s19: "Wildflower Meadow", s23: "Modern Pergola", s21: "Late Autumn", boost: "high line style, rusty corten steel, sunset light, walking trail, urban regeneration" },

    // [Group 3] Commercial & Resort (상업)
    'com_resort':   { ...C, s3: "3.상업 & 리조트", s4: "Luxury Resort Pool", s5: "Tropical Balinese", s6: "Limestone Slab", s19: "Tropical Palms & Ferns", s23: "Infinity Edge Pool", s9: "Golden Hour", boost: "bali ubud vibe, jungle view, turquoise water, vacation paradise" },
    'com_hotel':    { ...C, s3: "3.상업 & 리조트", s4: "Hotel Entrance", s5: "French Formal", s6: "Cobblestone", s19: "Topiary Hedges", s23: "Classic Fountain", s11: "Luxurious", boost: "grand entrance, symmetry, luxury hotel, manicured garden, expensive car" },
    'com_cafe':     { ...C, s3: "3.상업 & 리조트", s4: "Cafe Terrace", s5: "Industrial Chic", s6: "Exposed Concrete", s19: "Succulents & Cacti", s23: "Mist Fog System", s21: "Summer", boost: "hipster cafe, trendy spot, desert vibe, cool mist, instagrammable" },

    // [Group 4] Eco & Nature (생태)
    'eco_heal':     { ...C, s3: "4.생태 & 치유", s4: "Healing Garden", s5: "Naturalistic Planting", s6: "Decomposed Granite", s19: "Wildflower Meadow", s23: "Wooden Bench", s11: "Serene/Zen", boost: "hospital garden, sensory plants, lavender and rosemary, peaceful, barrier free" },
    'eco_rain':     { ...C, s3: "4.생태 & 치유", s4: "Rain Garden", s5: "Ecological/Wild", s6: "River Gravel", s19: "Aquatic Plants", s23: "Wooden Bridge", s10: "Light Drizzle", boost: "sustainable design, LID techniques, wet texture, lush green, rain drops" },
    'eco_forest':   { ...C, s3: "4.생태 & 치유", s4: "Biotope", s5: "Wild", s6: "No Paving", s19: "Dense Forest", s23: "Bird House", s9: "Dawn Mist", boost: "untouched nature, wildlife habitat, foggy morning, mysterious, deep woods" },

    // [Group 5] Future & Special (미래/특수)
    'fut_smart':    { ...C, s3: "5.특수 & 미래", s4: "Smart City Plaza", s5: "Parametric/Futuristic", s6: "Solar Pavers", s19: "Vertical Green Wall", s23: "Smart Media Pole", s9: "Night", s17: "Linear Strip Lights", boost: "cyberpunk landscape, glowing floor, digital trees, sci-fi, neon lights" },
    'fut_vert':     { ...C, s3: "5.특수 & 미래", s4: "Vertical Forest", s5: "Modern Minimalist", s6: "Glass and Steel", s19: "Cascading Plants", s23: "Sky Bridge", s16: "Bird's Eye View", boost: "bosco verticale style, buildings covered in trees, sustainable future city, aerial view" },
    'fut_trad':     { ...C, s3: "5.특수 & 미래", s4: "Traditional Garden", s5: "Traditional Korean", s6: "Decomposed Granite", s19: "Pine Tree Grove", s23: "Stone Pagoda", s21: "Snowy Winter", boost: "korean palace, gyeongbokgung style, snowy pine trees, tranquil, heritage" }
};

// ==========================================================================
// 3. API ROUTES
// ==========================================================================

app.get('/api/data', (req, res) => {
    res.json({ dataSheet: DATA_SHEET });
});

app.get('/api/preset/:themeKey', (req, res) => {
    const key = req.params.themeKey;
    const presets = THEME_PRESETS[key];
    if (presets) {
        res.json(presets);
    } else {
        res.json({ error: "No preset found" });
    }
});

// 💳 [결제 시스템] 크레딧 충전 및 유효기간 연장
app.post('/api/charge-success', async (req, res) => {
    const { userId, amount, creditsToAdd, daysToAdd } = req.body;
    
    if (!userId || !amount) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const { data: profile, error: fetchError } = await sbAdmin
            .from('profiles')
            .select('credits, valid_until')
            .eq('id', userId)
            .single();
        
        // 프로필이 없으면 생성
        if (fetchError || !profile) {
            const { error: insertError } = await sbAdmin.from('profiles').upsert([{ id: userId, credits: 0 }]);
            if(insertError) throw insertError;
        }

        const currentCredits = profile ? profile.credits : 0;
        const currentExpiry = profile ? profile.valid_until : null;
        
        // 크레딧 추가
        const addCredits = creditsToAdd ? parseInt(creditsToAdd) : Math.floor(amount / 30);
        const newCredits = currentCredits + addCredits;

        // 유효기간 연장
        const addedDays = daysToAdd ? parseInt(daysToAdd) : 30; 
        let newExpiryDate = new Date();

        if (currentExpiry) {
            const currentExpiryDate = new Date(currentExpiry);
            // 만료일이 아직 남았다면 거기서 연장, 지났다면 오늘부터 연장
            if (currentExpiryDate > new Date()) {
                newExpiryDate = currentExpiryDate;
            }
        }
        newExpiryDate.setDate(newExpiryDate.getDate() + addedDays);

        // DB 업데이트
        const { error: updateError } = await sbAdmin
            .from('profiles')
            .update({ 
                credits: newCredits, 
                valid_until: newExpiryDate.toISOString() 
            })
            .eq('id', userId);

        if (updateError) throw updateError;
        
        console.log(`✅ [Charge] User ${userId}: +${addCredits} Cr, +${addedDays} Days`);
        res.json({ success: true, newCredits, newExpiry: newExpiryDate });

    } catch (err) {
        console.error("Charge Error:", err);
        res.status(500).json({ error: "Charge failed" });
    }
});

// 🌳 [ENGINE] 조경 프롬프트 생성 (유효기간 체크 포함)
app.post('/api/generate', async (req, res) => {
    const { choices, themeBoost, userId } = req.body;
    
    // 1. 게스트 처리
    if (!userId || userId === 'guest') {
        const prompt = generateLandscapePrompt(choices, themeBoost);
        return res.json({ result: prompt, remainingCredits: 'guest' });
    }

    try {
        // 2. 회원 처리 (DB 조회)
        const { data: userProfile, error: fetchError } = await sbAdmin
            .from('profiles')
            .select('credits, valid_until')
            .eq('id', userId)
            .single();
        
        if (fetchError || !userProfile) {
             return res.status(404).json({ error: "User profile not found." });
        }

        // 유효기간 체크
        if (userProfile.valid_until) {
            const expiryDate = new Date(userProfile.valid_until);
            if (expiryDate < new Date()) {
                return res.status(403).json({ error: "멤버십이 만료되었습니다. 연장 후 이용해주세요!" });
            }
        }
        
        if (userProfile.credits < 1) {
            return res.status(403).json({ error: "크레딧이 부족합니다. 충전 후 이용해주세요!" });
        }

        // 3. 프롬프트 생성
        const prompt = generateLandscapePrompt(choices, themeBoost);

        // 4. 크레딧 차감
        const newCreditBalance = userProfile.credits - 1;
        const { error: updateError } = await sbAdmin
            .from('profiles')
            .update({ credits: newCreditBalance })
            .eq('id', userId);
        
        if (updateError) throw updateError;

        console.log(`✂️ Generated: User ${userId} (${newCreditBalance})`);
        res.json({ result: prompt, remainingCredits: newCreditBalance });

    } catch (err) {
        console.error("Generate Error:", err);
        res.status(500).json({ error: "Transaction failed" });
    }
});

// Prompt Logic (Helper)
function generateLandscapePrompt(choices, themeBoost) {
    const getV = (k) => choices[k] ? choices[k].replace(/\([^)]*\)/g, "").trim() : "";

    const type = getV('s4') || getV('s3') || "Landscape Architecture";
    const style = getV('s5') ? `designed in ${getV('s5')} style` : "";
    const context = [getV('s0'), getV('s1'), getV('s2')].filter(Boolean).join(", located in ");

    let elements = [];
    if (getV('s6')) elements.push(`paved with ${getV('s6')}`);
    if (getV('s19')) elements.push(`featuring ${getV('s19')}`);
    if (getV('s23')) elements.push(`centered around a ${getV('s23')}`);
    if (getV('s25')) elements.push(`furnished with ${getV('s25')}`);
    if (getV('s8')) elements.push(`arranged in a ${getV('s8')} layout`);

    let atmo = [getV('s21'), getV('s9'), getV('s10'), getV('s11'), getV('s17')].filter(Boolean).join(", ");

    let prompt = `A professional landscape architecture visualization of a ${type}, ${style}.`;
    if (context) prompt += ` The site is ${context}.`;
    if (elements.length > 0) prompt += ` The design is characterized by ${elements.join(", ")}.`;
    if (atmo) prompt += ` Atmosphere: ${atmo}.`;
    
    const tech = [getV('s14'), getV('s15'), getV('s16'), getV('s22')].filter(Boolean).join(", ");
    if (tech) prompt += ` Rendering specs: ${tech}.`;
    
    if (themeBoost) prompt += `\n\n**Design Narrative**: ${themeBoost}.`;

    prompt += `\n\n**Requirements**: 8k resolution, photorealistic, volumetric lighting, highly detailed vegetation textures, award-winning landscape photography.`;
    prompt += `\n**Constraints**: Do not include any text, watermarks, or logos.`;
    
    const ratioStr = getV('s18').replace("--ar ", "") || "16:9";
    prompt += `\n(Aspect Ratio: ${ratioStr})`;

    return prompt;
}

app.listen(port, () => {
    console.log(`🚀 MY LANDSCAPE PRO Server running on port ${port}`);
});
