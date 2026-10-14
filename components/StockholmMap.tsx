import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Attraction } from '../types';
import { Navigation, Compass, Layers, MapPin, ExternalLink, Star } from 'lucide-react';

interface StockholmMapProps {
  attractions: Attraction[];
  selectedAttraction: Attraction | null;
  savedIds: Set<string>;
  onSelect: (attraction: Attraction) => void;
  onToggleSave: (id: string) => void;
  className?: string;
}

// Stockholm center coordinates
const STOCKHOLM_CENTER: [number, number] = [59.3293, 18.0686];

export const StockholmMap: React.FC<StockholmMapProps> = ({
  attractions,
  selectedAttraction,
  savedIds,
  onSelect,
  onToggleSave,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [mapStyle, setMapStyle] = useState<'voyager' | 'osm'>('voyager');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: STOCKHOLM_CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add zoom control to bottom-right
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>')
        .addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = mapStyle === 'voyager'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const maxZoom = mapStyle === 'voyager' ? 19 : 19;

    L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
  }, [mapStyle]);

  // Update Markers when attractions change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    Object.keys(markersRef.current).forEach((id) => {
      markersRef.current[id]?.remove();
    });
    markersRef.current = {};

    attractions.forEach((attraction) => {
      const isSelected = selectedAttraction?.id === attraction.id;
      const isSaved = savedIds.has(attraction.id);

      // Category colors
      let pinColor = '#3b82f6'; // blue
      if (attraction.category === 'historical') pinColor = '#eab308'; // amber/yellow
      if (attraction.category === 'museums') pinColor = '#8b5cf6'; // purple
      if (attraction.category === 'nature') pinColor = '#22c55e'; // green
      if (attraction.category === 'palaces') pinColor = '#ec4899'; // pink
      if (attraction.category === 'views') pinColor = '#06b6d4'; // cyan
      if (attraction.category === 'entertainment') pinColor = '#f97316'; // orange

      const markerHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 ${
            isSelected ? 'scale-125 ring-4 ring-white ring-offset-2' : 'hover:scale-110'
          }" style="background-color: ${pinColor}; border: 2.5px solid #ffffff;">
            ${
              isSaved
                ? '<svg class="w-4 h-4 text-white fill-white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
                : '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>'
            }
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/30 rounded-full blur-[1px]"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker([attraction.latitude, attraction.longitude], {
        icon: customIcon,
        title: attraction.name
      }).addTo(map);

      // Popup Content in Arabic
      const popupContent = document.createElement('div');
      popupContent.dir = 'rtl';
      popupContent.className = 'p-1 font-[Tajawal,Cairo,system-ui] text-right';
      popupContent.innerHTML = `
        <div class="w-56 overflow-hidden rounded-lg">
          <img src="${attraction.imageUrl}" alt="${attraction.name}" class="w-full h-24 object-cover rounded-md mb-2 shadow-sm" />
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-xs px-2 py-0.5 rounded-full font-medium" style="background-color: ${pinColor}20; color: ${pinColor}">
              ${attraction.categoryLabel}
            </span>
            <span class="text-xs text-amber-500 font-bold flex items-center gap-0.5">★ ${attraction.rating}</span>
          </div>
          <h3 class="font-bold text-gray-900 text-sm leading-tight mb-1">${attraction.name}</h3>
          <p class="text-xs text-gray-500 font-mono mb-2">${attraction.swedishName}</p>
          <p class="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">${attraction.description}</p>
          <div class="flex items-center gap-1 pt-1 border-t border-gray-100">
            <button id="btn-select-${attraction.id}" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-2 rounded transition-colors text-center">
              عرض التفاصيل
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}" target="_blank" rel="noopener noreferrer" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs p-1.5 rounded transition-colors" title="الاتجاهات">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A2 2 0 012.5 15.485V4.515A2 2 0 014.553 2.72L9 4.947l6-3 4.447 2.224A2 2 0 0120.5 5.915v10.97a2 2 0 01-1.053 1.79L15 16.053l-6 3.947z"/></svg>
            </a>
          </div>
        </div>
      `;

      // Event listener for select button inside popup
      popupContent.querySelector(`#btn-select-${attraction.id}`)?.addEventListener('click', () => {
        onSelect(attraction);
      });

      marker.bindPopup(popupContent, {
        maxWidth: 260,
        className: 'modern-arabic-popup'
      });

      marker.on('click', () => {
        onSelect(attraction);
      });

      markersRef.current[attraction.id] = marker;
    });
  }, [attractions, selectedAttraction?.id, savedIds, onSelect]);

  // Pan to selected attraction
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedAttraction) return;

    map.flyTo([selectedAttraction.latitude, selectedAttraction.longitude], 15, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    const marker = markersRef.current[selectedAttraction.id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  }, [selectedAttraction]);

  // Invalidate map size on mount/resize
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Handle Locate User
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('خدمة تحديد الموقع غير مدعومة في متصفحك.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 14);
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#3b82f6',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
          })
            .addTo(mapRef.current)
            .bindPopup('<div dir="rtl" class="text-xs font-bold text-center">موقعك الحالي</div>')
            .openPopup();
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
      },
      { timeout: 8000 }
    );
  };

  const handleResetView = () => {
    mapRef.current?.flyTo(STOCKHOLM_CENTER, 13);
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 bg-slate-100 dark:bg-slate-900 ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Floating Control Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
        {/* Reset to Stockholm center */}
        <button
          onClick={handleResetView}
          title="إعادة ضبط العرض لوسط ستوكهولم"
          className="p-2.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all border border-gray-200/80 dark:border-gray-700/80 flex items-center gap-1.5 text-xs font-semibold"
        >
          <Compass className="w-4 h-4 text-blue-500 animate-spin-slow" />
          <span className="hidden sm:inline">وسط ستوكهولم</span>
        </button>

        {/* Locate me */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          title="تحديد موقعي"
          className="p-2.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all border border-gray-200/80 dark:border-gray-700/80 flex items-center gap-1.5 text-xs font-semibold"
        >
          <Navigation className={`w-4 h-4 text-emerald-500 ${isLocating ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{isLocating ? 'جارِ التحديد...' : 'موقعي'}</span>
        </button>

        {/* Style switcher */}
        <button
          onClick={() => setMapStyle(prev => prev === 'voyager' ? 'osm' : 'voyager')}
          title="تغيير مظهر الخريطة"
          className="p-2.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 transition-all border border-gray-200/80 dark:border-gray-700/80 flex items-center gap-1.5 text-xs font-semibold"
        >
          <Layers className="w-4 h-4 text-indigo-500" />
          <span className="hidden sm:inline">{mapStyle === 'voyager' ? 'طبيعية' : 'شوارع'}</span>
        </button>
      </div>

      {/* Map Legend / Category Pills */}
      <div className="absolute bottom-3 right-3 left-16 sm:left-auto z-[1000] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-gray-200/80 dark:border-gray-700/80 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap text-[11px]">دليل المعالم:</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> تاريخ
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> متاحف
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> طبيعة
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> قصور
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-700 dark:text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> إطلالات
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockholmMap;
