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

    baseApi.delete(`${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/folder?key=users/${user?.id}${currentPath}`)
    .then((res)=>{
      toast.success("Folder deleted successfully");
      setInterval(()=>{
        window.location.href = `?path=${encodeURIComponent(currentPath.substring(0, currentPath.substring(0,currentPath.length-1).lastIndexOf("/")+1))}`;
      },1000);
    })
    .catch((error)=>{
      toast.error("Something went wrong while deleting folder-"+(error.response.data.message || error.message));
    })
    .finally(()=>{
      setShowDeleteConfirm(false);
    })
  }

  useEffect(() => {
    const fetchContents = () => {  
        setLoading(true);
        setError(null);
       baseApi.get(
          `${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/contents?key=users/${user?.id}${currentPath}`
        )
        .then((res)=>{
            const response = res.data;
            const responseData = response.data;
            console.log(responseData);
            setContents(responseData);
        })
        .catch((error)=>{
        const errorMessage = error.response.data.message || "Something went wrong while fetching contents- "+error.message;
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
    <div className="w-full">
      {/* Path navigation bar */}
      <div className="flex items-center gap-8 p-4 bg-gray-300/10 rounded-t-lg">
        <button
          onClick={handleBackClick}
          className="p-2 hover:bg-gray-200 hover:text-gray-800 bg-gray-200/10 rounded-full"
          disabled={currentPath === '/'}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="px-4 py-2 bg-black/10 text-gray-200 rounded-md flex-1 max-w-[60%]">
          {currentPath}
        </div>
        <div className="flex gap-4">

        <button 
        onClick={()=>setShowProperties(true)}
        className="p-2 flex items-center gap-2 hover:bg-gray-200 hover:text-gray-800 bg-gray-200/10 rounded-lg">
          <InfoIcon className="w-5 h-5" />
          <p>Properties</p>
        </button>
        {/* <button className="p-2 flex items-center gap-2 hover:bg-gray-200 hover:text-gray-800 bg-gray-200/10 rounded-lg">
          <PencilLine className="w-5 h-5" />
          <p>Rename</p>
        </button> */}
        <button 
        className="p-2 flex items-center gap-2 hover:bg-gray-200 hover:text-red-800 bg-red-600/10 rounded-lg"
        onClick={()=>setShowDeleteConfirm(true)}
        >
          <Trash2 className="w-5 h-5" />
          <p>Delete</p>
        </button>
        </div>
      </div>

      <div className="flex flex-row-reverse items-center gap-4">
        <FileUploader accept="image/*,video/*,audio/*" path={currentPath}/>
        <button 
        onClick={()=>setShowCreateFolder(true)}
        disabled={showCreateFolder}
        className="p-2 h-fit flex items-center text-gray-800 hover:text-blue-700 bg-blue-400 rounded-lg">
          <FolderPlus className="w-5 h-5" />
          <p>Create Folder</p>
        </button>
      </div>

      {/* Contents */}
      {loading && <div className="flex justify-center items-center h-full">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>}
      {error && <div className="flex justify-center items-center h-full">
        <AlertCircle className="w-5 h-5" />
        <p className="text-red-500">{error}</p>
      </div>}

      <DeleteConfirmationModal showModal={showDeleteConfirm} setShowModal={setShowDeleteConfirm} handleDelete={handleDelete}/>
      <FolderPropertiesModal showProperties={showProperties} setShowProperties={setShowProperties} folder={contents}/>
      <FolderCreateDialog isOpen={showCreateFolder} setIsOpen={setShowCreateFolder} currentPath={currentPath}/>
      {!loading && !error && <div className="flex flex-col gap-8 m-4">
        {/* folders */}
        <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Folders</h2>
            <div className="flex flex-wrap gap-4">
                {contents.folders.length > 0 ?
                contents.folders.map((folder,index)=>{
                    return <FolderBlock folder={folder} key={index}/>
                })
                :
                <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No folders found</p>
                </div>
                }
            </div>
        </div>
      </div>}

      {/* images */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Images</h2>
        <div className="flex flex-wrap gap-4">
            {contents.images.length > 0 ?
            contents.images.map((image,index)=>{
                return <ImageBlock image={image} key={index}/>
            })
            :
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No images found</p>
            </div>
            }
        </div>
      </div>
      <Toaster/>
    </div>
  );
}
