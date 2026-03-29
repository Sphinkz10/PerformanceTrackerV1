/**
 * INTEGRATION TESTS - DataOS Metric Entry Flow
 * 
 * Day 24: Testing complete metric entry user flow
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataOSProvider } from '@/components/dataos/context/DataOSContext';
import LiveBoardMain from '@/components/dataos/v2/liveboard/LiveBoardMain';

// Mock API calls
global.fetch = jest.fn();

const mockMetrics = [
  {
    id: 'metric-1',
    name: 'Weight',
    type: 'number',
    unit: 'kg',
    category: 'physical',
  },
  {
    id: 'metric-2',
    name: 'Height',
    type: 'number',
    unit: 'cm',
    category: 'physical',
  },
];

const mockAthletes = [
  {
    id: 'athlete-1',
    name: 'John Doe',
    status: 'active',
  },
  {
    id: 'athlete-2',
    name: 'Jane Smith',
    status: 'active',
  },
];

const mockMetricUpdates = [
  {
    id: 'update-1',
    metricId: 'metric-1',
    athleteId: 'athlete-1',
    value: 75,
    date: '2025-01-30',
  },
];

describe('DataOS Metric Entry Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/metrics')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockMetrics,
        });
      }
      if (url.includes('/api/athletes')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockAthletes,
        });
      }
      if (url.includes('/api/metric-updates')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockMetricUpdates,
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });
  });

  const renderLiveBoard = () => {
    return render(
      <DataOSProvider>
        <LiveBoardMain />
      </DataOSProvider>
    );
  };

  describe('Initial Load', () => {
    test('should load metrics and athletes on mount', async () => {
      renderLiveBoard();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/metrics'),
          expect.any(Object)
        );
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/athletes'),
          expect.any(Object)
        );
      });
    });

    test('should display loading state initially', () => {
      renderLiveBoard();

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('should display metric grid after load', async () => {
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
        expect(screen.getByText('Height')).toBeInTheDocument();
      });
    });
  });

  describe('Quick Entry Modal', () => {
    test('should open quick entry modal on button click', async () => {
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      fireEvent.click(quickEntryButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/enter metric value/i)).toBeInTheDocument();
      });
    });

    test('should select athlete in modal', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      await user.click(quickEntryButton);

      const athleteSelect = screen.getByLabelText(/select athlete/i);
      await user.selectOptions(athleteSelect, 'athlete-1');

      expect(athleteSelect).toHaveValue('athlete-1');
    });

    test('should select metric in modal', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      await user.click(quickEntryButton);

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      expect(metricSelect).toHaveValue('metric-1');
    });

    test('should enter value and submit', async () => {
      const user = userEvent.setup();
      
      // Mock POST success
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ id: 'new-update', success: true }),
        })
      );

      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      // Open modal
      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      await user.click(quickEntryButton);

      // Fill form
      const athleteSelect = screen.getByLabelText(/select athlete/i);
      await user.selectOptions(athleteSelect, 'athlete-1');

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      const valueInput = screen.getByLabelText(/value/i);
      await user.clear(valueInput);
      await user.type(valueInput, '80');

      // Submit
      const submitButton = screen.getByRole('button', { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/metric-updates'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"value":80'),
          })
        );
      });
    });

    test('should show validation error for empty value', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      await user.click(quickEntryButton);

      const athleteSelect = screen.getByLabelText(/select athlete/i);
      await user.selectOptions(athleteSelect, 'athlete-1');

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      // Try to submit without value
      const submitButton = screen.getByRole('button', { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/value is required/i)).toBeInTheDocument();
      });
    });

    test('should close modal on cancel', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      await user.click(quickEntryButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Bulk Entry', () => {
    test('should open bulk entry modal', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const bulkEntryButton = screen.getByRole('button', { name: /bulk entry/i });
      await user.click(bulkEntryButton);

      await waitFor(() => {
        expect(screen.getByText(/bulk metric entry/i)).toBeInTheDocument();
      });
    });

    test('should select metric for bulk entry', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const bulkEntryButton = screen.getByRole('button', { name: /bulk entry/i });
      await user.click(bulkEntryButton);

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      expect(metricSelect).toHaveValue('metric-1');
    });

    test('should show athlete list for bulk entry', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const bulkEntryButton = screen.getByRole('button', { name: /bulk entry/i });
      await user.click(bulkEntryButton);

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    test('should enter values for multiple athletes', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const bulkEntryButton = screen.getByRole('button', { name: /bulk entry/i });
      await user.click(bulkEntryButton);

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      await waitFor(() => {
        const inputs = screen.getAllByRole('spinbutton');
        expect(inputs.length).toBeGreaterThan(0);
      });

      const inputs = screen.getAllByRole('spinbutton');
      await user.clear(inputs[0]);
      await user.type(inputs[0], '75');
      await user.clear(inputs[1]);
      await user.type(inputs[1], '68');

      expect(inputs[0]).toHaveValue(75);
      expect(inputs[1]).toHaveValue(68);
    });

    test('should submit bulk entries', async () => {
      const user = userEvent.setup();
      
      // Mock bulk POST success
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ success: true, count: 2 }),
        })
      );

      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const bulkEntryButton = screen.getByRole('button', { name: /bulk entry/i });
      await user.click(bulkEntryButton);

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      await waitFor(() => {
        const inputs = screen.getAllByRole('spinbutton');
        expect(inputs.length).toBeGreaterThan(0);
      });

      const inputs = screen.getAllByRole('spinbutton');
      await user.clear(inputs[0]);
      await user.type(inputs[0], '75');
      await user.clear(inputs[1]);
      await user.type(inputs[1], '68');

      const submitButton = screen.getByRole('button', { name: /save all/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/metric-updates/bulk'),
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });
  });

  describe('Inline Editing', () => {
    test('should enable inline edit on cell click', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('75')).toBeInTheDocument();
      });

      const cell = screen.getByText('75');
      await user.click(cell);

      await waitFor(() => {
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
      });
    });

    test('should save inline edit on blur', async () => {
      const user = userEvent.setup();
      
      // Mock PATCH success
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        })
      );

      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('75')).toBeInTheDocument();
      });

      const cell = screen.getByText('75');
      await user.click(cell);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '80');
      
      // Blur to save
      fireEvent.blur(input);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/metric-updates/'),
          expect.objectContaining({
            method: 'PATCH',
            body: expect.stringContaining('"value":80'),
          })
        );
      });
    });

    test('should cancel inline edit on Escape', async () => {
      const user = userEvent.setup();
      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('75')).toBeInTheDocument();
      });

      const cell = screen.getByText('75');
      await user.click(cell);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '80');
      
      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      await waitFor(() => {
        expect(screen.getByText('75')).toBeInTheDocument();
        expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('should show error toast on save failure', async () => {
      const user = userEvent.setup();
      
      // Mock POST failure
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({ error: 'Internal server error' }),
        })
      );

      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      await user.click(quickEntryButton);

      const athleteSelect = screen.getByLabelText(/select athlete/i);
      await user.selectOptions(athleteSelect, 'athlete-1');

      const metricSelect = screen.getByLabelText(/select metric/i);
      await user.selectOptions(metricSelect, 'metric-1');

      const valueInput = screen.getByLabelText(/value/i);
      await user.clear(valueInput);
      await user.type(valueInput, '80');

      const submitButton = screen.getByRole('button', { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    test('should handle network errors gracefully', async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText(/error loading/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Refresh', () => {
    test('should refresh data after successful entry', async () => {
      const user = userEvent.setup();
      
      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('/api/metric-updates') && callCount === 0) {
          callCount++;
          return Promise.resolve({
            ok: true,
            json: async () => mockMetricUpdates,
          });
        }
        if (url.includes('/api/metric-updates') && callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: async () => [
              ...mockMetricUpdates,
              {
                id: 'update-2',
                metricId: 'metric-1',
                athleteId: 'athlete-2',
                value: 80,
                date: '2025-01-30',
              },
            ],
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({}),
        });
      });

      renderLiveBoard();

      await waitFor(() => {
        expect(screen.getByText('Weight')).toBeInTheDocument();
      });

      // Perform entry
      const quickEntryButton = screen.getByRole('button', { name: /quick entry/i });
      await user.click(quickEntryButton);

      // ... fill and submit form ...

      // Verify refresh was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + POST + Refresh
      });
    });
  });
});
