// import { Navigate } from "react-router-dom";
// import { useCookies } from "react-cookie";

const Private = ({ Component, isLoginPage }) => {
    return <Component />;
}

export default Private;

// const [cookies] = useCookies(['authtoken', 'expiry']);
//     const isCookiePresent = cookies.authtoken && cookies.expiry && Date.now() < Date.parse(cookies.expiry);
//     if (!isLoginPage) {
//         return isCookiePresent ? <Navigate to={'/dashboard'} /> : <Component />
//     } else {
//         return isCookiePresent ? <Component /> : <Navigate to={'/login'} />
//     }