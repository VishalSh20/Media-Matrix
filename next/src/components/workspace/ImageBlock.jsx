import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useState } from "react";
import ImageViewerModal from "./ImageViewerModal";
import { FullscreenIcon } from "lucide-react";

ImageBlock.propTypes = {
    image:PropTypes.object.isRequired,
    imageId:PropTypes.string.isRequired,
}

export default function ImageBlock({image,showDescription=true}){
    console.log(image);
    const router = useRouter();
    const name = image.name;
    const clippedName = name?.length > 20 ? name.substring(0, 20) + "..." : name;
    const [isOpen,setIsOpen] = useState(false);
    return <div className="flex flex-col p-2 gap-2 rounded-md cursor-pointer">
        <div className="group p-1 rounded-md w-60 h-60 items-center justify-center flex hover:scale-105 transition-all duration-200" style={{
            backgroundImage: `url(${image.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}
        onClick={()=>setIsOpen(true)}
        >
           <FullscreenIcon 
           className="w-8 h-8 text-white hidden group-hover:block"
           />
        </div>
        <div 
        className={"flex flex-col gap-2"}
        hidden={!showDescription}
        >
            <h2 className="text-lg text-white font-bold">{clippedName}</h2>
            <p className="text-xs text-gray-500">{(image?.Size/1000).toFixed(2)} KB</p>
        </div>
        <ImageViewerModal isOpen={isOpen} onClose={()=>setIsOpen(false)} imagePrompt={image}/>
    </div>
}   