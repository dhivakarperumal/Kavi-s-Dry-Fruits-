import { GoogleLogin } from "@react-oauth/google";

const GoogleSignInButton = ({ onSuccess, onError }) => (
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      theme="outline"
      size="large"
      text="continue_with"
      shape="rectangular"
      logo_alignment="center"
      use_fedcm_for_button
    />
  </div>
);

export default GoogleSignInButton;
