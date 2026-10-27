import { Helmet } from "react-helmet-async";

const NoIndex = ({ children }) => (
  <>
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    {children}
  </>
);

export default NoIndex;
