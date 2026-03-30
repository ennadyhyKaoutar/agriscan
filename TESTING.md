// app/components/__tests__/Card.test.jsx
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  test('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies hover effect when enabled', () => {
    const { container } = render(<Card hover>Content</Card>);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('hover:shadow-lg');
  });

  test('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('custom-class');
  });
});

// app/lib/__tests__/validation.test.js
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateForm,
} from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    test('accepts valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    test('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    test('accepts valid Moroccan phone', () => {
      expect(validatePhone('+212 6 12 34 56 78')).toBe(true);
      expect(validatePhone('0612345678')).toBe(true);
    });

    test('rejects invalid phone', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('invalid')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('accepts strong password', () => {
      expect(validatePassword('SecurePass123')).toBe(true);
    });

    test('rejects weak password', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('nouppercaseornumber')).toBe(false);
    });
  });

  describe('validateForm', () => {
    test('validates entire form correctly', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123',
        name: 'John',
      };

      const rules = {
        email: { required: true, email: true },
        password: { required: true, password: true },
        name: { required: true, minLength: 2 },
      };

      const errors = validateForm(data, rules);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    test('returns errors for invalid form', () => {
      const data = {
        email: 'invalid',
        password: 'weak',
        name: '',
      };

      const rules = {
        email: { required: true, email: true },
        password: { required: true, password: true },
        name: { required: true },
      };

      const errors = validateForm(data, rules);
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });
});

// app/lib/__tests__/storage.test.js
import { storage } from '../storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('sets and gets item', () => {
    const testData = { name: 'John', age: 30 };
    storage.set('user', testData);
    expect(storage.get('user')).toEqual(testData);
  });

  test('removes item', () => {
    storage.set('user', { name: 'John' });
    storage.remove('user');
    expect(storage.get('user')).toBeNull();
  });

  test('clears all storage', () => {
    storage.set('user', { name: 'John' });
    storage.set('preferences', { theme: 'dark' });
    storage.clear();
    expect(localStorage.length).toBe(0);
  });

  test('checks if key exists', () => {
    storage.set('user', { name: 'John' });
    expect(storage.has('user')).toBe(true);
    expect(storage.has('nonexistent')).toBe(false);
  });

  test('returns default value for missing key', () => {
    const defaultValue = { name: 'Guest' };
    expect(storage.get('missing', defaultValue)).toEqual(defaultValue);
  });
});

// app/hooks/__tests__/useForm.test.js
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm Hook', () => {
  test('initializes with correct values', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() =>
      useForm(initialValues, async () => {})
    );

    expect(result.current.values).toEqual(initialValues);
  });

  test('updates field value on change', () => {
    const initialValues = { name: '' };
    const { result } = renderHook(() =>
      useForm(initialValues, async () => {})
    );

    const mockEvent = {
      target: { name: 'name', value: 'John', type: 'text' },
    };

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values.name).toBe('John');
  });

  test('handles form submission', async () => {
    const initialValues = { name: '', email: '' };
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm(initialValues, onSubmit));

    const mockEvent = { preventDefault: jest.fn() };

    act(() => {
      result.current.values.name = 'John';
      result.current.values.email = 'john@example.com';
    });

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    });
  });

  test('resets form values', () => {
    const initialValues = { name: 'John' };
    const { result } = renderHook(() =>
      useForm(initialValues, async () => {})
    );

    act(() => {
      result.current.setFieldValue('name', 'Jane');
    });

    expect(result.current.values.name).toBe('Jane');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
  });
});

// Jest config: jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    '!app/**/*.d.ts',
    '!app/**/layout.jsx',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
}

module.exports = createJestConfig(customJestConfig)

// Jest setup: jest.setup.js
import '@testing-library/jest-dom'

// Mock fetch
global.fetch = jest.fn()

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})
