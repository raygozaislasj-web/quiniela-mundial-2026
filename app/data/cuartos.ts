export interface Partido {
  id: number;
  local: string;
  visitante: string;
}

export const partidos: Partido[] = [
  {
    id: 97,
    local: "Francia",
    visitante: "Marruecos",
  },
  {
    id: 98,
    local: "España",
    visitante: "Bélgica",
  },
  {
    id: 99,
    local: "Noruega",
    visitante: "Inglaterra",
  },
  {
    id: 100,
    local: "Argentina",
    visitante: "Suiza",
  },
];