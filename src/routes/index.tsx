import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: () => {
    if(true) {
      redirect({
        to: '/login',
        throw: true,
      })
    }

    if(false) {
    return Index
    }
  }
})

function Index() {

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}