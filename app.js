/* ==========================================================================
   Music Match - 핵심 비즈니스 로직 및 데이터 (app.js)
   이 스크립트는 음악 데이터셋 정의, SPA 탭 라우팅, 검색, 장르/분위기 필터링,
   즐겨찾기(LocalStorage 연동), 평점 별점 부여, 모달 정보 제공 등을 제어합니다.
   ========================================================================== */

// 1. 30곡 이상의 샘플 음악 데이터 정의 (장르별 5곡씩 구성)
const musicDataset = [
    // --- 1) 발라드 장르 (ID: 1 ~ 5) ---
    {
        id: 1,
        title: "밤편지",
        artist: "아이유 (IU)",
        genre: "발라드",
        moods: ["잠들기 전", "기분이 우울할 때"],
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60",
        recommendation: "서정적인 어쿠스틱 기타 선율과 아이유의 따뜻하고 차분한 목소리가 어우러진 곡입니다. 잠들기 전 조용히 감상하며 하루를 마감하기에 완벽한 위로를 건넵니다.",
        releaseDate: "2017-03-24",
        likes: 9820,
        rating: 4.9
    },
    {
        id: 2,
        title: "모든 날, 모든 순간",
        artist: "폴킴 (Paul Kim)",
        genre: "발라드",
        moods: ["드라이브할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60",
        recommendation: "담담하면서도 감미로운 목소리로 사랑하는 이의 곁을 지키겠다는 진심을 표현합니다. 드라이브할 때 창문을 열어두고 흘러나오는 잔잔한 멜로디가 매력적입니다.",
        releaseDate: "2018-03-20",
        likes: 8750,
        rating: 4.8
    },
    {
        id: 3,
        title: "야생화",
        artist: "박효신",
        genre: "발라드",
        moods: ["기분이 우울할 때", "공부할 때"],
        image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=60",
        recommendation: "추운 겨울을 이겨내고 붉게 피어나는 야생화처럼, 역경 속에서도 다시 일어서겠다는 희망을 대변하는 웅장한 곡입니다. 마음이 울적할 때 폭발적인 가창력이 카타르시스를 선사합니다.",
        releaseDate: "2014-03-28",
        likes: 9540,
        rating: 4.95
    },
    {
        id: 4,
        title: "안녕",
        artist: "폴킴 (Paul Kim)",
        genre: "발라드",
        moods: ["잠들기 전", "공부할 때"],
        image: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=500&auto=format&fit=crop&q=60",
        recommendation: "드라마 '호텔 델루나'의 OST로, 만남과 헤어짐의 애틋함을 노래한 명곡입니다. 피아노와 스트링의 차분한 조화가 학습 또는 독서 시 편안한 BGM이 되어 줍니다.",
        releaseDate: "2019-08-12",
        likes: 7200,
        rating: 4.7
    },
    {
        id: 5,
        title: "처음 느끼던 그대 눈빛",
        artist: "신승훈",
        genre: "발라드",
        moods: ["드라이브할 때", "잠들기 전"],
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60",
        recommendation: "한국 발라드 황제 신승훈의 명곡으로 레트로한 감성과 맑고 깨끗한 미성이 인상적입니다. 차분한 밤하늘 아래 야간 드라이브를 할 때 어울리는 낭만을 불러일으킵니다.",
        releaseDate: "1990-11-01",
        likes: 6100,
        rating: 4.6
    },

    // --- 2) 힙합 장르 (ID: 6 ~ 10) ---
    {
        id: 6,
        title: "시차 (We Are)",
        artist: "우원재 (Feat. 로꼬, 그레이)",
        genre: "힙합",
        moods: ["공부할 때", "드라이브할 때"],
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=60",
        recommendation: "남들과 다른 시차 속에서 밤낮을 바꾸며 치열하게 꿈을 쫓는 청춘들의 이야기를 그레이의 세련된 비트와 우원재의 담담한 래핑으로 완성한 힙합 음악입니다.",
        releaseDate: "2017-09-04",
        likes: 8900,
        rating: 4.8
    },
    {
        id: 7,
        title: "SPIN BACK",
        artist: "릴보이 (lIlBOI)",
        genre: "힙합",
        moods: ["운동할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60",
        recommendation: "빠르고 타이트한 랩 스킬과 트렌디한 붐뱁 비트가 만나 아드레날린을 솟구치게 만듭니다. 러닝 머신을 뛰거나 고강도 웨이트 트레이닝을 할 때 강력 추천합니다.",
        releaseDate: "2022-10-18",
        likes: 5800,
        rating: 4.5
    },
    {
        id: 8,
        title: "VVS",
        artist: "미란이, 먼치맨, Khundi Panda, 머쉬베놈",
        genre: "힙합",
        moods: ["운동할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&auto=format&fit=crop&q=60",
        recommendation: "쇼미더머니 9의 신드롬적 흥행 곡으로, 상처 속에서도 다이아몬드(VVS)처럼 빛나겠다는 극복의 에너지를 전합니다. 지치고 포기하고 싶을 때 파워풀한 동기부여가 됩니다.",
        releaseDate: "2020-11-21",
        likes: 9230,
        rating: 4.85
    },
    {
        id: 9,
        title: "봄날 (Spring Day)",
        artist: "방탄소년단 (BTS)",
        genre: "힙합",
        moods: ["기분이 우울할 때", "잠들기 전"],
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
        recommendation: "대중적인 힙합 베이스에 서정적인 록 사운드와 따스한 코러스가 융합된 곡으로 멀어진 친구와의 만남을 기다리는 그리운 마음을 따스한 희망으로 녹여낸 명곡입니다.",
        releaseDate: "2017-02-13",
        likes: 9940,
        rating: 4.96
    },
    {
        id: 10,
        title: "Lose Yourself",
        artist: "Eminem",
        genre: "힙합",
        moods: ["운동할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500&auto=format&fit=crop&q=60",
        recommendation: "단 한 번뿐인 인생의 기회를 놓치지 말고 몰입하라는 메시지를 거친 비트와 카리스마 넘치는 플로우에 실어 보냅니다. 전 세계에서 운동 의욕을 불태울 때 가장 많이 찾는 힙합 앤섬입니다.",
        releaseDate: "2002-10-22",
        likes: 9100,
        rating: 4.9
    },

    // --- 3) 팝 장르 (ID: 11 ~ 15) ---
    {
        id: 11,
        title: "Shape of You",
        artist: "Ed Sheeran",
        genre: "팝",
        moods: ["드라이브할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60",
        recommendation: "중독성 넘치는 마림바 리프와 감각적인 타악 비트가 듣는 즉시 어깨를 들썩이게 만듭니다. 상쾌한 드라이브나 친구들과의 경쾌한 분위기 연출에 더없이 훌륭합니다.",
        releaseDate: "2017-01-06",
        likes: 9600,
        rating: 4.88
    },
    {
        id: 12,
        title: "Stay",
        artist: "The Kid LAROI & Justin Bieber",
        genre: "팝",
        moods: ["운동할 때", "드라이브할 때"],
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
        recommendation: "빠른 스피드의 신스 팝 비트 위로 두 아티스트의 속도감 있는 감성 보컬이 귀를 매료시킵니다. 지루한 유산소 운동이나 고속도로 드라이브에 시원한 타격감을 안겨줍니다.",
        releaseDate: "2021-07-09",
        likes: 8990,
        rating: 4.78
    },
    {
        id: 13,
        title: "Bad Guy",
        artist: "Billie Eilish",
        genre: "팝",
        moods: ["운동할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=60",
        recommendation: "미니멀하고 묵직한 베이스 라인과 속삭이는 듯 속도감 있는 빌리 아일리시만의 독보적 음색이 세련된 매력을 발산합니다. 묘한 긴장감을 부르는 템포가 운동 페이스 조절에 용이합니다.",
        releaseDate: "2019-03-29",
        likes: 9020,
        rating: 4.8
    },
    {
        id: 14,
        title: "Shallow",
        artist: "Lady Gaga & Bradley Cooper",
        genre: "팝",
        moods: ["기분이 우울할 때"],
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60",
        recommendation: "영화 '스타 이즈 본'의 대표 OST로 잔잔한 통기타 선율로 시작해 후반부 웅장한 가창력으로 폭발하는 명곡입니다. 마음 깊은 곳을 터치하는 깊은 여운을 원하는 우울한 날에 추천합니다.",
        releaseDate: "2018-09-27",
        likes: 8400,
        rating: 4.85
    },
    {
        id: 15,
        title: "Thinking Out Loud",
        artist: "Ed Sheeran",
        genre: "팝",
        moods: ["잠들기 전", "공부할 때"],
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        recommendation: "나이가 들어 늙어갈 때까지 영원히 변치 않을 클래식한 낭만과 사랑을 따뜻한 멜로디에 담아냈습니다. 침대에 누워 나른하게 휴식을 취하거나 편안히 독서할 때 좋은 동반자가 됩니다.",
        releaseDate: "2014-06-20",
        likes: 8120,
        rating: 4.75
    },

    // --- 4) 록 장르 (ID: 16 ~ 20) ---
    {
        id: 16,
        title: "Don't Look Back in Anger",
        artist: "Oasis",
        genre: "록",
        moods: ["드라이브할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=60",
        recommendation: "브릿팝의 대명사 오아시스의 대표적인 명곡으로, 과거의 상처를 따뜻하게 용서하며 나아가자는 가사입니다. 떼창을 자아내는 시원한 록 코러스가 드라이브 시 가슴을 확 틔워줍니다.",
        releaseDate: "1996-02-19",
        likes: 9680,
        rating: 4.93
    },
    {
        id: 17,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        genre: "록",
        moods: ["드라이브할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&auto=format&fit=crop&q=60",
        recommendation: "아카펠라, 발라드, 오페라, 하드 록이 유기적으로 결합된 불후의 서사곡입니다. 프레디 머큐리의 압도적인 보컬과 드라마틱한 곡 전개가 한 편의 대하소설을 보는 듯한 웅장함을 줍니다.",
        releaseDate: "1975-10-31",
        likes: 9790,
        rating: 4.98
    },
    {
        id: 18,
        title: "톰보이 (Tomboy)",
        artist: "혁오 (HYUKOH)",
        genre: "록",
        moods: ["공부할 때", "기분이 우울할 때"],
        image: "https://images.unsplash.com/photo-1524567214243-0013ee5c9af0?w=500&auto=format&fit=crop&q=60",
        recommendation: "청춘의 방황, 불안, 그리고 그 속에서 피어나는 서투른 아름다움을 빈티지한 인디 록 사운드로 묵직하게 담아냈습니다. 복잡한 생각을 비우고 차분히 집중하고 싶을 때 잔잔한 공감을 이끌어 냅니다.",
        releaseDate: "2017-04-24",
        likes: 7420,
        rating: 4.72
    },
    {
        id: 19,
        title: "한 페이지가 될 수 있게",
        artist: "DAY6 (데이식스)",
        genre: "록",
        moods: ["운동할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=500&auto=format&fit=crop&q=60",
        recommendation: "청춘 만화의 한 장면처럼 청량하고 폭발적인 에너지가 특징인 팝 록 장르 곡입니다. 드럼과 강렬한 기타 비트가 온몸에 경쾌한 에너지를 공급해 주어 심박수를 끌어올리기 매우 유용합니다.",
        releaseDate: "2019-07-15",
        likes: 9410,
        rating: 4.91
    },
    {
        id: 20,
        title: "Numb",
        artist: "Linkin Park",
        genre: "록",
        moods: ["운동할 때", "기분이 우울할 때"],
        image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=60",
        recommendation: "타인의 기대에 억눌려 무감각해진 고통을 포효하는 얼터너티브 록 메탈 넘버입니다. 가슴 답답한 우울이나 억눌린 감정을 운동과 이 노래를 통해 속시원하게 배출해 보세요.",
        releaseDate: "2003-09-08",
        likes: 8900,
        rating: 4.8
    },

    // --- 5) K-POP 장르 (ID: 21 ~ 25) ---
    {
        id: 21,
        title: "Hype Boy",
        artist: "NewJeans (뉴진스)",
        genre: "K-POP",
        moods: ["기분이 좋을 때", "드라이브할 때"],
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60",
        recommendation: "세련된 뭄바톤 비트와 신스 팝이 조화로운 곡으로, 맑고 청량한 뉴진스의 보이스가 기분 좋은 설렘을 유발합니다. 시내 드라이브나 활기차게 시작하는 아침 출근길 추천 음악입니다.",
        releaseDate: "2022-08-01",
        likes: 9780,
        rating: 4.92
    },
    {
        id: 22,
        title: "Ditto",
        artist: "NewJeans (뉴진스)",
        genre: "K-POP",
        moods: ["잠들기 전", "공부할 때"],
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60",
        recommendation: "레트로하고 따뜻한 볼티모어 클럽 댄스 비트 위에 몽환적이고 애틋한 코러스가 얹어져 독특한 노스탤지어 감성을 풍깁니다. 비가 오거나 눈이 내리는 날 차분히 학습할 때 어울립니다.",
        releaseDate: "2022-12-19",
        likes: 9690,
        rating: 4.94
    },
    {
        id: 23,
        title: "Love Dive",
        artist: "IVE (아이브)",
        genre: "K-POP",
        moods: ["운동할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=60",
        recommendation: "사랑할 용기가 있다면 망설임 없이 뛰어들라는 당당한 가사와 미스테리한 다크 팝 사운드가 중독적인 곡입니다. 화려한 멜로디의 훅이 운동 텐션을 크게 고조시킵니다.",
        releaseDate: "2022-04-05",
        likes: 9350,
        rating: 4.88
    },
    {
        id: 24,
        title: "Dynamite",
        artist: "방탄소년단 (BTS)",
        genre: "K-POP",
        moods: ["기분이 좋을 때", "운동할 때"],
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=500&auto=format&fit=crop&q=60",
        recommendation: "디스코 팝 장르로, 밝고 신나는 에너지를 전달하며 팬데믹 시기 전 세계를 위로한 글로벌 메가 히트곡입니다. 어깨춤이 절로 나오는 리듬감으로 텐션을 즉각적으로 높여줍니다.",
        releaseDate: "2020-08-21",
        likes: 9910,
        rating: 4.95
    },
    {
        id: 25,
        title: "아주 NICE",
        artist: "세븐틴 (SEVENTEEN)",
        genre: "K-POP",
        moods: ["운동할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&auto=format&fit=crop&q=60",
        recommendation: "펑키한 금관악기 세션의 청량함과 세븐틴 고유의 역동적인 매력이 폭발하는 청량 끝판왕 곡입니다. 힘차고 기분 좋은 아침 운동이나 집중 러닝 페이스메이커로 적격입니다.",
        releaseDate: "2016-07-04",
        likes: 8560,
        rating: 4.74
    },

    // --- 6) 클래식 장르 (ID: 26 ~ 30) ---
    {
        id: 26,
        title: "캐논 변주곡 (Canon in D)",
        artist: "파헬벨 (Johann Pachelbel)",
        genre: "클래식",
        moods: ["공부할 때", "잠들기 전"],
        image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&auto=format&fit=crop&q=60",
        recommendation: "완벽하게 규칙적으로 순환하는 아름다운 대위법 선율이 지친 두뇌에 평안과 안정감을 부여합니다. 시험 공부나 업무 몰입도 향상에 매우 이상적인 음악입니다.",
        releaseDate: "1680-01-01",
        likes: 7800,
        rating: 4.8
    },
    {
        id: 27,
        title: "월광 소나타 (Moonlight Sonata)",
        artist: "베토벤 (Ludwig van Beethoven)",
        genre: "클래식",
        moods: ["잠들기 전", "기분이 우울할 때"],
        image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=60",
        recommendation: "루체른 호수의 달빛 어린 물결 위에 흔들리는 일렁임을 묘사하듯, 조용하면서도 깊은 우수와 성찰을 안기는 피아노 소나타입니다. 불면의 밤을 포근하게 토닥여줍니다.",
        releaseDate: "1801-06-01",
        likes: 8250,
        rating: 4.87
    },
    {
        id: 28,
        title: "사계 '봄' (The Four Seasons - Spring)",
        artist: "비발디 (Antonio Vivaldi)",
        genre: "클래식",
        moods: ["공부할 때", "기분이 좋을 때"],
        image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=500&auto=format&fit=crop&q=60",
        recommendation: "새들의 지저귐, 시냇물의 조잘거림, 봄날의 따스함을 바이올린의 독창적인 피치카토와 합주로 묘사해 싱그러운 생동감을 불어넣습니다. 리프레시와 기분 전환에 좋습니다.",
        releaseDate: "1725-01-01",
        likes: 7900,
        rating: 4.76
    },
    {
        id: 29,
        title: "녹턴 Op.9 No.2 (Nocturne)",
        artist: "쇼팽 (Frédéric Chopin)",
        genre: "클래식",
        moods: ["잠들기 전", "공부할 때"],
        image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop&q=60",
        recommendation: "피아노의 시인 쇼팽이 남긴 가장 아름다운 야상곡으로, 밤의 로맨스와 차분함을 노래하듯 감미로운 피아노 터치가 지친 육체와 긴장을 사르르 이완시켜 줍니다.",
        releaseDate: "1832-12-01",
        likes: 9120,
        rating: 4.91
    },
    {
        id: 30,
        title: "엘리제를 위하여 (Für Elise)",
        artist: "베토벤 (Ludwig van Beethoven)",
        genre: "클래식",
        moods: ["공부할 때"],
        image: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=500&auto=format&fit=crop&q=60",
        recommendation: "친숙한 시그니처 멜로디의 교차 전개가 호기심을 유발하고 집중력을 유지하는 데 도움을 줍니다. 과제나 정밀한 타이핑 작업을 수행할 때 배경음으로 아주 좋습니다.",
        releaseDate: "1810-04-27",
        likes: 7300,
        rating: 4.65
    }
];

// 2. 어플리케이션 전역 상태 관리
const state = {
    activeTab: 'home',          // 현재 띄워진 탭 ('home' | 'genres' | 'moods' | 'favorites' | 'about')
    favorites: [],              // 즐겨찾기 음악 ID 배열
    userRatings: {},            // 사용자가 개별 평가한 평점 데이터셋 { musicId: ratingValue }
    searchQuery: '',            // 현재 입력된 검색어
    selectedGenre: 'all',       // 선택된 음악 장르 필터
    selectedMood: 'all',        // 선택된 분위기 필터
    todaySongId: 1              // 오늘의 추천곡 고정 ID (새로고침 시 임의 설정되게 초기화 가능)
};

// 3. 초기화 함수 실행
window.addEventListener('DOMContentLoaded', () => {
    initAppState();
    setupEventListeners();
    renderAll();
});

// App 상태 초기화 (LocalStorage 데이터 동기화 및 오늘 추천곡 선정)
function initAppState() {
    // 1) 로컬 스토리지에서 즐겨찾기 불러오기
    const savedFavorites = localStorage.getItem('mm_favorites');
    state.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    // 2) 로컬 스토리지에서 개별 평점 데이터 불러오기
    const savedRatings = localStorage.getItem('mm_ratings');
    state.userRatings = savedRatings ? JSON.parse(savedRatings) : {};

    // 3) 오늘의 추천곡 무작위 선정 (매 세션마다 무작위로 한 곡 설정)
    const todayIndex = Math.floor(Math.random() * musicDataset.length);
    state.todaySongId = musicDataset[todayIndex].id;
}

// 4. 이벤트 리스너 통합 설정
function setupEventListeners() {
    // 1) 사이드바 네비게이션 클릭 이벤트 처리
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // 2) 모바일 햄버거 메뉴 제어
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        const icon = mobileMenuBtn.querySelector('i');
        if (sidebar.classList.contains('open')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // 3) 실시간 노래 검색 이벤트 연동 (타이핑 시 즉각 반영)
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        renderAll();
    });

    // 4) 랜덤 음악 추천 버튼 클릭
    const randomBtn = document.getElementById('randomRecommendBtn');
    randomBtn.addEventListener('click', triggerRandomRecommend);

    // 5) 장르별 필터 버튼 클릭 바인딩
    const genreButtons = document.querySelectorAll('#genreFilterGroup .filter-btn');
    genreButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genreButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedGenre = btn.getAttribute('data-genre');
            renderGenres();
        });
    });

    // 6) 분위기별 필터 카드 클릭 바인딩
    const moodCards = document.querySelectorAll('#moodFilterGroup .mood-card');
    moodCards.forEach(card => {
        card.addEventListener('click', () => {
            moodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            state.selectedMood = card.getAttribute('data-mood');
            renderMoods();
        });
    });

    // 7) 상세 모달 닫기 버튼 이벤트
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalOverlay = document.getElementById('musicModal');
    
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// 5. SPA 탭 스위칭 로직
function switchTab(tabName) {
    state.activeTab = tabName;
    
    // 1) 사이드바 네비게이션 활성화 클래스 조절
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 2) 탭 섹션 화면 표시 토글
    const sections = document.querySelectorAll('.tab-section');
    sections.forEach(sec => {
        if (sec.id === `tab-${tabName}`) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    // 3) 모바일 사이드바 열려있으면 닫기
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
    }

    // 4) 탭 변경 시 렌더링
    renderAll();
}

// 6. 통합 렌더링 컨트롤러
function renderAll() {
    // 검색창 비우지 않고 다른 탭 갈 때도 상태를 유지하므로, 현재 Tab에 맞춤형 데이터 렌더
    switch (state.activeTab) {
        case 'home':
            renderHome();
            break;
        case 'genres':
            renderGenres();
            break;
        case 'moods':
            renderMoods();
            break;
        case 'favorites':
            renderFavorites();
            break;
        case 'about':
            // About 섹션은 정적이므로 렌더 함수 없음
            break;
    }
}

// 7. 홈 탭 렌더링 (오늘의 추천, TOP 10, 최신 추천)
function renderHome() {
    // 1) 오늘의 추천곡 렌더
    const todaySong = musicDataset.find(s => s.id === state.todaySongId) || musicDataset[0];
    const isFavToday = state.favorites.includes(todaySong.id);
    const todayBanner = document.getElementById('todayRecommendBanner');
    
    todayBanner.innerHTML = `
        <div class="banner-glow"></div>
        <div class="banner-content">
            <div class="banner-img-wrap">
                <img src="${todaySong.image}" alt="${todaySong.title}">
            </div>
            <div class="banner-info">
                <span class="banner-tag">오늘의 추천곡</span>
                <h1 class="banner-title">${todaySong.title}</h1>
                <p class="banner-artist">${todaySong.artist}</p>
                <p class="banner-reason">${todaySong.recommendation}</p>
                <div class="banner-actions">
                    <button class="banner-btn" onclick="openMusicModal(${todaySong.id})">
                        <i class="fa-solid fa-circle-info"></i> 상세정보
                    </button>
                    <button class="banner-btn ${isFavToday ? 'text-neon' : ''}" onclick="toggleFavorite(${todaySong.id}, event)">
                        <i class="fa-${isFavToday ? 'solid' : 'regular'} fa-heart"></i> 즐겨찾기
                    </button>
                </div>
            </div>
        </div>
    `;

    // 2) TOP 10 인기곡 렌더 (추천수 likes가 큰 순 상위 10곡)
    const sortedTop10 = [...musicDataset]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10);
    
    const top10Container = document.getElementById('top10Container');
    top10Container.innerHTML = '';
    
    sortedTop10.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'top10-card';
        card.addEventListener('click', () => openMusicModal(song.id));
        card.innerHTML = `
            <span class="rank-number">${index + 1}</span>
            <img class="top10-img" src="${song.image}" alt="${song.title}">
            <div class="top10-info">
                <h4 class="top10-title">${song.title}</h4>
                <p class="top10-artist">${song.artist}</p>
                <span class="genre-tag">${song.genre}</span>
            </div>
        `;
        top10Container.appendChild(card);
    });

    // 3) 최신 노래 추천 렌더 (발매일 releaseDate 최근 순 6곡)
    const sortedLatest = [...musicDataset]
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 6);
        
    const latestContainer = document.getElementById('latestSongsContainer');
    latestContainer.innerHTML = '';
    
    // 검색 필터가 켜져 있으면, 홈에서도 최신 리스트가 아니라 검색 결과를 보여주도록 연동
    const filteredSongs = filterSongs(sortedLatest);
    
    if (filteredSongs.length === 0) {
        latestContainer.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-face-frown-open"></i>
                <p>일치하는 노래가 없습니다.</p>
            </div>
        `;
    } else {
        filteredSongs.forEach(song => {
            const cardElement = createSongCard(song);
            latestContainer.appendChild(cardElement);
        });
    }
}

// 8. 장르별 추천 탭 렌더링
function renderGenres() {
    const container = document.getElementById('genreSongsContainer');
    container.innerHTML = '';

    // 장르 필터링
    let filteredList = musicDataset;
    if (state.selectedGenre !== 'all') {
        filteredList = musicDataset.filter(s => s.genre === state.selectedGenre);
    }

    // 검색어 동시 적용
    filteredList = filterSongs(filteredList);

    if (filteredList.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-music"></i>
                <p>해당 장르에 맞는 검색 결과가 존재하지 않습니다.</p>
            </div>
        `;
    } else {
        filteredList.forEach(song => {
            container.appendChild(createSongCard(song));
        });
    }
}

// 9. 분위기별 추천 탭 렌더링
function renderMoods() {
    const container = document.getElementById('moodSongsContainer');
    container.innerHTML = '';

    // 분위기 필터링
    let filteredList = musicDataset;
    if (state.selectedMood !== 'all') {
        filteredList = musicDataset.filter(s => s.moods.includes(state.selectedMood));
    }

    // 검색어 동시 적용
    filteredList = filterSongs(filteredList);

    if (filteredList.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-cloud"></i>
                <p>해당 분위기에 매칭되는 곡을 찾지 못했습니다.</p>
            </div>
        `;
    } else {
        filteredList.forEach(song => {
            container.appendChild(createSongCard(song));
        });
    }
}

// 10. 즐겨찾기 탭 렌더링
function renderFavorites() {
    const container = document.getElementById('favoriteSongsContainer');
    container.innerHTML = '';

    // 즐겨찾기에 등록된 곡 필터링
    let favoriteList = musicDataset.filter(s => state.favorites.includes(s.id));

    // 검색어 동시 적용
    favoriteList = filterSongs(favoriteList);

    if (favoriteList.length === 0) {
        if (state.favorites.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-heart-crack"></i>
                    <p>즐겨찾기 보관함이 비어 있습니다.</p>
                    <span style="font-size: 13px; color: var(--text-dark); margin-top: 8px; display: inline-block;">
                        마음에 드는 노래 카드의 하트를 눌러보세요!
                    </span>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>즐겨찾기 목록 중 검색어와 일치하는 노래가 없습니다.</p>
                </div>
            `;
        }
    } else {
        favoriteList.forEach(song => {
            container.appendChild(createSongCard(song));
        });
    }
}

// 11. 공통 헬퍼: 검색어 매칭 필터링
function filterSongs(list) {
    if (!state.searchQuery) return list;
    return list.filter(song => 
        song.title.toLowerCase().includes(state.searchQuery) || 
        song.artist.toLowerCase().includes(state.searchQuery)
    );
}

// 12. 공통 헬퍼: 노래 카드 템플릿 생성
function createSongCard(song) {
    const isFav = state.favorites.includes(song.id);
    const userRating = state.userRatings[song.id] || song.rating; // 개인 평점 우선 노출
    
    const card = document.createElement('div');
    card.className = 'song-card';
    // 카드 자체를 클릭하면 상세 모달 오픈
    card.addEventListener('click', (e) => {
        // 하트나 앨범오버레이 버튼 클릭 시 모달이 겹쳐 뜨지 않도록 예외 처리
        if (e.target.closest('.favorite-btn') || e.target.closest('.play-overlay')) return;
        openMusicModal(song.id);
    });

    card.innerHTML = `
        <div class="favorite-btn ${isFav ? 'is-active' : ''}" title="즐겨찾기">
            <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
        </div>
        <div class="card-img-wrap">
            <img src="${song.image}" alt="${song.title}" loading="lazy">
            <div class="play-overlay" title="곡 정보 확인">
                <i class="fa-solid fa-circle-info"></i>
            </div>
        </div>
        <h4 class="card-title" title="${song.title}">${song.title}</h4>
        <p class="card-artist" title="${song.artist}">${song.artist}</p>
        <div class="card-footer">
            <span class="genre-tag">${song.genre}</span>
            <div class="card-rating">
                <i class="fa-solid fa-star"></i>
                <span>${Number(userRating).toFixed(1)}</span>
            </div>
        </div>
    `;

    // 하트 버튼 개별 이벤트 바인딩
    const favBtn = card.querySelector('.favorite-btn');
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 클릭 이벤트 부모 전파 차단 (모달 팝업 방지)
        toggleFavorite(song.id, e);
    });

    return card;
}

// 13. 즐겨찾기 등록/해제 처리 핵심 함수
function toggleFavorite(songId, event) {
    const index = state.favorites.indexOf(songId);
    let isAdding = false;
    
    if (index === -1) {
        // 즐겨찾기 추가
        state.favorites.push(songId);
        isAdding = true;
    } else {
        // 즐겨찾기 해제
        state.favorites.splice(index, 1);
    }

    // LocalStorage 업데이트
    localStorage.setItem('mm_favorites', JSON.stringify(state.favorites));

    // UI 즉각 피드백 반영
    const clickTarget = event.currentTarget;
    if (clickTarget) {
        if (isAdding) {
            clickTarget.classList.add('is-active');
            const icon = clickTarget.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-heart';
        } else {
            clickTarget.classList.remove('is-active');
            const icon = clickTarget.querySelector('i');
            if (icon) icon.className = 'fa-regular fa-heart';
        }
    }

    // 현재 열려 있는 탭의 화면을 즉시 갱신
    renderAll();
}

// 14. 랜덤 추천 음악 팝업 실행
function triggerRandomRecommend() {
    const randomBtn = document.getElementById('randomRecommendBtn');
    const originalContent = randomBtn.innerHTML;
    
    // 버튼 셔플 룰렛 스피너 로딩 연출
    randomBtn.disabled = true;
    randomBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>매칭 중...</span>`;
    
    // 0.8초 후 무작위로 음악 하나 선정해서 상세 모달 팝업
    setTimeout(() => {
        randomBtn.innerHTML = originalContent;
        randomBtn.disabled = false;
        
        const randomIndex = Math.floor(Math.random() * musicDataset.length);
        const randomSong = musicDataset[randomIndex];
        openMusicModal(randomSong.id);
    }, 800);
}

// 15. 노래 상세 모달 팝업 제어
function openMusicModal(songId) {
    const song = musicDataset.find(s => s.id === songId);
    if (!song) return;

    const modalOverlay = document.getElementById('musicModal');
    const modalBody = document.getElementById('modalBody');
    
    const isFav = state.favorites.includes(song.id);
    const currentUserRating = state.userRatings[song.id] || 0; // 저장된 평점 없으면 0

    // 분위기 해시태그 HTML 생성
    const moodTagsHTML = song.moods.map(mood => `<span class="modal-tag">#${mood}</span>`).join('');

    modalBody.innerHTML = `
        <div class="modal-header-info">
            <img class="modal-album-art" src="${song.image}" alt="${song.title}">
            <div class="modal-details">
                <h2 class="modal-title">${song.title}</h2>
                <p class="modal-artist">${song.artist}</p>
                <div class="modal-tags">
                    <span class="modal-tag tag-genre">${song.genre}</span>
                    ${moodTagsHTML}
                </div>
            </div>
        </div>
        
        <div class="modal-reason-box">
            <h4 class="modal-reason-title">💡 에디터 추천 이유</h4>
            <p class="modal-reason-text">${song.recommendation}</p>
        </div>

        <div class="modal-actions-area">
            <div class="rating-stars-interactive">
                <span class="stars-label">내 별점 남기기:</span>
                <div class="stars-wrap" data-song-id="${song.id}">
                    <i class="fa-star star-interactive ${currentUserRating >= 1 ? 'fa-solid filled' : 'fa-regular'}" data-value="1"></i>
                    <i class="fa-star star-interactive ${currentUserRating >= 2 ? 'fa-solid filled' : 'fa-regular'}" data-value="2"></i>
                    <i class="fa-star star-interactive ${currentUserRating >= 3 ? 'fa-solid filled' : 'fa-regular'}" data-value="3"></i>
                    <i class="fa-star star-interactive ${currentUserRating >= 4 ? 'fa-solid filled' : 'fa-regular'}" data-value="4"></i>
                    <i class="fa-star star-interactive ${currentUserRating >= 5 ? 'fa-solid filled' : 'fa-regular'}" data-value="5"></i>
                </div>
                <span id="interactiveRatingText" style="font-size: 13px; font-weight: 700; color: #ffd700;">
                    ${currentUserRating > 0 ? `${currentUserRating.toFixed(1)} 점` : '평가 없음'}
                </span>
            </div>
            
            <button class="modal-heart-action ${isFav ? 'is-fav' : ''}" id="modalFavActionBtn">
                <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                <span>즐겨찾기 보관함</span>
            </button>
        </div>
    `;

    // 모달 활성화
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 뒤쪽 스크롤 차단

    // 모달 내 즐겨찾기 버튼 이벤트 바인딩
    const modalFavBtn = document.getElementById('modalFavActionBtn');
    modalFavBtn.addEventListener('click', (e) => {
        toggleFavorite(song.id, e);
        // 모달창 내 버튼 UI 재조정
        const updatedFav = state.favorites.includes(song.id);
        if (updatedFav) {
            modalFavBtn.classList.add('is-fav');
            modalFavBtn.querySelector('i').className = 'fa-solid fa-heart';
        } else {
            modalFavBtn.classList.remove('is-fav');
            modalFavBtn.querySelector('i').className = 'fa-regular fa-heart';
        }
    });

    // 별점 인터랙션 바인딩
    setupInteractiveStars(song.id);
}

// 모달 닫기
function closeModal() {
    const modalOverlay = document.getElementById('musicModal');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // 스크롤 정상화
}

// 16. 별점 인터랙션 핸들링 (호버 및 점수 저장)
function setupInteractiveStars(songId) {
    const starsWrap = document.querySelector('.stars-wrap');
    const stars = starsWrap.querySelectorAll('.star-interactive');
    const ratingText = document.getElementById('interactiveRatingText');

    stars.forEach(star => {
        // 1) 마우스 오버 시 일시적인 하이라이트 연출
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                if (sVal <= val) {
                    s.classList.add('hovered');
                    s.classList.replace('fa-regular', 'fa-solid');
                } else {
                    s.classList.remove('hovered');
                }
            });
        });

        // 2) 마우스 아웃 시 하이라이트 초기화
        star.addEventListener('mouseout', () => {
            stars.forEach(s => {
                s.classList.remove('hovered');
            });
            // 기존 등록 평점으로 원복
            const savedVal = state.userRatings[songId] || 0;
            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                if (sVal <= savedVal) {
                    s.classList.replace('fa-regular', 'fa-solid');
                    s.classList.add('filled');
                } else {
                    s.classList.replace('fa-solid', 'fa-regular');
                    s.classList.remove('filled');
                }
            });
        });

        // 3) 클릭 시 평점 고정 및 로컬 스토리지 보존
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            
            // 전역 상태에 평점 보존
            state.userRatings[songId] = val;
            localStorage.setItem('mm_ratings', JSON.stringify(state.userRatings));
            
            // 텍스트 및 클래스 고정 변경
            ratingText.textContent = `${val.toFixed(1)} 점`;
            
            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                if (sVal <= val) {
                    s.classList.add('filled');
                    s.classList.replace('fa-regular', 'fa-solid');
                } else {
                    s.classList.remove('filled');
                    s.classList.replace('fa-solid', 'fa-regular');
                }
            });

            // 음악 평점 변경 시 뒤쪽 메인 화면의 평점도 실시간 동기화
            renderAll();
        });
    });
}
