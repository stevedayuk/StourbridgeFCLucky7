import {Link} from "react-router";

export default function HomePage() {
    return <>
        <h1>My Home Page - {import.meta.env.VITE_API_URL}</h1>
        <p>Go to <Link to='/products'>the list of products</Link>.</p>
        </>;
}