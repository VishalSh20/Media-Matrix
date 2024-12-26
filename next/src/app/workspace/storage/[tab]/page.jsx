"use client"
import { useState, useEffect ,use} from 'react';
import { useRouter } from 'next/navigation';
import AllContentBrief from '@/components/workspace/storage/AllContentBrief';
import AllImages from '@/components/workspace/storage/AllImages';
import FolderView from '@/components/workspace/storage/FolderView';
function Page({params}) {
    const tab = use(params).tab;
    const [selectedTab, setSelectedTab] = useState(tab || "all");
    const allTabs = ["all","folders","images","videos","audio"];
    const router = useRouter();

    useEffect(() => {
        setSelectedTab(tab);
    }, [tab]);

    const handleTabChange = (newTab) => {
        setSelectedTab(newTab);
        router.push(`/workspace/storage/${newTab}`);
    };

    return (
        <div className="flex flex-col gap-4 p-8">
            {/* tab selector */}
            <div className="flex gap-4 items-center tab-selector">
                {
                    allTabs.map((tabItem) => (
                        <button 
                            key={tabItem} 
                            className={`${selectedTab === tabItem ? "bg-blue-500 outline-1 outline-purple-500 text-white" : "bg-gray-300 text-gray-800"} px-4 py-2 rounded-md`} 
                            onClick={() => handleTabChange(tabItem)}
                        >
                            {tabItem}
                        </button>
                    ))
                }
            </div>

            {/* content - different components for different tabs */}
            {selectedTab === "all" && <AllContentBrief/>}
            {selectedTab === "images" && <AllImages/>}
            {selectedTab === "folders" && <FolderView/>}
            {selectedTab === "videos" && <div>Videos Component (Coming Soon)</div>}
            {selectedTab === "audio" && <div>Audio Component (Coming Soon)</div>}
        </div>
    )
}

export default Page