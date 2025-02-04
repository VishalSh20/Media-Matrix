'use client'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { baseApi } from '../../../axios.config';
import { useRouter } from 'next/navigation';
import { 
  FolderOpen, 
  Edit3, 
  Trash2, 
  X, 
  ExternalLink,
  VideoIcon, 
  XIcon,
  Loader,
  InfoIcon,
  Download
} from 'lucide-react'
import PropertiesModal from './FileProperties.jsx';
import DeleteConfirmationModal from './DeleteConfirmationModal.jsx';
import {toast, Toaster } from 'react-hot-toast';

VideoViewerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  videoPrompt: PropTypes.object.isRequired
};

export default function VideoViewerModal({ isOpen, onClose, videoPrompt }) {
    const router = useRouter();
    const [name, setName] = useState(videoPrompt.name);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const {user} = useUser();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showProperties, setShowProperties] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSave = () => {
        setIsEditing(false);
        setIsSaving(true);
        const updationData = {
          userId: user?.id,
          fileKey: videoPrompt.Key,
          updates: {name: name}
        }
        
        baseApi.put('/api/file', updationData)
        .then((res) => {
            toast.success("Filename updated successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch((err) => {
            toast.error("Error updating filename:" + err.message);
            setName(videoPrompt.name)
        })
        .finally(() => {
            setIsSaving(false);
        })
    }

    const handleDelete = () => {
        const deleteUrl = `/api/file?fileKey=${videoPrompt.Key}&userId=${user?.id}`;
        setIsDeleting(true);
        baseApi.delete(deleteUrl)
        .then((res) => {
            toast.success("File deleted successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch((err) => {
            console.log(err);
            toast.error("Error deleting file:" + err.message);
        })
        .finally(() => {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        })
    }

    const handleDownload = async (url, filename) => {
      try {
          const response = await fetch(url);
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
          toast.error("Error downloading file: " + error.message);
      }
    };
  
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog 
                as="div" 
                className="relative z-50 text-black" 
                onClose={onClose}
            >
                {isSaving && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
                        <Loader className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}

                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-[90vw] h-[90vh] transform bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
                                {/* Top Bar */}
                                <div className="h-14 border-b flex items-center justify-between px-4 bg-gray-50">
                                    <div className="flex flex-row gap-4 bg-gray-100">
                                        <VideoIcon className="w-8 h-8 text-blue-300"/>
                                        {
                                        !isEditing
                                        ?
                                        <div className="flex gap-4">
                                            <h1 className="text-lg font-bold text-gray-700">{videoPrompt.name}</h1>
                                            <Edit3 size={18} className="text-gray-700 cursor-pointer" onClick={() => {
                                                setIsEditing(true);
                                                setName(videoPrompt.name);
                                            }}/>
                                        </div>
                                        :
                                        <div className="flex flex-row gap-2">
                                            <input 
                                                type="text" 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)} 
                                                className="text-lg font-bold text-gray-700"
                                            />
                                            <button 
                                                onClick={handleSave} 
                                                className="text-lg font-bold text-gray-700">Save</button>
                                            <XIcon size={18} className="text-gray-700 cursor-pointer" onClick={() => setIsEditing(false)}/>
                                        </div>
                                        }
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                                            title="Show Properties"
                                            onClick={() => setShowProperties(true)}
                                        >
                                            <InfoIcon size={18}/>
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                                            title="Open in folder"
                                            onClick={() => {
                                                router.push(`/workspace/storage/folders?path=${videoPrompt.path.replace(videoPrompt.filename,'')}`);
                                            }}
                                        >
                                            <FolderOpen size={18} />
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                                            title="Open in editor"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                                            title="Download"
                                            onClick={() => handleDownload(videoPrompt.url, videoPrompt.name)}
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete"
                                            onClick={() => setShowDeleteConfirm(true)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Video Container */}
                                <div className="flex-1 min-h-0 p-4 bg-gray-100">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <video
                                            controls
                                            controlsList='nodownload'
                                            disablePictureInPicture
                                            disableRemotePlayback
                                            className="max-h-full max-w-full"
                                            style={{ backgroundColor: 'black' }}
                                        >
                                            <source src={videoPrompt.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
                {showDeleteConfirm && 
                    <DeleteConfirmationModal 
                        showModal={showDeleteConfirm} 
                        setShowModal={setShowDeleteConfirm} 
                        handleDelete={handleDelete} 
                    />
                }
                {showProperties && 
                    <PropertiesModal 
                        showProperties={showProperties} 
                        setShowProperties={setShowProperties} 
                        file={videoPrompt}
                    />
                }
                <Toaster/>
            </Dialog>
        </Transition>
    )
}