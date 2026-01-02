import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { formatDisplayDate, addDays } from '../utils/dateUtils';

const Header = ({ currentDate, viewMode, onPrev, onNext, onToday, onViewChange, onAddBlock }) => {

    // Calculate display label
    let dateLabel = '';
    if (viewMode === 'day') {
        dateLabel = formatDisplayDate(currentDate);
    } else {
        const duration = viewMode === 'week' ? 7 : 3;
        const endDate = addDays(currentDate, duration - 1);
        const startStr = formatDisplayDate(currentDate);
        const endStr = formatDisplayDate(endDate);
        // If same month/year, could optimize, but keep simple for now
        dateLabel = `${startStr} - ${endStr}`;
    }
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
                    <button onClick={onPrev} style={{ padding: '4px', display: 'flex', borderRadius: '4px', cursor: 'pointer' }}>
                        <ChevronLeft size={16} color="var(--color-text-secondary)" />
                    </button>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        padding: '0 var(--spacing-4)',
                        color: 'var(--color-text-primary)',
                        minWidth: '150px',
                        textAlign: 'center',
                        userSelect: 'none'
                    }}>
                        {dateLabel}
                        {/* If we're far from Today, maybe show a "Back to Today" icon/text? 
                            But "Today" button is elsewhere usually. 
                            Let's add a Today button explicitly or make the label click to today?
                            The design has "Today" inside the arrows? No, the design had "Today" as the label. 
                            Let's put a dedicated "Today" button next to arrows or use the label.
                            Actually the original mockup had: < < Today > > sort of?
                            Original: [ < Today > ]
                            Let's make a "Today" button separate or keep it simple.
                            
                            Wait, the original code had:
                             <button> < </button>
                             <span> Today </span>
                             <button> > </button>
                             
                            I'll just add a "Today" button next to it.
                        */}
                    </span>
                    <button onClick={onNext} style={{ padding: '4px', display: 'flex', borderRadius: '4px', cursor: 'pointer' }}>
                        <ChevronRight size={16} color="var(--color-text-secondary)" />
                    </button>
                </div>
                <button onClick={onToday} style={{
                    marginLeft: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer'
                }}>
                    Today
                </button>
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
                    <button
                        onClick={() => onViewChange('day')}
                        style={{
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            backgroundColor: viewMode === 'day' ? 'var(--color-surface)' : 'transparent',
                            boxShadow: viewMode === 'day' ? 'var(--shadow-sm)' : 'none',
                            fontWeight: viewMode === 'day' ? '600' : 'normal',
                            color: viewMode === 'day' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            cursor: 'pointer'
                        }}>Day</button>
                    <button
                        onClick={() => onViewChange('3-days')}
                        style={{
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            backgroundColor: viewMode === '3-days' ? 'var(--color-surface)' : 'transparent',
                            boxShadow: viewMode === '3-days' ? 'var(--shadow-sm)' : 'none',
                            fontWeight: viewMode === '3-days' ? '600' : 'normal',
                            color: viewMode === '3-days' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            cursor: 'pointer'
                        }}>3 Days</button>
                    <button
                        onClick={() => onViewChange('week')}
                        style={{
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            backgroundColor: viewMode === 'week' ? 'var(--color-surface)' : 'transparent',
                            boxShadow: viewMode === 'week' ? 'var(--shadow-sm)' : 'none',
                            fontWeight: viewMode === 'week' ? '600' : 'normal',
                            color: viewMode === 'week' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            cursor: 'pointer'
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
