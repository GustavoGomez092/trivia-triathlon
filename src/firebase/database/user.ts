import {auth, database} from "./firebase-config";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import {ScoreData} from "@/firebase/database/games.ts";

export function waitForUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

export async function getUserByEmail(email: string): Promise<ScoreData | null> {
    const usersRef = ref(database, 'users');
    const usersQuery = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(usersQuery);

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val();
}