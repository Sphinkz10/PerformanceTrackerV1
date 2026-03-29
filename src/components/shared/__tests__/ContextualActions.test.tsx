/**
 * CONTEXTUAL ACTIONS - TESTS
 * Testes unitários para o componente ContextualActions
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Edit, Trash2, Copy } from 'lucide-react';
import { ContextualActions, Action } from '../ContextualActions';

// Mock do hook useResponsive
jest.mock('@/hooks/useResponsive', () => ({
  useResponsive: jest.fn()
}));

import { useResponsive } from '@/hooks/useResponsive';

describe('ContextualActions', () => {
  const mockActions: Action[] = [
    {
      id: 'edit',
      label: 'Editar',
      icon: Edit,
      onClick: jest.fn(),
      variant: 'primary'
    },
    {
      id: 'duplicate',
      label: 'Duplicar',
      icon: Copy,
      onClick: jest.fn(),
      variant: 'secondary'
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: Trash2,
      onClick: jest.fn(),
      variant: 'danger'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // DESKTOP MODE TESTS
  // ==========================================

  describe('Desktop Mode (Inline Buttons)', () => {
    beforeEach(() => {
      (useResponsive as jest.Mock).mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        breakpoint: 'lg'
      });
    });

    it('should render all actions as inline buttons on desktop', () => {
      render(<ContextualActions actions={mockActions} />);

      expect(screen.getByText('Editar')).toBeInTheDocument();
      expect(screen.getByText('Duplicar')).toBeInTheDocument();
      expect(screen.getByText('Eliminar')).toBeInTheDocument();
    });

    it('should call onClick when button is clicked', () => {
      render(<ContextualActions actions={mockActions} />);

      const editButton = screen.getByText('Editar');
      fireEvent.click(editButton);

      expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    });

    it('should apply correct variant classes', () => {
      render(<ContextualActions actions={mockActions} />);

      const editButton = screen.getByText('Editar').closest('button');
      const deleteButton = screen.getByText('Eliminar').closest('button');

      expect(editButton).toHaveClass('from-sky-500', 'to-sky-600'); // Primary
      expect(deleteButton).toHaveClass('border-red-200', 'text-red-600'); // Danger
    });

    it('should disable buttons when disabled prop is true', () => {
      const disabledActions: Action[] = [
        {
          id: 'disabled',
          label: 'Desabilitado',
          onClick: jest.fn(),
          disabled: true
        }
      ];

      render(<ContextualActions actions={disabledActions} />);

      const button = screen.getByText('Desabilitado').closest('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should hide actions when hidden prop is true', () => {
      const hiddenActions: Action[] = [
        {
          id: 'visible',
          label: 'Visível',
          onClick: jest.fn()
        },
        {
          id: 'hidden',
          label: 'Oculto',
          onClick: jest.fn(),
          hidden: true
        }
      ];

      render(<ContextualActions actions={hiddenActions} />);

      expect(screen.getByText('Visível')).toBeInTheDocument();
      expect(screen.queryByText('Oculto')).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // MOBILE MODE TESTS
  // ==========================================

  describe('Mobile Mode (Dropdown)', () => {
    beforeEach(() => {
      (useResponsive as jest.Mock).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        breakpoint: 'xs'
      });
    });

    it('should render dropdown trigger on mobile', () => {
      render(<ContextualActions actions={mockActions} label="Ações" />);

      const trigger = screen.getByLabelText('Ações');
      expect(trigger).toBeInTheDocument();
    });

    it('should open dropdown when trigger is clicked', async () => {
      render(<ContextualActions actions={mockActions} />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Editar')).toBeVisible();
        expect(screen.getByText('Duplicar')).toBeVisible();
        expect(screen.getByText('Eliminar')).toBeVisible();
      });
    });

    it('should close dropdown when action is clicked', async () => {
      render(<ContextualActions actions={mockActions} />);

      // Open dropdown
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Editar')).toBeVisible();
      });

      // Click action
      const editAction = screen.getByText('Editar');
      fireEvent.click(editAction);

      expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);

      // Dropdown should close (actions should not be visible)
      await waitFor(() => {
        expect(screen.queryByText('Editar')).not.toBeInTheDocument();
      });
    });

    it('should close dropdown when clicking outside', async () => {
      render(
        <div>
          <ContextualActions actions={mockActions} />
          <div data-testid="outside">Outside</div>
        </div>
      );

      // Open dropdown
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Editar')).toBeVisible();
      });

      // Click outside
      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      await waitFor(() => {
        expect(screen.queryByText('Editar')).not.toBeInTheDocument();
      });
    });

    it('should apply correct danger variant in dropdown', async () => {
      render(<ContextualActions actions={mockActions} />);

      // Open dropdown
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        const deleteButton = screen.getByText('Eliminar').closest('button');
        expect(deleteButton).toHaveClass('text-red-600', 'hover:bg-red-50');
      });
    });
  });

  // ==========================================
  // TABLET MODE TESTS
  // ==========================================

  describe('Tablet Mode', () => {
    beforeEach(() => {
      (useResponsive as jest.Mock).mockReturnValue({
        isMobile: false,
        isTablet: true,
        isDesktop: false,
        breakpoint: 'md'
      });
    });

    it('should render as dropdown when mobileThreshold is "tablet"', () => {
      render(<ContextualActions actions={mockActions} mobileThreshold="tablet" />);

      // Should show dropdown trigger, not inline buttons
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByText('Editar')).not.toBeInTheDocument(); // Not visible until opened
    });

    it('should render as inline buttons when mobileThreshold is "desktop"', () => {
      render(<ContextualActions actions={mockActions} mobileThreshold="desktop" />);

      // Should show inline buttons
      expect(screen.getByText('Editar')).toBeInTheDocument();
      expect(screen.getByText('Duplicar')).toBeInTheDocument();
    });
  });

  // ==========================================
  // THRESHOLD TESTS
  // ==========================================

  describe('Mobile Threshold Behavior', () => {
    it('should always show dropdown when threshold is "always"', () => {
      (useResponsive as jest.Mock).mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        breakpoint: 'xl'
      });

      render(<ContextualActions actions={mockActions} mobileThreshold="always" />);

      // Even on desktop, should show dropdown
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ==========================================
  // ALIGNMENT TESTS
  // ==========================================

  describe('Dropdown Alignment', () => {
    beforeEach(() => {
      (useResponsive as jest.Mock).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        breakpoint: 'xs'
      });
    });

    it('should align dropdown to the right by default', async () => {
      render(<ContextualActions actions={mockActions} />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        const dropdown = screen.getByText('Editar').closest('div')?.parentElement;
        expect(dropdown).toHaveClass('right-0');
      });
    });

    it('should align dropdown to the left when specified', async () => {
      render(<ContextualActions actions={mockActions} align="left" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        const dropdown = screen.getByText('Editar').closest('div')?.parentElement;
        expect(dropdown).toHaveClass('left-0');
      });
    });
  });

  // ==========================================
  // ACCESSIBILITY TESTS
  // ==========================================

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      (useResponsive as jest.Mock).mockReturnValue({
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        breakpoint: 'xs'
      });

      render(<ContextualActions actions={mockActions} label="Menu de ações" />);

      const trigger = screen.getByLabelText('Menu de ações');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have disabled state on disabled buttons', () => {
      (useResponsive as jest.Mock).mockReturnValue({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        breakpoint: 'lg'
      });

      const disabledActions: Action[] = [
        {
          id: 'disabled',
          label: 'Desabilitado',
          onClick: jest.fn(),
          disabled: true
        }
      ];

      render(<ContextualActions actions={disabledActions} />);

      const button = screen.getByText('Desabilitado').closest('button');
      expect(button).toBeDisabled();

      // Should not call onClick when disabled
      if (button) {
        fireEvent.click(button);
      }
      expect(disabledActions[0].onClick).not.toHaveBeenCalled();
    });
  });
});
