/**
 * INTEGRATION TESTS - Calendar Event Creation Flow
 * 
 * Day 24: Testing complete user workflows
 */

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarPage } from '@/components/pages/CalendarPage';

// Mock API
global.fetch = jest.fn();

describe('Calendar Event Creation Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/calendar-events')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ events: [] }),
        });
      }
      if (url.includes('/api/athletes')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ 
            athletes: [
              { id: '1', name: 'John Doe', email: 'john@test.com' },
              { id: '2', name: 'Jane Smith', email: 'jane@test.com' },
            ],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({}),
      });
    });
  });

  describe('Complete Event Creation', () => {
    test('user can create a new event', async () => {
      const user = userEvent.setup();
      
      render(<CalendarPage />);
      
      // Wait for calendar to load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      
      // Click "Create Event" button
      const createButton = screen.getByRole('button', { name: /create event/i });
      await user.click(createButton);
      
      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Fill in event details
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Morning Training');
      
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, 'Team training session');
      
      // Select date
      const dateInput = screen.getByLabelText(/date/i);
      await user.type(dateInput, '2026-02-01');
      
      // Select time
      const timeInput = screen.getByLabelText(/time/i);
      await user.type(timeInput, '09:00');
      
      // Select athletes
      const athleteSelector = screen.getByLabelText(/athletes/i);
      await user.click(athleteSelector);
      
      // Wait for dropdown
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('John Doe'));
      await user.click(screen.getByText('Jane Smith'));
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      // Verify API was called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/calendar-events'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Morning Training'),
          })
        );
      });
      
      // Modal should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      
      // Success message should appear
      expect(screen.getByText(/event created/i)).toBeInTheDocument();
    });
  });

  describe('Event Creation with Recurrence', () => {
    test('user can create recurring event', async () => {
      const user = userEvent.setup();
      
      render(<CalendarPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      
      // Open create modal
      const createButton = screen.getByRole('button', { name: /create event/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      
      // Fill basic details
      await user.type(screen.getByLabelText(/title/i), 'Weekly Training');
      
      // Enable recurrence
      const recurrenceToggle = screen.getByLabelText(/repeat/i);
      await user.click(recurrenceToggle);
      
      // Select recurrence pattern
      const patternSelect = screen.getByLabelText(/pattern/i);
      await user.selectOptions(patternSelect, 'weekly');
      
      // Select days of week
      const mondayCheckbox = screen.getByLabelText(/monday/i);
      const wednesdayCheckbox = screen.getByLabelText(/wednesday/i);
      await user.click(mondayCheckbox);
      await user.click(wednesdayCheckbox);
      
      // Set end date
      const endDateInput = screen.getByLabelText(/end date/i);
      await user.type(endDateInput, '2026-03-01');
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      // Verify recurrence data in API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.stringMatching(/weekly/),
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    test('shows error when required fields are empty', async () => {
      const user = userEvent.setup();
      
      render(<CalendarPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      
      // Open modal
      const createButton = screen.getByRole('button', { name: /create event/i });
      await user.click(createButton);
      
      // Try to submit without filling fields
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      // Error messages should appear
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      });
    });

    test('shows error when API fails', async () => {
      const user = userEvent.setup();
      
      // Mock API failure
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Internal Server Error',
        })
      );
      
      render(<CalendarPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      
      // Fill and submit
      const createButton = screen.getByRole('button', { name: /create event/i });
      await user.click(createButton);
      
      await user.type(screen.getByLabelText(/title/i), 'Test Event');
      
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/error creating event/i)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    test('validates date is not in the past', async () => {
      const user = userEvent.setup();
      
      render(<CalendarPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      
      const createButton = screen.getByRole('button', { name: /create event/i });
      await user.click(createButton);
      
      // Try to set past date
      const dateInput = screen.getByLabelText(/date/i);
      await user.type(dateInput, '2020-01-01');
      
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      // Validation error
      await waitFor(() => {
        expect(screen.getByText(/date cannot be in the past/i)).toBeInTheDocument();
      });
    });

    test('validates end time is after start time', async () => {
      const user = userEvent.setup();
      
      render(<CalendarPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      
      const createButton = screen.getByRole('button', { name: /create event/i });
      await user.click(createButton);
      
      // Set start time
      const startTimeInput = screen.getByLabelText(/start time/i);
      await user.type(startTimeInput, '14:00');
      
      // Set end time before start
      const endTimeInput = screen.getByLabelText(/end time/i);
      await user.type(endTimeInput, '13:00');
      
      const submitButton = screen.getByRole('button', { name: /create/i });
      await user.click(submitButton);
      
      // Validation error
      await waitFor(() => {
        expect(screen.getByText(/end time must be after start time/i)).toBeInTheDocument();
      });
    });
  });

  describe('Conflict Detection', () => {
    test('warns about conflicts with existing events', async () => {
      const user = userEvent.setup();
      
      // Mock existing events
      (global.fetch as jest.Mock).mockImplementationOnce((url) => {
        if (url.includes('/api/calendar-events')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              events: [
                {
                  id: '1',
                  title: 'Existing Event',
                  start: '2026-02-01T09:00:00',
                  end: '2026-02-01T10:00:00',
                  athletes: ['1'],
                },
              ],
            }),
          });
        }
        return Promise.resolve({ ok: true, json: async () => ({}) });
      });
      
      render(<CalendarPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
      
      const createButton = screen.getByRole('button', { name: /create event/i });
      await user.click(createButton);
      
      // Create event with same time/athlete
      await user.type(screen.getByLabelText(/title/i), 'New Event');
      await user.type(screen.getByLabelText(/date/i), '2026-02-01');
      await user.type(screen.getByLabelText(/time/i), '09:00');
      
      // Select same athlete
      const athleteSelector = screen.getByLabelText(/athletes/i);
      await user.click(athleteSelector);
      await user.click(screen.getByText('John Doe')); // ID: 1
      
      // Warning should appear
      await waitFor(() => {
        expect(screen.getByText(/conflict detected/i)).toBeInTheDocument();
      });
    });
  });
});
