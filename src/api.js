// /src/api.js
import { db, firebase } from "./firebase";

// 新增祝福資料到 Firestore
export const addBlessing = async (blessing) => {
  try {
    const docRef = await db.collection("blessings").add({
      text: blessing.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
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