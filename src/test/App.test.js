import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import history from '../utils/history';
import createStore from '../store';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';
import axios from '../utils/axios';

jest.mock('../utils/axios.js');

let store;
beforeEach(() => {
  window.scrollTo = jest.fn();
  localStorage.clear();
  store = createStore();
});

describe('General Navigation Test', () => {
  test('renders register component', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        categories: [
          { _id: 1, subject: 'Math' },
          { _id: 2, subject: 'Chemistry' },
          { _id: 3, subject: 'Biology' },
          { _id: 4, subject: 'Physics' },
          { _id: 5, subject: 'Development' },
          { _id: 6, subject: 'Psychology' },
        ],
      },
    });

    history.push('/register');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => screen.getByText('Are you a student or a tutor?'));
  });

  test('renders login component', () => {
    history.push('/login');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
  });

  test('redirects to login if not authenticated', () => {
    history.push('/home');
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
  });
});
