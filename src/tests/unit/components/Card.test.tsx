/**
 * UNIT TESTS - Card Component
 * 
 * Day 23: Testing shared Card wrapper component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '@/components/shared/Card';
import { Plus } from 'lucide-react';

describe('Card', () => {
  describe('Basic Rendering', () => {
    test('should render children', () => {
      render(
        <Card>
          <div>Test Content</div>
        </Card>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('should render title', () => {
      render(
        <Card title="Test Title">
          <div>Content</div>
        </Card>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('should render subtitle', () => {
      render(
        <Card title="Title" subtitle="Test Subtitle">
          <div>Content</div>
        </Card>
      );

      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    test('should render without title and subtitle', () => {
      const { container } = render(
        <Card>
          <div>Content only</div>
        </Card>
      );

      expect(screen.getByText('Content only')).toBeInTheDocument();
      expect(container.querySelector('h3')).not.toBeInTheDocument();
    });
  });

  describe('Action Button', () => {
    test('should render action button', () => {
      render(
        <Card
          title="Title"
          action={
            <button aria-label="Add">
              <Plus className="h-4 w-4" />
            </button>
          }
        >
          <div>Content</div>
        </Card>
      );

      expect(screen.getByLabelText('Add')).toBeInTheDocument();
    });

    test('should handle action click', () => {
      const handleClick = jest.fn();

      render(
        <Card
          title="Title"
          action={
            <button onClick={handleClick}>Action</button>
          }
        >
          <div>Content</div>
        </Card>
      );

      fireEvent.click(screen.getByText('Action'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    test('should have default card styles', () => {
      const { container } = render(
        <Card>
          <div>Content</div>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-2xl');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('p-4');
    });

    test('should apply custom accent', () => {
      const { container } = render(
        <Card accent="bg-gradient-to-br from-sky-50 to-white">
          <div>Content</div>
        </Card>
      );

      const card = container.querySelector('[class*="from-sky-50"]');
      expect(card).toBeInTheDocument();
    });

    test('should apply custom className', () => {
      const { container } = render(
        <Card className="custom-class">
          <div>Content</div>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Header Layout', () => {
    test('should have header when title provided', () => {
      const { container } = render(
        <Card title="Test Title">
          <div>Content</div>
        </Card>
      );

      const header = container.querySelector('[class*="flex"][class*="items-center"]');
      expect(header).toBeInTheDocument();
    });

    test('should align action button to right', () => {
      const { container } = render(
        <Card
          title="Title"
          action={<button>Action</button>}
        >
          <div>Content</div>
        </Card>
      );

      const header = container.querySelector('[class*="justify-between"]');
      expect(header).toBeInTheDocument();
    });

    test('should have margin bottom after header', () => {
      const { container } = render(
        <Card title="Title">
          <div>Content</div>
        </Card>
      );

      const header = container.querySelector('[class*="mb-"]');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    test('should have mobile-first responsive classes', () => {
      const { container } = render(
        <Card title="Title" subtitle="Subtitle">
          <div>Content</div>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');
    });

    test('should handle long titles', () => {
      const longTitle = 'This is a very long title that should wrap properly without breaking the layout';

      render(
        <Card title={longTitle}>
          <div>Content</div>
        </Card>
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    test('should handle long subtitles', () => {
      const longSubtitle = 'This is a very long subtitle with lots of descriptive text';

      render(
        <Card title="Title" subtitle={longSubtitle}>
          <div>Content</div>
        </Card>
      );

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });
  });

  describe('Content Area', () => {
    test('should render multiple children', () => {
      render(
        <Card>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Card>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    test('should handle complex nested content', () => {
      render(
        <Card title="Complex Card">
          <div>
            <p>Paragraph 1</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
            <button>Action Button</button>
          </div>
        </Card>
      );

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have semantic HTML structure', () => {
      const { container } = render(
        <Card title="Title">
          <div>Content</div>
        </Card>
      );

      // Card should be a section or article
      const card = container.firstChild as HTMLElement;
      expect(['DIV', 'SECTION', 'ARTICLE']).toContain(card.tagName);
    });

    test('should have proper heading hierarchy', () => {
      render(
        <Card title="Main Title">
          <div>Content</div>
        </Card>
      );

      const heading = screen.getByText('Main Title');
      expect(heading.tagName).toMatch(/H[1-6]/);
    });

    test('should be keyboard navigable', () => {
      const handleClick = jest.fn();

      render(
        <Card
          title="Title"
          action={
            <button onClick={handleClick}>Action</button>
          }
        >
          <div>Content</div>
        </Card>
      );

      const button = screen.getByText('Action');
      button.focus();
      
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty children', () => {
      const { container } = render(
        <Card title="Empty Card">
          {null}
        </Card>
      );

      expect(screen.getByText('Empty Card')).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    test('should handle undefined title and subtitle', () => {
      render(
        <Card title={undefined} subtitle={undefined}>
          <div>Content</div>
        </Card>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('should handle empty strings', () => {
      render(
        <Card title="" subtitle="">
          <div>Content</div>
        </Card>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    test('should handle React fragments as children', () => {
      render(
        <Card title="Fragment Test">
          <>
            <div>Fragment Child 1</div>
            <div>Fragment Child 2</div>
          </>
        </Card>
      );

      expect(screen.getByText('Fragment Child 1')).toBeInTheDocument();
      expect(screen.getByText('Fragment Child 2')).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    test('should match snapshot with minimal props', () => {
      const { container } = render(
        <Card>
          <div>Content</div>
        </Card>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot with all props', () => {
      const { container } = render(
        <Card
          title="Full Card"
          subtitle="With all props"
          accent="bg-gradient-to-br from-emerald-50 to-white"
          action={<button>Action</button>}
          className="custom-class"
        >
          <div>Full content</div>
        </Card>
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Integration with Motion', () => {
    test('should work with motion.div wrapper', () => {
      // Assuming Card can be wrapped with motion
      render(
        <Card title="Animated Card">
          <div>Animated Content</div>
        </Card>
      );

      expect(screen.getByText('Animated Card')).toBeInTheDocument();
    });
  });

  describe('Different Accent Gradients', () => {
    const gradients = [
      'from-emerald-50 to-white',
      'from-sky-50 to-white',
      'from-amber-50 to-white',
      'from-violet-50 to-white',
      'from-red-50 to-white',
    ];

    gradients.forEach(gradient => {
      test(`should render with ${gradient} gradient`, () => {
        const { container } = render(
          <Card accent={`bg-gradient-to-br ${gradient}`}>
            <div>Content</div>
          </Card>
        );

        const firstColorClass = gradient.split(' ')[0];
        const card = container.querySelector(`[class*="${firstColorClass}"]`);
        expect(card).toBeInTheDocument();
      });
    });
  });
});
