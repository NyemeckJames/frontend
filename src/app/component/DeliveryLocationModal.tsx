import React, { useEffect, useRef, useState } from "react";
import UpdateOnMap from "./UpdateOnMap";
import { AiFillCloseCircle } from "react-icons/ai";
interface Location {
  latitude: number;
  longitude: number;
}

interface FormData {
  additional_contact_name: string;
  additional_contact_phone: string;
  delivery_track_id: string;
  location: Location;
  location_title: string;
  name: string;
}
interface DeliveryLocationModalProps {
  formData: any;
  setFormData: any;
  closeModal: any;
  saveAddress: any;
}
const DeliveryLocationModal: React.FC<DeliveryLocationModalProps> = ({
  setFormData,
  formData,
  closeModal,
  saveAddress,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "latitude" | "longitude"
  ) => {
    const value = parseFloat(e.target.value);
    setFormData((prev: any) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [screen, setScreen] = useState<"autocomplete" | "map">("autocomplete");
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState({
    lat: 3.848,
    lng: 11.5021,
  });
  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    // console.log("place", place);
    if (place) {
      setPlace(place);
      if (place.geometry) {
        setFormData((prev: FormData) => ({
          ...prev,
          name: place.name || "", // Mise à jour de formData.name
          location_title: place.formatted_address || "",
          location: {
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0,
          },
        }));
      }
    }
  };

  // useEffect(() => {
  //   console.log("formData", formData);
  // }, [formData]);

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error with reverse geocoding: ", error);
      return "Unknown location";
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng });
    const address = await reverseGeocode(lat, lng);
    const updatedPlace = {
      name: address,
      formatted_address: address,
      geometry: {
        location: { toJSON: () => ({ lat, lng }) },
      },
    };
    setPlace(updatedPlace);
    setFormData((prev: any) => ({
      ...prev,
      name: updatedPlace.name,
      location_title: updatedPlace.formatted_address,
      location: { latitude: lat, longitude: lng },
    }));
  };
  useEffect(() => {
    // console.log("place", place);
    if (place) {
      setFormData((prev: any) => ({ ...prev, name: place.name }));
      setFormData((prev: any) => ({
        ...prev,
        location_title: place.formatted_address,
      }));
      setFormData((prev: any) => ({
        ...prev,
        location: {
          ...prev.location,
          latitude: place.geometry?.location?.toJSON().lat,
        },
      }));
      setFormData((prev: any) => ({
        ...prev,
        location: {
          ...prev.location,
          longitude: place.geometry?.location?.toJSON().lng,
        },
      }));
    }
  }, [place]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onLoad = () => {
        setLoading(true);
        if (inputRef.current) {
          const cityBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(1.6508, 8.5), // Sud-Ouest
            new google.maps.LatLng(13.0833, 16.1921) // Nord-Est
          );

          const options = {
            bounds: cityBounds,
            types: ["establishment"],
            componentRestrictions: { country: "cm" },
          };

          const autocomplete = new google.maps.places.Autocomplete(
            inputRef.current,
            options
          );

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place && place.geometry) {
              handlePlaceSelected(place);
            }
          });
        }
        setLoading(false);
      };
      if ((window as any).google && (window as any).google.maps) {
        setLoading(false);
        return;
      }
      if (!document.querySelector("#google-maps-script")) {
        const script = document.createElement("script");
        //script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAynBJfaFqCPhOSNEeMLsz9DWKUDjCaIZ4&libraries=places&callback=initMap`;
        script.async = true;
        document.body.appendChild(script);
        // Define the initMap function globally so it can be called by the Google Maps API
        (window as any).initMap = onLoad;

        return () => {
          document.body.removeChild(script);
          delete (window as any).google;
        };
      }
    }
  }, []);
  // Fonction pour afficher les données dans la console
  const handleShowData = () => {
    console.log("FormData:", formData);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[500]">
        <div className="fixed inset-0 bg-black opacity-30 -z-50"></div>
        <div className=" w-max bg-white rounded-lg shadow-xl p-10 pb-5 px-6 relative">
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <AiFillCloseCircle className="text-[1.5rem]" color="f41010" />
          </button>
          <div
            className={`absolute top-2 left-2 flex items-center justify-center p-2 px-3 rounded cursor-pointer text-[.6rem] ${"bg-green text-black"}`}
            onClick={() => setIsMapModalOpen(true)}
          >
            Update On Map
          </div>
          <div className="w-full flex items-center flex-col gap-3">
            <div className="flex w-full gap-2 mb-4"></div>
            <div className="w-full flex items-center justify-start gap-4">
              <span className="text-[.7rem] min-w-[10rem]">Name</span>
              <div className="border border-gray-700 rounded-md h-8 w-60">
                <input
                  ref={inputRef}
                  type="text"
                  name="name"
                  className={` border-none outline-none h-full w-full bg-none px-2 bg-transparent ${
                    loading && " pointer-events-none "
                  }`}
                  placeholder={loading ? "Loading..." : "Name"}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-start gap-4">
              <span className="text-[.7rem] min-w-[10rem]">Location Title</span>
              <div className="border border-gray-700 rounded-md h-8 w-60">
                <input
                  type="text"
                  name="location_title"
                  className="border-none outline-none h-full w-full bg-none px-2 bg-transparent"
                  placeholder="Location Title"
                  onChange={handleInputChange}
                  value={place?.formatted_address || ""}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-start gap-4">
              <span className="text-[.7rem] min-w-[10rem]">Latitude</span>
              <div className="border border-gray-700 rounded-md h-8 w-60">
                <input
                  type="number"
                  name="latitude"
                  className="border-none outline-none h-full w-full bg-none px-2 bg-transparent"
                  placeholder="Latitude"
                  value={place?.geometry?.location?.toJSON()?.lat ?? 0}
                  onChange={(e) => handleLocationChange(e, "latitude")}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-start gap-4">
              <span className="text-[.7rem] min-w-[10rem]">Longitude</span>
              <div className="border border-gray-700 rounded-md h-8 w-60">
                <input
                  type="number"
                  name="longitude"
                  className="border-none outline-none h-full w-full bg-none px-2 bg-transparent"
                  placeholder="Longitude"
                  value={place?.geometry?.location?.toJSON()?.lng ?? 0}
                  onChange={(e) => handleLocationChange(e, "longitude")}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-start gap-4">
              <span className="text-[.7rem] min-w-[10rem]">
                Additional Contact Name
              </span>
              <div className="border border-gray-700 rounded-md h-8 w-60">
                <input
                  type="text"
                  name="additional_contact_name"
                  className="border-none outline-none h-full w-full bg-none px-2 bg-transparent"
                  placeholder="Additional Contact Name"
                  value={formData.additional_contact_name || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-start gap-4">
              <span className="text-[.7rem] min-w-[10rem]">
                Additional Contact Phone
              </span>
              <div className="border border-gray-700 rounded-md h-8 w-60">
                <input
                  type="text"
                  name="additional_contact_phone"
                  className="border-none outline-none h-full w-full bg-none px-2 bg-transparent"
                  placeholder="Additional Contact Phone"
                  value={formData.additional_contact_phone || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div
              className={` w-full flex items-center bg-red-500 justify-center bg-green text-black text-[12px] cursor-pointer p-2 rounded `}
              onClick={saveAddress}
            >
              Save
            </div>
          </div>
        </div>
      </div>

      {isMapModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[600] bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-[25rem]">
            <button
              onClick={() => setIsMapModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <AiFillCloseCircle className="text-[1.5rem]" color="f41010" />
            </button>
            <UpdateOnMap
              center={selectedPosition}
              onMapClick={handleMapClick}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryLocationModal;
