"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface Panel {
    id: string;
    name: string;
    type: string;
    city: string;
    district: string;
    imageUrl?: string;
    priceWeekly: number;
    priceDaily?: number;
    ownerName?: string;
    width: number;
    height: number;
}

interface CartItem {
    id: string;
    panelId: string;
    startDate: string | null;
    endDate: string | null;
    panel: Panel;
}

interface DiscountSuggestion {
    panelType: string;
    ownerName: string | null;
    currentCount: number;
    neededCount: number;
    discountPercent?: number;
    fixedUnitPrice?: number;
    potentialSavings: number;
}

interface CartTotals {
    subtotal: number;
    discount: number;
    total: number;
    itemCount: number;
    suggestions: DiscountSuggestion[];
}

interface CartContextType {
    items: CartItem[];
    count: number;
    loading: boolean;
    totals: CartTotals;
    addToCart: (panelId: string) => Promise<{ success: boolean; error?: string }>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateItemDates: (itemId: string, startDate: string, endDate: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    calculateTotals: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate or get session ID
function getSessionId(): string {
    if (typeof window === 'undefined') return '';

    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState<CartTotals>({
        subtotal: 0,
        discount: 0,
        total: 0,
        itemCount: 0,
        suggestions: []
    });

    const sessionId = typeof window !== 'undefined' ? getSessionId() : '';

    const refreshCart = useCallback(async () => {
        try {
            const res = await fetch('/api/cart', {
                headers: { 'x-session-id': sessionId }
            });
            const data = await res.json();
            setItems(data.items || []);
            setCount(data.count || 0);
        } catch (error) {
            console.error('Error refreshing cart:', error);
        }
    }, [sessionId]);

    const calculateTotals = useCallback(async () => {
        try {
            const res = await fetch('/api/cart/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                }
            });
            const data = await res.json();
            setTotals({
                subtotal: data.subtotal || 0,
                discount: data.discount || 0,
                total: data.total || 0,
                itemCount: data.itemCount || 0,
                suggestions: data.suggestions || []
            });
        } catch (error) {
            console.error('Error calculating totals:', error);
        }
    }, [sessionId]);

    const addToCart = async (panelId: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({ panelId, sessionId })
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error };
            }

            setCount(data.count);
            await refreshCart();
            await calculateTotals();
            return { success: true };
        } catch (error) {
            console.error('Error adding to cart:', error);
            return { success: false, error: 'Bir hata oluştu' };
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: { 'x-session-id': sessionId }
            });
            const data = await res.json();
            setCount(data.count || 0);
            await refreshCart();
            await calculateTotals();
        } catch (error) {
            console.error('Error removing from cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateItemDates = async (itemId: string, startDate: string, endDate: string) => {
        try {
            await fetch(`/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({ startDate, endDate })
            });
            await refreshCart();
            await calculateTotals();
        } catch (error) {
            console.error('Error updating dates:', error);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        try {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'x-session-id': sessionId }
            });
            setItems([]);
            setCount(0);
            setTotals({ subtotal: 0, discount: 0, total: 0, itemCount: 0, suggestions: [] });
        } catch (error) {
            console.error('Error clearing cart:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load cart on mount
    useEffect(() => {
        if (sessionId) {
            refreshCart();
            calculateTotals();
        }
    }, [sessionId, refreshCart, calculateTotals]);

    return (
        <CartContext.Provider value={{
            items,
            count,
            loading,
            totals,
            addToCart,
            removeFromCart,
            updateItemDates,
            clearCart,
            refreshCart,
            calculateTotals
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
