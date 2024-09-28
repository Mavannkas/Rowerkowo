export type RawAccident = {
  ciezkosc: string;
  wsp_gps_x: number;
  wsp_gps_y: number;
}

export type gmina = {
  zdarzenia_detale: RawAccident[];
}

export type powiat = {
  gminy: gmina[];
}

export type wojewodztwo = {
  powiaty: powiat[];
}

export type AccidentApiResponseData = {
  mapa: {
    wojewodztwa: wojewodztwo[];
  }
}