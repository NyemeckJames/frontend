'use client';

import { useState } from "react";
import { FaUpload } from "react-icons/fa";

const MultipleImageUpload = () => {
  const [images, setImages] = useState<{ name: string; src: string; file: File }[]>([]);
  const [numOfFiles, setNumOfFiles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setNumOfFiles(files.length);

    // Convertir chaque fichier en une promesse avec {name, src, file}
    const fileReaders = Array.from(files).map((file) => {
      return new Promise<{ name: string; src: string; file: File }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({ name: file.name, src: e.target?.result as string, file });
        };
        reader.readAsDataURL(file);
      });
    });

    // Attendre que toutes les images soient chargées
    const imagePreviews = await Promise.all(fileReaders);
    setImages(imagePreviews);
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      setMessage("No images to upload.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("event_id", "1"); // Remplace 1 par l'ID réel de l'événement

    images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-event-images/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Images uploaded successfully!");
        setImages([]);
        setNumOfFiles(0);
      } else {
        setMessage(data.error || "Upload failed.");
      }
    } catch (error) {
      setMessage("An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-cyan-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-lg text-center">
        <h1 className="text-xl font-bold mb-4">Multiple Image Upload Preview</h1>
        <input
          type="file"
          id="file-input"
          accept="image/png, image/jpeg"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer bg-blue-600 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <FaUpload /> Choose A Photo
        </label>
        {numOfFiles > 0 && <p className="mt-4 text-gray-700">{numOfFiles} Files Selected</p>}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {images.map((img, index) => (
            <figure key={index} className="w-32 text-center">
              <img src={img.src} alt={img.name} className="w-full rounded-md shadow-md" />
              <figcaption className="text-xs mt-1 text-gray-600 truncate w-32">{img.name}</figcaption>
            </figure>
          ))}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-4 px-6 py-2 rounded-lg text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Images"}
        </button>

        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default MultipleImageUpload;
