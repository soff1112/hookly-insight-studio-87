import { useState, useCallback } from "react";

interface LegendState {
  hiddenSeries: Set<string>;
  isolatedSeries: string | null;
}

export const useInteractiveLegend = (seriesKeys: string[]) => {
  const [state, setState] = useState<LegendState>({
    hiddenSeries: new Set(),
    isolatedSeries: null,
  });

  const handleLegendClick = useCallback((dataKey: string, event?: React.MouseEvent) => {
    const isShiftClick = event?.shiftKey;

    setState(prev => {
      // Shift+click isolates the series (hides all others)
      if (isShiftClick) {
        if (prev.isolatedSeries === dataKey) {
          // If already isolated, restore all
          return { hiddenSeries: new Set(), isolatedSeries: null };
        }
        // Isolate this series
        const newHidden = new Set(seriesKeys.filter(k => k !== dataKey));
        return { hiddenSeries: newHidden, isolatedSeries: dataKey };
      }

      // Normal click toggles visibility
      const newHidden = new Set(prev.hiddenSeries);
      if (newHidden.has(dataKey)) {
        newHidden.delete(dataKey);
      } else {
        newHidden.add(dataKey);
      }

      // Clear isolated state on normal click
      return { hiddenSeries: newHidden, isolatedSeries: null };
    });
  }, [seriesKeys]);

  const isSeriesVisible = useCallback((dataKey: string) => {
    return !state.hiddenSeries.has(dataKey);
  }, [state.hiddenSeries]);

  const resetLegend = useCallback(() => {
    setState({ hiddenSeries: new Set(), isolatedSeries: null });
  }, []);

  const getSeriesOpacity = useCallback((dataKey: string) => {
    if (state.isolatedSeries) {
      return state.isolatedSeries === dataKey ? 1 : 0.1;
    }
    return state.hiddenSeries.has(dataKey) ? 0 : 1;
  }, [state.hiddenSeries, state.isolatedSeries]);

  return {
    hiddenSeries: state.hiddenSeries,
    isolatedSeries: state.isolatedSeries,
    handleLegendClick,
    isSeriesVisible,
    resetLegend,
    getSeriesOpacity,
  };
};
