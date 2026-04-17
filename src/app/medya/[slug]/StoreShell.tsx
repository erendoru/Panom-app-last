"use client";

import type { ReactNode } from "react";
import StoreNavbar from "./StoreNavbar";
import StoreFooter from "./StoreFooter";
import { StoreProvider, type StoreOwnerContext } from "./StoreContext";

export default function StoreShell({
    owner,
    children,
}: {
    owner: StoreOwnerContext;
    children: ReactNode;
}) {
    return (
        <StoreProvider owner={owner}>
            <div className="min-h-screen flex flex-col bg-white text-slate-900">
                <StoreNavbar />
                <main className="flex-1">{children}</main>
                <StoreFooter />
            </div>
        </StoreProvider>
    );
}
