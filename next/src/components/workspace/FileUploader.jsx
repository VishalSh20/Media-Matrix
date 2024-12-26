import { Upload, X , Loader2} from 'lucide-react';
import { useState, useRef } from 'react';
import { Toaster,toast } from 'react-hot-toast';
import {useUser} from "@clerk/nextjs";
import {baseApi} from "../../../axios.config.js"
import PropTypes from "prop-types";

FileUploader.propTypes = {
    accept: PropTypes.string.isRequired,
    path: PropTypes.string,
    disabledByParent: PropTypes.bool
}

function FileUploader({ accept, path="/",disabledByParent}) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);
    const {user} = useUser();

    const handleChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const upload = () => {
            setUploading(true);
            const filename = file.name.substring(0, file.name.indexOf("."));
            const {type} = file;

            const requestURL = `${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/media/?&userId=${user?.id}&folderPath=${path}&filename=${filename}&type=${type}`;

            baseApi
                .post(requestURL)
                .then((response) => {
                    const postingURL = response.data?.url;
                    if(!postingURL) {
                        throw new Error("response url not present");
                    }
                    
                    console.log(postingURL);
                    baseApi
                        .put(postingURL, file, {
                            headers: {
                                "Content-Type": type
                            }
                        })
                        .then(() => {
                            toast.success("File uploaded Successfully!", {
                                position: "top-center"
                            });
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        })
                        .catch((err) => {
                            toast.error(`Error in uploading file: ${err.message || err.statusText}`);
                            setUploading(false);
                        });
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(`Error in uploading file: ${err.message || err.statusText}`);
                })
                .finally(()=>{
                    setUploading(false);
                    inputRef.current.value = null;
                    setFile(null);
                });
        };
        
        upload();
    };

    const handleRemove = () => {
        inputRef.current.value = null;
        setFile(null);
    }

    const handleClick = () => {
        inputRef.current.click();
    }

  return (
    <div className='flex flex-col items-center justify-center p-4 text-gray-800'>
        <input 
        type="file" 
        accept={accept} 
        onChange={handleChange} 
        className="hidden" 
        ref={inputRef} 
        disabled={uploading || file || disabledByParent}
        />
    <div 
    className="flex items-center justify-center w-full h-full bg-blue-400 hover:text-blue-700 rounded-lg cursor-pointer p-2"
    onClick={handleClick}
    >
      {
     !uploading && !file && <p>Upload Files</p>
      }
      {
        !uploading && file && 
        <div className="flex flex-row gap-2">
        <div className='flex flex-col items-center justify-center'>
          <p>{file.name}</p>
          <p>{file.size} bytes</p>
        </div>
        <button 
        className="bg-green-400 p-2 rounded-md"
        onClick={handleUpload}
        >
            <Upload className="w-5 h-5 " />
        </button>
        <button 
        className="bg-red-400 p-2 rounded-md"
        onClick={handleRemove}
        >
            <X className="w-5 h-5" />
        </button>
        </div>
      }
      {
        uploading && <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
      }
    </div>
    <Toaster />
    </div>
  )
}

export default FileUploader