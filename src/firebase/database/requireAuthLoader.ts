import { redirect } from '@tanstack/react-router';
import { waitForUser } from "@/firebase/database/user.ts";

export async function requireAuthLoader(): Promise<any> {
    const user = await waitForUser();

    if (!user) {
        return redirect({ to: '/login' });
    }
    return null;
}
