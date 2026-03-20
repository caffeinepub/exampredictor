import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { StarField } from "./components/StarField";
import { HomePage } from "./pages/HomePage";
import { ZodiacDetailPage } from "./pages/ZodiacDetailPage";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <>
      <StarField />
      <Outlet />
      <Toaster />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const zodiacDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/zodiac/$signIndex",
  component: ZodiacDetailPage,
});

const routeTree = rootRoute.addChildren([homeRoute, zodiacDetailRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
