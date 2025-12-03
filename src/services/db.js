import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy } from "firebase/firestore";

// --- Profiles ---
export const getProfiles = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return profiles.length > 0 ? profiles : null;
    } catch (e) {
        console.error("Error getting profiles: ", e);
        return null;
    }
};

export const addProfile = async (name, age = 60) => {
    try {
        const docRef = await addDoc(collection(db, "profiles"), {
            name,
            age,
            createdAt: new Date()
        });
        return { id: docRef.id, name, age };
    } catch (e) {
        console.error("Error adding profile: ", e);
        return null;
    }
};

// --- Orders ---
export const saveOrder = async (order) => {
    try {
        await addDoc(collection(db, "orders"), {
            ...order,
            createdAt: new Date()
        });
        return true;
    } catch (e) {
        console.error("Error saving order: ", e);
        return false;
    }
};

// --- Reminders ---
export const getReminders = async (profileId) => {
    try {
        const q = query(collection(db, "reminders"), where("profileId", "==", profileId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error getting reminders: ", e);
        return [];
    }
};

export const addReminder = async (reminder) => {
    try {
        const docRef = await addDoc(collection(db, "reminders"), reminder);
        return { id: docRef.id, ...reminder };
    } catch (e) {
        console.error("Error adding reminder: ", e);
        return null;
    }
};

export const updateReminderStatus = async (id, taken) => {
    try {
        const reminderRef = doc(db, "reminders", id);
        await updateDoc(reminderRef, { taken });
        return true;
    } catch (e) {
        console.error("Error updating reminder: ", e);
        return false;
    }
};
