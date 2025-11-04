import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/tasks/$taskId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { taskId } = Route.useParams()
  return <div>Hello "/tasks/$taskId"! {taskId}</div>
}
