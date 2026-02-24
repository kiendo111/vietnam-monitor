import type { TyphoonInfo } from '../types'

const API_URL = '/api/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/1/query?where=1%3D1&outFields=*&f=json'

// Bounding box for the South China Sea and surrounding areas
const VIETNAM_AREA = {
  minLat: 0,
  maxLat: 25,
  minLon: 100,
  maxLon: 125,
}

interface ArcGISFeature {
  attributes: {
    StormName: string;
    Intensity: number; // in KPH
    StormType: string;
    ForecastHr: number;
    ObsTime: number; // timestamp
  };
  geometry: {
    x: number; // longitude
    y: number; // latitude
  };
}

function isNearVietnam(lat: number, lon: number): boolean {
  return (
    lat >= VIETNAM_AREA.minLat &&
    lat <= VIETNAM_AREA.maxLat &&
    lon >= VIETNAM_AREA.minLon &&
    lon <= VIETNAM_AREA.maxLon
  );
}

export async function fetchTyphoonData(): Promise<TyphoonInfo | null> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();

  const features = data.features as ArcGISFeature[];

  if (!features || features.length === 0) {
    return null;
  }

  // Find the most recent observation for a storm near Vietnam
  for (const feature of features) {
    const { geometry, attributes } = feature;
    if (geometry && isNearVietnam(geometry.y, geometry.x)) {
      // Found a storm near Vietnam, now let's get its forecast
      const forecastFeatures = await fetch(
        `/api/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/0/query?where=StormName='${attributes.StormName}'&outFields=*&f=json`
      ).then(res => res.json()).then(data => data.features as ArcGISFeature[]);

      const forecast = forecastFeatures
        .filter(f => f.attributes.ForecastHr <= 5 * 24) // 5 days forecast
        .map(f => `Day ${Math.ceil(f.attributes.ForecastHr / 24)}: ${f.attributes.Intensity} KPH`);


      return {
        active: true,
        name: attributes.StormName,
        nameVi: `Bão ${attributes.StormName}`,
        category: Math.round(attributes.Intensity / 50), // Simple category calculation
        windSpeed: attributes.Intensity,
        location: `Vĩ độ ${geometry.y.toFixed(2)}, Kinh độ ${geometry.x.toFixed(2)}`,
        eta: forecast.length > 0 ? forecast.join(', ') : 'No forecast available',
        affectedProvinces: [], // This API doesn't provide this info
        warningLevel: attributes.Intensity > 150 ? 'Cấp độ 3' : attributes.Intensity > 100 ? 'Cấp độ 2' : 'Cấp độ 1',
      };
    }
  }

  return null; // No active storms near Vietnam
}
