import { useRouter } from "next/navigation";
import { FolderIcon } from "lucide-react";

export default function FolderBlock({folder}){
    const router = useRouter();

    return <div className="flex flex-col p-2 rounded-md bg-indigo-400/50 hover:bg-indigo-500/50 hover:scale-105 transition-all duration-200 cursor-pointer" 
    onClick={()=>{
        router.push(`/workspace/storage/folders?path=${folder.path}`);
    }}>
        <div className="p-1 rounded-md w-20 h-20">
            <FolderIcon className="w-full h-full text-blue-500"/>
        </div>
        <div className="flex flex-col gap-1">
            <h1 className="text-sm font-bold">{folder.name}</h1>
            <p className="text-xs text-gray-200">{(folder?.Size/1000).toFixed(2)} KB</p>
        </div>
    </div>
}   