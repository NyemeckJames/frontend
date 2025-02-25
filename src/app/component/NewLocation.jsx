"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MapComponent from "./MapComponent/MapComponent";
import styles from "./NewLocation.module.css";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserProfile } from "../../context/UserProfileContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStoredLanguagePreference } from "../../context/lang";

// Import translation files
import translationsEn from '../../assets/locales/ENG.json';  // English Translations
import translationsAm from '../../assets/locales/AMH.json';  // Amharic Translations 

const NewLocation = () => {
  const [address, setAddress] = useState("");
  const [addressTitle, setAddressTitle] = useState("");
  const [landmark, setLandmark] = useState("");
  const [additionalContact, setAdditionalContact] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPosition, setSelectedPosition] = useState({ lat: 9.03, lng: 38.74 });
    const searchInputRef = useRef(null);
    const router = useRouter();
    const searchParams = useSearchParams();
  const groupId = searchParams.get("groupid");
  const { userProfile, rewardPoints, loading: loadingProfile, error: errorProfile } = useUserProfile();
    const [selectedLanguage, setSelectedLanguage] = useState('AMH');  // Default language

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.body.appendChild(script);
    };

    // Initialize Google Autocomplete
    const initializeAutocomplete = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setSelectedPosition({ lat: latitude, lng: longitude });
            const title = await reverseGeocode(latitude, longitude);
            setAddress(title);
            setAddressTitle(title);
          },
          (error) => {
            console.error("Error getting user location: ", error);
          }
        );
      }

      if (window.google && searchInputRef.current) {
        const cityBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(9.024666568, 38.737330384)
        );

        const options = {
          bounds: cityBounds,
          types: ["geocode"],
          componentRestrictions: { country: "et" },
        };

        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, options);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const { lat, lng } = place.geometry.location;
            setSelectedPosition({ lat: lat(), lng: lng() });
            setAddress(place.formatted_address || "");
            setAddressTitle(place.address_components?.[0]?.long_name || "");
            setLandmark(place.address_components?.[1]?.long_name || "");
          }
        });
      }
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeAutocomplete();
    }
  }, []);

    // Fetch language preference on mount
  useEffect(() => {
    const fetchLanguagePreference = async () => {
      try {
        const language = await getStoredLanguagePreference();  
        setSelectedLanguage(language || 'AMH'); 
      } catch (error) {
        console.error("Error fetching language preference:", error);
      }
    };

    fetchLanguagePreference();
  }, []);

    // Use the correct translations based on the selected language
  const translations = selectedLanguage === 'AMH' ? translationsAm : translationsEn;

  // Reverse Geocode to get address from lat/lon using OpenStreetMap's Nominatim API
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
      const data = await response.json();
      return data.display_name || "Unknown location";
    } catch (error) {
      console.error("Error with reverse geocoding: ", error);
      return "Unknown location";
    }
  };

  // Handle Map click to update input fields
  const handleMapClick = async (lat, lng) => {
    setSelectedPosition({ lat, lng });
    const address = await reverseGeocode(lat, lng);
    setAddress(address);
    setAddressTitle(address);
  };


      // Handle form submission and API request
    const handleSubmit = async (e) => {
      e.preventDefault();

      // Build the newLocation object
      const newLocation = {
        additional_contact_name: additionalContact || "Anonymous",
        additional_contact_phone: phoneNumber || "No phone provided",
        delivery_type: "DROP_OF_POINT",
        location: {
          latitude: selectedPosition.lat,
          longitude: selectedPosition.lng,
        },
        location_title: addressTitle,
        name: addressTitle,
      };

      //console.log("Data to save:", newLocation);

      try {
        // Step 1: Validate the location coordinates
        const validationResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/locations/coordinates`,
          {
            latitude: selectedPosition.lat,
            longitude: selectedPosition.lng,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userProfile.token}`,
            },
          }
        );

        // Step 2: Check if the location is valid
        if (validationResponse.data.data.valid) {
          // Step 3: If valid, proceed to save the location
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/locations`,
            newLocation,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userProfile.token}`,
              },
            }
          );

          //console.log("Location saved successfully:", response.data);

          if (response.data.ok) {
            // Navigate to the cart page with location data
            router.push(`/cart?id=${groupId}&locationid=${response.data.data.id}&willing=${true}`);
          }
        } else {
          // Step 4: If not valid, show an error message
          toast.error(`Sorry We are not operating in this location currently.`);
        }
      } catch (error) {
        console.error("Error validating or saving location:", error);
        alert("An error occurred. Please try again.");
      }
    };

    useEffect(() => {
    // Initialize Telegram's back button
    if (window.Telegram?.WebApp) {
      const { BackButton } = window.Telegram.WebApp;

      // Show the back button
      BackButton.show();

      // Set back button click handler
      BackButton.onClick(() => {
        router.push(`/deliverymethod?groupid=${groupId}`);  // Navigate to the root (homepage)
      });

      // Cleanup on component unmount
      return () => {
        BackButton.hide();
        BackButton.offClick();
      };
    }
  }, [router]);

  return (
    <div className={styles.container}>
          <ToastContainer />  {/* Add this to make toast notifications visible */}

      <div className={styles.header}>
        <h3>{translations.pick_on_the_map}</h3>
      </div>

      <form onSubmit={handleSubmit} className={styles.formLocation}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder={translations.address}
          className={styles.input}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <div className={styles.formRow}>
          <input
            type="text"
            placeholder={translations.address_title}
            value={addressTitle}
            onChange={(e) => setAddressTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder={translations.landmark}
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <input
            type="text"
            placeholder={translations.additional_contact}
            value={additionalContact}
            onChange={(e) => setAdditionalContact(e.target.value)}
          />
          <input
            type="text"
            placeholder={translations.phone_number}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.saveButton}>
          {translations.save_address} 
        </button>
      </form>

      <MapComponent
        center={selectedPosition}
        onPlaceSelected={(position) => setSelectedPosition(position)} // For Autocomplete
        onMapClick={handleMapClick} // For reverse-geocoding on map click
      />
    </div>
  );
};

export default NewLocation;
