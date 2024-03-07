import { formatNumber } from "@/utils/utils"



export const PriceChange = ({
  label,
  change,
  className="items-center"
}) => {

  return <div className={`flex flex-col gap-1 ${className}`}>
    {
      label && <p className="text-sm text-muted-foreground">{label}</p>
    }
    { (change && change < 999999999) ?
      <h1 className={`text-sm font-bold rounded ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {
          change > 0 && "+"
        }
        {
        formatNumber(change, "2")
        }%
      </h1>
      :
      <p className="text-xs text-muted-foreground">N/A</p>
    }
  </div>
}