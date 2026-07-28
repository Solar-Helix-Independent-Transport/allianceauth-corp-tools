export interface MiningGraphDatum {
  id: string;
  [ore: string]: string | number;
}

export interface MiningTotalsDatum {
  name: string;
  [ore: string]: string | number;
}
