import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    imageData:{
        images:[],
        page:null,
        totalPages:null,
        loading:false,
        error:null
    },
    videoData:{
        videos:[],
        page:null,
        totalPages:null,
        loading:false,
        error:null
    },
    audioData:{
        audios:[],
        page:null,
        totalPages:null,
        loading:false,
        error:null
    },
    overallData:{
        images:[],
        videos:[],
        audios:[],
        loading:false,
        error:null
    }

}

const storageSlice = createSlice({
    name:"storage",
    initialState,
    reducers:{
        // image data related actions
        startFetchingImageData:(state)=>{
            state.imageData = {
                ...state.imageData,
                loading:true,
                error:null
            };
        },
        stopFetchingImageData:(state,action)=>{
            state.imageData = {
                images:action.payload?.images,
                totalPages:action.payload?.totalPages,
                loading:false,
                error:action.payload?.error
            };
        },
        setImagePage:(state,action)=>{
            state.imageData = {...state.imageData,page:action.payload};
        },
        // video data related actions
        startFetchingVideoData:(state)=>{
            state.videoData = {
                ...state.videoData,
                loading:true,
                error:null
            };
        },
        stopFetchingVideoData:(state,action)=>{
            state.videoData = {
                videos:action.payload?.videos,
                totalPages:action.payload?.totalPages,
                loading:false,
                error:action.payload?.error 
                }
        },
        setVideoPage:(state,action)=>{
            state.imageData = {...state.imageData,page:action.payload};
        },
        // audio data related actions
        startFetchingAudioData:(state)=>{
            state.audioData = {
                ...state.audioData,
                loading:true,
                error:null
            };
        },
        stopFetchingAudioData:(state,action)=>{
            state.audioData = {
            audios:action.payload?.audios,
            totalPages:action.payload?.totalPages,
            loading:false,
            error:action.payload?.error
            }
        },
        setAudioPage:(state,action)=>{
            state.audioData = {...state.audioData,page:action.payload};
        }
        ,
        startFetchingOverallData:(state)=>{
            state.overallData = {
                images:[],
                videos:[],
                audios:[],
                loading:true,
                error:null
            }
        },
        stopFetchingOverallData:(state,action)=>{
            state.overallData = {
                images: action.payload?.images,
                videos: action.payload?.videos,
                audios: action.payload?.audios,
                loading:false,
                error:action.payload?.error
            }
        }
    }
});

export default storageSlice.reducer;
export const {
    startFetchingImageData,
    stopFetchingImageData,
    startFetchingVideoData,
    stopFetchingVideoData,
    startFetchingAudioData,
    stopFetchingAudioData,
    startFetchingOverallData,
    stopFetchingOverallData,
    setImagePage,
    setVideoPage,
    setAudioPage
} = storageSlice.actions;