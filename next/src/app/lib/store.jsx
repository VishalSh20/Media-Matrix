import { configureStore,combineReducers } from '@reduxjs/toolkit'
import textImageGenerationReducer from './features/textImageGeneration.slice'
import storyGenerationReducer from './features/storyGeneration.slice'
import storageReducer from './features/storage.slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        textImageGeneration:textImageGenerationReducer,
        storyGeneration:storyGenerationReducer,
        storage:storageReducer
    }
  })
}