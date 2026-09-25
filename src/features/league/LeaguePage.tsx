import { GoalsPerRound } from './GoalsPerRound'
import { Highlights } from './Highlights'
import { StandingsTable } from './StandingsTable'

export default function LeaguePage() {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-[28px] font-bold leading-[34px] tracking-tight">Brasileirão Série A</h1>
      <Highlights />
      <StandingsTable />
      <GoalsPerRound />
    </div>
  )
}
