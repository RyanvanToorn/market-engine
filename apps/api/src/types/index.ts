export interface InstrumentType {
  id: number;
  description: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date | null;
  modifiedBy: string | null;
  isActive: boolean;
}

export interface Instrument {
  id: number;
  symbol: string;
  name: string;
  typeId: number;
  exchange: string;
  currency: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date | null;
  modifiedBy: string | null;
  isActive: boolean;
  instrumentType: InstrumentType | null;
}

export interface PotentialInstrument {
  id: number;
  symbol: string;
  name: string;
  typeId: number;
  exchange: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date | null;
  modifiedBy: string | null;
  isActive: boolean;
  validated: boolean;
  instrumentType: InstrumentType | null;
}

export interface InstrumentPriceHistory {
  id: number;
  instrumentId: number;
  /** 'YYYY-MM-DD' */
  date: string;
  granularity: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  adjClose: number | null;
  volume: number | null;
}

export interface InstrumentDividend {
  id: number;
  instrumentId: number;
  /** 'YYYY-MM-DD' */
  exDate: string;
  /** 'YYYY-MM-DD' */
  paymentDate: string;
  amount: number;
}

export interface InstrumentKey {
  id: number;
  symbol: string;
  exchange: string;
}
