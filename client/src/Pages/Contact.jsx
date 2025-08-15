import { Mail } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaViber } from "react-icons/fa";

export default function Contact() {
  const contacts = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-green-600" size={28} />,
      link: "https://wa.me/9843865766",
      description: "Chat with us instantly on WhatsApp.",
      bg: "from-green-50 to-white",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-pink-500" size={28} />,
      link: "https://www.instagram.com/ballertalks9/",
      description: "Follow us and send a DM.",
      bg: "from-pink-50 to-white",
    },
    {
      name: "Viber",
      icon: <FaViber className="text-purple-500" size={28} />,
      link: "viber://chat?number=%9843865766",
      description: "Reach us directly on Viber.",
      bg: "from-purple-50 to-white",
    },
    {
      name: "Email",
      icon: <Mail className="text-blue-500" size={28} />,
      link: "mailto:ranjan@ballertalks.com",
      description: "Send us an email anytime.",
      bg: "from-blue-50 to-white",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-10 text-lg">
          We're always here to help. Reach out through your favorite platform.
        </p>

        {/* Contact Methods */}
        <div className="grid gap-8 sm:grid-cols-2">
          {contacts.map((c) => (
            <a
              key={c.name}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-gradient-to-br ${c.bg} rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 p-8 flex flex-col items-center text-center border border-gray-100 group`}
            >
              {/* Icon Bubble */}
              <div className="mb-5 p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                {c.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {c.name}
              </h3>
              <p className="text-gray-600 text-sm mt-3">{c.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
