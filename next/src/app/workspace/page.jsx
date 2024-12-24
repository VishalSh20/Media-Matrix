export default function WorkspacePage() {
  return (
    <div className="p-6 space-y-8">
      {/* Hero Banner */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <div className="absolute inset-0">
          <img
            src="/modern-room.jpg"
            alt="Modern room interior"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 p-12 text-white">
          <h1 className="text-6xl font-bold mb-4">Introducing Flux Dev</h1>
          <p className="text-2xl">Try out the exclusive Text-to-image model — Flux Dev</p>
        </div>
      </div>

      {/* Imagine Studios Section */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Imagine Studios</h2>
        <p className="text-gray-400 mb-6">Create and explore image, video and audio AI powered tools</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mars Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <img
              src="/mars-astronaut.jpg"
              alt="Astronaut on Mars"
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Street Scene Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <img
              src="/street-scene.jpg"
              alt="Street scene with palm trees"
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Furniture Sketch Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <img
              src="/furniture-sketch.jpg"
              alt="Furniture sketch interface"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
