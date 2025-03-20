import { createRootRoute, Outlet } from '@tanstack/react-router';
import useValidCodeMonitor from "@/firebase/hooks/useValidCodeMonitor.ts";

export const Route = createRootRoute({
    component: () => {
        useValidCodeMonitor();
        return (
            <>
                <Outlet/>
                {/* <TanStackRouterDevtools /> */}
            </>
        );
    },
});
