import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Folder, Loader2, X } from 'lucide-react';
import { baseApi } from '../../../axios.config';
import {useUser} from '@clerk/nextjs';
import {toast,Toaster} from 'react-hot-toast';
import {useState} from 'react';
import axios from 'axios';

export default function FolderCreateModal({ isOpen, setIsOpen, currentPath = "/" }) {
    const {user} = useUser();
    const [folderName, setFolderName] = useState("");
    const [saving, setSaving] = useState(false);
    const handleCreate = (e) => {
        e.preventDefault();
        setSaving(true);
        axios.post(`/api/folder`,
            {
                userId: user?.id,
                path: currentPath,
                name: folderName
            }
        )
        .then((res) => {
            toast.success("Folder created successfully");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch((err) => {
            toast.error("Failed to create folder");
        })
        .finally(() => {
            setSaving(false);
            setIsOpen(false);
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={()=>{
                setIsOpen(false);
                setFolderName("");
            }}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
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
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                <DialogTitle className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Folder className="w-5 h-5" />
                                        Create New Folder
                                    </div>
                                    <button
                                        onClick={()=>{
                                            setIsOpen(false);
                                            setFolderName("");
                                        }}
                                        className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </DialogTitle>

                                <form onSubmit={handleCreate} className="mt-4 space-y-4">
                                    {/* Current Path (readonly) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={currentPath}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-500/10 text-gray-800"
                                        />
                                    </div>

                                    {/* Folder Name Input */}
                                    <div>
                                        <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Folder Name
                                        </label>
                                        <input
                                            type="text"
                                            id="folderName"
                                            name="folderName"
                                            value={folderName}
                                            onChange={(e)=>{
                                                console.log(e.target.value);
                                                setFolderName(e.target.value);
                                            }}
                                            required
                                            className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter folder name"
                                            autoComplete="off"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={()=>{
                                                setIsOpen(false);
                                                setFolderName("");
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            disabled={saving}
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
            <Toaster />
        </Transition>
    );
}
