import { renderHook } from '@testing-library/react';
import { useOnRouteChange } from '../useOnRouteChange';
import { usePathname } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('useOnRouteChange', () => {
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn();
    (usePathname as jest.Mock).mockReturnValue('/initial-path');

    // Setup window event listener mocks
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not call callback on initial render', () => {
    renderHook(() => useOnRouteChange(mockCallback));
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call callback when pathname changes', () => {
    const { rerender } = renderHook(() => useOnRouteChange(mockCallback));

    // Change pathname
    (usePathname as jest.Mock).mockReturnValue('/new-path');
    rerender();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when pathname stays the same', () => {
    const { rerender } = renderHook(() => useOnRouteChange(mockCallback));

    // Re-render without changing pathname
    rerender();

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should subscribe to hashchange event when runOnHashChange is true', () => {
    renderHook(() => useOnRouteChange(mockCallback, undefined, true));
    expect(window.addEventListener).toHaveBeenCalledWith('hashchange', mockCallback);
  });

  it('should not subscribe to hashchange event when runOnHashChange is false', () => {
    renderHook(() => useOnRouteChange(mockCallback, undefined, false));
    expect(window.addEventListener).not.toHaveBeenCalledWith('hashchange', mockCallback);
  });

  it('should unsubscribe from hashchange event on unmount when enabled', () => {
    const { unmount } = renderHook(() => useOnRouteChange(mockCallback, undefined, true));
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('hashchange', mockCallback);
  });

  it('should not unsubscribe from hashchange event on unmount when not enabled', () => {
    const { unmount } = renderHook(() => useOnRouteChange(mockCallback, undefined, false));
    unmount();
    expect(window.removeEventListener).not.toHaveBeenCalledWith('hashchange', mockCallback);
  });

  it('should call new callback when callback reference changes and path changes', () => {
    const newCallback = jest.fn();
    const { rerender } = renderHook(({ callback }) => useOnRouteChange(callback), {
      initialProps: { callback: mockCallback },
    });

    // Change both callback and pathname
    (usePathname as jest.Mock).mockReturnValue('/new-path');
    rerender({ callback: newCallback });

    expect(newCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
