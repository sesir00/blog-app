import { BookOpen, Target, Users } from "lucide-react";

export default function About() {
  const sections = [
    {
      title: "Our Story",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      text: `Founded in 2025, our sports blog started with a passion for bringing fans closer to the action. 
      From breaking news and in-depth match analysis to behind-the-scenes stories, 
      we aim to be your go-to source for everything sports.`,
    },
    {
      title: "Our Mission",
      icon: <Target className="w-6 h-6 text-green-600" />,
      text: `ur mission is to inspire and connect sports enthusiasts worldwide by providing timely, 
      reliable, and engaging sports coverage. 
      Whether you're a casual fan or a die-hard supporter, we’re here to keep you in the game.`,
    },
    {
      title: "The Team",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      text: `We’re a diverse group of developers, designers, and content creators 
      who believe in the power of connection. Every feature we build is for you.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn more about the vision, mission, and people behind this platform.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gray-50">
                  {s.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {s.title}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
