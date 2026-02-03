import { createBrowserRouter } from 'react-router-dom';
import BrandTestPage from '../pages/BrandTestPage';
import CareerFitPage from '../pages/CareerFitPage';
import CareerFitProPage from '../pages/CareerFitProPage';
import HomePage from '../pages/HomePage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/brand-test',
        element: <BrandTestPage />,
    },
    {
        path: '/career-fit',
        element: <CareerFitPage />,
    },
    {
        path: '/career-fit-pro',
        element: <CareerFitProPage />,
    },
]);
