"use client"
export default function Page() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <section className="flex flex-col justify-center items-center py-10 text-gray-800 bg-gray-100/80 shadow-md">
        <h1 className="text-5xl font-extrabold text-black tracking-wide">Media-Matrix</h1>
        <span className="text-gray-600 text-xl mt-2">
          Storage, Editing, and AI all at the same place
        </span>
      </section>

      {/* Features Section */}
      <section className="flex flex-wrap justify-center gap-6 px-8 py-12">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xs hover:shadow-lg transition duration-300">
          <h2 className="text-2xl font-semibold text-blue-600">Cheap and Effective Storage</h2>
          <p className="text-gray-700 mt-2">
            Store your data securely with affordable and scalable cloud solutions.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xs hover:shadow-lg transition duration-300">
          <h2 className="text-2xl font-semibold text-green-600">Edit Images and Videos</h2>
          <p className="text-gray-700 mt-2">
            Easily edit your images and videos with powerful built-in tools.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xs hover:shadow-lg transition duration-300">
          <h2 className="text-2xl font-semibold text-purple-600">Transcode, Translate, Transcript</h2>
          <p className="text-gray-700 mt-2">
            Transcode media, add subtitles, and convert content seamlessly.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xs hover:shadow-lg transition duration-300">
          <h2 className="text-2xl font-semibold text-indigo-600">Generate Media with AI</h2>
          <p className="text-gray-700 mt-2">
            Use cutting-edge AI to generate and enhance your media files.
          </p>
        </div>
      </section>
    </div>
  );
}
