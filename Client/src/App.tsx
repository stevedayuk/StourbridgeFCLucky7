import {Provider} from 'react-redux';
import Routes from "./routing/Routes.tsx";
import {store} from "./store/store.ts";

function App() {
    return (
        <Provider store={store}>
            <Routes />
        </Provider>
    )
}

export default App
