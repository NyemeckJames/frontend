"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationIcon from "@/assets/icons/location_icon.png";

// Configure the default Leaflet icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Configure a custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: LocationIcon.src,
  iconRetinaUrl: LocationIcon.src, // Optional: Use the same icon for retina displays
  iconSize: [25, 41], // Adjust the size as needed
  iconAnchor: [12, 41], // Anchor the icon to its base
  popupAnchor: [0, -41], // Optional: Position popups relative to the icon
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", // Use default shadow or remove this line
  shadowSize: [41, 41], // Adjust shadow size if needed
  shadowAnchor: [12, 41], // Anchor shadow to match the icon
});

interface UpdateOnMapProps {
  center: any;
  onMapClick: any;
}
const UpdateOnMap: React.FC<UpdateOnMapProps> = ({ center, onMapClick }) => {
  const [markerPosition, setMarkerPosition] = useState(center);

  // Use effect to track changes in the `center` prop and update the marker position
  useEffect(() => {
    if (
      center.lat !== markerPosition.lat ||
      center.lng !== markerPosition.lng
    ) {
      setMarkerPosition(center);
    }
  }, [center]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        onMapClick(lat, lng); // Reverse geocode and update input fields
      },
    });

    return markerPosition === null ? null : (
      <Marker
        position={[markerPosition.lat, markerPosition.lng]}
        icon={customIcon}
      />
    );
  };

  return (
    <MapContainer
      center={[markerPosition.lat, markerPosition.lng]}
      zoom={14}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default UpdateOnMap;
