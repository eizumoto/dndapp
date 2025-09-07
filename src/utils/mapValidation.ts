

export interface MapConfig {
    width: number;
    height: number;
    grid: number[][];
}

export function validateMapConfig(mapConfig: MapConfig): void {
  const { width, height, grid } = mapConfig;

  if (grid.length !== height) {
    throw new Error(`Grid height ${grid.length} does not match expected height ${height}`);
  }

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    if (row.length !== width) {
      throw new Error(`Row ${y} width ${row.length} does not match expected width ${width}`);
    }

    for (let x = 0; x < row.length; x++) {
      const val = row[x];
      if (!Number.isInteger(val) || val < 0 || val > 999) {
        throw new Error(`Invalid cell value at (${x},${y}): ${val}. Must be 0-999`);
      }
    }
  }
}