import { db, firebase } from "./firebase";

// 新增祝福資料到 Firestore
export const addBlessing = async (blessing) => {
  try {
    const docRef = await db.collection("blessings").add({
      text: blessing.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    // 更新該文檔，將生成的 id 加入到資料中
    await docRef.update({ id: docRef.id });
    return docRef.id;
  } catch (error) {
    console.error("Error adding blessing: ", error);
    throw error;
  }
};

// 取得所有祝福資料，依建立時間排序 (最新在前)
export const getBlessings = async () => {
  try {
    const snapshot = await db
      .collection("blessings")
      .orderBy("createdAt", "desc")
      .get();
    const blessings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    return blessings;
  } catch (error) {
    console.error("Error fetching blessings: ", error);
    throw error;
  }
};

export const updateLoveCount = async (blessingId, newLoveCount) => {
  try {
    await db.collection("blessings").doc(blessingId).update({
      loveCount: newLoveCount
    });
  } catch (error) {
    console.error("Error updating love count: ", error);
    throw error;
  }
};