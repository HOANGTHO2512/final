// Quiz Questions and Data from brand_test.html
export const QUESTIONS = [
    // S: Strengths (15題)
    { t: '面對複雜且模糊的專案需求時，我能迅速找出潛在風險與多種應對路徑。(Strategic)', m: 'Strategic', cat: 's' },
    { t: '面對新技術或陌生領域，我會感到興奮並能快速掌握核心概念應用於工作中。(Learner)', m: 'Learner', cat: 's' },
    { t: '在會議中，我習慣要求以數據、邏輯推演或具體證據來佐證決策，而非憑感覺。(Analytical)', m: 'Analytical', cat: 's' },
    { t: '我常能跳脫現有框架，提出讓團隊耳目一新的非傳統解決方案。(Ideation)', m: 'Ideation', cat: 's' },
    { t: '我擅長將複雜的技術語言，轉化為非技術人員也能聽懂的商業價值或故事。(Communication)', m: 'Communication', cat: 's' },
    { t: '我將完成任務視為基本，並習慣主動設定更高的KPI或優化標準來挑戰自己。(Achiever)', m: 'Achiever', cat: 's' },
    { t: '即使在干擾眾多的環境下，我仍能鎖定關鍵目標，長時間維持高效率產出。(Focus)', m: 'Focus', cat: 's' },
    { t: '對於答應的交付期限(Deadline)，我視為絕對承諾，必要時會自主排除萬難完成。(Responsibility)', m: 'Responsibility', cat: 's' },
    { t: '我能敏銳察覺團隊成員的潛力，並樂於提供指導或資源協助他們突破瓶頸。(Developer)', m: 'Developer', cat: 's' },
    { t: '比起表面寒暄，我更擅長與利害關係人建立長期、深度且具信任感的合作關係。(Relator)', m: 'Relator', cat: 's' },
    { t: '當系統或流程出錯時，我本能地會去拆解底層邏輯，找出根本原因(Root Cause)。(Analytical)', m: 'Analytical', cat: 's' },
    { t: '我習慣將大目標拆解為可執行的步驟，並預先規劃時程表與資源配置。(Strategic)', m: 'Strategic', cat: 's' },
    { t: '我將「持續進修」視為職涯必需品，常在下班後主動學習產業新知。(Learner)', m: 'Learner', cat: 's' },
    { t: '我能夠區分任務的輕重緩急，確保資源集中在對組織最有價值的20%事務上。(Focus)', m: 'Focus', cat: 's' },
    { t: '我重視團隊的心理安全感，能在高壓環境下維繫成員間的和諧與士氣。(Relator)', m: 'Relator', cat: 's' },
    // Holland (15題)
    { t: '我喜歡操作精密儀器、編寫底層代碼或進行硬體設備的維護與組裝。(R)', m: 'R', cat: 'h' },
    { t: '比起抽象的策略討論，我更享受看到自己親手打造的產品實際運作的成就感。(R)', m: 'R', cat: 'h' },
    { t: '我喜歡鑽研演算法、數學模型或分析複雜的系統架構，找出最佳化解法。(I)', m: 'I', cat: 'h' },
    { t: '遇到未知問題時，我習慣先進行廣泛的資料蒐集與文獻研究，再歸納出結論。(I)', m: 'I', cat: 'h' },
    { t: '我對使用者介面(UI)、視覺排版或產品美學有高標準，無法忍受缺乏設計感的產出。(A)', m: 'A', cat: 'h' },
    { t: '我不喜歡被既定的SOP綁死，需要能自由發揮創意與個人風格的工作環境。(A)', m: 'A', cat: 'h' },
    { t: '我樂於處理「人」的問題，包括輔導他人、解決客戶抱怨或進行教育訓練。(S)', m: 'S', cat: 'h' },
    { t: '在跨部門專案中，我常擔任協調者角色，確保各方意見能達成共識。(S)', m: 'S', cat: 'h' },
    { t: '我喜歡擔任專案負責人(PM)，帶領團隊衝刺業績或達成專案目標，並對結果負責。(E)', m: 'E', cat: 'h' },
    { t: '我具備說服力，樂於向客戶提案或在會議中推銷我的想法與產品價值。(E)', m: 'E', cat: 'h' },
    { t: '我擅長建立檔案管理系統，確保資料分類邏輯清晰，方便後續檢索。(C)', m: 'C', cat: 'h' },
    { t: '我重視細節與精確度，在執行任務時會嚴格遵守規範與品質標準。(C)', m: 'C', cat: 'h' },
    { t: '我會主動參加技術研討會或閱讀論文，以保持在專業領域的領先地位。(I)', m: 'I', cat: 'h' },
    { t: '我享受在公開場合演講或進行簡報，展現個人或團隊的成果。(E)', m: 'E', cat: 'h' },
    { t: '我無法忍受流程混亂或效率低下的工作方式，會主動尋求優化與標準化。(C)', m: 'C', cat: 'h' }
];

export const DATA = {
    // 權重差異化
    weights: {
        '資工系 (CS)': { holland: { R: 8, I: 8, A: 1, S: 0, E: 1, C: 5 }, strengths: { Analytical: 8, Focus: 8, Learner: 5, Strategic: 3, Achiever: 3, Ideation: 1, Communication: 0, Relator: 0, Developer: 0, Responsibility: 3 } },
        '資管系 (IM)': { holland: { R: 1, I: 3, A: 1, S: 3, E: 8, C: 8 }, strengths: { Strategic: 8, Achiever: 5, Responsibility: 5, Communication: 5, Analytical: 3, Focus: 1, Learner: 1, Ideation: 1, Relator: 3, Developer: 3 } },
        '資傳系 (Comm)': { holland: { R: 1, I: 1, A: 8, S: 8, E: 5, C: 1 }, strengths: { Communication: 8, Ideation: 8, Relator: 5, Developer: 5, Strategic: 1, Achiever: 1, Analytical: 0, Focus: 0, Learner: 3, Responsibility: 1 } }
    },
    radarMap: [
        { name: '邏輯分析', keys: ['Analytical', 'Focus', 'I'] },
        { name: '專案執行', keys: ['Achiever', 'Responsibility', 'C'] },
        { name: '策略思維', keys: ['Strategic', 'E', 'Learner'] },
        { name: '人際溝通', keys: ['Communication', 'Relator', 'S'] },
        { name: '創新創造', keys: ['Ideation', 'A'] },
        { name: '技術實作', keys: ['R'] }
    ],
    radarBenchmarks: {
        '邏輯分析': { low: '仰賴直覺決策', mid: '能進行基礎數據判讀', high: '具備拆解複雜系統與數據洞察的卓越能力' },
        '專案執行': { low: '需要明確指令', mid: '能按時完成交付', high: '具備高度當責感，能優化流程並確保高品質產出' },
        '策略思維': { low: '專注眼前執行', mid: '能規劃短期目標', high: '具備宏觀視野，能預判風險並制定長期佈局' },
        '人際溝通': { low: '偏好獨立作業', mid: '能進行團隊協作', high: '擅長跨部門溝通與衝突協調，具影響力' },
        '創新創造': { low: '偏好標準流程', mid: '能提出改良建議', high: '具備突破性思維，能從0到1建構解決方案' },
        '技術實作': { low: '偏好理論研究', mid: '能操作基礎工具', high: '具備強烈動手實作能力，能將概念轉化為實體' }
    },
    strengthsInfo: {
        'Strategic': '策略思維', 'Learner': '學習渴望', 'Analytical': '邏輯分析', 'Ideation': '創新思維', 'Communication': '溝通表達',
        'Achiever': '成就導向', 'Focus': '專注目標', 'Responsibility': '責任紀律', 'Developer': '伯樂特質', 'Relator': '深度交往'
    },
    hollandInfo: {
        'R': { n: '實做型', c: '#ef4444' }, 'I': { n: '研究型', c: '#3b82f6' }, 'A': { n: '藝術型', c: '#e879f9' },
        'S': { n: '社交型', c: '#f97316' }, 'E': { n: '企業型', c: '#8b5cf6' }, 'C': { n: '常規型', c: '#06b6d4' }
    },
    // 平台推薦資料
    platforms: {
        'R': { name: 'GitHub / 技術部落格', desc: '展示你的代碼庫、專案架構與技術筆記，吸引技術主管的目光。' },
        'I': { name: 'Medium / ResearchGate', desc: '發表深度分析文章或研究成果，建立專業領域的知識權威感。' },
        'A': { name: 'Instagram / Behance', desc: '透過視覺化作品集展現美感與創意，適合經營個人風格鮮明的品牌。' },
        'S': { name: 'Facebook 社團 / Podcast', desc: '建立社群連結，透過聲音或文字分享觀點，經營人際影響力。' },
        'E': { name: 'LinkedIn', desc: '經營專業人脈，分享產業見解與專案成果，適合建立商務與領導形象。' },
        'C': { name: 'Notion / 個人網站', desc: '整理系統化的知識庫或履歷，展現條理分明與專業可靠的形象。' }
    },
    // 行動卡片 (書籍/技能)
    actionCards: {
        'Strategic': { book: '《好策略壞策略》', skill: '心智圖繪製、SWOT分析' },
        'Learner': { book: '《刻意練習》', skill: '快速閱讀、知識管理系統(Obsidian)' },
        'Analytical': { book: '《思考快與慢》', skill: 'Python 數據分析、Tableau 視覺化' },
        'Ideation': { book: '《創意自信帶來力量》', skill: '設計思考 (Design Thinking)、腦力激盪引導' },
        'Communication': { book: '《跟 TED 學表達》', skill: '簡報設計、故事行銷 (Storytelling)' },
        'Achiever': { book: '《原子習慣》', skill: '專案管理 (Agile/Scrum)、時間管理 (Pomodoro)' },
        'Focus': { book: '《深度工作力》', skill: '目標設定 (OKR)、心流觸發' },
        'Responsibility': { book: '《當責》', skill: '風險管理、品質控管' },
        'Developer': { book: '《教練》', skill: '導師引導 (Coaching)、教育訓練設計' },
        'Relator': { book: '《人性的弱點》', skill: '同理心傾聽、衝突管理' }
    }
};
