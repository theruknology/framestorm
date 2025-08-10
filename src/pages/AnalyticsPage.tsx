import React from "react";

const viralPics = [
  "/example_folder/viralpic1.png",
  "/example_folder/viralpic2.png",
  "/example_folder/viralpic3.png",
  "/example_folder/viralpic4.png",
  "/example_folder/viralpic5.png",
  "/example_folder/viralpic6.png",
];

const tips = [
  "Engage with trending topics and hashtags.",
  "Post consistently and at optimal times.",
  "Use high-quality visuals and catchy captions.",
  "Collaborate with influencers in your niche.",
  "Encourage audience interaction through questions and polls.",
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 drop-shadow-lg">
        Current Trends in Your Business
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {viralPics.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`Viral Example ${idx + 1}`}
            className="rounded-xl shadow-lg object-cover w-64 h-40 border-4 border-white hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-xl w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Tips to Go Viral</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
