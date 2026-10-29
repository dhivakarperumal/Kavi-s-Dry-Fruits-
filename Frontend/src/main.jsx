import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Helmet, HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./index.css";
import { StoreProvider } from "./Context/StoreContext.jsx";
import PrivateRouter from "./PrivateRouter/PrivateRouter.jsx";
import { AuthProvider } from "./PrivateRouter/AuthContext.jsx";
import ErrorPage from "./Component/ErrorPage.jsx";
import { Toaster } from "react-hot-toast";
import { AdminNotificationProvider } from "./Context/AdminNotificationProvider.jsx";
import NoIndex from "./Component/NoIndex.jsx";
import LoadingPage from "./Component/LoadingPage.jsx";

const Home = lazy(() => import("./Home/Home.jsx"));
const Shop = lazy(() => import("./Shop/Shop.jsx"));
const SingleProductView = lazy(() => import("./Shop/SingleProductView.jsx"));
const Login = lazy(() => import("./Auth/Login.jsx"));
const Register = lazy(() => import("./Auth/Register.jsx"));
const AddToCart = lazy(() => import("./Shop/AddToCart.jsx"));
const AddToFav = lazy(() => import("./Shop/AddToFav.jsx"));
const Checkout = lazy(() => import("./Shop/Checkout.jsx"));
const Orders = lazy(() => import("./Shop/Orders.jsx"));
const Account = lazy(() => import("./MyAccount/Account.jsx"));
const Categorys = lazy(() => import("./Categorys/Categorys.jsx"));
const Contac_Us = lazy(() => import("./Contact Us/Contac_Us.jsx"));
const About_Us = lazy(() => import("./About Us/About_Us.jsx"));
const Return_Policy = lazy(() => import("./Return Policy/Return_Policy.jsx"));
const Privacy_Policy = lazy(() => import("./Privacy Policy/Privacy_Policy.jsx"));
const Combos = lazy(() => import("./Combos/Combos.jsx"));
const Offers = lazy(() => import("./Offers/Offers.jsx"));
const SingleComboProduct = lazy(() => import("./Combos/SingleComboProduct.jsx"));
const OrderTracking = lazy(() => import("./Shop/OrderTracking.jsx"));
const HealthBenefits = lazy(() => import("./Health Benefits/HealthBenefits.jsx"));
const Adminpanel = lazy(() => import("./Admin/AdminPanel.jsx"));
const ViewInvoice = lazy(() => import("./Admin/ViewInvoice.jsx"));
const OrderDetail = lazy(() => import("./Admin/Orders/OrdersDetails.jsx"));
const withLoading = (Page) => (
  <Suspense fallback={<LoadingPage />}>
    <Page />
  </Suspense>
);

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ||
  "300098164569-qkmatesg46cpagaigi8ismitdlph1eao.apps.googleusercontent.com";

if ("serviceWorker" in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    }).catch((error) => {
      console.warn("Unable to unregister the development service worker:", error);
    });
  } else {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  }
}

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: withLoading(Home) },
      { path: "/shop", element: withLoading(Shop) },
      { path: "/shop/:id", element: withLoading(SingleProductView) },
      { path: "/category/:categoryName", element: withLoading(Categorys) },
      { path: "/contactus", element: withLoading(Contac_Us) },
      { path: "/aboutus", element: withLoading(About_Us) },
      { path: "/healthbenefits", element: withLoading(HealthBenefits) },
      { path: "/return-policy", element: withLoading(Return_Policy) },
      { path: "/privacy-policy", element: withLoading(Privacy_Policy) },
      { path: "/combos", element: withLoading(Combos) },
      { path: "/combos/:id", element: withLoading(SingleComboProduct) },
      { path: "/offers", element: withLoading(Offers) },
      { path: "orders/:uid/:orderId", element: withLoading(OrderDetail) },

      {
        path: "/account",
        element: (
          <PrivateRouter>
            {withLoading(Account)}
          </PrivateRouter>
        ),
      },
      {
        path: "/addtocart",
        element: (
          <PrivateRouter>
            {withLoading(AddToCart)}
          </PrivateRouter>
        ),
      },
      {
        path: "/addtofav",
        element: (
          <PrivateRouter>
            {withLoading(AddToFav)}
          </PrivateRouter>
        ),
      },
      {
        path: "/checkout",
        element: (
          <PrivateRouter>
            {withLoading(Checkout)}
          </PrivateRouter>
        ),
      },
      {
        path: "/orders",
        element: (
          <PrivateRouter>
            {withLoading(Orders)}
          </PrivateRouter>
        ),
      },
      {
        path: "/tracking/:orderId",
        element: (
          <PrivateRouter>
            {withLoading(OrderTracking)}
          </PrivateRouter>
        ),
      },
    ],
  },

  {
    path: "/adminpanel/*",
    element: (
      <NoIndex>
        <PrivateRouter allowedRoles={["admin"]}>
          {withLoading(Adminpanel)}
        </PrivateRouter>
      </NoIndex>
    )
  },

  
  {
    path: "/admin/invoice",
    element: (
      <NoIndex>
        <PrivateRouter allowedRoles={["admin"]}>
          {withLoading(ViewInvoice)}
        </PrivateRouter>
      </NoIndex>
    )
  },

  {
    path: "/login",
    element: (
      <GoogleOAuthProvider clientId={googleClientId}>
        <NoIndex>{withLoading(Login)}</NoIndex>
      </GoogleOAuthProvider>
    ),
  },
  { path: "/register", element: <NoIndex>{withLoading(Register)}</NoIndex> },
  // { path: "/admin/invoice", element: <ViewInvoice /> },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // Google Identity Services is global and StrictMode replays its initialization effect in development.
  <HelmetProvider>
    <AuthProvider>
      <StoreProvider>
        <AdminNotificationProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "10px",
                fontSize: "14px",
              },
              duration: 2000,
            }}
          />
        </AdminNotificationProvider>
      </StoreProvider>
    </AuthProvider>
  </HelmetProvider>
);
