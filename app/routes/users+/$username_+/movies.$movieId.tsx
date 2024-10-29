import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import {
	json,
	type LoaderFunctionArgs,
	type ActionFunctionArgs,
} from '@remix-run/node'
import {
	Form,
	Link,
	useActionData,
	useLoaderData,
	type MetaFunction,
} from '@remix-run/react'
import { formatDistanceToNow } from 'date-fns'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { floatingToolbarClassName } from '#app/components/floating-toolbar.tsx'
import { ErrorList } from '#app/components/forms.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { requireUserWithPermission } from '#app/utils/permissions.server.ts'
import { redirectWithToast } from '#app/utils/toast.server.ts'
import { userHasPermission, useOptionalUser } from '#app/utils/user.ts'
import { type loader as moviesLoader } from './movies.tsx'

export async function loader({ params }: LoaderFunctionArgs) {
	const movie = await prisma.movie.findUnique({
		where: { id: params.movieId },
		select: {
			id: true,
			title: true,
            release: true,
			ownerId: true,
			updatedAt: true,
		},
	})

	invariantResponse(movie, 'Not found', { status: 404 })

	const date = new Date(movie.updatedAt)
	const timeAgo = formatDistanceToNow(date)

	return json({
		movie,
		timeAgo,
	})
}

const DeleteFormSchema = z.object({
	intent: z.literal('delete-movie'),
	movieId: z.string(),
})

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: DeleteFormSchema,
	})
	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { movieId } = submission.value

	const movie = await prisma.movie.findFirst({
		select: { id: true, ownerId: true, owner: { select: { username: true } } },
		where: { id: movieId },
	})
	invariantResponse(movie, 'Not found', { status: 404 })

	const isOwner = movie.ownerId === userId
	await requireUserWithPermission(
		request,
		isOwner ? `delete:movie:own` : `delete:movie:any`,
	)

	await prisma.movie.delete({ where: { id: movie.id } })

	return redirectWithToast(`/users/${movie.owner.username}/movies`, {
		type: 'success',
		title: 'Success',
		description: 'Your movie has been deleted.',
	})
}

export default function MovieRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	const isOwner = user?.id === data.movie.ownerId
	const canDelete = userHasPermission(
		user,
		isOwner ? `delete:movie:own` : `delete:movie:any`,
	)
	const displayBar = canDelete || isOwner

	return (
		<div className="absolute inset-0 flex flex-col px-10">
			<h2 className="mb-2 pt-12 text-h2 lg:mb-6">{data.movie.title}</h2>
			<div className={`${displayBar ? 'pb-24' : 'pb-12'} overflow-y-auto`}>
				<p className="whitespace-break-spaces text-sm md:text-lg">
					{data.movie.release}
				</p>
			</div>
			{displayBar ? (
				<div className={floatingToolbarClassName}>
					<span className="text-sm text-foreground/90 max-[524px]:hidden">
						<Icon name="clock" className="scale-125">
							{data.timeAgo} ago
						</Icon>
					</span>
					<div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
						{canDelete ? <DeleteMovie id={data.movie.id} /> : null}
						<Button
							asChild
							className="min-[525px]:max-md:aspect-square min-[525px]:max-md:px-0"
						>
							<Link to="edit">
								<Icon name="pencil-1" className="scale-125 max-md:scale-150">
									<span className="max-md:hidden">Edit</span>
								</Icon>
							</Link>
						</Button>
					</div>
				</div>
			) : null}
		</div>
	)
}

export function DeleteMovie({ id }: { id: string }) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form] = useForm({
		id: 'delete-movie',
		lastResult: actionData?.result,
	})

	return (
		<Form method="POST" {...getFormProps(form)}>
			<input type="hidden" name="movieId" value={id} />
			<StatusButton
				type="submit"
				name="intent"
				value="delete-movie"
				variant="destructive"
				status={isPending ? 'pending' : (form.status ?? 'idle')}
				disabled={isPending}
				className="w-full max-md:aspect-square max-md:px-0"
			>
				<Icon name="trash" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">Delete</span>
				</Icon>
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</Form>
	)
}

export const meta: MetaFunction<
	typeof loader,
	{ 'routes/users+/$username_+/movies': typeof moviesLoader }
> = ({ data, params, matches }) => {
	const moviesMatch = matches.find(
		(m) => m.id === 'routes/users+/$username_+/movies',
	)
	const displayName = moviesMatch?.data?.owner.name ?? params.username
	const movieTitle = data?.movie.title ?? 'Movie'
    const movieRelease = data?.movie.release ?? 'No release date'

	return [
		{ title: `${movieTitle} | ${displayName}'s Movies | Movie List` },
		{
			name: 'description',
			release: movieRelease,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				403: () => <p>You are not allowed to do that</p>,
				404: ({ params }) => (
					<p>No movie with the id "{params.movieId}" exists</p>
				),
			}}
		/>
	)
}
