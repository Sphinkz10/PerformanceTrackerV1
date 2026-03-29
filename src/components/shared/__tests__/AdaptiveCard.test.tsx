/**
 * TESTS: AdaptiveCard
 * Unit tests for AdaptiveCard component and variants
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrendingUp, Plus, User } from 'lucide-react';
import {
  AdaptiveCard,
  StatCard,
  ActionCard,
  ListCard,
  MediaCard,
} from '../AdaptiveCard';

describe('AdaptiveCard', () => {
  describe('Basic Functionality', () => {
    it('should render children', () => {
      render(
        <AdaptiveCard>
          <div>Card Content</div>
        </AdaptiveCard>
      );

      expect(screen.getByText('Card Content')).toBeTruthy();
    });

    it('should render as div by default', () => {
      const { container } = render(
        <AdaptiveCard>
          <div>Content</div>
        </AdaptiveCard>
      );

      const card = container.firstChild;
      expect(card?.nodeName).toBe('DIV');
    });

    it('should render as button when onClick is provided', () => {
      const onClick = jest.fn();
      const { container } = render(
        <AdaptiveCard onClick={onClick}>
          <div>Content</div>
        </AdaptiveCard>
      );

      const card = container.firstChild as HTMLElement;
      expect(card.nodeName).toBe('BUTTON');
    });

    it('should call onClick when clicked', () => {
      const onClick = jest.fn();
      const { container } = render(
        <AdaptiveCard onClick={onClick}>
          <div>Content</div>
        </AdaptiveCard>
      );

      const card = container.firstChild as HTMLElement;
      fireEvent.click(card);

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Styling Props', () => {
    it('should apply border by default', () => {
      const { container } = render(
        <AdaptiveCard>
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).toContain('border');
    });

    it('should not apply border when border is false', () => {
      const { container } = render(
        <AdaptiveCard border={false}>
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).not.toContain('border-slate');
    });

    it('should apply shadow-sm by default', () => {
      const { container } = render(
        <AdaptiveCard>
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).toContain('shadow-sm');
    });

    it('should apply correct shadow class', () => {
      const { container } = render(
        <AdaptiveCard shadow="lg">
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).toContain('shadow-lg');
    });

    it('should apply no shadow', () => {
      const { container } = render(
        <AdaptiveCard shadow="none">
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).not.toContain('shadow-');
    });

    it('should apply correct padding class', () => {
      const { container } = render(
        <AdaptiveCard padding="lg">
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).toContain('p-6');
    });

    it('should apply no padding', () => {
      const { container } = render(
        <AdaptiveCard padding="none">
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).not.toContain('p-');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <AdaptiveCard className="custom-class">
          <div>Content</div>
        </AdaptiveCard>
      );

      expect(container.innerHTML).toContain('custom-class');
    });
  });
});

describe('StatCard', () => {
  it('should render with all props', () => {
    render(
      <StatCard
        icon={TrendingUp}
        label="Total Revenue"
        value="€12,345"
        change="+15% vs last month"
        changeType="positive"
        color="emerald"
      />
    );

    expect(screen.getByText('Total Revenue')).toBeTruthy();
    expect(screen.getByText('€12,345')).toBeTruthy();
    expect(screen.getByText('+15% vs last month')).toBeTruthy();
  });

  it('should render without change', () => {
    render(
      <StatCard
        icon={TrendingUp}
        label="Total Revenue"
        value="€12,345"
        color="emerald"
      />
    );

    expect(screen.getByText('Total Revenue')).toBeTruthy();
    expect(screen.getByText('€12,345')).toBeTruthy();
  });

  it('should apply correct color gradient', () => {
    const { container } = render(
      <StatCard
        icon={TrendingUp}
        label="Test"
        value="100"
        color="sky"
      />
    );

    expect(container.innerHTML).toContain('sky');
  });

  it('should apply positive change color', () => {
    const { container } = render(
      <StatCard
        icon={TrendingUp}
        label="Test"
        value="100"
        change="+15%"
        changeType="positive"
      />
    );

    expect(container.innerHTML).toContain('emerald-600');
  });

  it('should apply negative change color', () => {
    const { container } = render(
      <StatCard
        icon={TrendingUp}
        label="Test"
        value="100"
        change="-5%"
        changeType="negative"
      />
    );

    expect(container.innerHTML).toContain('red-600');
  });

  it('should be clickable when onClick provided', () => {
    const onClick = jest.fn();
    const { container } = render(
      <StatCard
        icon={TrendingUp}
        label="Test"
        value="100"
        onClick={onClick}
      />
    );

    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalled();
  });
});

describe('ActionCard', () => {
  it('should render with all props', () => {
    render(
      <ActionCard
        icon={Plus}
        title="New Action"
        description="Click to create new item"
        badge={5}
        color="emerald"
        onClick={() => {}}
      />
    );

    expect(screen.getByText('New Action')).toBeTruthy();
    expect(screen.getByText('Click to create new item')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('should render without badge', () => {
    render(
      <ActionCard
        icon={Plus}
        title="New Action"
        description="Description"
        color="emerald"
        onClick={() => {}}
      />
    );

    expect(screen.getByText('New Action')).toBeTruthy();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ActionCard
        icon={Plus}
        title="Test"
        description="Description"
        onClick={onClick}
      />
    );

    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalled();
  });

  it('should apply correct color', () => {
    const { container } = render(
      <ActionCard
        icon={Plus}
        title="Test"
        description="Description"
        color="violet"
        onClick={() => {}}
      />
    );

    expect(container.innerHTML).toContain('violet');
  });
});

describe('ListCard', () => {
  it('should render with avatar', () => {
    render(
      <ListCard
        avatar="https://example.com/avatar.jpg"
        title="John Doe"
        subtitle="john@example.com"
      />
    );

    expect(screen.getByText('John Doe')).toBeTruthy();
    expect(screen.getByText('john@example.com')).toBeTruthy();
    expect(screen.getByAltText('John Doe')).toBeTruthy();
  });

  it('should render with icon instead of avatar', () => {
    render(
      <ListCard
        icon={User}
        title="John Doe"
        subtitle="john@example.com"
      />
    );

    expect(screen.getByText('John Doe')).toBeTruthy();
  });

  it('should render with badge', () => {
    render(
      <ListCard
        title="John Doe"
        badge="Active"
        badgeColor="emerald"
      />
    );

    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('should render actions', () => {
    render(
      <ListCard
        title="John Doe"
        actions={<button>Edit</button>}
      />
    );

    expect(screen.getByText('Edit')).toBeTruthy();
  });

  it('should be clickable when onClick provided', () => {
    const onClick = jest.fn();
    const { container } = render(
      <ListCard
        title="John Doe"
        onClick={onClick}
      />
    );

    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalled();
  });

  it('should apply correct badge color', () => {
    const { container } = render(
      <ListCard
        title="Test"
        badge="Status"
        badgeColor="red"
      />
    );

    expect(container.innerHTML).toContain('red-100');
  });
});

describe('MediaCard', () => {
  it('should render with all props', () => {
    render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Card Title"
        description="Card description text"
        badge="NEW"
        footer={<button>View More</button>}
      />
    );

    expect(screen.getByText('Card Title')).toBeTruthy();
    expect(screen.getByText('Card description text')).toBeTruthy();
    expect(screen.getByText('NEW')).toBeTruthy();
    expect(screen.getByText('View More')).toBeTruthy();
  });

  it('should render without description', () => {
    render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Card Title"
      />
    );

    expect(screen.getByText('Card Title')).toBeTruthy();
  });

  it('should render without badge', () => {
    render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Card Title"
      />
    );

    expect(screen.getByText('Card Title')).toBeTruthy();
  });

  it('should render without footer', () => {
    render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Card Title"
      />
    );

    expect(screen.getByText('Card Title')).toBeTruthy();
  });

  it('should be clickable when onClick provided', () => {
    const onClick = jest.fn();
    const { container } = render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Card Title"
        onClick={onClick}
      />
    );

    const card = container.firstChild as HTMLElement;
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalled();
  });

  it('should apply correct aspect ratio', () => {
    const { container } = render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Card Title"
        aspectRatio="4/3"
      />
    );

    expect(container.innerHTML).toContain('aspect-[4/3]');
  });

  it('should render image with correct alt text', () => {
    render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Card Title"
      />
    );

    const image = screen.getByAltText('Card Title');
    expect(image).toBeTruthy();
  });
});

describe('Responsive Behavior', () => {
  it('should have responsive classes in ListCard', () => {
    const { container } = render(
      <ListCard title="Test" />
    );

    expect(container.innerHTML).toContain('sm:');
  });
});

describe('Accessibility', () => {
  it('should have proper button role when clickable', () => {
    render(
      <AdaptiveCard onClick={() => {}}>
        <div>Content</div>
      </AdaptiveCard>
    );

    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });

  it('should have alt text for images', () => {
    render(
      <ListCard
        avatar="https://example.com/avatar.jpg"
        title="John Doe"
      />
    );

    const image = screen.getByAltText('John Doe');
    expect(image).toBeTruthy();
  });

  it('should have alt text for MediaCard images', () => {
    render(
      <MediaCard
        image="https://example.com/image.jpg"
        title="Test Card"
      />
    );

    const image = screen.getByAltText('Test Card');
    expect(image).toBeTruthy();
  });
});
