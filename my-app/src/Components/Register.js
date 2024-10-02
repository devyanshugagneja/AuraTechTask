import React, { useState } from 'react';
import './styles/LandingPage.css';

const LandingPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [removedBgPreview, setRemovedBgPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileType(selectedFile.type.split('/')[0]);
    
    const previewURL = URL.createObjectURL(selectedFile);
    setPreview(previewURL);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      setMessage(data.message);

      // Enable remove background button only for images
      if (fileType === 'image') {
        setDownloadLink(data.downloadLink); // Assume the response contains a download link
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRemoveBg = async () => {
    if (!file) {
      setMessage('No image uploaded. Processing a default image instead.'); // Optional message
    } else if (fileType !== 'image') {
      setMessage('Please upload an image to remove the background');
      return;
    }

    const formData = new FormData();
    formData.append('image_file', file);

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": "B4AhgXpEYyNyW8yg8KrSVHBh", // Your API key here
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Background removal failed');
      }

      const rbgResultData = await response.arrayBuffer();
      const blob = new Blob([rbgResultData], { type: "image/png" });
      const downloadUrl = URL.createObjectURL(blob); // Create a URL for the result image

      setRemovedBgPreview(downloadUrl); // Update state for removed background preview
      setDownloadLink(downloadUrl); // Update the state with the download URL
      setMessage('Background removed successfully!'); // Update message to indicate success
    } catch (error) {
      setMessage(error.message);
    }
  };

  const renderFileContent = () => {
    if (fileType === 'image') return <img src={preview} alt="preview" style={{ width: '200px' }} />;
    if (fileType === 'audio') return <audio controls src={preview} />;
    if (fileType === 'video') return <video controls src={preview} width="300px" />;
    if (fileType === 'application') return <iframe src={preview} width="400px" height="300px" title="PDF preview" />;
    return <p>Unsupported file type</p>;
  };

  return (
    <div className="landing-page-container">
      <div className="file-upload-container">
        <h2>File Upload with Preview</h2>
        <input type="file" onChange={handleFileChange} />
        {preview && (
          <div className="file-preview">
            <h3>File Preview</h3>
            {renderFileContent()}
          </div>
        )}
        <button onClick={handleUpload}>Upload File</button>
        {message && <p>{message}</p>}
        
        {fileType === 'image' && (
          <div>
            <button onClick={handleRemoveBg}>Remove Background</button>
            {removedBgPreview && (
              <div className="removed-bg-preview">
                <h3>Removed Background Image</h3>
                <img src={removedBgPreview} alt="Removed Background" style={{ width: '200px' }} />
                <a href={downloadLink} download>Download Image</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
