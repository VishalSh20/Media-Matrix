import React, { useState } from 'react';
import { Type, AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const fontFamilies = [
  'Arial', 
  'Helvetica', 
  'Times New Roman', 
  'Courier New', 
  'Verdana', 
  'Georgia', 
  'Palatino', 
  'Garamond', 
  'Bookman', 
  'Comic Sans MS', 
  'Trebuchet MS', 
  'Arial Black',
  // Add Google Fonts from the previous configuration
  'Inter',
  'Roboto', 
  'Open Sans', 
  'Lato', 
  'Montserrat', 
  'Poppins', 
  'Nunito', 
  'Source Sans 3', 
  'Merriweather', 
  'Noto Sans', 
  'Quicksand', 
  'Work Sans', 
  'Raleway', 
  'Ubuntu', 
  'Fira Sans'
];

function RemotionSubtitleControls({ subtitleStyle, setSubtitleStyle }) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Font Size</label>
          <span className="text-sm text-gray-500">{subtitleStyle.fontSize}px</span>
        </div>
        <Slider 
          value={[subtitleStyle.fontSize]}
          onValueChange={(value) => setSubtitleStyle(prev => ({...prev, fontSize: value[0]}))}
          min={16}
          max={48}
          step={1}
        />
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Font Family</label>
        <Select 
          value={subtitleStyle.fontFamily}
          onValueChange={(value) => {
            console.log("Selected font:", value);
            setSubtitleStyle(prev => ({...prev, fontFamily: value}));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>{font}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Color */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Font Color</label>
        <Input 
          type="color" 
          value={subtitleStyle.fontColor}
          onChange={(e) => setSubtitleStyle(prev => ({...prev, fontColor: e.target.value}))}
          className="w-full h-10"
        />
      </div>

      {/* Text Shadow */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Text Shadow</label>
        <Button 
          variant={subtitleStyle.textShadow ? "default" : "outline"}
          size="sm"
          onClick={() => setSubtitleStyle(prev => ({...prev, textShadow: !prev.textShadow}))}
        >
          {subtitleStyle.textShadow ? "On" : "Off"}
        </Button>
      </div>

      {/* Text Positioning */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bottom</label>
          <Input 
            type="number" 
            value={subtitleStyle.bottom}
            onChange={(e) => setSubtitleStyle(prev => ({...prev, bottom: Number(e.target.value)}))}
            min={0}
            max={100}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Left</label>
          <Input 
            type="number" 
            value={subtitleStyle.left}
            onChange={(e) => setSubtitleStyle(prev => ({...prev, left: Number(e.target.value)}))}
            min={0}
            max={100}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Text Align</label>
          <div className="flex space-x-2">
            <Button 
              variant={subtitleStyle.textAlign === 'left' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setSubtitleStyle(prev => ({...prev, textAlign: 'left'}))}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant={subtitleStyle.textAlign === 'center' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setSubtitleStyle(prev => ({...prev, textAlign: 'center'}))}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button 
              variant={subtitleStyle.textAlign === 'right' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setSubtitleStyle(prev => ({...prev, textAlign: 'right'}))}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RemotionSubtitleControls;