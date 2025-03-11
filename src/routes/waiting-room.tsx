import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/waiting-room')({
  component: waitingRoom,
})

function waitingRoom() {
  return <div className="p-2">Hello from the waiting room!</div>
}