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

// ==========================================================================
// 1. DATA_SHEET (한영 병기 적용 완료 v2.1)
// ==========================================================================
const DATA_SHEET = {
    "usage_mapping": {
        "1.Residential": [
            "Living Room (거실)", "Master Bedroom (안방/마스터룸)", "Open Kitchen & Dining (오픈형 주방 & 다이닝)", 
            "Luxury Bathroom (고급 욕실)", "Powder Room (파우더룸)", "Home Office (홈 오피스/서재)", 
            "Walk-in Closet (드레스룸)", "Entrance Hall (현관 홀)", "Kids Room (아이방)", 
            "Attic Lounge (다락방 라운지)", "Home Bar (홈바)", "Guest Room (게스트룸)"
        ],
        "2.Commercial": [
            "Hip Cafe (힙한 카페)", "Fine Dining Restaurant (파인다이닝 레스토랑)", "Whiskey Bar (위스키 바)", 
            "Fashion Boutique (패션 부티크)", "Flagship Store (플래그십 스토어)", "Artisan Bakery (베이커리)", 
            "Flower Shop (플라워 샵)", "Hair Salon (헤어 살롱)", "Yoga Studio (요가 스튜디오)", "Pop-up Store (팝업 스토어)"
        ],
        "3.Office": [
            "CEO Office (임원실)", "Open Workstation (오픈형 사무실)", "Conference Room (대회의실)", 
            "Creative Lounge (크리에이티브 라운지)", "Lobby & Reception (로비 & 리셉션)", "Meeting Booth (미팅 부스)"
        ],
        "4.Hospitality": [
            "Hotel Lobby (호텔 로비)", "Luxury Hotel Suite (호텔 스위트룸)", "Art Gallery (아트 갤러리)", 
            "Museum Hall (박물관 홀)", "Spa & Wellness Center (스파 & 웰니스)", "Library (도서관)", "Resort Lounge (리조트 라운지)"
        ],
        "5.Special": [
            "Home Cinema (홈 시네마)", "Gaming Room (게이밍 룸)", "Wine Cellar (와인 저장고)", 
            "Indoor Garden (실내 정원)", "Home Gym (홈짐)", "Recording Studio (녹음실)", "Cat Cafe (고양이 카페)"
        ]
    },
    "style": [
        "Modern Minimalist (모던 미니멀리즘)", "Contemporary (컨템포러리)", "Industrial Loft (인더스트리얼 로프트)", 
        "Mid-Century Modern (미드센추리 모던)", "Scandinavian (북유럽 스타일)", "Traditional Classic (트래디셔널 클래식)", 
        "Art Deco (아트데코)", "French Provincial (프렌치 프로방스)", "Rustic Farmhouse (러스틱 팜하우스)", 
        "Bohemian (보헤미안/보호)", "Coastal Hamptons (코스탈 햄튼)", "Japandi (자판디/재팬+스칸디)", 
        "Hollywood Regency (할리우드 리젠시)", "Zen (젠 스타일)", "Wabi-sabi (와비사비)", 
        "Bauhaus (바우하우스)", "Maximalist (맥시멀리즘)"
    ],
    "mat": [
        "Venetian Plaster (베네치안 플라스터/유럽미장)", "Microcement (마이크로 시멘트)", "Exposed Concrete (노출 콘크리트)", 
        "Oak Wood Paneling (오크 우드 패널)", "Walnut Fluted Panels (월넛 템바보드)", "White Marble Slab (화이트 대리석)", 
        "Black Marquina Marble (블랙 마르퀴나 대리석)", "Red Brick Wall (붉은 파벽돌)", "White Painted Brick (화이트 파벽돌)", 
        "Travertine Stone (트래버틴 스톤)", "Stainless Steel Panels (스테인리스 스틸)", "Brushed Aluminum (헤어라인 알루미늄)", 
        "Terrazzo Wall (테라조 월)", "Velvet Fabric Wall (벨벳 패브릭 월)", "Tambour Board (탬버보드)", "Silk Wallpaper (실크 벽지)"
    ],
    "floor": [
        "Herringbone Oak Parquet (헤링본 오크 마루)", "Chevron Walnut Parquet (쉐브론 월넛 마루)", 
        "Wide Plank Timber (광폭 원목 마루)", "Polished Concrete (폴리싱 콘크리트)", "Microcement Floor (마이크로 시멘트 바닥)", 
        "Terrazzo (테라조 바닥)", "White Carrara Marble (화이트 카라라 대리석)", "Black Slate Tile (블랙 슬레이트 타일)", 
        "Checkered Black&White Marble (체커보드 대리석)", "Porcelain Tile (포세린 타일)", "Sisal Rug (사이잘 러그)", 
        "Wall-to-wall Wool Carpet (울 카펫)", "Travertine Tile (트래버틴 타일)"
    ],
    "form": [
        "Vaulted Ceiling (볼트 천장)", "Coffered Ceiling (우물 천장)", "Exposed Wooden Beams (노출 서까래)", 
        "Recessed Lighting Cove (간접 조명 등박스)", "Industrial Exposed HVAC Pipes (노출 배관)", 
        "Skylight Installation (천창 설치)", "Minimalist Flat Ceiling (평천장)", "Double-height Void (복층 보이드)", 
        "Sloped Attic Ceiling (경사 지붕 천장)", "Decorative Molding (웨인스코팅 몰딩)"
    ],
    "detail": [ // Furniture & Objects
        "Modular Low Sofa (모듈형 로우 소파)", "Pierre Jeanneret Chairs (피에르 잔느레 의자)", 
        "Eames Lounge Chair (임스 라운지 체어)", "Curved Velvet Sofa (곡선형 벨벳 소파)", 
        "Marble Island Counter (대리석 아일랜드)", "Solid Wood Slab Table (우드슬랩 테이블)", 
        "Built-in Library Shelves (빌트인 서재)", "Floating Staircase (플로팅 계단)", 
        "Rattan Furniture (라탄 가구)", "Steel Tube Chairs (스틸 튜브 체어)", 
        "Chesterfield Leather Sofa (체스터필드 가죽 소파)", "Noguchi Coffee Table (노구치 테이블)"
    ],
    "concept": [ // Color Palette
        "Warm Beige & Cream (웜 베이지 & 크림)", "All White Minimal (올 화이트 미니멀)", 
        "Monochromatic Grey (모노크롬 그레이)", "Greige Tones (그레이지 톤)", 
        "Black & White High Contrast (블랙 앤 화이트)", "Earthy Terracotta & Sage (테라코타 & 세이지)", 
        "Deep Green & Gold (딥 그린 & 골드)", "Navy Blue & Dark Wood (네이비 블루 & 다크 우드)", 
        "Burgundy & Brass (버건디 & 브라스)", "Pastel Sorbet Colors (파스텔 소르베)", 
        "Dark & Moody Charcoal (다크 & 무디 차콜)"
    ],
    "land": [ // Indoor Plants
        "Large Monstera Deliciosa (대형 몬스테라)", "Olive Tree in Terracotta Pot (올리브 나무)", 
        "Fiddle Leaf Fig (떡갈고무나무)", "Dried Pampas Grass (팜파스)", "Hanging Pothos (행잉 식물)", 
        "Vertical Moss Wall (수직 이끼 벽)", "Indoor Bamboo Grove (실내 대나무)", 
        "Bonsai Collection (분재)", "Fresh Cut Tulips (튤립)", "No Plants (식물 없음)"
    ],
    "road": [ // Textiles (Key mapping maintained from 2.0)
        "Persian Rug (페르시아 러그)", "Geometric Wool Rug (기하학 패턴 러그)", "Jute Rug (황마 러그)", 
        "Sheepskin Throw (양털 러그)", "Silk Curtains (실크 커튼)", "Linen Drapes (린넨 커튼)", 
        "Motorized Blinds (전동 블라인드)", "Velvet Cushions (벨벳 쿠션)", 
        "Knitted Throw Blanket (니트 담요)", "No Textiles (패브릭 없음)"
    ],
    "weather": [ // Lighting Fixtures (Key mapping maintained from 2.0)
        "Crystal Chandelier (크리스탈 샹들리에)", "Bauhaus Pendant Light (바우하우스 펜던트)", 
        "Architectural Magnetic Track Light (마그네틱 트랙 조명)", "Noguchi Paper Lantern (종이 조명)", 
        "Neon Signage (네온 사인)", "Minimalist LED Line (라인 조명)", "Brass Wall Sconces (브라스 벽등)", 
        "Arco Floor Lamp (아르코 플로어 램프)", "Table Lamp (테이블 램프)"
    ],
    "light": [ // Environment Light
        "Morning Sunlight (아침 햇살)", "Golden Hour Glow (골든 아워/노을)", "Blue Hour Dusk (블루 아워/해질녘)", 
        "Soft Diffused Light (부드러운 확산광)", "Dramatic Chiaroscuro (드라마틱한 명암)", 
        "Cyberpunk Neon Glow (사이버펑크 네온)", "Warm Interior Incandescent (따뜻한 실내 조명)", 
        "Moonlight through Window (창문 너머 달빛)", "God Rays (빛내림)"
    ],
    "mood": [
        "Serene & Zen (고요하고 선적인)", "Luxurious & Grand (럭셔리하고 웅장한)", "Cozy & Warm (아늑하고 따뜻한)", 
        "Moody & Atmospheric (무드 있고 분위기 있는)", "Airy & Breezy (통풍이 잘 되고 시원한)", 
        "Professional & Clean (전문적이고 깔끔한)", "Romantic (낭만적인)", 
        "Futuristic (미래지향적인)", "Vintage & Nostalgic (빈티지한 향수)"
    ],
    "time": [
        "Early Morning (이른 아침)", "Midday (한낮)", "Late Afternoon (늦은 오후)", 
        "Sunset (일몰)", "Night (밤)", "Midnight (자정)"
    ],
    "season": [
        "Spring (Blossom) (봄/꽃)", "Summer (Vibrant) (여름/활기찬)", 
        "Autumn (Warm) (가을/따뜻한)", "Winter (Snowy) (겨울/눈)"
    ],
    "country": [
        "Seoul, Korea (서울)", "Paris, France (파리)", "Manhattan, NY (맨해튼)", 
        "Tokyo, Japan (도쿄)", "Milan, Italy (밀라노)", "Copenhagen, Denmark (코펜하겐)", 
        "London, UK (런던)", "Santorini, Greece (산토리니)", "Bali, Indonesia (발리)", "Berlin, Germany (베를린)"
    ],
    "region": [ // View Outside
        "City Skyline View (도시 스카이라인 뷰)", "Park Greenery View (공원 숲 뷰)", 
        "Ocean Horizon View (바다 수평선 뷰)", "Rainy Street View (비 오는 거리 뷰)", 
        "Private Courtyard View (프라이빗 중정 뷰)", "Night City Lights View (도시 야경 뷰)", 
        "Snowy Mountain View (설산 뷰)", "Eiffel Tower View (에펠탑 뷰)"
    ],
    "site": [ // Building Type
        "Penthouse Loft (펜트하우스 로프트)", "Luxury Apartment (고급 아파트)", 
        "Industrial Loft (인더스트리얼 로프트)", "Minimalist Villa (미니멀리스트 빌라)", 
        "Hanok House (한옥)", "Flagship Store (플래그십 스토어)", "Basement Studio (지하 스튜디오)"
    ],
    "rep": [
        "Hyper-realistic Photo (극사실 사진)", "3D Render (3D 렌더)", 
        "Architectural Photography (건축 사진)", "Watercolor Sketch (수채화 스케치)", "Cinematic Shot (영화 같은 샷)"
    ],
    "engine": [
        "Unreal Engine 5.5", "Octane Render", "V-Ray 6", "Corona Render", "Midjourney V6.1"
    ],
    "view": [
        "Eye-level (눈높이)", "Wide Angle (광각)", "Low Angle (로우 앵글)", 
        "Top-down Plan (평면도 시점)", "Isometric (아이소)", "Close-up Macro (클로즈업)"
    ],
    "lens": [
        "16mm Ultra-wide (16mm 초광각)", "24mm Standard Wide (24mm 광각)", "35mm Narrative (35mm 표준)", 
        "50mm Portrait (50mm 인물/정석)", "85mm Detail (85mm 디테일)", "Tilt-shift Lens (틸트 시프트)"
    ],
    "ratio": [
        "--ar 16:9", "--ar 4:3", "--ar 1:1", "--ar 9:16", "--ar 3:4", "--ar 2:1"
    ],
    "act": [
        "Standing (서 있는)", "Sitting (앉아 있는)", "Dining (식사 중)", 
        "Reading (독서 중)", "Working (일하는)", "Walking (걷는)", "Relaxing on Sofa (소파에서 휴식)"
    ],
    "people_density": [
        "Empty (사람 없음)", "Solitary Figure (한 명)", 
        "Sparse People (드문드문)", "Bustling Crowd (붐비는)"
    ],
    "nature_density": [ // Decor Density
        "Minimalist Decor (미니멀 장식)", "Balanced Decor (균형 잡힌)", 
        "Maximalist Decor (맥시멀 장식)", "Cluttered/Lived-in (생활감 있는)"
    ],
    "vehicle_density": [ // Object Density/Type (Interior mapping)
        "Sparse Objects (소품 조금)", "Richly Decorated (풍부한 장식)", "Museum-like (박물관 같은)"
    ],
    "car": [ // Small Objects
        "Sculpture (조각상)", "Antique Vase (앤틱 화병)", "Art Collection (예술 작품)", 
        "Luxury Bags (명품 가방)", "Coffee Table Books (아트북)", "Vinyl Records (LP 판)"
    ],
    "motion": [
        "Still Life (정적인)", "Long Exposure (장노출)", "Motion Blur (모션 블러)"
    ]
};

// 📷 [TECH SPECS] 공통 카메라 설정 (한영 병기 반영)
const COMMON_SPECS = {
    s14: "Hyper-realistic Photo (극사실 사진)", 
    s15: "Unreal Engine 5.5", 
    s16: "Eye-level (눈높이)", 
    s22: "35mm Narrative (35mm 표준)", 
    s26: "Still Life (정적인)", 
    s18: "--ar 4:3"
};

// 🏠 [PRESETS] 15개 테마 (데이터 시트 값과 일치하도록 업데이트)
const THEME_PRESETS = {
    'modern': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Living Room (거실)", s5: "Modern Minimalist (모던 미니멀리즘)", 
        s6: "White Stucco (화이트 파벽돌)", s7: "Polished Concrete (폴리싱 콘크리트)", 
        s24: "Monochromatic Grey (모노크롬 그레이)", 
        boost: "clean lines, bauhaus inspiration, functional, luxury photography" 
    },
    'contemporary': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Living Room (거실)", s5: "Contemporary (컨템포러리)", 
        s23: "Curved Velvet Sofa (곡선형 벨벳 소파)", s24: "Deep Green & Gold (딥 그린 & 골드)", 
        s17: "Dramatic Chiaroscuro (드라마틱한 명암)", 
        boost: "fluid curves, trendy sculptural furniture, bold accents, vogue living style" 
    },
    'minimalist': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Master Bedroom (안방/마스터룸)", s5: "Modern Minimalist (모던 미니멀리즘)", 
        s6: "Venetian Plaster (베네치안 플라스터/유럽미장)", s25: "Minimal Objects (미니멀 오브제)", 
        s11: "Serene & Zen (고요하고 선적인)", 
        boost: "negative space, meditation room, extreme simplicity, soft natural light" 
    },
    'industrial': { 
        ...COMMON_SPECS, 
        s3: "2.Commercial", s4: "Hip Cafe (힙한 카페)", s5: "Industrial Loft (인더스트리얼 로프트)", 
        s6: "Red Brick Wall (붉은 파벽돌)", s8: "Industrial Exposed HVAC Pipes (노출 배관)", 
        s23: "Steel Tube Chairs (스틸 튜브 체어)", 
        boost: "raw textures, brooklyn loft aesthetic, weathered materials, high contrast" 
    },
    'midcentury': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Home Office (홈 오피스/서재)", s5: "Mid-Century Modern (미드센추리 모던)", 
        s23: "Eames Lounge Chair (임스 라운지 체어)", s24: "Navy Blue & Dark Wood (네이비 블루 & 다크 우드)", 
        s7: "Chevron Walnut Parquet (쉐브론 월넛 마루)", 
        boost: "vintage 1950s, organic shapes, walnut wood grains, mad men style" 
    },
    'scandi': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Open Kitchen & Dining (오픈형 주방 & 다이닝)", s5: "Scandinavian (북유럽 스타일)", 
        s7: "Herringbone Oak Parquet (헤링본 오크 마루)", s24: "Warm Beige & Cream (웜 베이지 & 크림)", 
        s19: "Fiddle Leaf Fig (떡갈고무나무)", 
        boost: "hygge, cozy, bright and airy, light wood, functional simplicity" 
    },
    'traditional': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Library (도서관)", s5: "Traditional Classic (트래디셔널 클래식)", 
        s6: "Oak Wood Paneling (오크 우드 패널)", s8: "Coffered Ceiling (우물 천장)", 
        s23: "Chesterfield Leather Sofa (체스터필드 가죽 소파)", 
        boost: "timeless elegance, symmetry, sophisticated, grand scale" 
    },
    'transitional': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Master Bedroom (안방/마스터룸)", s5: "Contemporary (컨템포러리)", 
        s6: "Silk Wallpaper (실크 벽지)", s23: "Built-in Library Shelves (빌트인 서재)", 
        s24: "Greige Tones (그레이지 톤)", 
        boost: "blend of traditional and modern, balanced, cozy luxury, refined" 
    },
    'artdeco': { 
        ...COMMON_SPECS, 
        s3: "4.Hospitality", s4: "Hotel Lobby (호텔 로비)", s5: "Art Deco (아트데코)", 
        s6: "Black Marquina Marble (블랙 마르퀴나 대리석)", s10: "Crystal Chandelier (크리스탈 샹들리에)", 
        s24: "Black & White High Contrast (블랙 앤 화이트)", 
        boost: "glamour, geometric patterns, gold metallic accents, Great Gatsby style" 
    },
    'french': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Dining Room (다이닝 룸)", s5: "French Provincial (프렌치 프로방스)", 
        s6: "Venetian Plaster (베네치안 플라스터/유럽미장)", s25: "Antique Vase (앤틱 화병)", 
        s21: "Spring (Blossom) (봄/꽃)", 
        boost: "romantic, rustic elegance, soft curves, provence manor style" 
    },
    'rustic': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Living Room (거실)", s5: "Rustic Farmhouse (러스틱 팜하우스)", 
        s6: "Exposed Wooden Beams (노출 서까래)", s7: "Wide Plank Timber (광폭 원목 마루)", 
        s11: "Cozy & Warm (아늑하고 따뜻한)", 
        boost: "primitive, raw nature, log cabin aesthetic, unrefined textures" 
    },
    'bohemian': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Attic Lounge (다락방 라운지)", s5: "Bohemian (보헤미안/보호)", 
        s23: "Rattan Furniture (라탄 가구)", s20: "Geometric Wool Rug (기하학 패턴 러그)", 
        s19: "Hanging Pothos (행잉 식물)", 
        boost: "eclectic, free spirit, layered textiles, vibrant and cozy" 
    },
    'coastal': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Living Room (거실)", s5: "Coastal Hamptons (코스탈 햄튼)", 
        s6: "White Painted Brick (화이트 파벽돌)", s20: "Linen Drapes (린넨 커튼)", 
        s1: "Ocean Horizon View (바다 수평선 뷰)", 
        boost: "beach house, breezy, relaxed luxury, nautical touches" 
    },
    'japandi': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Living Room (거실)", s5: "Japandi (자판디/재팬+스칸디)", 
        s6: "Walnut Fluted Panels (월넛 템바보드)", s7: "Microcement Floor (마이크로 시멘트 바닥)", 
        s11: "Wabi-sabi (와비사비)", 
        boost: "east meets west, zen, bamboo and stone, imperfect beauty" 
    },
    'hollywood': { 
        ...COMMON_SPECS, 
        s3: "1.Residential", s4: "Walk-in Closet (드레스룸)", s5: "Hollywood Regency (할리우드 리젠시)", 
        s6: "Mirror Wall (거울 벽)", s23: "Curved Velvet Sofa (곡선형 벨벳 소파)", 
        s24: "Pastel Sorbet Colors (파스텔 소르베)", 
        boost: "opulence, high gloss, cinema drama, vibrant pop of color" 
    }
};

// ================= API ENDPOINTS =================

// 1. 데이터 시트
app.get('/api/data', (req, res) => res.json({ dataSheet: DATA_SHEET }));

// 2. 프리셋
app.get('/api/preset/:key', (req, res) => res.json(THEME_PRESETS[req.params.key] || {}));

// 3. 결제 및 충전 (My Architect 로직 적용)
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

// 4. 생성 엔진 (한영 분리 로직 적용)
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
        
        // 프로필이 없을 경우
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
    // 💡 [KEY LOGIC] 괄호 안의 한글 제거 후 영문만 추출
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

app.listen(port, () => console.log(`🚀 MY INTERIOR PRO Server (v2.1 Bilingual) running on ${port}`));
