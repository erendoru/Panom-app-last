"use client";

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeaderCartIcon() {
    const [count, setCount] = useState(0);

    // Fetch cart count on mount
    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                let sessionId = localStorage.getItem('cart_session_id');
                if (!sessionId) {
                    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
                    localStorage.setItem('cart_session_id', sessionId);
                }

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
            className="relative flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            title="Sepetim"
        >
            <ShoppingCart className="w-5 h-5 text-white" />
            <AnimatePresence>
                {count > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                    >
                        {count > 99 ? '99+' : count}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    );
}
