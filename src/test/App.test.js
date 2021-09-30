import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import history from '../utils/history';
import createStore from '../store';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../utils/axios.js');

let store;
beforeEach(() => {
  localStorage.clear();
  store = createStore();
});

// technical debt
// test('renders register component', () => {
//   history.push('/register');
//   render(
//     <Provider store={store}>
//       <MemoryRouter>
//         <App />
//       </MemoryRouter>
//     </Provider>,
//   );
//   expect(screen.getByTestId('register-title')).toBeInTheDocument();
// });

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
