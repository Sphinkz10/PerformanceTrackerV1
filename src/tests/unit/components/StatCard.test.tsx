/**
 * UNIT TESTS - StatCard Component
 * 
 * Day 23: Testing shared component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/shared/StatCard';
import { TrendingUp } from 'lucide-react';

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Athletes',
    value: '125',
    icon: TrendingUp,
    gradient: 'from-emerald-50/90 to-white/90' as const,
    iconGradient: 'from-emerald-500 to-emerald-600' as const,
  };

  describe('Rendering', () => {
    test('should render with required props', () => {
      render(<StatCard {...defaultProps} />);
      
      expect(screen.getByText('Total Athletes')).toBeInTheDocument();
      expect(screen.getByText('125')).toBeInTheDocument();
    });

    test('should render icon', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      
      // Icon should be rendered (lucide-react renders as svg)
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    test('should apply correct gradient classes', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      
      const card = container.querySelector('[class*="bg-gradient"]');
      expect(card).toHaveClass('bg-gradient-to-br');
      expect(card).toHaveClass('from-emerald-50/90');
      expect(card).toHaveClass('to-white/90');
    });
  });

  describe('Optional Props', () => {
    test('should render subtitle when provided', () => {
      render(<StatCard {...defaultProps} subtitle="Active this month" />);
      
      expect(screen.getByText('Active this month')).toBeInTheDocument();
    });

    test('should render change indicator when provided', () => {
      render(<StatCard {...defaultProps} change="+12%" changeType="positive" />);
      
      expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    test('should apply positive change styling', () => {
      render(<StatCard {...defaultProps} change="+12%" changeType="positive" />);
      
      const changeElement = screen.getByText('+12%');
      expect(changeElement).toHaveClass('text-emerald-600');
    });

    test('should apply negative change styling', () => {
      render(<StatCard {...defaultProps} change="-5%" changeType="negative" />);
      
      const changeElement = screen.getByText('-5%');
      expect(changeElement).toHaveClass('text-red-600');
    });

    test('should apply neutral change styling', () => {
      render(<StatCard {...defaultProps} change="0%" changeType="neutral" />);
      
      const changeElement = screen.getByText('0%');
      expect(changeElement).toHaveClass('text-slate-600');
    });
  });

  describe('Responsive Behavior', () => {
    test('should have mobile-first padding classes', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('p-4');
    });

    test('should have rounded corners', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('rounded-2xl');
    });

    test('should have border with opacity', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('border-slate-200/80');
    });
  });

  describe('Accessibility', () => {
    test('should have semantic HTML structure', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      
      // Should be a div or article
      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toMatch(/DIV|ARTICLE/);
    });

    test('should have accessible text hierarchy', () => {
      render(<StatCard {...defaultProps} subtitle="Test subtitle" />);
      
      // Title should be visible
      const title = screen.getByText('Total Athletes');
      expect(title).toBeVisible();
      
      // Value should be prominent
      const value = screen.getByText('125');
      expect(value).toBeVisible();
      expect(value).toHaveClass('text-2xl');
    });
  });

  describe('Different Gradient Combinations', () => {
    test('should render with sky gradient', () => {
      const { container } = render(
        <StatCard
          {...defaultProps}
          gradient="from-sky-50/90 to-white/90"
          iconGradient="from-sky-500 to-sky-600"
        />
      );
      
      const card = container.querySelector('[class*="from-sky-50"]');
      expect(card).toBeInTheDocument();
    });

    test('should render with amber gradient', () => {
      const { container } = render(
        <StatCard
          {...defaultProps}
          gradient="from-amber-50/90 to-white/90"
          iconGradient="from-amber-500 to-amber-600"
        />
      );
      
      const card = container.querySelector('[class*="from-amber-50"]');
      expect(card).toBeInTheDocument();
    });

    test('should render with violet gradient', () => {
      const { container } = render(
        <StatCard
          {...defaultProps}
          gradient="from-violet-50/90 to-white/90"
          iconGradient="from-violet-500 to-violet-600"
        />
      );
      
      const card = container.querySelector('[class*="from-violet-50"]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle very long titles', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines';
      render(<StatCard {...defaultProps} title={longTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    test('should handle very large values', () => {
      render(<StatCard {...defaultProps} value="999,999,999" />);
      
      expect(screen.getByText('999,999,999')).toBeInTheDocument();
    });

    test('should handle empty subtitle', () => {
      render(<StatCard {...defaultProps} subtitle="" />);
      
      // Should not render empty subtitle
      const subtitle = screen.queryByText('');
      expect(subtitle).toBeNull();
    });

    test('should handle zero value', () => {
      render(<StatCard {...defaultProps} value="0" />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Snapshot', () => {
    test('should match snapshot', () => {
      const { container } = render(<StatCard {...defaultProps} />);
      
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot with all props', () => {
      const { container } = render(
        <StatCard
          {...defaultProps}
          subtitle="Test subtitle"
          change="+12%"
          changeType="positive"
        />
      );
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
