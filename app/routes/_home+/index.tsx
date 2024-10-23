import { type MetaFunction } from '@remix-run/node'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip.tsx'
import { cn } from '#app/utils/misc.tsx'
// import { logos } from './logos/logos.ts'

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

// // Tailwind Grid cell classes lookup
// const columnClasses: Record<(typeof logos)[number]['column'], string> = {
// 	1: 'xl:col-start-1',
// 	2: 'xl:col-start-2',
// 	3: 'xl:col-start-3',
// 	4: 'xl:col-start-4',
// 	5: 'xl:col-start-5',
// }
// const rowClasses: Record<(typeof logos)[number]['row'], string> = {
// 	1: 'xl:row-start-1',
// 	2: 'xl:row-start-2',
// 	3: 'xl:row-start-3',
// 	4: 'xl:row-start-4',
// 	5: 'xl:row-start-5',
// 	6: 'xl:row-start-6',
// }

export default function Index() {
	return (
		<main className="font-poppins flex flex-col h-full place-items-center">
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-6 xl:gap-24">
				<div className="xl:col-span-1">
					<h2>Favorite Movies</h2>
				</div>
				<ul className="mt-16 flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-4 xl:col-span-5 xl:mt-0 xl:grid xl:grid-flow-col xl:grid-cols-5 xl:grid-rows-6">
					{favoriteMovies.map((movie, i) => (
						<li
							key={movie}
							className={cn(
								// columnClasses[logo.column],
								// rowClasses[logo.row],
								'animate-roll-reveal [animation-fill-mode:backwards]',
							)}
							style={{ animationDelay: `${i * 0.07}s` }}
						>
							{movie}
						</li>
					))}
				</ul>
			</div>
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-6 xl:gap-24">
				<div className="xl:col-span-1">
					<h2>Favorite Shows</h2>
				</div>
				<ul className="mt-16 flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-4 xl:col-span-5 xl:mt-0 xl:grid xl:grid-flow-col xl:grid-cols-5 xl:grid-rows-6">
					{favoriteShows.map((show) => (
						<li key={show}>{show}</li>
					))}
				</ul>
			</div>
		</main>
	)
}
