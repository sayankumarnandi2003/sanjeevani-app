import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from "firebase/firestore";

// Helper: Timeout Promise
const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms));

// Helper: LocalStorage Fallback
const getLocal = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- Profiles ---
export const getProfiles = async () => {
    try {
        // Try Firebase with 5s timeout
        const querySnapshot = await Promise.race([
            getDocs(collection(db, "profiles")),
            timeout(5000)
        ]);
        const profiles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sync to local
        setLocal("sanjeevani_profiles", profiles);
        return profiles.length > 0 ? profiles : null;
    } catch (e) {
        console.warn("Firebase failed/timed out, using local profiles:", e);
        return getLocal("sanjeevani_profiles");
    }
};

export const addProfile = async (name, age = 60) => {
    const newProfile = { name, age, createdAt: new Date().toISOString() };
    try {
        const docRef = await Promise.race([
            addDoc(collection(db, "profiles"), { ...newProfile, createdAt: new Date() }),
            timeout(5000)
        ]);
        const saved = { id: docRef.id, ...newProfile };

        // Update local
        const localProfiles = getLocal("sanjeevani_profiles");
        setLocal("sanjeevani_profiles", [...localProfiles, saved]);

        return saved;
    } catch (e) {
        console.warn("Firebase failed, saving profile locally:", e);
        const localId = "local_" + Date.now();
        const localSaved = { id: localId, ...newProfile };
        const localProfiles = getLocal("sanjeevani_profiles");
        setLocal("sanjeevani_profiles", [...localProfiles, localSaved]);
        return localSaved;
    }
};

// --- Orders ---
export const saveOrder = async (order) => {
    try {
        await Promise.race([
            addDoc(collection(db, "orders"), { ...order, createdAt: new Date() }),
            timeout(5000)
        ]);
        return true;
    } catch (e) {
        console.warn("Firebase failed, saving order locally:", e);
        const localOrders = getLocal("sanjeevani_orders");
        setLocal("sanjeevani_orders", [...localOrders, { ...order, createdAt: new Date().toISOString(), id: "local_" + Date.now() }]);
        return true; // Return true so UI thinks it succeeded
    }
};

// --- Reminders ---
export const getReminders = async (profileId) => {
    try {
        const q = query(collection(db, "reminders"), where("profileId", "==", profileId));
        const querySnapshot = await Promise.race([
            getDocs(q),
            timeout(5000)
        ]);
        const reminders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Update local cache (filtering for this profile might be tricky for cache, so we just append/merge? 
        // For simplicity, we'll just return what we got. If we fail, we read ALL local reminders and filter.)
        return reminders;
    } catch (e) {
        console.warn("Firebase failed, using local reminders:", e);
        const allReminders = getLocal("sanjeevani_reminders");
        return allReminders.filter(r => r.profileId === profileId);
    }
};

export const addReminder = async (reminder) => {
    try {
        const docRef = await Promise.race([
            addDoc(collection(db, "reminders"), reminder),
            timeout(5000)
        ]);
        const saved = { id: docRef.id, ...reminder };

        // Update local
        const localReminders = getLocal("sanjeevani_reminders");
        setLocal("sanjeevani_reminders", [...localReminders, saved]);

        return saved;
    } catch (e) {
        console.warn("Firebase failed, saving reminder locally:", e);
        const localSaved = { id: "local_" + Date.now(), ...reminder };
        const localReminders = getLocal("sanjeevani_reminders");
        setLocal("sanjeevani_reminders", [...localReminders, localSaved]);
        return localSaved;
    }
};

export const updateReminderStatus = async (id, taken) => {
    try {
        const reminderRef = doc(db, "reminders", id);
        await Promise.race([
            updateDoc(reminderRef, { taken }),
            timeout(5000)
        ]);

        // Update local
        const localReminders = getLocal("sanjeevani_reminders");
        const updated = localReminders.map(r => r.id === id ? { ...r, taken } : r);
        setLocal("sanjeevani_reminders", updated);

        return true;
    } catch (e) {
        console.warn("Firebase failed, updating reminder locally:", e);
        // If it's a local ID, we MUST update locally. If it's a firebase ID, we update locally too.
        const localReminders = getLocal("sanjeevani_reminders");
        const updated = localReminders.map(r => r.id === id ? { ...r, taken } : r);
        setLocal("sanjeevani_reminders", updated);
        return true;
    }
};
