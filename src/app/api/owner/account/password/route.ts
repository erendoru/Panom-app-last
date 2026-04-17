import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies });
    const {
        data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
        currentPassword?: string;
        newPassword?: string;
    };

    const current = (body.currentPassword || "").trim();
    const next = (body.newPassword || "").trim();

    if (!current || !next) {
        return NextResponse.json(
            { error: "Mevcut şifre ve yeni şifre gerekli." },
            { status: 400 }
        );
    }
    if (next.length < 8) {
        return NextResponse.json(
            { error: "Yeni şifre en az 8 karakter olmalı." },
            { status: 400 }
        );
    }
    if (next === current) {
        return NextResponse.json(
            { error: "Yeni şifre mevcut şifreyle aynı olamaz." },
            { status: 400 }
        );
    }

    // Mevcut şifreyi doğrulamak için reauth: email + password ile signIn dene
    const email = session.user.email;
    if (!email) {
        return NextResponse.json({ error: "Oturum hatası." }, { status: 400 });
    }

    const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password: current,
    });
    if (signErr) {
        return NextResponse.json(
            { error: "Mevcut şifre hatalı." },
            { status: 400 }
        );
    }

    const { error: updErr } = await supabase.auth.updateUser({
        password: next,
    });
    if (updErr) {
        console.error("[owner/account/password] update failed:", updErr);
        return NextResponse.json(
            { error: "Şifre güncellenemedi. Lütfen tekrar deneyin." },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true });
}
