import {createBrowserRouter, RouterProvider} from "react-router";
import HomePage from "../pages/HomePage.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import DrawPage from "../pages/draw/DrawPage.tsx";

export default function Routes() {
    const router = createBrowserRouter([
        {
            path: '/', element: <RootLayout/>, children: [
                {path: '/', element: <HomePage/>},
                {path: '/draw', element: <DrawPage />},
                {path: '/draw/test', element: <DrawPage isTest={true} />} // Assuming you want to handle specific draws
            ]
        }
    ]);

    return <RouterProvider router={router}/>
}