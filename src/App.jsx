import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CalendarGrid from './components/Calendar/CalendarGrid';
import NewBlockModal from './components/Modals/NewBlockModal';

const STORAGE_KEY = 'focusflow_blocks';

// Initial dummy state (fallback if empty)
const INITIAL_BLOCKS = [
  {
    id: 1,
    title: 'CVD paper - planning',
    time: '6:00 AM - 7:15 AM',
    category: 'deep-work',
    startHour: 6,
    duration: 1.25,
    dayIndex: 0
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

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);

  // Initialize state from localStorage or fallback
  const [blocks, setBlocks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_BLOCKS;
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


  const handleSaveBlock = (blockData) => {
    if (blockData.id) {
      // UPDATE existing block
      setBlocks(prev => prev.map(b => {
        if (b.id === blockData.id) {
          return {
            ...b,
            title: blockData.title,
            category: blockData.category,
            // We assume time hasn't changed via Modal for this simplified version, 
            // unless we parse 'date'/'start'/'end' strings.
            // For now, let only Title/Category be editable via modal to keep it simple,
            // as time is edited via Drag/Resize.
          };
        }
        return b;
      }));
    } else {
      // CREATE new block
      // Determine start/duration from initial data or defaults
      let startHour = 9;
      let duration = 1;
      let dayIndex = 0;

      // If we have initial data from a drag selection, use it
      if (modalInitialData) {
        startHour = modalInitialData.startHour;
        // Handle both range selection (endHour) and single click (defaults)
        if (modalInitialData.endHour) {
          duration = modalInitialData.endHour - modalInitialData.startHour;
        }
        if (modalInitialData.dayIndex !== undefined) {
          dayIndex = modalInitialData.dayIndex;
        }
      }

      const newBlock = {
        id: Date.now(),
        title: blockData.title || 'New Block',
        time: formatTimeRange(startHour, duration),
        category: blockData.category || 'personal',
        startHour,
        duration,
        dayIndex
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

  const handleBlockMove = (blockId, newDayIndex, newStartHour) => {
    setBlocks(prevBlocks => prevBlocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          dayIndex: newDayIndex,
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
        <Header onAddBlock={() => {
          setModalInitialData(null);
          setIsModalOpen(true);
        }} />

        {/* Content Area */}
        <div style={{ flex: 1, padding: 'var(--spacing-6)', overflow: 'hidden' }}>
          <CalendarGrid
            blocks={blocks}
            onBlockMove={handleBlockMove}
            onRangeSelect={handleRangeSelect}
            onBlockResize={handleBlockResize}
            onBlockClick={handleBlockClick}
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
