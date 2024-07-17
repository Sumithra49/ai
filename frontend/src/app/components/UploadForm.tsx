"use client";

import { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setTextContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md">
      <input 
        type="file" 
        accept=".txt,.html,.docx" 
        onChange={handleFileChange} 
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button 
        type="submit" 
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
      >
        Upload
      </button>
      {textContent && (
        <div className="mt-4 p-4 border border-gray-300 rounded w-full max-w-2xl bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Uploaded Content:</h3>
          <p className="whitespace-pre-wrap break-words">{textContent}</p>
        </div>
      )}
    </form>
  );
};

export default UploadForm;
