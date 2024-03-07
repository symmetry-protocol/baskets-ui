import { Badge } from "./ui/badge"
import { Level } from "./level";

export const LevelBadge = ({level, size=24, variant="secondary"}) => {

  return <Badge variant={variant} className="rounded flex items-center gap-1 w-fit">
    <Level level={level} size={size}/>
    {
      size === 24 ?
      <p className="text-xs">Level {level}</p>
      :
      <p className="text-sm">Level {level}</p>
    }
  </Badge>
}