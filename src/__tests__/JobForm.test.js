import { render, screen, fireEvent } from '@testing-library/react';
import JobForm from '../components/JobForm';

describe('JobForm', () => {
  const mockSubmit = jest.fn();
  const mockClose = jest.fn();

  test('submits form with valid data', async () => {
    render(<JobForm onSubmit={mockSubmit} onClose={mockClose} />);
    
    fireEvent.change(screen.getByLabelText(/company/i), { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getByLabelText(/day/i), { target: { value: '2025-08-30' } });
    fireEvent.click(screen.getByLabelText(/ATS Friendly/i));
    fireEvent.click(screen.getByLabelText(/LinkedIn/i));
    fireEvent.click(screen.getByText(/Add/i));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        company: 'Test Corp',
        day: '2025-08-30',
        resumeFormat: ['ATS Friendly'],
        platforms: ['LinkedIn']
      })
    );
  });

  test('shows validation errors', async () => {
    render(<JobForm onSubmit={mockSubmit} onClose={mockClose} />);
    
    fireEvent.click(screen.getByText(/Add/i));
    expect(screen.getByText(/Company is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
  });
});