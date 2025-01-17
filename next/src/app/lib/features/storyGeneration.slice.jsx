import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  storyOptions: {
    description: '',
    tone: '',
    duration: '',
    narrator: '',
    animationTheme: '',
  },
  isGenerating: false,
  error:null
};

const storyGenerationSlice = createSlice({
  name: 'storyGeneration',
  initialState,
  reducers: {
    setStoryOptions: (state, action) => {
      state.storyOptions = {...state.storyOptions,...action.payload};
    },
    startGenerating: (state) => {
      state.isGenerating = true;
      state.error = null;
    },
    stopGenerating: (state,action) => {
      const error  = action.payload?.error;
      state.isGenerating = false;
      if(error){
        state.error = error;
      }
    }
  },
});

export default storyGenerationSlice.reducer;
export const { setStoryOptions, startGenerating, stopGenerating } = storyGenerationSlice.actions;