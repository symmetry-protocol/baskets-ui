import { Header } from "@/components/header"
import { Level } from "@/components/level";
import { LevelBadge } from "@/components/level-badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Username } from "@/components/username";
import { formatNumber } from "@/utils/utils";
import { useEffect, useState } from "react"

const LeaderboardPage = () => {

  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    fetch('https://api.symmetry.fi/v1/funds-getter', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "request": "get_user_rankings",
        "params": {
          max_count: 100,
          attributes: null
        }
      })

    }).then(res => res.json()).then(data => {
      setLeaderboard(data.users);
    });
  }, []);

  return <div className="sm:max-w-screen-sm md:max-w-screen-xl w-screen flex flex-col px-0.5 md:px-4 gap-4 mt-4">
    <Header 
      title={"Home | Symmetry"}
      path="/leaderboard"
    />
    <div className="w-full flex flex-col px-4 gap-4 mt-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Leaderboard TOP 100</h1>
        <p className="text-muted-foreground">Rank up the ladder before May 31st, the 📸 will be taken on May 1, 00:00 UTC. Protocol user rankings update hourly. </p>
      </div>
      <Table>
        <TableCaption>User Rankings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-[200px] text-right">Points</TableHead>
            <TableHead className="text-right w-[150px]">Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          { leaderboard &&
            leaderboard.map((item, i) => (
              <TableRow 
                key={item}
                className={`${i < 3 ? 'h-12' : 'h-auto'}`}
              >
                <TableCell className="text-md font-bold text-muted-foreground">
                  {
                    i === 0 ? "🥇 1." :
                    i === 1 ? "🥈 2." :
                    i === 2 ? "🥉 3." :
                    i + 1 + "."
                  }
                </TableCell>
                <TableCell>
                  {
                    i === 0 ? <div className="shinyGold">
                      <Username
                       address={item.pubkey}
                       href={'/creator/'+item.pubkey}
                       target="_self"
                       />
                    </div> :
                    i === 1 ? <div className="shinySilver">
                      <Username 
                        address={item.pubkey}
                        href={'/creator/'+item.pubkey}
                        target="_self"
                      />
                    </div> :
                    i === 2 ? <div className="shinyBronze">
                      <Username 
                        address={item.pubkey}
                        href={'/creator/'+item.pubkey}
                        target="_self"
                      />
                    </div> :
                    <Username 
                      address={item.pubkey}
                      href={'/creator/'+item.pubkey}
                      target="_self"
                    />
                  }
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatNumber(item.total_points,0)} pts
                </TableCell>
                <TableCell className="flex items-center justify-end gap-2">
                  <Level size={42} level={Math.floor(9.2 * Math.log(0.00011 * item.total_points + 1) / Math.log(10) + 1/2 * item.total_points**0.1)}/>
                  <p className="text-md font-medium">Level {Math.floor(9.2 * Math.log(0.00011 * item.total_points + 1) / Math.log(10) + 1/2 * item.total_points**0.1)}</p>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  </div>
}

export default LeaderboardPage;