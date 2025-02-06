import React, { useState } from 'react';

const FileUpload = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className='space-y-2'>
      <h1 className='text-sm font-medium'>Attachment</h1>
      <div
        className='border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-primary transition-colors'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type='file'
          id='fileInput'
          className='hidden'
          onChange={handleFileChange}
          accept='image/*'
        />
        <label htmlFor='fileInput' className='cursor-pointer'>
          {image ? (
            <img
              src={image}
              alt='Uploaded'
              className='max-w-full max-h-48 mx-auto'
            />
          ) : (
            <div className='space-y-2'>
              <p className='text-gray-600'>
                Drop your files here or{' '}
                <span className='underline text-primary'>click to upload</span>
              </p>
              <p className='text-xs text-gray-500'>
                Supported formats: JPEG, PNG, GIF
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
