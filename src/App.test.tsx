import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders King Chan Family Tree', () => {
  render(<App />);
  const linkElement = screen.getByText(/King Chan Family Tree/i);
  expect(linkElement).toBeInTheDocument();
});
