"use client"; // ⚠ Important pour Next.js 13+ avec App Router
import { Provider } from "react-redux";
import { store } from "./index";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
