import {createBrowserRouter, RouterProvider} from "react-router";
import HomePage from "../pages/Home.tsx";
import ProductsPage from "../pages/Products.tsx";
import RootLayout from "../layouts/RootLayout.tsx";
import DrawPage from "../pages/draw/DrawPage.tsx";

export default function Routes() {
    const router = createBrowserRouter([
        {
            path: '/', element: <RootLayout/>, children: [
                {path: '/', element: <HomePage/>},
                {path: '/products', element: <ProductsPage/>},
                {path: '/draw', element: <DrawPage />}
            ]
        }
    ]);

    return <RouterProvider router={router}/>
}