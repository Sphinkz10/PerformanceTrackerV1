/**
 * TESTS: ResponsiveTabBar
 * Unit tests for ResponsiveTabBar component and variants
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Home, Calendar, Settings, User } from 'lucide-react';
import { ResponsiveTabBar, CompactTabBar, PillTabBar, TabItem } from '../ResponsiveTabBar';

// Mock tabs data
const mockTabs: TabItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calendar', label: 'Calendar', icon: Calendar, badge: 3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User, disabled: true },
];

describe('ResponsiveTabBar', () => {
  describe('Basic Functionality', () => {
    it('should render all tabs', () => {
      const onChange = jest.fn();
      render(
        <ResponsiveTabBar
          tabs={mockTabs}
          activeTab="home"
          onChange={onChange}
        />
      );

      expect(screen.getAllByText('Home')).toBeTruthy();
      expect(screen.getAllByText('Calendar')).toBeTruthy();
      expect(screen.getAllByText('Settings')).toBeTruthy();
      expect(screen.getAllByText('Profile')).toBeTruthy();
    });

    it('should call onChange when tab is clicked', () => {
      const onChange = jest.fn();
      render(
        <ResponsiveTabBar
          tabs={mockTabs}
          activeTab="home"
          onChange={onChange}
        />
      );

      const calendarButtons = screen.getAllByText('Calendar');
      fireEvent.click(calendarButtons[0]);

      expect(onChange).toHaveBeenCalledWith('calendar');
    });

    it('should not call onChange when disabled tab is clicked', () => {
      const onChange = jest.fn();
      render(
        <ResponsiveTabBar
          tabs={mockTabs}
          activeTab="home"
          onChange={onChange}
        />
      );

      const profileButtons = screen.getAllByText('Profile');
      fireEvent.click(profileButtons[0]);

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should highlight active tab', () => {
      render(
        <ResponsiveTabBar
          tabs={mockTabs}
          activeTab="calendar"
          onChange={() => {}}
        />
      );

      const calendarButtons = screen.getAllByText('Calendar');
      // Active tab should have gradient classes
      expect(calendarButtons[0].className).toContain('sky');
    });
  });

  describe('Badge Support', () => {
    it('should display badge when provided', () => {
      render(
        <ResponsiveTabBar
          tabs={mockTabs}
          activeTab="home"
          onChange={() => {}}
        />
      );

      // Badge with number 3
      expect(screen.getAllByText('3')).toBeTruthy();
    });

    it('should display string badge', () => {
      const tabsWithStringBadge: TabItem[] = [
        { id: 'test', label: 'Test', icon: Home, badge: 'NEW' },
      ];

      render(
        <ResponsiveTabBar
          tabs={tabsWithStringBadge}
          activeTab="test"
          onChange={() => {}}
        />
      );

      expect(screen.getAllByText('NEW')).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled tab with correct styling', () => {
      render(
        <ResponsiveTabBar
          tabs={mockTabs}
          activeTab="home"
          onChange={() => {}}
        />
      );

      const profileButtons = screen.getAllByText('Profile');
      expect(profileButtons[0]).toBeDisabled();
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ResponsiveTabBar
          tabs={mockTabs}
          activeTab="home"
          onChange={() => {}}
          className="custom-class"
        />
      );

      expect(container.querySelector('.custom-class')).toBeTruthy();
    });
  });
});

describe('CompactTabBar', () => {
  it('should render compact variant', () => {
    render(
      <CompactTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('should have smaller sizing classes', () => {
    const { container } = render(
      <CompactTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    // Compact uses text-xs
    expect(container.innerHTML).toContain('text-xs');
  });
});

describe('PillTabBar', () => {
  it('should render pill variant', () => {
    render(
      <PillTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Home')).toBeTruthy();
  });

  it('should have pill container styling', () => {
    const { container } = render(
      <PillTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    // Pill variant has rounded-xl container
    expect(container.innerHTML).toContain('rounded-xl');
  });

  it('should highlight active tab with white background', () => {
    render(
      <PillTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    const homeButton = screen.getByText('Home');
    expect(homeButton.className).toContain('bg-white');
  });
});

describe('Responsive Behavior', () => {
  it('should render desktop version', () => {
    const { container } = render(
      <ResponsiveTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    // Desktop version has hidden sm:flex
    expect(container.innerHTML).toContain('hidden sm:flex');
  });

  it('should render mobile version', () => {
    const { container } = render(
      <ResponsiveTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    // Mobile version has sm:hidden
    expect(container.innerHTML).toContain('sm:hidden');
  });

  it('should render fixed bottom bar for mobile', () => {
    const { container } = render(
      <ResponsiveTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
        position="bottom"
      />
    );

    expect(container.innerHTML).toContain('fixed');
    expect(container.innerHTML).toContain('bottom-0');
  });
});

describe('Accessibility', () => {
  it('should have proper button roles', () => {
    render(
      <ResponsiveTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should disable buttons correctly', () => {
    render(
      <ResponsiveTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={() => {}}
      />
    );

    const profileButtons = screen.getAllByText('Profile');
    profileButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});

// Performance Tests
describe('Performance', () => {
  it('should handle large number of tabs', () => {
    const manyTabs: TabItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: `tab-${i}`,
      label: `Tab ${i}`,
      icon: Home,
    }));

    const { container } = render(
      <ResponsiveTabBar
        tabs={manyTabs}
        activeTab="tab-0"
        onChange={() => {}}
      />
    );

    expect(container).toBeTruthy();
  });

  it('should handle rapid clicks', () => {
    const onChange = jest.fn();
    render(
      <ResponsiveTabBar
        tabs={mockTabs}
        activeTab="home"
        onChange={onChange}
      />
    );

    const calendarButtons = screen.getAllByText('Calendar');
    
    // Simulate rapid clicks
    for (let i = 0; i < 10; i++) {
      fireEvent.click(calendarButtons[0]);
    }

    expect(onChange).toHaveBeenCalledTimes(10);
  });
});
