import { Coordinates } from "./Coordinates";
import GeocoderResult = google.maps.GeocoderResult;

/**
 * Place info data.
 */
export interface PlaceInfo {
  /**
   * Location
   */
  location: Coordinates;
  /**
   * State name
   */
  state: string;
  /**
   * City name
   */
  city: string;
  /**
   * Initial google data.
   */
  initial: GeocoderResult;
}
