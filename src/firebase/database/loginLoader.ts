import { redirect } from "@tanstack/react-router";
import { waitForUser } from "./user";

export async function loginLoader(): Promise<any> {
    const user = await waitForUser();

    if (user) {
        return redirect({ to: '/waiting-room' });
    }
    return null;
}
