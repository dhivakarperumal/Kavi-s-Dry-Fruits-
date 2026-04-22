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
    <div className="p-4 sm:p-10 bg-slate-50 min-h-screen">
    

      <div className="flex flex-col gap-8">
        {settingsCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className={`group relative overflow-hidden p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer hover:-translate-x-2 transition-all duration-500`}
          >
            {/* Bright Gradient Background on Hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${card.path.includes('users') ? 'from-emerald-500 to-teal-600' : card.path.includes('reviews') ? 'from-amber-400 to-orange-500' : card.path.includes('dealer') ? 'from-blue-500 to-indigo-600' : card.path.includes('invoice') ? 'from-indigo-500 to-purple-600' : 'from-rose-500 to-pink-600'}`}></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:bg-white group-hover:shadow-white/20 ${card.bgColor} border border-white/50 backdrop-blur-sm`}>
                {React.cloneElement(card.icon, { 
                  size: 32, 
                  className: `transition-colors duration-500 group-hover:text-slate-900 ${card.icon.props.className}` 
                })}
              </div>
              
              <div className="flex-grow">
                <h3 className="text-2xl font-black text-slate-900 mb-2 transition-colors duration-500 group-hover:text-white tracking-tighter">
                  {card.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed transition-colors duration-500 group-hover:text-white/80 max-w-sm">
                  {card.description}
                </p>
              </div>
              
              <div className="absolute top-8 right-8 transition-transform duration-500 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-xl border border-white/30 shadow-lg">
                  →
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-50 rounded-full group-hover:hidden transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
