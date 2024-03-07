import Image from "next/image";
import LevelsImage from "/public/static/images/levels.png";
import { Level } from "./level";


export const LevelsBanner = ({}) => {

  return <div className="w-full flex items-center justify-between p-4 border rounded-xl relative overflow-hidden">
    <div className="w-full flex flex-col gap-1">
      <h2 className="text-xl font-bold text-yellow-400">Introducing Levels</h2>
      <p className="text-sm text-muted-foreground">Earn Points and Level Up to secure your spot in the leaderboards.</p>
      <p className="text-sm">You've got until May 31 to secure your ranking in time for the snapshot.</p>
    </div>
    <Level level={72} size={96} />
  </div>
}