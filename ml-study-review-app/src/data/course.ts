import week01Quiz from "@/content/quizzes/week-01-kmeans.json";
import week02Quiz from "@/content/quizzes/week-02-pca-kmedoids-silhouette.json";
import type { Chapter, MasteryStatus, QuizQuestion } from "./types";

export const masteryLabels: Record<MasteryStatus, string> = {
  "not-learned": "尚未學習",
  weak: "薄弱",
  okay: "可以",
  mastered: "已掌握",
  "review-before-exam": "考前再看",
};

export const masteryStyles: Record<MasteryStatus, string> = {
  "not-learned": "bg-stone-100 text-stone-600 border-stone-200",
  weak: "bg-rose-50 text-rose-700 border-rose-200",
  okay: "bg-amber-50 text-amber-700 border-amber-200",
  mastered: "bg-teal-50 text-teal-700 border-teal-200",
  "review-before-exam": "bg-red-50 text-red-700 border-red-200",
};

export const chapters: Chapter[] = [
  {
    slug: "week-01-k-means",
    week: "Week 01",
    title: "K-Means",
    subtitle: "用距離與中心點理解分群，掌握演算法步驟、目標函數與常見陷阱。",
    minutes: 35,
    topics: ["分群目標", "演算法步驟", "SSE / WCSS", "初始化", "標準化", "選 K"],
    outcomes: [
      "能手寫 K-Means 的 assignment / update 兩步。",
      "能解釋為什麼 K-Means 會收斂但不保證全域最佳。",
      "能在考題中辨識尺度、離群值、初始中心造成的錯誤。",
    ],
    checkpoints: [
      "我能說出 K-Means 最小化的量。",
      "我能判斷資料是否需要標準化。",
      "我能比較 elbow 與 silhouette 的用途。",
    ],
    learningBlocks: [
      {
        id: "kmeans-why",
        title: "先建立直覺：中心點在代表什麼？",
        timebox: "5 min",
        takeaway: "K-Means 把每群想成一個平均代表點，資料點會被吸到最近的代表點。",
        recall: "遮住筆記，說出 assignment 與 update 各在做什麼。",
        examSignal: "看到「一次迭代」「重新計算中心」就要列距離與平均值。",
      },
      {
        id: "kmeans-objective",
        title: "目標函數：SSE / WCSS",
        timebox: "8 min",
        takeaway: "K-Means 每一步都在讓群內平方距離不要變大，所以會收斂到某個局部解。",
        recall: "用一句話回答：K-Means 最小化什麼？",
        examSignal: "若題目問好壞、收斂、初始化，答案要連回 SSE。",
      },
      {
        id: "kmeans-traps",
        title: "考試陷阱：尺度、離群值、非球狀群",
        timebox: "7 min",
        takeaway: "距離模型會被尺度與極端值影響，且偏好球狀、大小相近的群。",
        recall: "舉一個 K-Means 會分不好的資料形狀。",
        examSignal: "看到 feature scale 差很多，先寫 standardization。",
      },
    ],
    cards: [
      {
        id: "kmeans-card-1",
        tag: "核心定義",
        front: "K-Means 的目標函數是什麼？",
        back: "將每個點分到最近中心，最小化群內平方和 SSE / WCSS：所有點到所屬群中心的平方距離總和。",
      },
      {
        id: "kmeans-card-2",
        tag: "演算法",
        front: "K-Means 每次迭代做哪兩件事？",
        back: "Assignment：依最近中心分派群集。Update：用每群資料點平均值更新中心。",
      },
      {
        id: "kmeans-card-3",
        tag: "考試陷阱",
        front: "為什麼 K-Means 對尺度敏感？",
        back: "因為距離計算會被數值範圍大的特徵主導，所以通常需要 standardization。",
      },
    ],
    examPrompts: [
      {
        id: "kmeans-exam-1",
        prompt: "給定三個點與兩個初始中心，完成一次 K-Means 迭代。",
        answer: "先算每點到兩中心的距離，分到最近中心，再取各群平均作為新中心。",
        trap: "不要直接看圖猜群，考卷通常要列出距離或至少呈現 assignment 邏輯。",
      },
      {
        id: "kmeans-exam-2",
        prompt: "說明 K-Means 不適合哪些資料形狀。",
        answer: "非球狀、不同密度、群大小差很多、含強離群值或類別尺度不一致的資料。",
        trap: "不要只寫「資料很複雜」，要連到距離與平均中心的假設。",
      },
    ],
  },
  {
    slug: "week-02-pca-k-medoids-silhouette",
    week: "Week 02",
    title: "PCA, K-Medoids, Silhouette",
    subtitle: "把降維、穩健分群與分群評估串成一條考前判斷線。",
    minutes: 45,
    topics: ["PCA 變異量", "主成分", "K-Medoids", "PAM", "Silhouette", "模型選擇"],
    outcomes: [
      "能解釋 PCA 為何找最大變異方向。",
      "能比較 K-Means 與 K-Medoids 對離群值的差異。",
      "能用 silhouette 判斷樣本分得好不好與 K 值是否合理。",
    ],
    checkpoints: [
      "我能說明 eigenvectors / principal components 的意義。",
      "我能解釋 medoid 必須是真實資料點。",
      "我能判讀 silhouette 接近 -1、0、1 的含義。",
    ],
    learningBlocks: [
      {
        id: "week02-pca",
        title: "PCA：先問「最大變異方向」",
        timebox: "10 min",
        takeaway: "PCA 不是挑欄位，而是建立新的正交座標軸，讓投影後變異量最大。",
        recall: "不用看筆記，講出 PCA 與 feature selection 的差別。",
        examSignal: "看到 explained variance、principal component、visualization，先想到 PCA。",
      },
      {
        id: "week02-medoids",
        title: "K-Medoids：中心是真實資料點",
        timebox: "8 min",
        takeaway: "Medoid 必須是資料集中的點，因此比平均值中心更不容易被離群值拖走。",
        recall: "一句話比較 centroid 與 medoid。",
        examSignal: "題目提到 outlier 或 robust clustering，優先比較 K-Medoids。",
      },
      {
        id: "week02-silhouette",
        title: "Silhouette：群內近，群外遠",
        timebox: "8 min",
        takeaway: "分數接近 1 代表分得清楚，接近 0 在邊界，接近 -1 可能分錯。",
        recall: "畫一條 -1 到 1 的線，標出三個區間含義。",
        examSignal: "看到選 K、cluster quality、平均分數，就寫 silhouette 的 trade-off。",
      },
    ],
    cards: [
      {
        id: "week02-card-1",
        tag: "PCA",
        front: "PCA 第一主成分代表什麼？",
        back: "資料投影後變異量最大的方向；第二主成分與第一主成分正交，並解釋剩餘最大變異。",
      },
      {
        id: "week02-card-2",
        tag: "K-Medoids",
        front: "K-Medoids 與 K-Means 最大差異？",
        back: "K-Medoids 的中心是實際資料點 medoid，通常比平均值中心更抗離群值。",
      },
      {
        id: "week02-card-3",
        tag: "Silhouette",
        front: "Silhouette 分數接近 1、0、-1 各代表什麼？",
        back: "接近 1：群內近、群外遠。接近 0：在邊界。接近 -1：可能被分錯群。",
      },
    ],
    examPrompts: [
      {
        id: "week02-exam-1",
        prompt: "比較 PCA 與 feature selection。",
        answer: "PCA 建立原特徵的線性組合；feature selection 保留原本部分特徵。PCA 可提高壓縮效率但可解釋性較低。",
        trap: "PCA 不是直接挑出最重要的原始欄位。",
      },
      {
        id: "week02-exam-2",
        prompt: "Silhouette 如何幫助選 K？",
        answer: "比較不同 K 的平均 silhouette，較高代表群內凝聚且群間分離較好，但仍需結合領域意義。",
        trap: "最高分不一定永遠是最佳答案，考題可能要求解釋 trade-off。",
      },
    ],
  },
];

export const quizzes = [...week01Quiz, ...week02Quiz] as QuizQuestion[];

export function getChapter(slug: string) {
  return chapters.find((chapter) => chapter.slug === slug);
}

export function getChapterQuiz(slug: string) {
  return quizzes.filter((question) => question.chapterSlug === slug);
}
