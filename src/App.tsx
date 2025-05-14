import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sort from './pages/sort/Sort';
import { ThemeProvider, WindowSizeProvider } from "./standard_ui/standard_ui";

import './standard_ui/standard_ui.css';

function App() 
{

    return (
        <ThemeProvider>
        <WindowSizeProvider>

            <Router>
                <Routes>
                    <Route
                        path = { "/" }
                        element = { <Sort /> }
                    />

                    {/* 
                    * Fallback route. 
                    * TODO: make an actual 'Page not found' page. See: https://stackoverflow.com/questions/72527907/how-to-implement-a-standalone-404-page-in-react-router-6-which-is-not-tied-to-an
                    */}
                    <Route path = "*" element = { <Sort /> } />
                </Routes>
            </Router>

        </WindowSizeProvider>
        </ThemeProvider>
    );
}

export default App
