import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    generatedImages: [],
    isGenerating: false,
    error: null,
    selectedTheme:"Abstract",
    prompt:""
};

const textImageGenerationSlice = createSlice({
    name: "textImageGeneration",
    initialState,
    reducers: {
        clearImageGenerationState: (state) => {
           state = {...initialState};
        },
        setSelectedTheme: (state, action) => {
            state.selectedTheme = action.payload;
        },
        setPrompt: (state, action) => {
            state.prompt = action.payload;
        },
        generateImagesStart: (state) => {
            state.generatedImages = [];
            state.isGenerating = true;
            state.error = null;
        },
        generateImagesSuccess: (state, action) => {
            state.isGenerating = false;
            state.generatedImages = [...action.payload];
        },
        generateImagesFailure: (state, action) => {
            state.generatedImages = [];
            state.isGenerating = false;
            state.error = action.payload;
        },
    },
});

export const { clearImageGenerationState,generateImagesStart, generateImagesSuccess, generateImagesFailure,setPrompt,setSelectedTheme } = textImageGenerationSlice.actions;
export default textImageGenerationSlice.reducer;