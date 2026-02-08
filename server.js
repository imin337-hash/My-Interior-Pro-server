const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔐 [SECURITY] Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const sbAdmin = createClient(supabaseUrl, supabaseKey);

// ==========================================================================
// 1. DATA_SHEET (한영 병기 데이터셋) - 기존 유지
// ==========================================================================
const DATA_SHEET = {
    // A. CONTEXT (건물 및 뷰)
    "country": [
        "Luxury Penthouse (럭셔리 펜트하우스)", "Modern Apartment (모던 아파트)", "Parisian Haussmann Apartment (파리 오스만식 아파트)", 
        "Industrial Loft (인더스트리얼 로프트)", "Minimalist Villa (미니멀 빌라)", "Hanok Traditional House (전통 한옥)", 
        "Tropical Resort Villa (휴양지 리조트 빌라)", "Country Cottage (전원주택)", "Glass House (글래스 하우스)", 
        "Basement Studio (지하 스튜디오)", "High-rise Office (고층 오피스)", "Retail Flagship Store (플래그십 스토어)"
    ],
    "region": [
        "City Skyline (도시 스카이라인)", "Central Park Greenery (센트럴파크 녹지)", "Ocean Horizon (바다 수평선)", 
        "Forest Panorama (숲 파노라마)", "Rainy Street (비오는 거리)", "Snowy Mountain (설산)", 
        "Night City Lights (도시 야경)", "Private Courtyard (프라이빗 중정)", "Old Brick Wall (오래된 벽돌담)", "River View (강변 뷰)"
    ],
    "site": [
        "Double Height Ceiling (복층/높은 층고)", "Standard Ceiling Height (표준 층고)", "Low Cozy Ceiling (낮고 아늑한 천장)", 
        "Vaulted Ceiling (볼트형/아치 천장)", "Sloped Attic Ceiling (다락방 경사 천장)", "Exposed Concrete Ceiling (노출 콘크리트 천장)", 
        "Coffered Ceiling (우물 천장)", "Glass Ceiling (유리 천장/천창)"
    ],
    // 용도 매핑 (Category -> Room)
    "usage_mapping": {
        "1.Residential (주거)": ["Living Room (거실)", "Master Bedroom (안방)", "Open Kitchen & Dining (대면형 주방)", "Luxury Bathroom (욕실)", "Powder Room (파우더룸)", "Walk-in Closet (드레스룸)", "Home Office (서재)", "Entrance Hall (현관)", "Kids Room (아이방)", "Balcony Garden (발코니 정원)"],
        "2.Commercial (상업)": ["Hip Cafe (힙한 카페)", "Artisan Bakery (베이커리)", "Fine Dining Restaurant (레스토랑)", "Whiskey Bar (위스키 바)", "Fashion Boutique (의류 매장)", "Flagship Store (플래그십 스토어)", "Pop-up Store (팝업 스토어)", "Hair Salon (미용실)", "Flower Shop (꽃집)"],
        "3.Office (업무)": ["Open Workstation (오픈 오피스)", "CEO Office (임원실)", "Conference Room (회의실)", "Creative Lounge (라운지)", "Studio (스튜디오)"],
        "4.Hospitality (호텔/문화)": ["Hotel Lobby (호텔 로비)", "Hotel Suite (스위트룸)", "Library (도서관)", "Art Gallery (갤러리)", "Museum Hall (박물관 홀)", "Spa & Wellness (스파)"],
        "5.Special (특수)": ["Home Gym (홈짐)", "Home Cinema (홈시네마)", "Gaming Room (게이밍 룸)", "Wine Cellar (와인 저장고)", "Indoor Garden (실내 정원)"]
    },
    // B. STYLE (15가지 스타일)
    "style": [
        "Modern (모던)", "Contemporary (컨템포러리)", "Minimalist (미니멀리즘)", "Industrial (인더스트리얼)", 
        "Mid-Century Modern (미드센추리 모던)", "Scandinavian (북유럽/스칸디나비안)", "Traditional (트래디셔널)", 
        "Transitional (트랜지셔널)", "Art Deco (아르 데코)", "French Country (프렌치 컨트리)", 
        "Rustic (러스틱)", "Bohemian (보헤미안)", "Coastal Hamptons (코스탈 햄튼)", 
        "Japandi (자판디)", "Hollywood Regency (할리우드 리젠시)", "Maximalist (맥시멀리즘)"
    ],
    // C. MATERIALS
    "mat": [
        "White Plaster (화이트 미장)", "Venetian Plaster (베네치안 플라스터)", "Exposed Concrete (노출 콘크리트)", 
        "White Painted Brick (화이트 파벽돌)", "Red Brick (붉은 벽돌)", "Natural Stone (천연석)", 
        "Oak Wood Paneling (오크 우드 패널)", "Walnut Wood Paneling (월넛 우드 패널)", "Tambour Board (템바보드)", 
        "Silk Wallpaper (실크 벽지)", "Patterned Wallpaper (패턴 벽지)", "Wainscoting (웨인스코팅)", 
        "Marble Slab (대리석 슬랩)", "Glass Wall (유리벽)", "Mirror Wall (거울벽)", "Stainless Steel (스테인리스 스틸)"
    ],
    "floor": [
        "Herringbone Parquet (헤링본 마루)", "Chevron Parquet (쉐브론 마루)", "Wide Plank Oak (광폭 원목마루)", 
        "Dark Walnut Floor (월넛 마루)", "Polished Concrete (폴리싱 콘크리트)", "Microcement (마이크로 시멘트)", 
        "Terrazzo (테라조)", "White Marble (화이트 대리석)", "Black Marble (블랙 대리석)", 
        "Travertine Tile (트래버틴 타일)", "Porcelain Tile (포세린 타일)", "Sisal Rug (사이잘 러그)", 
        "Wall-to-wall Carpet (카펫)", "Epoxy (에폭시)"
    ],
    "form": [ // 천장 디테일
        "Wooden Beams (목재 빔/서까래)", "Decorative Molding (장식 몰딩)", "Recessed Lighting Cove (간접 등박스)", 
        "Industrial Pipes (노출 배관)", "Skylight Window (천창)", "Minimal Flat (평천장)"
    ],
    // D. FURNISHING
    "detail": [ // 가구 스타일
        "Modular Low Sofa (모듈 소파)", "Curved Velvet Sofa (벨벳 곡선 소파)", "Leather Chesterfield (체스터필드 소파)", 
        "Pierre Jeanneret Chairs (피에르 잔느레 의자)", "Eames Lounge Chair (임스 라운지 체어)", "Wishbone Chairs (위시본 체어)", 
        "Marble Dining Table (대리석 식탁)", "Solid Wood Slab (우드슬랩)", "Glass Coffee Table (유리 테이블)", 
        "Built-in Cabinetry (빌트인 수납장)", "Floating Shelves (무지주 선반)", "Rattan Furniture (라탄 가구)", "Steel Tube Furniture (스틸 파이프 가구)"
    ],
    "concept": [ // 컬러 팔레트
        "All White (올 화이트)", "Warm Beige & Cream (웜 베이지 & 크림)", "Greige Tone (그레이지)", "Monochromatic Grey (모노톤 그레이)", 
        "Black & White (블랙 앤 화이트)", "Earthy Terracotta (얼씨 테라코타)", "Pastel Tones (파스텔 톤)", 
        "Deep Green & Gold (딥 그린 & 골드)", "Navy Blue & Wood (네이비 & 우드)", "Burgundy & Brass (버건디 & 브라스)", 
        "Vibrant Pop Colors (비비드 팝 컬러)", "Dark & Moody (다크 무드)"
    ],
    "car": [ // 소품 (Decor)
        "Large Potted Plants (대형 화분)", "Abstract Painting (추상화)", "Sculptural Ceramics (도자기 오브제)", 
        "Coffee Table Books (커피테이블 서적)", "Vintage Vinyls (빈티지 바이닐)", "Luxury Perfumes (향수 컬렉션)", 
        "Minimal Objects (미니멀 오브제)", "Travel Souvenirs (여행 기념품)"
    ],
    "road": [ // 텍스타일/러그
        "Persian Rug (페르시안 러그)", "Geometric Wool Rug (기하학 패턴 러그)", "Jute Rug (마 러그)", 
        "Sheepskin Throw (양털 러그)", "Silk Curtains (실크 커튼)", "Linen Drapes (린넨 커튼)", "No Rug (러그 없음)"
    ],
    "land": [ // 식물 (Planterior)
        "Monstera Plant (몬스테라)", "Olive Tree (올리브 나무)", "Fiddle Leaf Fig (떡갈고무나무)", 
        "Dried Flowers (드라이 플라워)", "Fresh Tulips (튤립)", "Vertical Garden (수직 정원)", "No Plants (식물 없음)"
    ],
    // E. LIGHTING
    "weather": [ // 조명 기구
        "Crystal Chandelier (크리스탈 샹들리에)", "Modern Pendant (모던 펜던트)", "Linear LED (라인 조명)", 
        "Track Lighting (레일 조명)", "Floor Lamp (플로어 램프)", "Table Lamp (테이블 램프)", 
        "Neon Sign (네온 사인)", "Paper Lantern (종이 등/이사무 노구치)", "Architectural Slot Light (건축화 조명/슬롯)"
    ],
    "light": [ // 조명 효과
        "Soft Morning Light (부드러운 아침 햇살)", "Strong Sunlight (강한 직사광)", "Golden Hour (골든아워)", 
        "Blue Hour (블루아워)", "Diffused Light (확산광)", "God Rays (빛내림)", 
        "Moonlight (달빛)", "Dramatic Contrast (드라마틱한 명암)", "Artificial Light Only (인공 조명만)"
    ],
    "mood": [
        "Cozy & Warm (아늑하고 따뜻한)", "Clean & Sterile (깨끗하고 정갈한)", "Luxurious (고급스러운)", 
        "Moody & Atmospheric (무드있는)", "Airy & Breezy (통풍이 잘되는)", "Masculine (남성적인)", 
        "Romantic (로맨틱한)", "Professional (전문적인)", "Zen (명상적인/젠)"
    ],
    "time": ["Early Morning (이른 아침)", "Midday (한낮)", "Late Afternoon (늦은 오후)", "Sunset (일몰)", "Night (밤)", "Midnight (자정)"],
    "season": ["Spring Blossom (봄/꽃)", "Summer Greenery (여름/녹음)", "Autumn Leaves (가을/낙엽)", "Winter Snow (겨울/눈)"],
    
    // F. TECH SPECS
    "rep": ["Hyper-realistic Photo (극사실 사진)", "3D Render (3D 렌더링)", "Architectural Sketch (건축 스케치)", "Watercolor (수채화)"],
    "engine": ["Unreal Engine 5.5", "Corona Render", "V-Ray 6", "Midjourney V6.1"],
    "view": ["Eye-level (눈높이)", "Low Angle (로우 앵글)", "High Angle (하이 앵글)", "Top-down Plan (평면도)", "Wide Angle (광각)", "Close-up (클로즈업)", "Isometric (아이소메트릭)"],
    "lens": ["16mm Wide (초광각)", "24mm Std Wide (광각)", "35mm Standard (표준)", "50mm Portrait (인물/표준)", "85mm Detail (망원/디테일)", "Macro (매크로)"],
    "ratio": ["--ar 16:9 (Wide)", "--ar 4:3 (Standard)", "--ar 3:4 (Portrait)", "--ar 9:16 (Story)", "--ar 1:1 (Square)"],
    "motion": ["Still Life (정적)", "Motion Blur (모션 블러)", "Long Exposure (장노출)"]
};

// ==========================================================================
// 2. THEME PRESETS (15가지 테마)
// ==========================================================================
const COMMON_SPECS = { s14: "Hyper-realistic Photo (극사실 사진)", s15: "Unreal Engine 5.5", s16: "Eye-level (눈높이)", s22: "24mm Std Wide (광각)", s18: "--ar 4:3 (Standard)" };

const THEME_PRESETS = {
    'modern': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Living Room (거실)", s5: "Modern (모던)", s6: "Glass Wall (유리벽)", s7: "Polished Concrete (폴리싱 콘크리트)", s2: "Open Plan (오픈 플랜)", s24: "Neutral Palette (중성적 색채)", boost: "Bauhaus, clean lines, functional, no clutter" }],
    'contemporary': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Living Room (거실)", s5: "Contemporary (컨템포러리)", s6: "Natural Stone (천연석)", s7: "Wide Plank Oak (광폭 원목마루)", s23: "Curved Velvet Sofa (벨벳 곡선 소파)", s24: "Bold Contrast (강한 대비)", boost: "fluid curves, trendy, sculptural, current fashion" }],
    'minimal': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Master Bedroom (안방)", s5: "Minimalist (미니멀리즘)", s6: "White Plaster (화이트 미장)", s7: "Microcement (마이크로 시멘트)", s25: "Minimal Objects (미니멀 오브제)", s24: "All White (올 화이트)", boost: "negative space, zen, clutter-free, essentialism" }],
    'industrial': [{ ...COMMON_SPECS, s3: "2.Commercial (상업)", s4: "Hip Cafe (힙한 카페)", s5: "Industrial (인더스트리얼)", s6: "Exposed Concrete (노출 콘크리트)", s7: "Epoxy (에폭시)", s8: "Industrial Pipes (노출 배관)", s23: "Steel Tube Furniture (스틸 파이프 가구)", boost: "loft style, raw texture, brooklyn, rusted metal" }],
    'midcentury': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Home Office (서재)", s5: "Mid-Century Modern (미드센추리 모던)", s6: "Walnut Wood Paneling (월넛 우드 패널)", s7: "Dark Walnut Floor (월넛 마루)", s23: "Eames Lounge Chair (임스 라운지 체어)", s24: "Deep Green & Gold (딥 그린 & 골드)", boost: "vintage, mad men style, organic curves, 1950s" }],
    'scandi': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Open Kitchen & Dining (대면형 주방)", s5: "Scandinavian (북유럽/스칸디나비안)", s6: "White Painted Brick (화이트 파벽돌)", s7: "Herringbone Parquet (헤링본 마루)", s19: "Monstera Plant (몬스테라)", s24: "Warm Beige & Cream (웜 베이지 & 크림)", boost: "hygge, cozy, bright, natural light, functional" }],
    'traditional': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Library (도서관)", s5: "Traditional (트래디셔널)", s6: "Wainscoting (웨인스코팅)", s7: "Dark Walnut Floor (월넛 마루)", s23: "Leather Chesterfield (체스터필드 소파)", s24: "Burgundy & Brass (버건디 & 브라스)", boost: "classic, symmetry, luxury, molding, dignity" }],
    'transitional': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Living Room (거실)", s5: "Transitional (트랜지셔널)", s6: "Patterned Wallpaper (패턴 벽지)", s7: "Wide Plank Oak (광폭 원목마루)", s23: "Modular Low Sofa (모듈 소파)", s24: "Greige Tone (그레이지)", boost: "refined, elegant, comfort, balance of old and new" }],
    'artdeco': [{ ...COMMON_SPECS, s3: "4.Hospitality (호텔/문화)", s4: "Hotel Lobby (호텔 로비)", s5: "Art Deco (아르 데코)", s6: "Marble Slab (대리석 슬랩)", s7: "Black Marble (블랙 대리석)", s10: "Crystal Chandelier (크리스탈 샹들리에)", s24: "Black & White (블랙 앤 화이트)", boost: "glamour, geometric patterns, gold accents, great gatsby" }],
    'french': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Open Kitchen & Dining (대면형 주방)", s5: "French Country (프렌치 컨트리)", s6: "Venetian Plaster (베네치안 플라스터)", s7: "Travertine Tile (트래버틴 타일)", s25: "Dried Flowers (드라이 플라워)", s24: "Pastel Tones (파스텔 톤)", boost: "rustic elegance, provence, romantic, soft curves" }],
    'rustic': [{ ...COMMON_SPECS, s3: "5.Special (특수)", s4: "Wine Cellar (와인 저장고)", s5: "Rustic (러스틱)", s6: "Natural Stone (천연석)", s7: "Herringbone Parquet (헤링본 마루)", s8: "Wooden Beams (목재 빔/서까래)", s24: "Earthy Terracotta (얼씨 테라코타)", boost: "primitive, raw nature, cozy cabin, unrefined" }],
    'boho': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Master Bedroom (안방)", s5: "Bohemian (보헤미안)", s6: "Patterned Wallpaper (패턴 벽지)", s7: "Sisal Rug (사이잘 러그)", s23: "Rattan Furniture (라탄 가구)", s24: "Vibrant Pop Colors (비비드 팝 컬러)", boost: "eclectic, plants, layered textures, free spirit" }],
    'coastal': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Living Room (거실)", s5: "Coastal Hamptons (코스탈 햄튼)", s6: "White Plaster (화이트 미장)", s7: "Wide Plank Oak (광폭 원목마루)", s20: "Linen Drapes (린넨 커튼)", s24: "Navy Blue & Wood (네이비 & 우드)", boost: "beach house, airy, relaxed luxury, breeezy" }],
    'japandi': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Living Room (거실)", s5: "Japandi (자판디)", s6: "Tambour Board (템바보드)", s7: "Microcement (마이크로 시멘트)", s23: "Modular Low Sofa (모듈 소파)", s24: "Warm Beige & Cream (웜 베이지 & 크림)", boost: "wabi-sabi, warm minimalism, wood & stone, meditation" }],
    'hollywood': [{ ...COMMON_SPECS, s3: "1.Residential (주거)", s4: "Walk-in Closet (드레스룸)", s5: "Hollywood Regency (할리우드 리젠시)", s6: "Mirror Wall (거울벽)", s7: "White Marble (화이트 대리석)", s23: "Curved Velvet Sofa (벨벳 곡선 소파)", s24: "Vibrant Pop Colors (비비드 팝 컬러)", boost: "opulence, glam, high gloss, drama, cinema" }]
};

// ==========================================================================
// 3. API ENDPOINTS
// ==========================================================================

// 데이터 시트 조회
app.get('/api/data', (req, res) => res.json({ dataSheet: DATA_SHEET }));

// 테마 프리셋 조회
app.get('/api/preset/:themeKey', (req, res) => {
    const presets = THEME_PRESETS[req.params.themeKey];
    if (presets && presets.length > 0) {
        const choice = presets[Math.floor(Math.random() * presets.length)];
        res.json(choice);
    } else {
        res.json({ error: "No preset found" });
    }
});

// 💳 [결제 시스템] 크레딧 충전 및 유효기간 연장 (NEW)
app.post('/api/charge-success', async (req, res) => {
    // creditsToAdd: 충전할 크레딧 (100 or 1000)
    // daysToAdd: 연장할 기간 (30일)
    const { userId, amount, creditsToAdd, daysToAdd } = req.body;
    
    if (!userId || !amount) {
        return res.status(400).json({ error: "필수 정보가 누락되었습니다." });
    }

    try {
        // 1. 프로필 조회
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

        // 2. 크레딧 추가
        const addedCredits = creditsToAdd ? parseInt(creditsToAdd) : Math.floor(amount / 30);
        const newCredits = currentCredits + addedCredits;

        // 3. 유효기간 연장
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

        // 4. DB 업데이트
        const { error: updateError } = await sbAdmin
            .from('profiles')
            .update({ 
                credits: newCredits,
                valid_until: newExpiryDate.toISOString() 
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        console.log(`✅ [Charge] User ${userId}: +${addedCredits} Cr, +${addedDays} Days`);
        res.json({ success: true, newCredits, newExpiry: newExpiryDate });

    } catch (err) {
        console.error("Charge Error:", err);
        res.status(500).json({ error: "크레딧 충전 중 오류가 발생했습니다." });
    }
});

// 🍌 [생성 엔진] 프롬프트 생성 및 크레딧 차감 (유효기간 체크 포함)
app.post('/api/generate', async (req, res) => {
    const { choices, themeBoost, userId } = req.body;

    // 1. 비회원(Guest) 처리
    if (!userId || userId === 'guest') {
        const prompt = generateInteriorPrompt(choices, themeBoost);
        return res.json({ result: prompt, remainingCredits: 'guest' });
    }

    // 2. 회원 처리 (DB 연동)
    try {
        const { data: userProfile, error: fetchError } = await sbAdmin
            .from('profiles')
            .select('credits, valid_until')
            .eq('id', userId)
            .single();

        if (fetchError || !userProfile) {
            return res.status(404).json({ error: "사용자 정보를 찾을 수 없습니다." });
        }

        // [New] 유효기간 체크
        if (userProfile.valid_until) {
            const expiryDate = new Date(userProfile.valid_until);
            if (expiryDate < new Date()) {
                return res.status(403).json({ error: "멤버십이 만료되었습니다. 연장 후 이용해주세요!" });
            }
        }
        
        // 크레딧 체크
        if (userProfile.credits < 1) {
            return res.status(403).json({ error: "크레딧이 부족합니다. 충전 후 이용해주세요!" });
        }

        const newBalance = userProfile.credits - 1;
        const { error: updateError } = await sbAdmin
            .from('profiles')
            .update({ credits: newBalance })
            .eq('id', userId);

        if (updateError) throw updateError;

        const prompt = generateInteriorPrompt(choices, themeBoost);
        
        console.log(`✨ [Generate] User ${userId} used 1 credit. (Remaining: ${newBalance})`);
        res.json({ result: prompt, remainingCredits: newBalance });

    } catch (err) {
        console.error("Generate Error:", err);
        res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
});

// 📝 [Helper] Nano Banana Optimized Prompt Builder
function generateInteriorPrompt(choices, themeBoost) {
    const getV = (k) => choices[k] ? choices[k].replace(/\([^)]*\)/g, "").trim() : "";

    // 1. Main Subject & Context
    const style = getV('s5') || "Modern";
    const room = getV('s4') || getV('s3') || "Interior Space";
    const context = getV('s0') ? `situated within a ${getV('s0')}` : "";
    
    let prompt = `Create a **photorealistic interior design image** of a **${style} ${room}** ${context}.`;
    
    // 2. Architectural Features
    let features = [];
    if(getV('s2')) features.push(`a ${getV('s2')}`);
    if(getV('s8')) features.push(`architectural details like ${getV('s8')}`);
    if(getV('s1')) features.push(`large windows revealing a ${getV('s1')}`);
    
    if(features.length > 0) prompt += ` The space is characterized by ${features.join(', ')}.`;

    // 3. Materials & Finishes
    const wall = getV('s6') || "neutral walls";
    const floor = getV('s7') || "matching flooring";
    prompt += ` The design features **${wall}** paired with **${floor}**.`;

    // 4. Furnishing & Decor
    prompt += ` The room is furnished with **${getV('s23') || "contemporary furniture"}**`;
    if(getV('s24')) prompt += ` following a **${getV('s24')} color palette**`;
    prompt += `.`;
    
    const decorItems = [getV('s25'), getV('s20'), getV('s19')].filter(Boolean);
    if(decorItems.length > 0) {
        prompt += ` Decor highlights include ${decorItems.join(', ')}.`;
    }

    // 5. Lighting & Atmosphere
    prompt += ` The atmosphere is **${getV('s11') || "inviting"}**, illuminated by ${getV('s10') || "ambient lighting"} creating ${getV('s17') || "soft shadows"}.`;
    if(getV('s9')) prompt += ` The time setting is ${getV('s9')}.`;

    // 6. Artistic Boost
    if(themeBoost) prompt += `\n\n**Artistic Style**: Capture the essence of ${themeBoost}.`;

    // 7. Technical Specs
    prompt += `\n\n**Technical Details**: Shot from a ${getV('s16') || "eye-level"} perspective using a ${getV('s22') || "24mm lens"}.`;
    prompt += ` Rendered in ${getV('s15') || "Unreal Engine 5"} style, achieving ${getV('s14') || "Hyper-realism"}.`;
    
    // 8. Quality & Negative Constraints
    prompt += `\n**Quality Requirements**: 8k resolution, award-winning interior photography, sharp focus, perfectly balanced composition.`;
    prompt += `\n**Negative Constraints**: Do not include text, watermarks, blurred foregrounds, distorted geometry, or human figures unless specified.`;
    
    const ratio = (choices['s18'] || "--ar 4:3").replace("--ar ", "");
    prompt += `\n(Target Aspect Ratio: ${ratio})`;

    return prompt;
}

// Start Server
app.listen(port, () => {
    console.log(`🚀 MY INTERIOR PRO Server running on port ${port}`);
});
