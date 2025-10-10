import {createBrowserRouter, RouterProvider} from "react-router";
// import HomePage from "../pages/HomePage.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import DrawPage from "../pages/draw/DrawPage.tsx";
import SignupPage from "../pages/admin/SignupPage.tsx";
import PrivateRoutes from "./PrivateRoutes.tsx";
import LoginPage from "../pages/admin/LoginPage.tsx";
import AdminHomePage from "../pages/admin/AdminHomePage.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import UsersPage from "../pages/admin/UsersPage.tsx";
import ImportUsersPage from "../pages/admin/ImportUsersPage.tsx";
import {HomePageRedirect} from "../pages/HomePageRedirect.tsx";

export default function Routes() {
    const router = createBrowserRouter([
        {
            path: '/', element: <RootLayout/>, children: [
                {path: '/', element: <HomePageRedirect/>},
                {
                    path: '/draw', element: <PrivateRoutes/>, children: [
                        {path: '', element: <DrawPage/>},
                        {path: 'test', element: <DrawPage isTest={true}/>}
                    ]
                },
                {
                    path: '/admin', element: <AdminLayout/>, children: [
                        {
                            path: 'login', element: <LoginPage />,
                        },
                        {
                            path: '', element: <PrivateRoutes/>, children: [
                                {path: '', element: <AdminHomePage />},
                                {path: 'users', element: <UsersPage/>},
                                {path: 'users/import', element: <ImportUsersPage />}
                            ]
                        }
                    ]
                },
                {path: '/admin/sign-up', element: <SignupPage/>}
            ],
        }
    ]);

    return <RouterProvider router={router}/>
}