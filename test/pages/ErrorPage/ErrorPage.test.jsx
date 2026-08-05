import { screen } from '@testing-library/react';
import ErrorPage from 'src/pages/ErrorPage/ErrorPage.jsx';
import { APP_TITLE } from 'src/shared/lib/constants/app.js';
import { ERROR_MESSAGE } from 'src/pages/ErrorPage/ErrorPage.constants.js';
import { renderWithProviders } from 'test/utils/renderWithProviders.jsx';

const STACK_ONLY_TEXT = 'boom, this text should never reach the screen';

const ThrowingPage = () => {
  throw new Error(STACK_ONLY_TEXT);
};

const routes = [{ path: '/', element: <ThrowingPage />, errorElement: <ErrorPage /> }];

describe('ErrorPage', () => {
  it('shows the generic message and the header, without leaking the error stack', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(null, { routes });

    expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: APP_TITLE })).toBeInTheDocument();
    expect(screen.queryByText(STACK_ONLY_TEXT, { exact: false })).not.toBeInTheDocument();

    consoleError.mockRestore();
  });
});
