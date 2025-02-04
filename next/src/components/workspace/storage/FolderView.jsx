import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, Folder, Image as ImageIcon,Loader2,AlertCircle, InfoIcon, PencilLine, Trash2, FolderPlus } from 'lucide-react';
import {baseApi} from '../../../../axios.config';
import FolderBlock from '../FolderBlock';
import ImageBlock from '../ImageBlock';
// import VideoBlock from '../VideoBlock'; // TODO: add video block
import { useUser } from '@clerk/nextjs';
import {toast,Toaster} from 'react-hot-toast';
import FileUploader from '../FileUploader';
import FolderPropertiesModal from '../FolderProperties';
import FolderCreateDialog from '../FolderCreateDialog';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import axios from 'axios';
import VideoBlock from '../VideoBlock';

export default function FolderView() {
  const {user} = useUser();
  const [contents, setContents] = useState({folders:[],images:[],videos:[],totalSize:0});
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [showProperties, setShowProperties] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const searchParams = useSearchParams();
  const currentPath = searchParams.get('path') || '/';

  const handleBackClick = () => {
    const secondLastIndex = currentPath.substring(0,currentPath.length-1).lastIndexOf('/');
    const newPath = secondLastIndex === -1 ? '/' : currentPath.substring(0, secondLastIndex + 1);
    window.location.href = `?path=${encodeURIComponent(newPath)}`;
  };

  const handleDelete = () => {
    if(currentPath === '/'){
      toast.error("Cannot delete root folder");
      return;
    } 

    const deleteUrl = `/api/folder?userId=${user?.id}&folderPath=${currentPath}`;
    axios.delete(deleteUrl)
    .then((res)=>{
      toast.success("Folder deleted successfully");
      setInterval(()=>{
        window.location.href = `?path=${encodeURIComponent(currentPath.substring(0, currentPath.substring(0,currentPath.length-1).lastIndexOf("/")+1))}`;
      },1000);
    })
    .catch((error)=>{
      toast.error("Something went wrong while deleting folder-"+(error.response?.data?.message || error.message));
    })
    .finally(()=>{
      setShowDeleteConfirm(false);
    })
  }

  useEffect(() => {
    const fetchContents = () => {  
        setLoading(true);
        setError(null);
      axios.get(`/api/contents?userId=${user?.id}&path=${currentPath}`)
        .then((res)=>{
           const responseData = res.data;
           console.log(responseData);
           setContents(responseData);
        })
        .catch((error)=>{
        const errorMessage = error.response?.data?.message || "Something went wrong while fetching contents- "+error.message;
        setError(errorMessage);
        })
        .finally(()=>{
            setLoading(false);
        })
    };

    if (user?.id) {
      fetchContents();
    }
  }, [currentPath, user?.id]);

  return (
    <div className="w-full bg-gray-900 rounded-lg">
      {/* Path navigation bar */}
      <div className="flex items-center gap-8 p-4 bg-gray-800/50 rounded-t-lg border-b border-gray-700">
        <button
          onClick={handleBackClick}
          className="p-2 hover:bg-gray-700 text-gray-300 bg-gray-800/50 rounded-full transition-colors"
          disabled={currentPath === '/'}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md flex-1 max-w-[60%]">
          {currentPath}
        </div>
        <div className="flex gap-4">
          <button 
            onClick={()=>setShowProperties(true)}
            className="p-2 flex items-center gap-2 hover:bg-gray-700 text-gray-300 bg-gray-800/50 rounded-lg transition-colors"
          >
            <InfoIcon className="w-5 h-5" />
            <p>Properties</p>
          </button>
          <button 
            className="p-2 flex items-center gap-2 hover:bg-red-900/50 text-red-400 bg-red-900/20 rounded-lg transition-colors"
            onClick={()=>setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-5 h-5" />
            <p>Delete</p>
          </button>
        </div>
      </div>

      <div className="flex flex-row-reverse items-center gap-4 p-2">
        <FileUploader accept="image/*,video/*,audio/*" path={currentPath}/>
        <button 
          onClick={()=>setShowCreateFolder(true)}
          disabled={showCreateFolder}
          className="p-2 h-fit flex items-center gap-2 text-gray-300 hover:bg-blue-600 bg-blue-600/20 rounded-lg transition-colors"
        >
          <FolderPlus className="w-5 h-5" />
          <p>Create Folder</p>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/50 m-4 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-8 p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Folders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {contents?.folders?.length > 0 ? (
                contents.folders.map((folder,index) => (
                  <FolderBlock folder={folder} key={index}/>
                ))
              ) : (
                <div className="col-span-full text-center p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400">No folders found</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Images</h2>
            <div className="flex flex-wrap gap-4">
              {contents?.images.length > 0 ? (
                contents.images.map((image,index) => (
                  <ImageBlock image={image} key={index}/>
                ))
              ) : (
                <div className="col-span-full text-center p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400">No images found</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Videos</h2>
            <div className="flex flex-wrap gap-4">
              {contents?.videos.length > 0 ? (
                contents.videos.map((video,index) => (
                  <VideoBlock video={video} key={index}/>
                ))
              ) : (
                <div className="col-span-full text-center p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-400">No videos found</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      <DeleteConfirmationModal showModal={showDeleteConfirm} setShowModal={setShowDeleteConfirm} handleDelete={handleDelete}/>
      <FolderPropertiesModal showProperties={showProperties} setShowProperties={setShowProperties} folder={contents}/>
      <FolderCreateDialog isOpen={showCreateFolder} setIsOpen={setShowCreateFolder} currentPath={currentPath}/>
      <Toaster/>
    </div>
  );
}