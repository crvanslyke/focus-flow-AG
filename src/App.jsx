import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CalendarGrid from './components/Calendar/CalendarGrid';
import NewBlockModal from './components/Modals/NewBlockModal';

const STORAGE_KEY = 'focusflow_blocks';

// Initial dummy state (fallback if empty)
// Initial dummy state (fallback if empty)
// We need to generate dynamic dates relative to ONE STABLE POINT (e.g. today or fixed).
// For the demo, let's just make sure we migrate 'dayIndex' to 'date' strings on load.
const INITIAL_BLOCKS_RAW = [
  {
    id: 1,
    title: 'CVD paper - planning',
    time: '6:00 AM - 7:15 AM',
    category: 'deep-work',
    startHour: 6,
    duration: 1.25,
    dayIndex: 0 // offset from anchor
  },
  {
    id: 2,
    title: 'CAIS review work',
    time: '8:00 AM - 9:00 AM',
    category: 'admin',
    startHour: 8,
    duration: 1,
    dayIndex: 0
  }
];

import { getToday, addDays, formatDateKey, getDatesInView } from './utils/dateUtils';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(getToday());
  const [viewMode, setViewMode] = useState('3-days'); // 'day', '3-days', 'week'

  // Initialize state from localStorage or fallback
  const [blocks, setBlocks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Data Migration check: if blocks have dayIndex but NO date, we assume dayIndex 0 is TODAY.
      const needsMigration = parsed.some(b => !b.date);
      if (needsMigration) {
        const todayKey = formatDateKey(new Date()); // Use actual today for migration
        return parsed.map(b => ({
          ...b,
          date: b.date || formatDateKey(addDays(new Date(), b.dayIndex || 0)),
          // keep dayIndex for now if needed, or just rely on 'date'
        }));
      }
      return parsed;
    }
    // Initial Setup: Map dayIndex 0 to Today
    const today = new Date();
    return INITIAL_BLOCKS_RAW.map(b => ({
      ...b,
      date: formatDateKey(addDays(today, b.dayIndex))
    }));
  });

  // Save to localStorage whenever blocks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  }, [blocks]);

  // Helper to format time strings
  const formatTimeRange = (startH, duration) => {
    const pm = (h) => h >= 12 ? 'PM' : 'AM';
    const h12 = (h) => {
      const val = Math.floor(h);
      return val > 12 ? val - 12 : (val === 0 ? 12 : val);
    };
    const min = (h) => {
      const m = Math.round((h % 1) * 60);
      return m < 10 ? `0${m}` : `${m}`;
    };

    const endH = startH + duration;
    return `${h12(startH)}:${min(startH)} ${pm(startH)} - ${h12(endH)}:${min(endH)} ${pm(endH)}`;
  };

  // Helper to parse "HH:MM" string to decimal hour
  const timeStringToHour = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    return h + (m / 60);
  };

  // --- Navigation Handlers ---
  const handlePrev = () => {
    const daysToSubtract = viewMode === 'week' ? 7 : (viewMode === '3-days' ? 3 : 1);
    setCurrentDate(prev => addDays(prev, -daysToSubtract));
  };

  const handleNext = () => {
    const daysToAdd = viewMode === 'week' ? 7 : (viewMode === '3-days' ? 3 : 1);
    setCurrentDate(prev => addDays(prev, daysToAdd));
  };

  const handleToday = () => {
    setCurrentDate(getToday());
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };



  const handleSaveBlock = (blockData) => {
    if (blockData.id) {
      // UPDATE existing block
      setBlocks(prev => prev.map(b => {
        if (b.id === blockData.id) {
          return {
            ...b,
            title: blockData.title,
            category: blockData.category,
            // Update time if provided
            ...(blockData.startTime && blockData.endTime ? (() => {
              const s = timeStringToHour(blockData.startTime);
              const e = timeStringToHour(blockData.endTime);
              if (s !== null && e !== null && e > s) {
                return {
                  startHour: s,
                  duration: e - s,
                  time: formatTimeRange(s, e - s)
                };
              }
              return {};
            })() : {})
          };
        }
        return b;
      }));
    } else {
      // CREATE new block
      // Determine start/duration from initial data or defaults
      let startHour = 9;
      let duration = 1;
      let dateKey = formatDateKey(currentDate); // Default to current view start if generic add

      // If we have initial data from a drag selection, use it
      if (modalInitialData) {
        startHour = modalInitialData.startHour;
        // Handle both range selection (endHour) and single click (defaults)
        if (modalInitialData.endHour) {
          duration = modalInitialData.endHour - modalInitialData.startHour;
        }
        if (modalInitialData.date) {
          dateKey = modalInitialData.date;
        }
      }

      const newBlock = {
        id: Date.now(),
        title: blockData.title || 'New Block',
        time: formatTimeRange(startHour, duration),
        category: blockData.category || 'personal',
        startHour,
        duration,
        date: dateKey
      };

      setBlocks([...blocks, newBlock]);
    }

    setIsModalOpen(false);
    setModalInitialData(null);
  };

  const handleDeleteBlock = (blockId) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId));
    setIsModalOpen(false);
    setModalInitialData(null);
  };

  const handleBlockMove = (blockId, newDateKey, newStartHour) => {
    setBlocks(prevBlocks => prevBlocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          date: newDateKey,
          startHour: newStartHour,
          time: formatTimeRange(newStartHour, block.duration)
        };
      }
      return block;
    }));
  };

  const handleBlockResize = (blockId, newDuration) => {
    setBlocks(prevBlocks => prevBlocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          duration: newDuration,
          time: formatTimeRange(block.startHour, newDuration)
        };
      }
      return block;
    }));
  };

  const handleRangeSelect = (selection) => {
    setModalInitialData(selection);
    setIsModalOpen(true);
  }

  const handleBlockClick = (blockId) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setModalInitialData(block); // Pass full block data as initialData
      setIsModalOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header
          currentDate={currentDate}
          viewMode={viewMode}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={handleViewChange}
          onAddBlock={() => {
            setModalInitialData(null);
            setIsModalOpen(true);
          }}
        />

        {/* Content Area */}
        <div style={{ flex: 1, padding: 'var(--spacing-6)', overflow: 'hidden' }}>
          <CalendarGrid
            blocks={blocks}
            visibleDates={getDatesInView(currentDate, viewMode === 'week' ? 7 : (viewMode === '3-days' ? 3 : 1))}
            onBlockMove={handleBlockMove}
            onRangeSelect={handleRangeSelect}
            onBlockResize={handleBlockResize}
            onBlockClick={handleBlockClick}
            onDeleteBlock={handleDeleteBlock}
          />
        </div>
      </main>

      {isModalOpen && (
        <NewBlockModal
          initialData={modalInitialData}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBlock}
          onDelete={handleDeleteBlock}
        />
      )}
    </div>
  );
}

export default App;
