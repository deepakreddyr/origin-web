import { useEffect, useRef, useState } from 'react';
import { StoreLocation } from '@/utilities/types';

interface StoreMapProps {
  stores: StoreLocation[];
  selectedStoreId: number | null;
  onSelectStore: (id: number) => void;
}

const StoreMap = ({ stores, selectedStoreId, onSelectStore }: StoreMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [id: number]: google.maps.Marker }>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_MAP_KEY;

  // Load Google Maps script once
  useEffect(() => {
    if (typeof window === 'undefined' || !apiKey) return;

    if (window.google?.maps) {
      setMapLoaded(true);
      return;
    }

    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      // Script already added — wait for it
      const checkInterval = setInterval(() => {
        if (window.google?.maps) {
          setMapLoaded(true);
          clearInterval(checkInterval);
        }
      }, 200);
      return () => clearInterval(checkInterval);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  // Init map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || stores.length === 0) return;

    const center = { lat: stores[0].lat, lng: stores[0].lng };

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: stores.length === 1 ? 15 : 13,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
      ]
    });
    mapInstanceRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Fit bounds if multiple stores
    if (stores.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      stores.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
      map.fitBounds(bounds, 80);
    }

    const createMarkerIcon = (name: string, isSelected: boolean) => {
      const displayName = name.replace(/^Origin Fresh\s*-\s*/i, '').trim();
      const textWidth = Math.max(50, displayName.length * 6.5 + 20);
      const svgWidth = textWidth + 24;
      const svgHeight = 70;
      const cx = svgWidth / 2;
      const cy = 18; // center of the circle

      const circleColor = isSelected ? '#B68D00' : '#5A4E27';
      const borderColor = '#F5E1A4'; // light yellow border
      const textColor = '#3E341C'; // dark text
      const pillBg = '#FFFDF9'; // off-white

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
          <!-- Pill Label (pushed down for gap) -->
          <g transform="translate(${cx}, ${cy + 30})">
            <rect x="-${textWidth / 2}" y="-10" width="${textWidth}" height="22" rx="11" fill="${pillBg}" stroke="${borderColor}" stroke-width="1.2" />
            <text x="0" y="4.5" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="400" fill="${textColor}" text-anchor="middle">${displayName}</text>
          </g>
          <!-- Main Circle -->
          <g transform="translate(${cx}, ${cy})">
            <circle cx="0" cy="0" r="15" fill="${circleColor}" />
            <!-- Pin Icon -->
            <path d="M0 -9 C-4.5 -9 -8 -5.5 -8 -1 C-8 4.5 0 12 0 12 C0 12 8 4.5 8 -1 C8 -5.5 4.5 -9 0 -9 Z M0 1.5 C-1.5 1.5 -2.5 0.5 -2.5 -1 C-2.5 -2.5 -1.5 -3.5 0 -3.5 C1.5 -3.5 2.5 -2.5 2.5 -1 C2.5 0.5 1.5 1.5 0 1.5 Z" fill="#ffffff" transform="scale(0.7) translate(0, -1)" />
          </g>
        </svg>
      `;

      return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        anchor: new window.google.maps.Point(cx, cy) // Anchor at center of circle
      };
    };

    // Place markers
    stores.forEach((store) => {
      const isSelected = selectedStoreId === store.id;
      const marker = new window.google.maps.Marker({
        position: { lat: store.lat, lng: store.lng },
        map,
        title: store.name,
        icon: createMarkerIcon(store.name, isSelected)
      });

      marker.addListener('click', () => {
        onSelectStore(store.id);
        infoWindowRef.current?.setContent(`
          <div style="font-family: SofiaPro, sans-serif; max-width: 220px; padding: 4px 0;">
            <p style="font-weight:700; font-size:13px; margin:0 0 4px; color:#5A4E27;">${store.name.replace(/^Origin Fresh\s*-\s*/i, '').trim()}</p>
            <p style="font-size:11px; color:#555; margin:0 0 6px; line-height:1.4;">${store.address}</p>
            <a href="tel:${store.phone.replace(/\s/g, '')}" style="font-size:11px; color:#5A4E27; font-weight:600;">${store.phone}</a>
          </div>
        `);
        infoWindowRef.current?.open(map, marker);
      });

      markersRef.current[store.id] = marker;
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.setMap(null));
      markersRef.current = {};
      infoWindowRef.current?.close();
    };
  }, [mapLoaded, stores]);

  // Highlight selected marker
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const createMarkerIcon = (name: string, isSelected: boolean) => {
      const displayName = name.replace(/^Origin Fresh\s*-\s*/i, '').trim();
      const textWidth = Math.max(50, displayName.length * 6.5 + 20);
      const svgWidth = textWidth + 24;
      const svgHeight = 70;
      const cx = svgWidth / 2;
      const cy = 18;

      const circleColor = isSelected ? '#B68D00' : '#5A4E27';
      const borderColor = '#F5E1A4';
      const textColor = '#3E341C';
      const pillBg = '#FFFDF9';

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
          <g transform="translate(${cx}, ${cy + 30})">
            <rect x="-${textWidth / 2}" y="-10" width="${textWidth}" height="22" rx="11" fill="${pillBg}" stroke="${borderColor}" stroke-width="1.2" />
            <text x="0" y="4.5" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="400" fill="${textColor}" text-anchor="middle">${displayName}</text>
          </g>
          <g transform="translate(${cx}, ${cy})">
            <circle cx="0" cy="0" r="15" fill="${circleColor}" />
            <path d="M0 -9 C-4.5 -9 -8 -5.5 -8 -1 C-8 4.5 0 12 0 12 C0 12 8 4.5 8 -1 C8 -5.5 4.5 -9 0 -9 Z M0 1.5 C-1.5 1.5 -2.5 0.5 -2.5 -1 C-2.5 -2.5 -1.5 -3.5 0 -3.5 C1.5 -3.5 2.5 -2.5 2.5 -1 C2.5 0.5 1.5 1.5 0 1.5 Z" fill="#ffffff" transform="scale(0.7) translate(0, -1)" />
          </g>
        </svg>
      `;

      return {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
        anchor: new window.google.maps.Point(cx, cy)
      };
    };

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isSelected = Number(id) === selectedStoreId;
      const store = stores.find((s) => s.id === Number(id));
      if (store) {
        marker.setIcon(createMarkerIcon(store.name, isSelected));
        // Put selected marker on top
        marker.setZIndex(isSelected ? 100 : 1);
      }
    });

    if (selectedStoreId && markersRef.current[selectedStoreId]) {
      const store = stores.find((s) => s.id === selectedStoreId);
      if (store) {
        mapInstanceRef.current?.panTo({ lat: store.lat, lng: store.lng });
      }
    }
  }, [selectedStoreId, mapLoaded, stores]);

  if (!apiKey) {
    return (
      <div className="w-full h-full rounded-[1.1vw] mob:rounded-[4vw] bg-gray-100 flex items-center justify-center">
        <p className="font-[SofiaPro] text-gray-400 text-[0.9vw] mob:text-[3.5vw]">Map unavailable</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[1.1vw] mob:rounded-none overflow-hidden shadow-md relative">
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#E8F5EE] flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#00855B] border-t-transparent rounded-full animate-spin" />
            <p className="font-[SofiaPro] text-[#00855B] text-sm font-semibold">Loading map…</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default StoreMap;
