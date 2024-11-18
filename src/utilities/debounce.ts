function debounce(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
  let timerId: ReturnType<typeof setTimeout> | null;

  return (...args: any[]): void => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func(...args);
      timerId = null;
    }, delay);
  };
}

export default debounce;
