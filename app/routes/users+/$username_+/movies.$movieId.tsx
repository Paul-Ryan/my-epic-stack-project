import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { MovieEditor } from './__movie-editor.tsx'

export { action } from './__movie-editor.server.tsx'

export async function loader({ params, request }: LoaderFunctionArgs) {
	const userId = await requireUserId(request)
	const movie = await prisma.movie.findFirst({
		select: {
			id: true,
			title: true,
		},
		where: {
			id: params.movieId,
			ownerId: userId,
		},
	})
	invariantResponse(movie, 'Not found', { status: 404 })
	return json({ movie: movie })
}

export default function MovieEdit() {
	const data = useLoaderData<typeof loader>()

	return <MovieEditor movie={data.movie} />
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No movie with the id "{params.movieId}" exists</p>
				),
			}}
		/>
	)
}
