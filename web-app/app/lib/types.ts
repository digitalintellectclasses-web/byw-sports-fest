export interface Player {
  team: string;
  code: string;
  name: string;
  gender: string;
}

export interface Match {
  match_no: string | number;
  time: string;
  sport: string;
  category: string;
  stage: string;
  team1: string;
  team2: string;
  winner: string | null;
  completed: string | null;
}

export interface TournamentData {
  teams: string[];
  players: Player[];
  matches: Match[];
}
