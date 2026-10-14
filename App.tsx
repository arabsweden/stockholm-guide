import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Attraction, Category, ViewMode, ToastMessage } from './types';
import { fetchAttractions } from './services/geminiService';
import Header from './components/Header';
import AttractionList from './components/AttractionList';
import AttractionDetail from './components/AttractionDetail';
import StockholmMap from './components/StockholmMap';
import AttractionsGrid from './components/AttractionsGrid';
import ShareModal from './components/ShareModal';
import SavedItineraryModal from './components/SavedItineraryModal';
import ToastContainer from './components/Toast';
import { Map, List, LayoutGrid, Bookmark, Sparkles, Navigation, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [shareAttraction, setShareAttraction] = useState<Attraction | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileTab, setMobileTab] = useState<'list' | 'map' | 'detail'>('list');

  // Dark Mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const savedDark = localStorage.getItem('stockholm_theme');
      if (savedDark !== null) return savedDark === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stockholm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stockholm_theme', 'light');
    }
  }, [isDark]);

  // Saved Attractions
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const saved = window.localStorage.getItem('savedAttractions');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error("Error reading saved attractions:", error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('savedAttractions', JSON.stringify(Array.from(savedIds)));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [savedIds]);

  // Toast Helper
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Initial Load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchAttractions();
        setAttractions(data);
        if (data.length > 0) {
          setSelectedAttraction(data[0]);
        }
      } catch (err) {
        console.error("Error loading attractions:", err);
        showToast('تعذر تحميل البيانات، تم تفعيل الوضع التلقائي', 'warning');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [showToast]);

  // Handle Save Toggle
  const handleToggleSave = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setSavedIds((prev) => {
      const next = new Set(prev);
      const isAlreadySaved = next.has(id);
      const target = attractions.find(a => a.id === id);
      const name = target ? target.name : 'المعلم';

      if (isAlreadySaved) {
        next.delete(id);
        showToast(`تمت إزالة "${name}" من المحفوظات`, 'info');
      } else {
        next.add(id);
        showToast(`تم حفظ "${name}" في قائمتك المفضلة! ⭐`, 'success');
      }
      return next;
    });
  }, [attractions, showToast]);

  const handleClearAllSaved = useCallback(() => {
    setSavedIds(new Set());
    showToast('تم مسح جميع المحفوظات بنجاح', 'info');
    setIsSavedModalOpen(false);
  }, [showToast]);

  // Handle Selection
  const handleSelectAttraction = useCallback((attraction: Attraction) => {
    setSelectedAttraction(attraction);
    // On mobile switch to detail tab
    if (window.innerWidth < 768) {
      setMobileTab('detail');
    }
  }, []);

  // Handle Share
  const handleOpenShare = useCallback((attraction: Attraction, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShareAttraction(attraction);
  }, []);

  // Filtered Attractions
  const filteredAttractions = useMemo(() => {
    return attractions.filter((attr) => {
      // Category filter
      if (selectedCategory !== 'all' && attr.category !== selectedCategory) {
        return false;
      }
      // Saved filter
      if (showSavedOnly && !savedIds.has(attr.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = attr.name.toLowerCase().includes(query);
        const matchSwedish = attr.swedishName.toLowerCase().includes(query);
        const matchDesc = attr.description.toLowerCase().includes(query);
        const matchTag = attr.tags.some(t => t.toLowerCase().includes(query));
        const matchAddress = attr.address.toLowerCase().includes(query);
        return matchName || matchSwedish || matchDesc || matchTag || matchAddress;
      }
      return true;
    });
  }, [attractions, selectedCategory, showSavedOnly, savedIds, searchQuery]);

  const savedAttractionsList = useMemo(() => {
    return attractions.filter(a => savedIds.has(a.id));
  }, [attractions, savedIds]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-[Tajawal,Cairo,system-ui] transition-colors">
      
      {/* Top Navigation Bar */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        savedCount={savedIds.size}
        showSavedOnly={showSavedOnly}
        onToggleSavedFilter={() => {
          if (savedIds.size > 0 && !showSavedOnly) {
            setIsSavedModalOpen(true);
          } else {
            setShowSavedOnly(prev => !prev);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleDark={() => setIsDark(prev => !prev)}
      />

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden p-2 sm:p-4 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              جارِ تجهيز خريطة ومعالم ستوكهولم...
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          /* Cards Grid View */
          <div className="h-full overflow-y-auto pr-1">
            <AttractionsGrid
              attractions={filteredAttractions}
              savedIds={savedIds}
              onSelect={(attr) => {
                setSelectedAttraction(attr);
                setViewMode('split');
              }}
              onToggleSave={handleToggleSave}
              onShare={handleOpenShare}
            />
          </div>
        ) : viewMode === 'map' ? (
          /* Full Map View with Floating Drawer */
          <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-sm">
            <StockholmMap
              attractions={filteredAttractions}
              selectedAttraction={selectedAttraction}
              savedIds={savedIds}
              onSelect={handleSelectAttraction}
              onToggleSave={handleToggleSave}
            />

            {/* Quick floating detail pill at the bottom of full map */}
            {selectedAttraction && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideUp">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAttraction.imageUrl}
                    alt={selectedAttraction.name}
                    className="w-14 h-14 rounded-xl object-cover shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {selectedAttraction.categoryLabel}
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                      {selectedAttraction.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono truncate">
                      {selectedAttraction.swedishName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setViewMode('split')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      التفاصيل
                    </button>
                    <button
                      onClick={(e) => handleToggleSave(selectedAttraction.id, e)}
                      className={`p-2 rounded-xl transition-colors ${
                        savedIds.has(selectedAttraction.id)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedIds.has(selectedAttraction.id) ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Split View (Desktop: 3-column or 2-column balanced, Mobile: Tabbed) */
          <div className="h-full flex flex-col md:flex-row gap-3 overflow-hidden">
            
            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden bg-gray-200 dark:bg-gray-800 p-1 rounded-xl mb-1 flex-shrink-0">
              <button
                onClick={() => setMobileTab('list')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'list'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                القائمة ({filteredAttractions.length})
              </button>
              <button
                onClick={() => setMobileTab('map')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'map'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                الخريطة
              </button>
              <button
                onClick={() => setMobileTab('detail')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mobileTab === 'detail'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                التفاصيل
              </button>
            </div>

            {/* Left Column: Attraction List */}
            <div className={`md:w-80 lg:w-96 h-full flex-shrink-0 ${
              mobileTab === 'list' ? 'block' : 'hidden md:block'
            }`}>
              <AttractionList
                attractions={filteredAttractions}
                savedIds={savedIds}
                selectedId={selectedAttraction?.id}
                onSelect={handleSelectAttraction}
                onToggleSave={handleToggleSave}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Middle Column: Interactive Stockholm Map */}
            <div className={`flex-1 h-full flex flex-col gap-3 min-w-0 ${
              mobileTab === 'map' ? 'block' : 'hidden md:flex'
            }`}>
              <div className="h-1/2 md:h-2/5 min-h-[220px]">
                <StockholmMap
                  attractions={filteredAttractions}
                  selectedAttraction={selectedAttraction}
                  savedIds={savedIds}
                  onSelect={handleSelectAttraction}
                  onToggleSave={handleToggleSave}
                />
              </div>

              {/* Bottom half: Selected Attraction Details */}
              <div className="flex-1 min-h-0">
                <AttractionDetail
                  attraction={selectedAttraction}
                  isSaved={selectedAttraction ? savedIds.has(selectedAttraction.id) : false}
                  onSave={handleToggleSave}
                  onShare={handleOpenShare}
                  onFocusOnMap={() => {
                    // Triggers smooth pan to map
                  }}
                />
              </div>
            </div>

            {/* Mobile Detail Screen when Detail tab active */}
            <div className={`h-full ${mobileTab === 'detail' ? 'block md:hidden' : 'hidden'}`}>
              <AttractionDetail
                attraction={selectedAttraction}
                isSaved={selectedAttraction ? savedIds.has(selectedAttraction.id) : false}
                onSave={handleToggleSave}
                onShare={handleOpenShare}
              />
            </div>

          </div>
        )}
      </main>

      {/* Share Modal */}
      <ShareModal
        attraction={shareAttraction}
        isOpen={Boolean(shareAttraction)}
        onClose={() => setShareAttraction(null)}
        onShowToast={showToast}
      />

      {/* Saved Itinerary Modal */}
      <SavedItineraryModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedAttractions={savedAttractionsList}
        onRemove={handleToggleSave}
        onClearAll={handleClearAllSaved}
        onSelectAttraction={(attr) => {
          setSelectedAttraction(attr);
          setViewMode('split');
        }}
        onShowToast={showToast}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};

export default App;
