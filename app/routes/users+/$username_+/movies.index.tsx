import { type MetaFunction } from '@remix-run/react'
import { type loader as moviesLoader } from './movies.tsx'

export default function MoviesIndexRoute() {
	return (
		<div className="container pt-12">
			<p className="text-body-md">Select a movie</p>
		</div>
	)
}

export const meta: MetaFunction<
	null,
	{ 'routes/users+/$username_+/movies': typeof moviesLoader }
> = ({ params, matches }) => {
	const moviesMatch = matches.find(
		(m) => m.id === 'routes/users+/$username_+/movies',
	)
	const displayName = moviesMatch?.data?.owner.name ?? params.username
	const movieCount = moviesMatch?.data?.owner.movies.length ?? 0
	const movieText = movieCount === 1 ? 'movie' : 'movies'
	return [
		{ title: `${displayName}'s movies | Movie List` },
		{
			name: 'description',
			content: `Checkout ${displayName}'s ${movieCount} ${movieText} on Epic Notes`,
		},
	]
}
