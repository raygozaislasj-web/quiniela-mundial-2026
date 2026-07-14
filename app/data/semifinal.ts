export interface Partido {
  id: number;
  local: string;
  visitante: string;
}

export const partidos: Partido[] = [
  {
    id: 101,
    local: "Francia",
    visitante: "España",
  },
  {
    id: 102,
    local: "Inglaterra",
    visitante: "Argentina",
  },
];