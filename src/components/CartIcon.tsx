"use client";

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
}

export default function CartIcon() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const sessionId = getSessionId();
                const res = await fetch('/api/cart', {
                    headers: { 'x-session-id': sessionId }
                });
                const data = await res.json();
                setCount(data.count || 0);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCartCount();

        // Poll for updates every 60 seconds (reduced for mobile performance)
        const interval = setInterval(fetchCartCount, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Link
            href="/cart"
            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Sepetim"
        >
            <ShoppingCart className="w-5 h-5 text-white" />
            <AnimatePresence>
                {count > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    >
                        {count > 99 ? '99+' : count}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    );
}

