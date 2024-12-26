'use client'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
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
  ImageIcon, 
  XIcon,
  Loader,
  InfoIcon
} from 'lucide-react'
import PropertiesModal from './FileProperties.jsx';
import DeleteConfirmationModal from './DeleteConfirmationModal.jsx';

ImageViewerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imagePrompt: PropTypes.object.isRequired
};

export default function ImageViewerModal({ isOpen, onClose, imagePrompt }) {
    const router = useRouter();
    const [name,setName] = useState(imagePrompt.name);
    const [isEditing,setIsEditing] = useState(false);
    const [isSaving,setIsSaving] = useState(false);
    const {user} = useUser();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showProperties,setShowProperties] = useState(false);
    const [isDeleting,setIsDeleting] = useState(false);

    const handleSave = ()=>{
        setIsEditing(false);
        setIsSaving(true);
        const oldKey = imagePrompt.Key;
        const newKey = imagePrompt.Key.replace(imagePrompt.filename,name+'.'+imagePrompt.extension);
        const saveUrl = `${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/media?userId=${user?.id}&oldKey=${oldKey}&newKey=${newKey}`;
        baseApi.put(saveUrl)
        .then((res)=>{
            console.log(res);
            window.location.reload();
        })
        .catch((err)=>{
            console.log(err);
            setName(imagePrompt.name)
        })
        .finally(()=>{
            setIsSaving(false);
        })
    }

    const handleDelete = ()=>{
        const deleteUrl = `${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/media?key=${imagePrompt.Key}`;
        console.log("Trying to delete");
        setIsDeleting(true);
        baseApi.delete(deleteUrl)
        .then((res)=>{
            console.log(res);
            setTimeout(()=>{
                window.location.reload();
            },1000);
        })
        .catch((err)=>{
            console.log(err);
        })
        .finally(()=>{
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        })
    }

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
              <DialogPanel className="w-[90vw] h-[90vh] transform bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Top Bar */}
                <div className="h-14 border-b flex items-center justify-between px-4 bg-gray-50">
                  <div className="flex flex-row gap-4 bg-gray-100">
                    <ImageIcon className="w-8 h-8 text-blue-300"/>
                    {
                    !isEditing
                    ?
                    <div className="flex gap-4">
                        <h1 className="text-lg font-bold text-gray-700">{imagePrompt.filename}</h1>
                        <Edit3 size={18} className="text-gray-700 cursor-pointer" onClick={()=>{
                            setIsEditing(true);
                            setName(imagePrompt.name);
                        }}/>
                    </div>
                    :
                    <div className="flex flex-row gap-2">
                        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="text-lg font-bold text-gray-700"/>
                        <button 
                        onClick={handleSave} 
                        className="text-lg font-bold text-gray-700">Save</button>
                        <XIcon size={18} className="text-gray-700 cursor-pointer" onClick={()=>setIsEditing(false)}/>
                    </div>
                    }
                    
                  </div>
                  <div className="flex items-center gap-4">
                  <button
                      className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                      title="Open in folder"
                      onClick={()=>{
                        setShowProperties(true);
                      }}
                    >
                      <InfoIcon size={18} />
                      Properties
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                      title="Open in folder"
                      onClick={()=>{
                        router.push(`/workspace/storage/folders?path=${imagePrompt.path.replace(imagePrompt.filename,'')}`);
                      }}
                    >
                      <FolderOpen size={18} />
                      Open in Folder
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-gray-200 rounded-md transition-colors"
                      title="Open in editor"
                    >
                      <ExternalLink size={18} />
                      Open in Editor
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Image Container */}
                <div className="h-[calc(90vh-3.5rem)] w-full overflow-auto p-4">
                  <img
                    src={imagePrompt.url}
                    alt={imagePrompt.name}
                    className="max-w-full h-auto mx-auto"
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
      {showDeleteConfirm && <DeleteConfirmationModal showModal={showDeleteConfirm} setShowModal={setShowDeleteConfirm} handleDelete={handleDelete} />}
      {showProperties && <PropertiesModal showProperties={showProperties} setShowProperties={setShowProperties} file={imagePrompt}/>}
    </Transition>
  )
}