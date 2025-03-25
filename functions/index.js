/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// 此函數在 blessings 集合中任一文件新增、修改或刪除時觸發
exports.updateBlessingsSummary = functions.firestore
    .document("blessings/{docId}")
    .onWrite(async (change, context) => {
      try {
      // 取得所有祝福文件（若資料量非常大，可能需要調整策略）
        const snapshot = await admin.firestore().collection("blessings").get();
        let blessings = [];
        snapshot.forEach((doc) => {
          blessings.push({id: doc.id, ...doc.data()});
        });

        // 若總筆數不超過 100，則全部回傳
        if (blessings.length <= 100) {
          await admin.firestore().doc("summary/blessingsSummary").set({blessings});
          return null;
        }

        // 補上 loveCount 欄位（沒有則設為 0）
        blessings = blessings.map((b) => ({...b, loveCount: b.loveCount || 0}));
        // 取出愛心數前 20 筆的祝福
        const top20 = [...blessings].sort((a, b) => b.loveCount - a.loveCount).slice(0, 20);

        // 建立 top20 的 id 集合
        const top20Ids = new Set(top20.map((b) => b.id));

        // 過濾出不屬於 top20 的祝福
        const remaining = blessings.filter((b) => !top20Ids.has(b.id));

        // 對剩餘資料做隨機洗牌（Fisher-Yates shuffle）
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }

        // 取隨機 80 筆
        const random80 = remaining.slice(0, 80);

        // 合併成 summary 陣列
        const summary = [...top20, ...random80];

        // 將 summary 存入 Firestore 的 summary/blessingsSummary 文件
        await admin.firestore().doc("summary/blessingsSummary").set({blessings: summary});
        return null;
      } catch (error) {
        console.error("Error updating blessings summary: ", error);
        return null;
      }
    });
