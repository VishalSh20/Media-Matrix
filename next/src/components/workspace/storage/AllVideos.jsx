import {useState, useEffect} from "react";
import VideoBlock from "../VideoBlock.jsx";
import { VideoIcon, Loader2 } from "lucide-react";
import { api } from "../../../../axios.config.js";
import { useSelector, useDispatch } from "react-redux";
import { startFetchingVideoData, stopFetchingVideoData, setVideoPage } from "@/app/lib/features/storage.slice.jsx";
import FileUploader from "../FileUploader.jsx";
import { useUser } from "@clerk/nextjs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AllVideos() {
    const {user, isLoaded} = useUser();
    const videos = useSelector((state) => state.storage.videoData?.videos);
    const loading = useSelector((state) => state.storage.videoData?.loading);
    const error = useSelector((state) => state.storage.videoData?.error);
    const dataPage = useSelector(((state) => state.storage.videoData?.page));
    const totalPages = useSelector((state) => state.storage.videoData?.totalPages);
    const [page, setPage] = useState(dataPage ? dataPage : 1);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(isLoaded && user?.id && (page !== dataPage)) {
            dispatch(setVideoPage(page));
            dispatch(startFetchingVideoData());
            const videoUrl = `/api/file?userId=${user?.id}&type=video&page=${page}`;
            api.get(videoUrl)
                .then((res) => {
                    const response = res.data;
                    dispatch(stopFetchingVideoData({videos: response.files, totalPages: response.totalPages}));
                })
                .catch((err) => {
                    const errorMessage = err.response.data.message || "An error occurred while fetching videos"+err.message;
                    dispatch(stopFetchingVideoData({error: errorMessage}));
                });
        }
    }, [user, isLoaded, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="flex flex-col gap-4 bg-gray-900 p-6 rounded-lg min-h-screen">
            <div className="flex flex-row justify-between items-center border-b border-gray-700 pb-4">
                <h1 className="text-2xl font-bold text-white">All Videos</h1>
                <FileUploader accept="video/*" path="/"/>
            </div>
            
            {loading && (
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="text-blue-400 w-8 h-8 animate-spin"/>
                </div>
            )}
            
            {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                    <span className="text-sm text-red-400">{error}</span>
                </div>
            )}
            
            {!loading && !error && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row gap-4 items-center bg-gray-800/50 p-3 rounded-lg">
                        <VideoIcon className="w-5 h-5 text-emerald-400"/>
                        <span className="text-sm text-gray-300">Total Videos: {videos.length}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {videos.map((video, index) => (
                            <VideoBlock key={index} video={video}/>
                        ))}
                    </div>
                    
                    {totalPages > 1 && (
                        <Pagination className="mt-6">
                            <PaginationContent className="bg-gray-800 p-2 rounded-lg">
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => handlePageChange(page - 1)}
                                        className={`${page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700'} text-gray-300`}
                                    />
                                </PaginationItem>
                                
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() => handlePageChange(i + 1)}
                                            isActive={page === i + 1}
                                            className={`cursor-pointer ${
                                                page === i + 1 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(page + 1)}
                                        className={`${page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-700'} text-gray-300`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            )}
        </div>
    );
}
