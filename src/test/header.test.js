import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { Router } from 'react-router';
import Header from '../components/Header';
import history from '../utils/history';
import App from '../App';
import axios from '../utils/axios';
import createStore from '../store';

jest.mock('../utils/axios');

let store;
beforeEach(() => {
  localStorage.clear();
  store = createStore();
});

afterEach(cleanup);


describe('Header', () => {
    test('Renders the header', () => {
        store = createStore();
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>
        )
        expect(screen.getByAltText(/Logo/i)).toBeInTheDocument();
    })
    test('Sign In and Register button show if the user is not logged in', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>
        )
        expect(localStorage.getItem("token")).toBeFalsy()
        expect(screen.queryByTestId('sign-in-button')).toBeInTheDocument();
        expect(screen.queryByTestId('register-button')).toBeInTheDocument();
    })
    test('Sign in and Register button dont show if the user is logged in', async () => {
        localStorage.setItem("token", "fake token")
        store.dispatch({ type: "GET_USER_DATA", payload: {token: localStorage.getItem('token')}})
        await history.push('/home');
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Header />
                </MemoryRouter>
            </Provider>
        )
        expect(screen.queryByTestId('sign-in-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('register-button')).not.toBeInTheDocument();
    })
    test('Clicking Sign In button redirects to login page', async () => {
        render(
            <Provider store={store}>
                <Router history={history}>
                    <Header />
                </Router>
            </Provider>
        )

        const spy = jest.spyOn(history, 'push')
        await waitFor(() => screen.getByTestId(/sign-in-button/i));
        fireEvent.click(screen.getByTestId(/sign-in-button/i))
        await waitFor(() => expect(spy).toHaveBeenCalledWith("/login"))
        
    })
});