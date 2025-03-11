import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="nes-container">
        <CardHeader>
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/src/assets/images/NS-logo-cropped.png" className="w-auto h-12 mb-4" alt="" />
          <h1 className="font-sans text-4xl text-chart-1 font-bold">Trivia Triathlon</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email + invite code to login
          </p>
        </div>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Invite code</Label>
                </div>
                <Input id="password" type="text" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
