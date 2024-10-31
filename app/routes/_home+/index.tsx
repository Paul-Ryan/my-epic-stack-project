import { Button } from '#app/components/ui/button.tsx'
import { useOptionalUser } from '#app/utils/user.ts'
import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [{ title: 'Movie List' }]

const paulsMovies = [
	{
		title: 'Terminator 2',
	},
	{
		title: 'The Fifth Element',
	},
	{
		title: 'Blade Runner',
	},
	{
		title: 'Mars Express',
	},
	{
		title: 'Past Lives',
	},
	{
		title: 'Hunt for the Wilderpeople',
	},
	{
		title: 'Mission Impossible: Rogue Nation',
	},
	{
		title: 'Her',
	},
	{
		title: 'The Little Hours',
	}
]

export default function Index() {
	const user = useOptionalUser()
	const movies = user?.movies ?? paulsMovies
	const userDisplayName = user?.name ?? user?.username ?? 'Your'

	return (
		<main className="font-poppins flex h-full flex-col gap-4 px-8 sm:gap-8">
			<h2 className="text-h2 text-xl">{userDisplayName}'s Movies</h2>
			<Button asChild variant="secondary">Add Movie</Button>
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
