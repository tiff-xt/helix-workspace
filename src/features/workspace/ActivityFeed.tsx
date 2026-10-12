import { api } from '@/data/api'
import { people } from '@/data/project'
import { Avatar, Card, CardHeader, Skeleton } from '@/design-system'
import { useAsync } from '@/hooks/useAsync'
import { formatRelative } from '@/lib/format'

export function ActivityFeed() {
  const state = useAsync(() => api.getActivity(), [])
  return (
    <Card>
      <CardHeader title="Latest activity" />
      <div className="px-4 pb-3 pt-2" aria-busy={state.status === 'loading'}>
        {state.status === 'loading' ? (
          <div className="space-y-3 py-1">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 flex-1" />
              </div>
            ))}
          </div>
        ) : (
          <ol className="relative">
            {state.data?.map((item) => {
              const actor = people.find((p) => p.id === item.actorId)!
              return (
                <li key={item.id} className="flex gap-2.5 py-1.5">
                  <Avatar person={actor} size="sm" />
                  <p className="min-w-0 flex-1 text-sm text-fg-muted">
                    <span className="font-medium text-fg">{actor.name.replace('Dr. ', '')}</span> {item.action}{' '}
                    <span className="text-fg">{item.target}</span>
                    <span className="block text-xs text-fg-subtle">
                      <time dateTime={item.at}>{formatRelative(item.at)}</time>
                    </span>
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </Card>
  )
}
