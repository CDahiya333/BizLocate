import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapSkeleton } from './LoadingSkeleton';

// Get the API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px'
};

interface MapProps {
  lat: number;
  lng: number;
  businessName?: string;
  zoom?: number;
  infoContent?: React.ReactNode;
}

const GoogleMapComponent: React.FC<MapProps> = ({ 
  lat, 
  lng, 
  businessName,
  zoom = 14,
  infoContent 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const center = {
    lat,
    lng
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleLoadError = (error: Error) => {
    console.error('Error loading Google Maps:', error);
    setLoadError(error);
  };

  // Show error message if map fails to load
  if (loadError) {
    return (
      <div className="w-full h-full min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-center p-4">
        <div>
          <p className="text-error mb-2">Failed to load Google Maps</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Please check your internet connection or API key.</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      onError={handleLoadError}
      loadingElement={<MapSkeleton />}
    >
      {!isLoaded ? <MapSkeleton /> : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            fullscreenControl: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true
          }}
        >
          <Marker 
            position={center} 
            onClick={() => setInfoOpen(true)}
            title={businessName}
          />
          
          {infoContent && infoOpen && (
            <InfoWindow
              position={center}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                {infoContent || <p className="font-semibold">{businessName}</p>}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default GoogleMapComponent; 