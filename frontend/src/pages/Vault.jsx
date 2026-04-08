import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaCloudUploadAlt, FaVideo, FaImage, FaFileAlt, FaPlay, FaEye } from 'react-icons/fa';

const Vault = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/vault/files');
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching vault files", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/vault/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchFiles();
    } catch (err) {
      alert("Upload failed. Make sure PVC is mounted!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 min-h-screen bg-[#141414]">
      {/* Header with Glassmorphism */}
      <div className="mb-12 relative overflow-hidden p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white tracking-tight mb-2 uppercase">
            Personal <span className="text-red-600">Vault</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl font-light">
            Securely upload and store your images and videos in the cloud. 
            All data is persisted via Azure File Share (PVC). 
          </p>
          
          <div className="mt-8 flex items-center space-x-6">
             <label className="flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl">
               <FaCloudUploadAlt />
               <span>{uploading ? 'UPLOADING...' : 'UPLOAD NEW FILE'}</span>
               <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
             </label>
             <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
               Secured by Puneet Kumar
             </p>
          </div>
        </div>
        
        {/* Abstract background element */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {files.map(file => (
            <div 
              key={file.id} 
              className="group relative bg-[#1f1f1f] rounded-2xl overflow-hidden border border-white/5 hover:border-red-600/50 transition-all hover:-translate-y-2 cursor-pointer shadow-lg"
              onClick={() => file.file_type === 'video' && setSelectedVideo(file)}
            >
              <div className="aspect-video bg-black flex items-center justify-center relative group">
                {file.file_type === 'video' ? (
                  <FaVideo className="text-4xl text-red-600/50 group-hover:text-red-600 transition-colors" />
                ) : file.file_type === 'image' ? (
                  <FaImage className="text-4xl text-blue-600/50 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <FaFileAlt className="text-4xl text-gray-600/50 group-hover:text-gray-400 transition-colors" />
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  {file.file_type === 'video' ? (
                    <FaPlay className="text-white text-3xl" />
                  ) : (
                    <FaEye className="text-white text-3xl" />
                  )}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-white font-bold truncate mb-1">{file.filename}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-xs uppercase tracking-wider">{file.file_type}</p>
                  <p className="text-gray-400 text-xs">{file.file_size} MB</p>
                </div>
              </div>
            </div>
          ))}
          
          {files.length === 0 && (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
                <p className="text-gray-600 text-lg">No files in your vault yet. Start uploading!</p>
             </div>
          )}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-xl">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <button 
              className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur transition-all"
              onClick={() => setSelectedVideo(null)}
            >
              CLOSE
            </button>
            <video 
              controls 
              autoPlay 
              className="w-full h-full"
              src={`/api/vault/view/${selectedVideo.id}`}
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
               <h2 className="text-2xl font-bold text-white">{selectedVideo.filename}</h2>
               <p className="text-gray-400 text-sm">Secure Metadata: ID #{selectedVideo.id} | Size: {selectedVideo.file_size}MB</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-20 text-center">
         <p className="text-gray-700 text-sm font-bold uppercase tracking-[0.3em]">
           Engineered by Puneet Kumar for Precision Cloud Architectures
         </p>
      </div>
    </div>
  );
};

export default Vault;
