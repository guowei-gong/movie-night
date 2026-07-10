export type Review = {
  name: string;
  location: string;
  score: string;
  text: string;
};

export const castImages = [
  "detail-cast-1.png",
  "detail-cast-2.png",
  "detail-cast-3.png",
  "detail-cast-4.png",
  "detail-cast-5.png",
  "detail-cast-6.png",
  "detail-cast-7.png",
  "detail-cast-8.png",
];

export const reviews: Review[] = [
  {
    name: "阿尼凯特·罗伊",
    location: "来自印度",
    score: "4.5",
    text: "这部电影是一位好友推荐给我的。她独自去看后一直念念不忘，我后来也去了影院，可惜当天场次爆满，只好回家后第一时间补上。",
  },
  {
    name: "斯瓦拉吉",
    location: "来自印度",
    score: "5",
    text: "一个不安的国王以土地交换部落守护的神石，也由此找到内心的安宁。民俗、信仰和动作场面被揉合得非常有力量。",
  },
];
