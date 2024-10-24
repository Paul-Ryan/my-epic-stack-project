import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

const favoriteMovies = [
	'Hunt for the Wilderpeople',
	'Mission Impossible: Rogue Nation',
	'Her',
	'The Little Hours',
	'Blade Runner',
	'The Fifth Element',
	'Terminator 2',
	'Mars Express',
	'Past Lives',
]

const favoriteShows = [
	'Succession',
	'The Office',
	'Futurama',
	'What We Do In The Shadows',
	'Better Call Saul',
	'Freaks and Geeks',
	'Firefly',
]

export default function Index() {
	return (
		<main className="font-poppins flex h-full flex-col gap-4 px-8 sm:gap-8">
			<div className="flex flex-col sm:flex-row sm:gap-12">
				<div className="sm:basis-24">
					<h2 className="text-h2">Favorite Movies</h2>
				</div>
				<ul className="mt-2 flex max-w-[1200px] grow basis-auto flex-col flex-wrap justify-center sm:col-span-5 sm:mt-0 sm:grid sm:grid-flow-col sm:grid-cols-3 sm:grid-rows-6 sm:gap-4">
					{favoriteMovies.map((movie) => (
						<li key={movie}>{movie}</li>
					))}
				</ul>
			</div>
			<div className="flex flex-col sm:flex-row sm:gap-12">
				<div className="sm:basis-24">
					<h2 className="text-h2">Favorite Shows</h2>
				</div>
				<ul className="mt-2 flex max-w-[1200px] grow basis-auto flex-col flex-wrap justify-center sm:col-span-5 sm:mt-0 sm:grid sm:grid-flow-col sm:grid-cols-3 sm:grid-rows-6 sm:gap-4">
					{favoriteShows.map((show) => (
						<li key={show}>{show}</li>
					))}
				</ul>
			</div>
		</main>
	)
}
