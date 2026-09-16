import { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "/images/Kavi_logo.png";
import { 
  FaHeart, FaUser, FaBars, FaTimes, FaArrowUp, FaBoxOpen, FaHome, FaStore, 
  FaLayerGroup, FaGift, FaTags, FaFileAlt, FaChevronDown, FaLeaf, 
  FaInfoCircle, FaPhoneAlt, FaArrowRight 
} from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { IoCartOutline } from "react-icons/io5";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { useStore } from "../Context/StoreContext";
import Search from "./Search";

const Navbar = () => {
  const { favItems, cartItems, allProducts, allCategories } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const headerRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

    if (storedUser) {
      setUser(storedUser);
      setRole(storedUser.role || "User");
    } else {
      setUser(null);
      setRole("");
    }
  }, []);

  const pagesCardList = [
    {
      title: "Health Benefits",
      path: "/healthbenefits",
      badge: "Wellness",
      description: "Nutritional facts & wellness guides",
      icon: <FaLeaf className="text-emerald-600 text-base" />,
      iconBg: "bg-emerald-50 border border-emerald-100",
      accent: "hover:border-emerald-200 hover:bg-emerald-50/60",
    },
    {
      title: "About Us",
      path: "/aboutus",
      badge: "Story",
      description: "Our heritage & quality promise",
      icon: <FaInfoCircle className="text-amber-600 text-base" />,
      iconBg: "bg-amber-50 border border-amber-100",
      accent: "hover:border-amber-200 hover:bg-amber-50/60",
    },
    {
      title: "Contact Us",
      path: "/contactus",
      badge: "Support",
      description: "Get in touch & customer care",
      icon: <FaPhoneAlt className="text-blue-600 text-base" />,
      iconBg: "bg-blue-50 border border-blue-100",
      accent: "hover:border-blue-200 hover:bg-blue-50/60",
    },
  ];

  const categoryCardList = useMemo(() => {
    const catMap = new Map();

    (allCategories || []).forEach((c) => {
      const name = c.name || c.cname;
      if (!name || name === "Combo") return;
      const slug = name.toLowerCase().replace(/\s+/g, "");

      let img = "";
      if (c.images?.default) {
        img = c.images.default;
      } else if (Array.isArray(c.cimgs) && c.cimgs[0]) {
        img = c.cimgs[0];
      } else if (typeof c.cimgs === "string") {
        try {
          const parsed = JSON.parse(c.cimgs);
          img = Array.isArray(parsed) ? parsed[0] : (parsed.default || "");
        } catch {
          img = "";
        }
      }

      catMap.set(slug, {
        name,
        slug,
        image: img,
        count: 0,
      });
    });

    (allProducts || []).forEach((p) => {
      const catName = p.category;
      if (!catName || catName === "Combo") return;
      const slug = catName.toLowerCase().replace(/\s+/g, "");

      if (!catMap.has(slug)) {
        catMap.set(slug, {
          name: catName,
          slug,
          image: p.image || p.imageUrl || (Array.isArray(p.images) ? p.images[0] : "") || "",
          count: 1,
        });
      } else {
        const item = catMap.get(slug);
        item.count = (item.count || 0) + 1;
        if (!item.image) {
          item.image = p.image || p.imageUrl || (Array.isArray(p.images) ? p.images[0] : "") || "";
        }
      }
    });

    return Array.from(catMap.values());
  }, [allCategories, allProducts]);

  const uniqueCategories = [
    ...new Set(allProducts.map((item) => item.category)),
  ];
  const filterCategory = uniqueCategories.filter((item) => item !== "Combo");
  filterCategory.sort((a, b) => a.length - b.length);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close when clicking outside header or dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (userDropdownOpen && userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    if (menuOpen || userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen, userDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUserDropdownOpen(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const pagesItems = ["About Us", "Contact Us", "Health Benefits"];
  const userFirstLetter = user?.email ? user.email.charAt(0).toUpperCase() : "";
  const isMobile = windowWidth < 1024;
  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive ? "text-green-700 font-semibold" : "text-black hover:text-green-600"
    }`;

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[105] bg-black/40 backdrop-blur-[1px] lg:hidden cursor-pointer transition-opacity duration-200"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header
        ref={headerRef}
        className={`sticky top-0 ${menuOpen ? "z-[110] bg-white" : "z-50 bg-white/90"} backdrop-blur-sm border-b border-green-100 shadow-sm`}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="logo" className="w-20" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-base font-medium text-black">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>

            {/* Category Dropdown (Cards Design) */}
            <div
              className="relative"
              onMouseEnter={() => !isMobile && setCategoryOpen(true)}
              onMouseLeave={() => !isMobile && setCategoryOpen(false)}
            >
              <button 
                onClick={() => isMobile && setCategoryOpen(!categoryOpen)} 
                className={`flex items-center gap-1.5 py-2 font-medium transition-colors duration-200 cursor-pointer ${
                  categoryOpen || location.pathname.startsWith("/category")
                    ? "text-green-700 font-semibold"
                    : "text-black hover:text-green-600"
                }`}
              >
                <span>Category</span>
                <FaChevronDown className={`text-[10px] transition-transform duration-200 ${categoryOpen ? "rotate-180 text-green-700" : "text-gray-400"}`} />
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[450px] animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-4 ring-1 ring-black/5">
                    <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-gray-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Categories</span>
                      <Link 
                        to="/shop" 
                        onClick={() => setCategoryOpen(false)}
                        className="text-xs font-bold text-green-700 hover:text-green-800 hover:underline flex items-center gap-1"
                      >
                        All Products <FaArrowRight size={9} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                      {categoryCardList.map((cat, idx) => (
                        <Link
                          key={idx}
                          to={`/category/${cat.slug}`}
                          onClick={() => setCategoryOpen(false)}
                          className="group flex items-center gap-3 p-2.5 rounded-2xl border border-slate-100 hover:border-green-300 bg-slate-50/50 hover:bg-green-50/60 transition-all duration-200 shadow-xs hover:shadow-md"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-100 shadow-xs flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                            ) : (
                              <FaLayerGroup className="text-green-600 text-lg" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-800 group-hover:text-green-700 truncate transition-colors">
                              {cat.name}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 group-hover:text-green-600 flex items-center gap-1 mt-0.5 transition-colors">
                              {cat.count ? `${cat.count} Products` : "Explore"}
                              <FaArrowRight size={8} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between px-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        100% Farm Fresh & Natural
                      </span>
                      <Link to="/combos" onClick={() => setCategoryOpen(false)} className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                        Combos <FaArrowRight size={8} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/combos" className={navLinkClass}>Combos</NavLink>
            <NavLink to="/offers" className={navLinkClass}>Offers</NavLink>

            {/* Pages Dropdown (Cards Design: Health Benefits first, About Us next, Contact Us then) */}
            <div
              className="relative"
              onMouseEnter={() => !isMobile && setPagesOpen(true)}
              onMouseLeave={() => !isMobile && setPagesOpen(false)}
            >
              <button 
                onClick={() => isMobile && setPagesOpen(!pagesOpen)} 
                className={`flex items-center gap-1.5 py-2 font-medium transition-colors duration-200 cursor-pointer ${
                  pagesOpen || ["/healthbenefits", "/aboutus", "/contactus"].includes(location.pathname)
                    ? "text-green-700 font-semibold"
                    : "text-black hover:text-green-600"
                }`}
              >
                <span>Pages</span>
                <FaChevronDown className={`text-[10px] transition-transform duration-200 ${pagesOpen ? "rotate-180 text-green-700" : "text-gray-400"}`} />
              </button>

              {pagesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-80 animate-in fade-in zoom-in-95 duration-200">
                  <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-2.5 ring-1 ring-black/5">
                    <div className="flex items-center justify-between px-3 py-1.5 mb-1 border-b border-gray-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company & Resources</span>
                    </div>

                    <div className="space-y-1.5">
                      {pagesCardList.map((page, idx) => (
                        <Link
                          key={idx}
                          to={page.path}
                          onClick={() => setPagesOpen(false)}
                          className={`group flex items-center gap-3.5 p-2.5 rounded-2xl border border-slate-100/80 bg-slate-50/40 ${page.accent} transition-all duration-200 hover:shadow-sm`}
                        >
                          <div className={`w-11 h-11 rounded-2xl ${page.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                            {page.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                                {page.title}
                              </span>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                                {page.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                              {page.description}
                            </p>
                          </div>
                          <FaArrowRight size={10} className="text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Icons & User */}
          <div className="flex items-center space-x-4 relative">
            <div className="hidden sm:flex items-center border-2 border-green2 rounded-md shadow-sm">
              <Search />
            </div>

            <Link to="/addtofav" onClick={() => setMenuOpen(false)} className="relative border border-green1 rounded-full p-2 text-green-700 hover:bg-primary hover:text-white">
              <FaHeart size={18} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {favItems?.length || 0}
              </span>
            </Link>

            <Link to="/addtocart" onClick={() => setMenuOpen(false)} className="relative border border-green1 rounded-full p-2 text-primary hover:bg-primary hover:text-white">
              <IoCartOutline size={18} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems?.length || 0}
              </span>
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setMenuOpen(false);
                }}
                className="border border-green1 rounded-full p-2 text-white bg-primary font-bold hover:bg-primary hover:text-white w-8 h-8 flex items-center justify-center text-lg uppercase cursor-pointer"
              >
                {user ? userFirstLetter : <FaUser size={18} />}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-50 bg-white shadow rounded-md text-sm text-center py-2 z-50">
                  {user ? (
                    <>
                      <Link to="/account" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-3 font-bold hover:text-green-600">
                        <CgProfile size={15} /> My Account
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          navigate("/account", { state: { goToOrders: true } });
                        }}
                        className="flex items-center gap-2 w-full px-4 py-3 font-bold hover:text-green-600 cursor-pointer"
                      >
                        <FaBoxOpen  size={15} /> My Orders
                      </button>
                      {role === "admin" && (
                        <Link to="/adminpanel" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2 px-4 py-3 font-bold hover:text-green-600">
                          <RiAdminLine  size={15} /> Admin Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 font-bold text-red-600 cursor-pointer">
                        <FiLogOut /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setUserDropdownOpen(false)} className="flex items-center justify-center gap-2 px-4 py-1 hover:text-green-600">
                      <FiLogIn /> Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setUserDropdownOpen(false);
              }}
              className="text-green-600 text-xl ml-2"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden max-h-[calc(100dvh-6.5rem)] overflow-y-auto overscroll-contain border-t border-green-100 bg-[#f7fbf7] px-4 py-4 shadow-inner">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `col-span-2 flex items-center gap-3 rounded-xl border px-3 py-3 font-semibold transition-all ${isActive ? "border-green-600 bg-green-700 text-white shadow-md" : "border-green-100 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"}`}
            >
              <FaHome className="text-base" /> Home
            </NavLink>
            <NavLink
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `col-span-2 flex items-center gap-3 rounded-xl border px-3 py-3 font-semibold transition-all ${isActive ? "border-green-600 bg-green-700 text-white shadow-md" : "border-green-100 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"}`}
            >
              <FaStore className="text-base" /> Shop
            </NavLink>
            <div className="col-span-2 rounded-xl border border-green-100 bg-white p-3 shadow-sm">
              <button onClick={() => setCategoryOpen(!categoryOpen)} className="flex w-full items-center justify-between font-semibold text-gray-700">
                <span className="flex items-center gap-3"><FaLayerGroup className="text-green-700" /> Category</span>
                <FaChevronDown className={`text-xs text-green-700 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
              </button>
            {categoryOpen && (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-green-100 pt-3">
                {categoryCardList.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-green-100 bg-green-50/40 p-2 text-gray-800 transition-all hover:bg-green-100 hover:text-green-800 shadow-xs"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden border border-green-100">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                      ) : (
                        <FaLayerGroup className="text-green-600 text-xs" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold truncate block">{cat.name}</span>
                      <span className="text-[9px] text-gray-400 font-semibold">{cat.count ? `${cat.count} items` : "Explore"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            </div>
            <NavLink
              to="/combos"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `col-span-2 flex items-center gap-3 rounded-xl border px-3 py-3 font-semibold transition-all ${isActive ? "border-green-600 bg-green-700 text-white shadow-md" : "border-green-100 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"}`}
            >
              <FaGift className="text-base" /> Combos
            </NavLink>
            <NavLink
              to="/offers"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `col-span-2 flex items-center gap-3 rounded-xl border px-3 py-3 font-semibold transition-all ${isActive ? "border-green-600 bg-green-700 text-white shadow-md" : "border-green-100 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50"}`}
            >
              <FaTags className="text-base" /> Offers
            </NavLink>
            <div className="col-span-2 rounded-xl border border-green-100 bg-white p-3 shadow-sm">
              <button onClick={() => setPagesOpen(!pagesOpen)} className="flex w-full items-center justify-between font-semibold text-gray-700">
                <span className="flex items-center gap-3"><FaFileAlt className="text-green-700" /> Pages</span>
                <FaChevronDown className={`text-xs text-green-700 transition-transform ${pagesOpen ? "rotate-180" : ""}`} />
              </button>
            {pagesOpen && (
              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-green-100 pt-3">
                {pagesCardList.map((page, idx) => (
                  <Link
                    key={idx}
                    to={page.path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-green-100 bg-white p-2.5 text-gray-800 transition-all hover:bg-green-50 shadow-xs"
                  >
                    <div className={`w-9 h-9 rounded-xl ${page.iconBg} flex items-center justify-center shrink-0`}>
                      {page.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">{page.title}</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">{page.badge}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{page.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  );
};

export default Navbar;


