import React, { useState } from "react";
import axios from "axios";
import "./ImageUpload.css";

interface ImageUploadProps {
  setTaskId: (taskId: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setTaskId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (file) {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_GATEWAY}/api/v1/task`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setTaskId(response.data.id);
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error uploading file");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="file-upload-container">
      <div className="file-upload">
        <p>Select image for processing:</p>
        <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImageChange} />
        <button onClick={handleImageUpload} disabled={!file || isLoading}>
          {isLoading ? "Uploading..." : "Upload"}
        </button>
        {error && <div className="error-message">An error occurred: {error}</div>}
        {success && <div className="success-message">Image uploaded successfully</div>}
      </div>
    </div>
  );
};

export default ImageUpload;
