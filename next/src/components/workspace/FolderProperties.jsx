import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Fragment } from "@headlessui/react";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; 

export default function FolderPropertiesModal({showProperties,setShowProperties,folder}) {
    console.log(folder);
    return (
    <Transition appear show={showProperties} as={Fragment}>
        <Dialog as="div" className="relative z-[70]" onClose={() => setShowProperties(false)} >
            <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/50" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto text-black">
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
                        <DialogPanel className="bg-white rounded-lg p-6 max-w-lg text-wrap w-full">
                            <DialogTitle className="text-lg font-semibold mb-4 flex justify-between items-center">
                                Folder Properties
                                <button
                                    onClick={() => setShowProperties(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={16} />
                                </button>
                            </DialogTitle>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                                                 
                                    <span className="text-gray-500">Path:</span>
                                    <span className="col-span-2 font-medium break-all">{folder?.path}</span>

                                    <span className="text-gray-500">Key:</span>
                                    <span className="col-span-2 font-medium">{folder?.Key}</span>
                                    
                                    <span className="text-gray-500">Total Size:</span>
                                    <span className="col-span-2 font-medium">
                                        {(folder?.totalSize / 1024).toFixed(2)} KB
                                    </span>
                                      
                                    <span>Total Contents:</span>
                                    <span>{folder.folders.length} folders, {folder.images.length} images, {folder.videos.length} videos</span>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </Transition>
    );
}