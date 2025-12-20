"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Mail, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmailVerificationBanner() {
    const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkEmailVerification = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // email_confirmed_at will be null if not verified
                setIsEmailVerified(!!user.email_confirmed_at);
            }
        };

        checkEmailVerification();

        // Listen for auth state changes (in case user verifies email in another tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setIsEmailVerified(!!session.user.email_confirmed_at);
            }
        });

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleResendEmail = async () => {
        setIsResending(true);
        setResendSuccess(false);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: user.email,
                });

                if (!error) {
                    setResendSuccess(true);
                    setTimeout(() => setResendSuccess(false), 5000);
                }
            }
        } catch (error) {
            console.error("Error resending email:", error);
        } finally {
            setIsResending(false);
        }
    };

    // Don't render if verified, loading, or dismissed
    if (isEmailVerified === null || isEmailVerified === true || isDismissed) {
        return null;
    }

    return (
        <div className="bg-amber-50 border-b border-amber-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                            <Mail className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-amber-800">
                                Email adresinizi onaylayın
                            </p>
                            <p className="text-xs text-amber-600">
                                Kayıt sırasında gönderilen onay linkine tıklayarak hesabınızı doğrulayın.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {resendSuccess ? (
                            <span className="text-sm text-green-600 font-medium">
                                ✓ Mail gönderildi!
                            </span>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleResendEmail}
                                disabled={isResending}
                                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                            >
                                {isResending ? (
                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                )}
                                Tekrar Gönder
                            </Button>
                        )}
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="p-1 text-amber-600 hover:text-amber-800 transition-colors"
                            aria-label="Kapat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
