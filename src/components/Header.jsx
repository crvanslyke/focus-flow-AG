import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const Header = ({ onAddBlock }) => {
    return (
        <header style={{
            height: '72px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--spacing-8)',
            backgroundColor: 'var(--color-surface)'
        }}>
            {/* Date Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: '8px',
                    padding: '4px'
                }}>
                    <button style={{ padding: '4px', display: 'flex', borderRadius: '4px' }}>
                        <ChevronLeft size={16} color="var(--color-text-secondary)" />
                    </button>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        padding: '0 var(--spacing-4)',
                        color: 'var(--color-text-primary)'
                    }}>
                        Today
                    </span>
                    <button style={{ padding: '4px', display: 'flex', borderRadius: '4px' }}>
                        <ChevronRight size={16} color="var(--color-text-secondary)" />
                    </button>
                </div>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                {/* View Toggle */}
                <div style={{
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: '8px',
                    padding: '4px',
                    display: 'flex',
                    gap: '2px'
                }}>
                    <button style={{
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        color: 'var(--color-text-secondary)'
                    }}>Day</button>
                    <button style={{
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-surface)',
                        boxShadow: 'var(--shadow-sm)',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)'
                    }}>3 Days</button>
                    <button style={{
                        padding: '4px 12px',
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        color: 'var(--color-text-secondary)'
                    }}>Week</button>
                </div>

                {/* Add Block Button */}
                <button
                    onClick={onAddBlock}
                    style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--color-primary)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        transition: 'background-color 0.2s'
                    }}>
                    <Plus size={16} />
                    Add Block
                </button>
            </div>
        </header>
    );
};

export default Header;
