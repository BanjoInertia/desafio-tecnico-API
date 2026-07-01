import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('inicial', 300));
    expect(result.current).toBe('inicial');
  });

  it('não atualiza o valor antes do delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('a');
  });

  it('atualiza o valor após o delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('ab');
  });

  it('reinicia o timer ao mudar o valor antes do delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );
    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'abc' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('abc');
  });
});
