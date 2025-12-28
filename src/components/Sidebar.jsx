import React from 'react';
import { Lock } from 'lucide-react';

const CATEGORIES = [
  { id: 'deep-work', label: 'Deep Work', color: 'var(--color-deep-work)' },
  { id: 'meetings', label: 'Meetings', color: 'var(--color-meetings)' },
  { id: 'admin', label: 'Admin', color: 'var(--color-admin)' },
  { id: 'wellness', label: 'Wellness', color: 'var(--color-wellness)' },
  { id: 'personal', label: 'Personal', color: 'var(--color-personal)' },
];

const Sidebar = () => {
  return (
    <aside style={{
      width: '260px',
      borderRight: '1px solid var(--color-border)',
      padding: 'var(--spacing-6)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-surface)',
      height: '100%'
    }}>
      {/* Brand */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
         <h1 style={{ 
           fontSize: '1.25rem', 
           fontWeight: '600', 
           color: 'var(--color-primary)' 
         }}>
           FocusFlow
         </h1>
         <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} /> Encrypted Workspace
         </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 'var(--spacing-8)' }}>
        <h2 style={{ 
          fontSize: '0.65rem', 
          fontWeight: '700', 
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 'var(--spacing-2)'
        }}>
          Today's Progress
        </h2>
        <div style={{ 
          height: '6px', 
          backgroundColor: 'var(--color-bg)', 
          borderRadius: '99px',
          overflow: 'hidden',
          marginBottom: 'var(--spacing-1)'
        }}>
          <div style={{ 
            width: '5%', 
            height: '100%', 
            backgroundColor: 'var(--color-primary)',
            borderRadius: '99px'
          }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
          5% of day elapsed
        </div>
      </div>

      {/* Categories */}
      <div style={{ flex: 1 }}>
        <h2 style={{ 
            fontSize: '0.65rem', 
            fontWeight: '700', 
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 'var(--spacing-4)'
          }}>
            Categories
          </h2>
          <ul style={{ listStyle: 'none' }}>
            {CATEGORIES.map(category => (
              <li key={category.id} style={{ 
                marginBottom: 'var(--spacing-2)',
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: category.color,
                  marginRight: 'var(--spacing-3)'
                }} />
                {category.label}
              </li>
            ))}
          </ul>
      </div>

      {/* Footer */}
      <div>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-2)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
          <Lock size={16} />
          Lock Workspace
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
