import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VaultTypeToString } from "@/utils/utils"
import { Textarea } from "@/components/ui/textarea"


export const EditVaultDescription = ({open, onClose, vault}) => {

  return <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Description</DialogTitle>
        <DialogDescription>
          A good description helps people quickly understand what this {VaultTypeToString(vault ? vault.actively_managed : null)} is about.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Textarea placeholder="Type your description here." />
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}