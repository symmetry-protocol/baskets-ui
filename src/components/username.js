import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import Checkmark from "/public/static/icons/checkmark.svg";

export const Username = ({address, verified=false, href=null, target="_blank"}) => {

  const [username, setUsername] = useState(null);

  useEffect(() => {
    if(address) {
      fetch('https://sns-api.bonfida.com/v2/user/domains/'+address)
      .catch((e) => null)
      .then(res => res ? res.json() : null).then(result => {
        if (result) {
          let domains = Object.values(result);
          console.log('[domain]', domains);
          if(domains.length > 0) {
            setUsername(domains[0][0] + ".sol");
          }
        }
      });
    }
  }, [address]);

  if(!username && !address)
  return <Skeleton className="w-12 h-3"/>

  return <div className="flex items-center gap-1">
    <Link target={target} href={href || 'https://solscan.io/account/'+address} className="text-sm hover:underline w-fit">
      {
        username ?
        username
        :
        address.slice(0, 3) + "..." + address.slice(-3)
      }
    </Link>
    {
      verified &&
      <Checkmark width={16} height={16}/>
    }
    
  </div>
}