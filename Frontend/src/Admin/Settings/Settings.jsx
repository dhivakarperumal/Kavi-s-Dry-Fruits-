import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaStar, FaStore, FaFileInvoiceDollar, FaTicketAlt } from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();

  const settingsCards = [
    {
      title: "Users Management",
      description: "Manage admin and customer accounts, roles, and permissions.",
      icon: <FaUsers size={28} className="text-emerald-500" />,
      path: "/adminpanel/all-users",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      title: "Reviews",
      description: "Monitor and moderate product reviews and testimonials.",
      icon: <FaStar size={28} className="text-amber-500" />,
      path: "/adminpanel/reviews",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      title: "Dealer Management",
      description: "Approve and manage wholesale dealer applications and details.",
      icon: <FaStore size={28} className="text-blue-500" />,
      path: "/adminpanel/dealer",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Invoices",
      description: "View, generate, and process customer billing and invoices.",
      icon: <FaFileInvoiceDollar size={28} className="text-indigo-500" />,
      path: "/adminpanel/invoice",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
    {
      title: "Offers & Coupons",
      description: "Create and manage promotional discount codes and vouchers.",
      icon: <FaTicketAlt size={28} className="text-rose-500" />,
      path: "/adminpanel/coupons",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
    },
  ];

  return (
    <div className="p-6  min-h-[500px]">
     

      <div className="flex flex-col gap-4">
        {settingsCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className={`p-4 md:p-6 rounded-2xl border border-gray-200 ${card.bgColor} cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 group`}
          >
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 border border-gray-200">
              {card.icon}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
            
            <div className="flex-shrink-0 flex items-center">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2 group-hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-black/5">
                Manage <span>→</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
