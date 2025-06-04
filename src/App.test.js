import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the heavy CombinedFilter component to avoid axios dependency during tests
jest.mock('./CombineFilterComponent', () => () => <div data-testid="mock-combined-filter" />);

import App from './App';

test("renders What's in my Wardrobe heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/what's in my wardrobe/i);
  expect(headingElement).toBeInTheDocument();
});
