import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { formatDisplayDate, formatDateKey } from '../../utils/dateUtils';
import { Trash2 } from 'lucide-react';

const DraggableBlock = ({ block, style, children, onResizeStart, onClick, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: block.id,
        data: block,
        disabled: block.isResizing
    });

    const [isHovered, setIsHovered] = useState(false);

    const finalStyle = {
        ...style,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 100 : 10,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={finalStyle}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                // Only trigger click if not pulling a drag operation
                // dnd-kit usually prevents onClick if a drag occurred, but let's be safe
                if (!isDragging) {
                    onClick(block.id);
                }
            }}

        >
            {children}

            {/* Quick Delete */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(block.id);
                    }}
                    style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        padding: '4px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: '#EF4444',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Trash2 size={12} />
                </button>
            )}

            {/* Resize Handle */}
            <div
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onResizeStart(e, block);
                }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '8px',
                    cursor: 'ns-resize',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    touchAction: 'none'
                }}
            >
                <div style={{ width: '20px', height: '3px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} />
            </div>
        </div>
    );
};

const QuarterCell = ({ dateKey, hour, quarter }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `cell-${dateKey}-${hour}-${quarter}`,
        data: { dateKey, hour, quarter }
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                height: '25%', // 15 minutes
                width: '100%',
                backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                borderBottom: quarter < 3 ? '1px dotted rgba(0,0,0,0.05)' : 'none' // subtle guide
            }}
        />
    );
};

const DroppableCell = ({ dateKey, hour, children, onMouseDown, onMouseEnter, onMouseMove }) => {
    return (
        <div
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            style={{
                height: '60px',
                borderBottom: '1px solid var(--color-border)',
                // backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent', // Moved to QuarterCell
                transition: 'background-color 0.2s',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <QuarterCell dateKey={dateKey} hour={hour} quarter={0} />
            <QuarterCell dateKey={dateKey} hour={hour} quarter={1} />
            <QuarterCell dateKey={dateKey} hour={hour} quarter={2} />
            <QuarterCell dateKey={dateKey} hour={hour} quarter={3} />
            {children}
        </div>
    );
};

// Layout Helper
const calculateLayout = (blocks) => {
    const sorted = [...blocks].sort((a, b) => a.startHour - b.startHour);
    const styledBlocks = sorted.map(block => ({ ...block, style: {} }));

    for (let i = 0; i < styledBlocks.length; i++) {
        let block = styledBlocks[i];
        let overlaps = [block];

        for (let j = 0; j < styledBlocks.length; j++) {
            if (i === j) continue;
            let other = styledBlocks[j];
            const blockEnd = block.startHour + block.duration;
            const otherEnd = other.startHour + other.duration;

            if (block.startHour < otherEnd && blockEnd > other.startHour) {
                overlaps.push(other);
            }
        }

        overlaps.sort((a, b) => a.id - b.id);
        const count = overlaps.length;
        const index = overlaps.findIndex(b => b.id === block.id);
        const widthPercent = 100 / count;
        const leftPercent = index * widthPercent;

        block.style = {
            width: `calc(${widthPercent}% - 8px)`,
            left: `calc(${leftPercent}% + 4px)`
        };
    }
    return styledBlocks;
};


const CalendarGrid = ({ blocks, visibleDates, onBlockMove, onRangeSelect, onBlockResize, onBlockClick, onDeleteBlock }) => {
    const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM to 8 PM

    const [isSelecting, setIsSelecting] = useState(false);
    const [selection, setSelection] = useState(null);
    const [resizingState, setResizingState] = useState(null);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            // Check if we dropped on a quarter cell
            const { dateKey, hour, quarter = 0 } = over.data.current;
            const newStartHour = hour + (quarter * 0.25);

            if (onBlockMove) {
                onBlockMove(active.id, dateKey, newStartHour);
            }
        }
    };

    const handleResizeStart = (e, block) => {
        setResizingState({
            blockId: block.id,
            startY: e.clientY,
            currentDuration: block.duration,
            originalDuration: block.duration
        });
    };

    useEffect(() => {
        const handleGlobalMove = (e) => {
            if (resizingState) {
                const diffY = e.clientY - resizingState.startY;
                const diffHours = diffY / 60;
                let newDuration = resizingState.originalDuration + diffHours;
                newDuration = Math.max(0.25, Math.round(newDuration * 4) / 4);
                setResizingState(prev => ({ ...prev, currentDuration: newDuration }));
            }
        };

        const handleGlobalUp = (e) => {
            if (resizingState) {
                if (onBlockResize) {
                    onBlockResize(resizingState.blockId, resizingState.currentDuration);
                }
                setResizingState(null);
            }
            if (isSelecting) {
                if (selection && onRangeSelect) {
                    onRangeSelect(selection);
                }
                setIsSelecting(false);
                setSelection(null);
            }
        };

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('mouseup', handleGlobalUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [resizingState, onBlockResize, isSelecting, selection, onRangeSelect]);


    const customOnMouseDown = (e, dateKey, hour) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const fraction = offsetY / 60;
        const rounded = Math.floor(fraction * 4) / 4;
        const start = hour + rounded;

        setIsSelecting(true);
        setSelection({
            date: dateKey,
            startHour: start,
            endHour: start + 0.25,
            anchorHour: start
        });
    };

    const customOnMouseMove = (e, dateKey, hour) => {
        if (!isSelecting || !selection) return;
        if (dateKey !== selection.date) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const fraction = offsetY / 60;

        // Snap to nearest 0.25
        const snappedFraction = Math.floor(Math.max(0, Math.min(0.99, fraction)) * 4) / 4;
        const currentCursorTime = hour + snappedFraction;

        // Use anchor to determine direction
        if (currentCursorTime >= selection.anchorHour) {
            // Dragging down or same slot
            const newEnd = currentCursorTime + 0.25;
            // Avoid zero duration? (e.g if anchor=8.0, cursor=8.0, end=8.25. Dur=0.25. OK)
            setSelection(prev => ({
                ...prev,
                startHour: prev.anchorHour,
                endHour: newEnd
            }));
        } else {
            // Dragging up
            // Start is cursor. End is anchor + 0.25 (assuming anchor slot was included in initial click?
            // Actually, if I click 8.5. Anchor=8.5. Initial selection 8.5-8.75.
            // Drag up to 8.0.
            // Start 8.0. End? 
            // If I want to include the anchor slot block: End should be 8.75.
            // If I consider anchor as a POINT...
            // Standard behavior: Anchor point -> Current point.
            // But we have slots.
            // Let's assume Anchor includes the 15min slot it started in.
            setSelection(prev => ({
                ...prev,
                startHour: currentCursorTime,
                endHour: prev.anchorHour + 0.25
            }));
        }
    };

    const customOnMouseEnter = (dateKey, hour) => {
        // Handled by onMouseMove
    };


    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                userSelect: resizingState ? 'none' : 'auto',
                cursor: resizingState ? 'ns-resize' : 'default'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                    <div style={{ width: '60px', borderRight: '1px solid var(--color-border)' }}></div>
                    {visibleDates.map((date) => {
                        const dateKey = formatDateKey(date);
                        const isToday = formatDateKey(new Date()) === dateKey;
                        return (
                            <div key={dateKey} style={{ flex: 1, padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '0.8rem', color: 'var(--color-text-secondary)', borderRight: '1px solid var(--color-border)', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                {formatDisplayDate(date)}
                                {isToday && <span style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>TODAY</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Scrollable Body */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>
                    {/* Time Labels */}
                    <div style={{ width: '60px', borderRight: '1px solid var(--color-border)', flexShrink: 0 }}>
                        {hours.map(h => (
                            <div key={h} style={{ height: '60px', fontSize: '0.65rem', color: 'var(--color-text-secondary)', textAlign: 'right', paddingRight: '8px', position: 'relative', top: '-6px' }}>
                                {h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}
                            </div>
                        ))}
                    </div>

                    {/* Day Columns */}
                    {visibleDates.map((date) => {
                        const dateKey = formatDateKey(date);
                        // Filter blocks that match this date key
                        const dayBlocks = blocks.filter(b => b.date === dateKey);

                        const displayBlocks = dayBlocks.map(b => {
                            if (resizingState && resizingState.blockId === b.id) {
                                return { ...b, duration: resizingState.currentDuration, isResizing: true };
                            }
                            return b;
                        });
                        const layoutBlocks = calculateLayout(displayBlocks);

                        return (
                            <div key={dateKey} style={{ flex: 1, borderRight: '1px solid var(--color-border)', position: 'relative' }}>
                                {/* Grid Lines */}
                                {hours.map(h => (
                                    <DroppableCell
                                        key={h}
                                        dateKey={dateKey}
                                        hour={h}
                                        onMouseDown={(e) => customOnMouseDown(e, dateKey, h)}
                                        onMouseEnter={() => customOnMouseEnter(dateKey, h)}
                                        onMouseMove={(e) => customOnMouseMove(e, dateKey, h)}
                                    />
                                ))}

                                {/* Events */}
                                {layoutBlocks.map(block => (
                                    <DraggableBlock
                                        key={block.id}
                                        block={block}
                                        onResizeStart={handleResizeStart}
                                        onClick={onBlockClick}
                                        onDelete={onDeleteBlock}
                                        style={{
                                            position: 'absolute',
                                            top: (block.startHour - 6) * 60 + 'px',
                                            height: block.duration * 60 + 'px',
                                            left: block.style.left,
                                            width: block.style.width,
                                            backgroundColor: block.category === 'deep-work' ? '#EFF6FF' : (block.category === 'admin' ? '#F3F4F6' : '#FDF2F8'),
                                            borderLeft: `3px solid var(--color-${block.category})`,
                                            borderRadius: '4px',
                                            padding: '6px',
                                            fontSize: '0.75rem',
                                            color: 'var(--color-text-primary)',
                                            overflow: 'hidden',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            cursor: 'grab',
                                            touchAction: 'none'
                                        }}
                                    >
                                        <div style={{ fontWeight: '600', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{block.title}</div>
                                        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>{block.time}</div>
                                    </DraggableBlock>
                                ))}

                                {/* Ghost Block */}
                                {isSelecting && selection && selection.date === dateKey && (
                                    <div style={{
                                        position: 'absolute',
                                        top: (selection.startHour - 6) * 60 + 'px',
                                        height: (selection.endHour - selection.startHour) * 60 + 'px',
                                        left: '4px',
                                        width: 'calc(100% - 8px)',
                                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                        border: '2px dashed var(--color-primary)',
                                        borderRadius: '4px',
                                        pointerEvents: 'none',
                                        zIndex: 20
                                    }} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </DndContext>
    );
};

export default CalendarGrid;
