import { redirect } from '@tanstack/react-router';
import { auth } from './firebase-config.ts';

function waitForUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

export async function requireAuthLoader() {
    const user = await waitForUser();

    if (!user) {
        return redirect({ to: '/login' });
    }
    return null;
}
