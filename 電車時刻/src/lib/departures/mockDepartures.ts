import type { Departure } from "@/types";

export const stationDepartureTemplates: Record<string, Omit<Departure, "time">[]> = {
  "jr-kawaguchi": [
    { line: "京浜東北線", destination: "大宮行" },
    { line: "京浜東北線", destination: "南浦和行" },
    { line: "京浜東北線", destination: "磯子行" }
  ],
  "jr-nishikawaguchi": [
    { line: "京浜東北線", destination: "大船行" },
    { line: "京浜東北線", destination: "大宮行" }
  ],
  "jr-akabane": [
    { line: "埼京線", destination: "新宿行" },
    { line: "宇都宮線", destination: "上野行" },
    { line: "湘南新宿ライン", destination: "逗子行" }
  ],
  "metro-ueno": [
    { line: "銀座線", destination: "渋谷行" },
    { line: "日比谷線", destination: "中目黒行" }
  ],
  "jr-tokyo": [
    { line: "山手線", destination: "品川方面" },
    { line: "中央線快速", destination: "高尾行" },
    { line: "京葉線", destination: "蘇我行" }
  ],
  "metro-otemachi": [
    { line: "丸ノ内線", destination: "荻窪行" },
    { line: "東西線", destination: "西船橋行" },
    { line: "千代田線", destination: "代々木上原行" }
  ],
  "toei-shinjuku": [
    { line: "都営新宿線", destination: "本八幡行" },
    { line: "大江戸線", destination: "六本木方面" }
  ],
  "metro-shibuya": [
    { line: "半蔵門線", destination: "押上行" },
    { line: "副都心線", destination: "和光市行" },
    { line: "銀座線", destination: "浅草行" }
  ],
  "tokyu-naka-meguro": [
    { line: "東急東横線", destination: "横浜行" },
    { line: "日比谷線", destination: "北千住行" }
  ],
  "keio-kichijoji": [
    { line: "京王井の頭線", destination: "渋谷行" },
    { line: "中央線快速", destination: "東京行" }
  ],
  "odakyu-shimokitazawa": [
    { line: "小田急線", destination: "新宿行" },
    { line: "京王井の頭線", destination: "吉祥寺行" }
  ],
  "seibu-ikebukuro": [
    { line: "西武池袋線", destination: "飯能行" },
    { line: "有楽町線", destination: "新木場行" }
  ],
  "keikyu-shinagawa": [
    { line: "京急本線", destination: "羽田空港行" },
    { line: "山手線", destination: "渋谷方面" }
  ],
  "keisei-nippori": [
    { line: "京成本線", destination: "成田空港行" },
    { line: "山手線", destination: "上野方面" }
  ],
  "tsukuba-akihabara": [
    { line: "つくばエクスプレス", destination: "つくば行" },
    { line: "日比谷線", destination: "中目黒行" }
  ]
};
