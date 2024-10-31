import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, useMatches, type MetaFunction } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { Button } from '#app/components/ui/button.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { getUserImgSrc } from '#app/utils/misc.tsx'
import { useOptionalUser } from '#app/utils/user.ts'

export async function loader({ params }: LoaderFunctionArgs) {
	const user = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			createdAt: true,
			image: { select: { id: true } },
			movies: { select: { id: true, title: true } },
		},
		where: {
			username: params.username,
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return json({ user, userJoinedDisplay: user.createdAt.toLocaleDateString() })
}

export default function ProfileRoute() {
	const data = useLoaderData<typeof loader>()
	const user = data.user
	const movies = user.movies
	const userDisplayName = user.name ?? user.username

	return (
		<main className="font-poppins flex h-full flex-col gap-4 px-8 sm:gap-8">
			<h2 className="text-h2 text-xl">{userDisplayName}'s Movies</h2>
		<div className="flex flex-col sm:flex-row sm:gap-12">
			<div className="sm:basis-24">
				<h2 className="text-lg">Favorite Movies</h2>
			</div>
			<ul className="mt-2 flex max-w-[1200px] grow basis-auto flex-col flex-wrap justify-center sm:col-span-5 sm:mt-0 sm:grid sm:grid-flow-col sm:grid-cols-3 sm:grid-rows-6 sm:gap-4">
				{movies.map(({title}) => (
					<li key={title}>{title}</li>
				))}
			</ul>
		</div>
	</main>
	)
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
	const displayName = data?.user.name ?? params.username
	return [
		{ title: `${displayName} | Movie List` },
		{
			name: 'description',
			content: `Profile of ${displayName} on Movie List`,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No user with the username "{params.username}" exists</p>
				),
			}}
		/>
	)
}
