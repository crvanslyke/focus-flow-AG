import React, { useState } from 'react';
import { X, Calendar, Repeat, Clock, Trash2 } from 'lucide-react';

const CATEGORIES = [
    { id: 'deep-work', label: 'Deep Work', color: 'var(--color-deep-work)' },
    { id: 'meetings', label: 'Meetings', color: 'var(--color-meetings)' },
    { id: 'admin', label: 'Admin', color: 'var(--color-admin)' },
    { id: 'wellness', label: 'Wellness', color: 'var(--color-wellness)' },
    { id: 'personal', label: 'Personal', color: 'var(--color-personal)' },
];

const NewBlockModal = ({ onClose, onSave, onDelete, initialData }) => {
    // If initialData has an ID, we are in EDIT mode, not Create mode (unless it's just a time selection)
    // Actually, create mode from drag selection also passes initialData but usually without Title/ID.
    // Let's assume real blocks have Titles or IDs we can check.
    const isEditing = initialData && initialData.id;

    const [selectedCategory, setSelectedCategory] = useState(initialData?.category || 'deep-work');

    // Helper to format time
    const formatTime = (h) => {
        if (h === undefined) return '';
        const hour = Math.floor(h);
        const mins = Math.round((h % 1) * 60);
        const hStr = hour < 10 ? `0${hour}` : `${hour}`;
        const mStr = mins < 10 ? `0${mins}` : `${mins}`;
        return `${hStr}:${mStr}`;
    };

    const defaultTitle = initialData?.title || "";
    // If editing, use block date if available, or default
    const defaultDate = "12/28/2025";

    const defaultStart = initialData ? formatTime(initialData.startHour) : "09:00";
    // For editing, endHour needs to be calculated from start + duration
    let defaultEnd = "10:00";
    if (initialData) {
        let endH = initialData.endHour;
        if (!endH && initialData.startHour && initialData.duration) {
            endH = initialData.startHour + initialData.duration;
        }
        if (endH) defaultEnd = formatTime(endH);
    }

    const [title, setTitle] = useState(defaultTitle);
    const [date, setDate] = useState(defaultDate);
    // Visual only for this prototype, logic relies on App.jsx state mostly
    const [startTime, setStartTime] = useState(defaultStart);
    const [endTime, setEndTime] = useState(defaultEnd);
    const [notes, setNotes] = useState("");

    const handleSave = () => {
        onSave && onSave({
            id: initialData?.id, // Pass ID back if editing
            title: title || 'New Block',
            date,
            category: selectedCategory,
            startTime,
            endTime
        });
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.4)', // Dimmed overlay
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }}>
            <div style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)',
                width: '500px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                        {isEditing ? 'Edit Time Block' : 'New Time Block'}
                    </h2>
                    <button onClick={onClose} style={{ color: 'var(--color-text-secondary)', padding: '4px' }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Task / Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What are you working on?"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem',
                                color: 'var(--color-text-primary)',
                                outline: 'none',
                                backgroundColor: 'var(--color-bg)'
                            }}
                        />
                    </div>

                    {/* Date + Repeat Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Date
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        fontSize: '0.9rem',
                                        color: 'var(--color-text-primary)',
                                        backgroundColor: 'var(--color-bg)'
                                    }}
                                />
                                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-secondary)' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Repeat
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-text-primary)',
                                    backgroundColor: 'var(--color-bg)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    No Repeat
                                </div>
                                <Repeat size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-secondary)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Start + End Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Start
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        fontSize: '1rem',
                                        color: 'var(--color-text-primary)',
                                        backgroundColor: 'var(--color-bg)',
                                        textAlign: 'center'
                                    }}
                                />
                                <Clock size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--color-text-secondary)' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                End
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--color-border)',
                                        fontSize: '1rem',
                                        color: 'var(--color-text-primary)',
                                        backgroundColor: 'var(--color-bg)',
                                        textAlign: 'center'
                                    }}
                                />
                                <Clock size={16} style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--color-text-secondary)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Project/Category */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Project
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {CATEGORIES.map(cat => {
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <div
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--color-border)',
                                            borderRadius: '8px',
                                            padding: '10px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            cursor: 'pointer',
                                            backgroundColor: 'var(--color-surface)'
                                        }}
                                    >
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: cat.color
                                        }} />
                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{cat.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Details..."
                            style={{
                                width: '100%',
                                height: '80px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg)',
                                resize: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '8px' }}>
                    {/* Delete Button (Left aligned, only if editing) */}
                    {isEditing ? (
                        <button
                            onClick={() => onDelete && onDelete(initialData.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                color: '#EF4444', // Red
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: 'none',
                                cursor: 'pointer'
                            }}>
                            <Trash2 size={16} />
                            Delete
                        </button>
                    ) : <div />} {/* Spacer if empty */}

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                color: 'var(--color-text-secondary)',
                                fontWeight: '500'
                            }}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '600',
                                border: '1px solid transparent',
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
                            }}>
                            {isEditing ? 'Update Block' : 'Save Block'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewBlockModal;
