import {createBrowserRouter, RouterProvider} from "react-router";
import HomePage from "../pages/HomePage.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import DrawPage from "../pages/draw/DrawPage.tsx";
import SignupPage from "../pages/admin/SignupPage.tsx";
import PrivateRoutes from "./PrivateRoutes.tsx";
import LoginPage from "../pages/admin/LoginPage.tsx";
import AdminHomePage from "../pages/admin/AdminHomePage.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";

export default function Routes() {
    const router = createBrowserRouter([
        {
            path: '/', element: <RootLayout/>, children: [
                {path: '/', element: <HomePage/>},
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
                                {path: '', element: <AdminHomePage />}
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