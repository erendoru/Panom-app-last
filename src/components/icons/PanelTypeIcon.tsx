import React from 'react';

interface PanelTypeIconProps {
    type: string;
    size?: number;
    className?: string;
}

export default function PanelTypeIcon({ type, size = 24, className = '' }: PanelTypeIconProps) {
    const iconSize = size;
    const strokeWidth = size > 24 ? 2 : 1.5;

    // Color mapping for each panel type
    const colors: Record<string, string> = {
        BILLBOARD: '#10B981',         // Green
        BILLBOARD_PLUS: '#059669',    // Emerald
        GIANTBOARD: '#8B5CF6',        // Purple
        MEGALIGHT: '#F59E0B',         // Amber
        CLP: '#06B6D4',               // Cyan
        MEGABOARD: '#6366F1',         // Indigo
        KULEBOARD: '#3B82F6',         // Blue
        ALINLIK: '#EC4899',           // Pink
        LIGHTBOX: '#FBBF24',          // Yellow
        MAXIBOARD: '#14B8A6',         // Teal
        YOL_PANOSU: '#EF4444'         // Red
    };

    const color = colors[type] || '#6B7280'; // Gray as fallback

    const renderIcon = () => {
        switch (type) {
            case 'KULEBOARD':
                // Tower/Pole icon
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="10" y="4" width="4" height="16" fill={color} rx="1" />
                        <path d="M8 20 L16 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
                        <circle cx="12" cy="6" r="2" fill={color} />
                    </svg>
                );

            case 'BILLBOARD':
            case 'BILLBOARD_PLUS':
                // Standard billboard with frame
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="4" y="8" width="16" height="10" fill={color} rx="1" />
                        <rect x="4" y="8" width="16" height="10" stroke={color} strokeWidth={strokeWidth} rx="1" opacity="0.5" />
                        {type === 'BILLBOARD_PLUS' && (
                            <>
                                <line x1="12" y1="11" x2="12" y2="15" stroke="white" strokeWidth={strokeWidth} />
                                <line x1="10" y1="13" x2="14" y2="13" stroke="white" strokeWidth={strokeWidth} />
                            </>
                        )}
                    </svg>
                );

            case 'GIANTBOARD':
                // Large building facade
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="5" y="5" width="14" height="14" fill={color} rx="1" />
                        <rect x="5" y="5" width="14" height="14" stroke={color} strokeWidth={strokeWidth} rx="1" opacity="0.7" />
                        <path d="M5 19 L19 19" stroke={color} strokeWidth={strokeWidth * 1.5} strokeLinecap="round" />
                    </svg>
                );

            case 'MEGALIGHT':
            case 'LIGHTBOX':
                // Illuminated panel with light rays
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="6" y="9" width="12" height="8" fill={color} rx="1" />
                        <circle cx="12" cy="13" r="2" fill="white" opacity="0.8" />
                        {/* Light rays */}
                        <line x1="12" y1="5" x2="12" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
                        <line x1="12" y1="18" x2="12" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
                        <line x1="6" y1="13" x2="3" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
                        <line x1="21" y1="13" x2="18" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
                    </svg>
                );

            case 'CLP':
                // Small kiosk-style
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="8" y="7" width="8" height="12" fill={color} rx="1" />
                        <rect x="9" y="9" width="6" height="4" fill="white" opacity="0.7" rx="0.5" />
                        <line x1="8" y1="19" x2="16" y2="19" stroke={color} strokeWidth={strokeWidth * 1.5} strokeLinecap="round" />
                    </svg>
                );

            case 'MEGABOARD':
            case 'MAXIBOARD':
                // Extra large format
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="3" y="7" width="18" height="11" fill={color} rx="1" />
                        <rect x="3" y="7" width="18" height="11" stroke={color} strokeWidth={strokeWidth} rx="1" opacity="0.6" />
                        <circle cx="12" cy="12.5" r="3" fill="white" opacity="0.4" />
                    </svg>
                );

            case 'ALINLIK':
                // Storefront header
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <path d="M4 8 L20 8 L18 14 L6 14 Z" fill={color} />
                        <rect x="7" y="14" width="10" height="2" fill={color} opacity="0.6" />
                    </svg>
                );

            case 'YOL_PANOSU':
                // Roadside panel
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="7" y="6" width="10" height="8" fill={color} rx="1" />
                        <line x1="11" y1="14" x2="11" y2="19" stroke={color} strokeWidth={strokeWidth} />
                        <line x1="13" y1="14" x2="13" y2="19" stroke={color} strokeWidth={strokeWidth} />
                        <line x1="9" y1="19" x2="15" y2="19" stroke={color} strokeWidth={strokeWidth * 1.5} strokeLinecap="round" />
                    </svg>
                );

            default:
                // Default generic icon
                return (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
                        <rect x="6" y="8" width="12" height="10" fill={color} rx="1" />
                    </svg>
                );
        }
    };

    return renderIcon();
}

// Export color mapping for use in other components
export const PANEL_TYPE_COLORS: Record<string, string> = {
    BILLBOARD: '#10B981',
    BILLBOARD_PLUS: '#059669',
    GIANTBOARD: '#8B5CF6',
    MEGALIGHT: '#F59E0B',
    CLP: '#06B6D4',
    MEGABOARD: '#6366F1',
    KULEBOARD: '#3B82F6',
    ALINLIK: '#EC4899',
    LIGHTBOX: '#FBBF24',
    MAXIBOARD: '#14B8A6',
    YOL_PANOSU: '#EF4444'
};
