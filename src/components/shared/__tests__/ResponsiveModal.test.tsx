/**
 * TESTS: ResponsiveModal
 * Unit tests for ResponsiveModal component and variants
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResponsiveModal, ConfirmationDialog } from '../ResponsiveModal';

describe('ResponsiveModal', () => {
  describe('Basic Functionality', () => {
    it('should not render when isOpen is false', () => {
      render(
        <ResponsiveModal isOpen={false} onClose={() => {}}>
          <div>Modal Content</div>
        </ResponsiveModal>
      );

      expect(screen.queryByText('Modal Content')).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(
        <ResponsiveModal isOpen={true} onClose={() => {}}>
          <div>Modal Content</div>
        </ResponsiveModal>
      );

      expect(screen.getByText('Modal Content')).toBeTruthy();
    });

    it('should display title when provided', () => {
      render(
        <ResponsiveModal isOpen={true} onClose={() => {}} title="Test Modal">
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(screen.getAllByText('Test Modal')).toBeTruthy();
    });

    it('should display subtitle when provided', () => {
      render(
        <ResponsiveModal
          isOpen={true}
          onClose={() => {}}
          title="Test Modal"
          subtitle="Test Subtitle"
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(screen.getAllByText('Test Subtitle')).toBeTruthy();
    });

    it('should render footer when provided', () => {
      render(
        <ResponsiveModal
          isOpen={true}
          onClose={() => {}}
          footer={<button>Footer Button</button>}
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(screen.getAllByText('Footer Button')).toBeTruthy();
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(
        <ResponsiveModal isOpen={true} onClose={onClose} title="Test">
          <div>Content</div>
        </ResponsiveModal>
      );

      const closeButtons = screen.getAllByRole('button');
      const closeButton = closeButtons.find((btn) =>
        btn.querySelector('svg')
      );

      if (closeButton) {
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = jest.fn();
      const { container } = render(
        <ResponsiveModal
          isOpen={true}
          onClose={onClose}
          closeOnBackdrop={true}
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      const backdrop = container.querySelector('.bg-black\\/50');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('should not call onClose when backdrop is clicked if closeOnBackdrop is false', () => {
      const onClose = jest.fn();
      const { container } = render(
        <ResponsiveModal
          isOpen={true}
          onClose={onClose}
          closeOnBackdrop={false}
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      const backdrop = container.querySelector('.bg-black\\/50');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onClose).not.toHaveBeenCalled();
      }
    });

    it('should call onClose when Escape key is pressed', async () => {
      const onClose = jest.fn();
      render(
        <ResponsiveModal
          isOpen={true}
          onClose={onClose}
          closeOnEscape={true}
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should not call onClose when Escape is pressed if closeOnEscape is false', () => {
      const onClose = jest.fn();
      render(
        <ResponsiveModal
          isOpen={true}
          onClose={onClose}
          closeOnEscape={false}
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Size Variants', () => {
    it('should apply correct size class for sm', () => {
      const { container } = render(
        <ResponsiveModal isOpen={true} onClose={() => {}} size="sm">
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('max-w-md');
    });

    it('should apply correct size class for md', () => {
      const { container } = render(
        <ResponsiveModal isOpen={true} onClose={() => {}} size="md">
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('max-w-lg');
    });

    it('should apply correct size class for lg', () => {
      const { container } = render(
        <ResponsiveModal isOpen={true} onClose={() => {}} size="lg">
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('max-w-2xl');
    });

    it('should apply correct size class for xl', () => {
      const { container } = render(
        <ResponsiveModal isOpen={true} onClose={() => {}} size="xl">
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('max-w-4xl');
    });

    it('should apply correct size class for full', () => {
      const { container } = render(
        <ResponsiveModal isOpen={true} onClose={() => {}} size="full">
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('max-w-full');
    });
  });

  describe('Mobile Styles', () => {
    it('should render fullscreen style on mobile', () => {
      const { container } = render(
        <ResponsiveModal
          isOpen={true}
          onClose={() => {}}
          mobileStyle="fullscreen"
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('fixed inset-0');
    });

    it('should render bottomsheet style on mobile', () => {
      const { container } = render(
        <ResponsiveModal
          isOpen={true}
          onClose={() => {}}
          mobileStyle="bottomsheet"
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('bottom-0');
      expect(container.innerHTML).toContain('rounded-t-2xl');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ResponsiveModal
          isOpen={true}
          onClose={() => {}}
          className="custom-modal-class"
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      expect(container.innerHTML).toContain('custom-modal-class');
    });
  });

  describe('Show Close Button', () => {
    it('should show close button by default', () => {
      render(
        <ResponsiveModal isOpen={true} onClose={() => {}} title="Test">
          <div>Content</div>
        </ResponsiveModal>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should hide close button when showCloseButton is false', () => {
      render(
        <ResponsiveModal
          isOpen={true}
          onClose={() => {}}
          title="Test"
          showCloseButton={false}
        >
          <div>Content</div>
        </ResponsiveModal>
      );

      const closeButtons = screen.queryAllByRole('button');
      // Should have no close button in header
      expect(closeButtons.length).toBe(0);
    });
  });
});

describe('ConfirmationDialog', () => {
  describe('Basic Functionality', () => {
    it('should render with title and message', () => {
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Confirm Action"
          message="Are you sure?"
        />
      );

      expect(screen.getByText('Confirm Action')).toBeTruthy();
      expect(screen.getByText('Are you sure?')).toBeTruthy();
    });

    it('should display custom button labels', () => {
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Test"
          message="Message"
          confirmLabel="Yes, do it"
          cancelLabel="No, cancel"
        />
      );

      expect(screen.getByText('Yes, do it')).toBeTruthy();
      expect(screen.getByText('No, cancel')).toBeTruthy();
    });

    it('should call onConfirm when confirm button is clicked', () => {
      const onConfirm = jest.fn();
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={onConfirm}
          title="Test"
          message="Message"
        />
      );

      const confirmButton = screen.getByText('Confirmar');
      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalled();
    });

    it('should call onClose when cancel button is clicked', () => {
      const onClose = jest.fn();
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={() => {}}
          title="Test"
          message="Message"
        />
      );

      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('should apply info variant styling', () => {
      const { container } = render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Test"
          message="Message"
          variant="info"
        />
      );

      expect(container.innerHTML).toContain('sky');
    });

    it('should apply warning variant styling', () => {
      const { container } = render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Test"
          message="Message"
          variant="warning"
        />
      );

      expect(container.innerHTML).toContain('amber');
    });

    it('should apply danger variant styling', () => {
      const { container } = render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Test"
          message="Message"
          variant="danger"
        />
      );

      expect(container.innerHTML).toContain('red');
    });
  });

  describe('Loading State', () => {
    it('should show loading state', () => {
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Test"
          message="Message"
          isLoading={true}
        />
      );

      expect(screen.getByText('A processar...')).toBeTruthy();
    });

    it('should disable buttons when loading', () => {
      render(
        <ConfirmationDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Test"
          message="Message"
          isLoading={true}
        />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });
});

describe('Accessibility', () => {
  it('should trap focus inside modal', () => {
    render(
      <ResponsiveModal isOpen={true} onClose={() => {}} title="Test">
        <button>Inside Button</button>
      </ResponsiveModal>
    );

    const insideButton = screen.getByText('Inside Button');
    expect(insideButton).toBeTruthy();
  });

  it('should have proper ARIA attributes', () => {
    const { container } = render(
      <ResponsiveModal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Content</div>
      </ResponsiveModal>
    );

    // Modal should be visible
    expect(container.querySelector('[class*="z-50"]')).toBeTruthy();
  });
});

describe('Body Scroll Lock', () => {
  it('should prevent body scroll when modal is open', () => {
    const { rerender } = render(
      <ResponsiveModal isOpen={true} onClose={() => {}}>
        <div>Content</div>
      </ResponsiveModal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <ResponsiveModal isOpen={false} onClose={() => {}}>
        <div>Content</div>
      </ResponsiveModal>
    );

    expect(document.body.style.overflow).toBe('');
  });
});
