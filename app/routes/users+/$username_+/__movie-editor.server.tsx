import { parseWithZod } from '@conform-to/zod'
import {
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	json,
	unstable_parseMultipartFormData as parseMultipartFormData,
	redirect,
	type ActionFunctionArgs,
} from '@remix-run/node'
import { z } from 'zod'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import {
	MAX_UPLOAD_SIZE,
	MovieEditorSchema,
} from './__movie-editor'

export async function action({ request }: ActionFunctionArgs) {
	const userId = await requireUserId(request)

	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)

	const submission = await parseWithZod(formData, {
		schema: MovieEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const movie = await prisma.movie.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!movie) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Movie not found',
				})
			}
		}).transform(async ({ ...data }) => {
			return {
				...data,
            }		
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return json(
			{ result: submission.reply() },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const {
		id: movieId,
		title,
        release,
	} = submission.value

	const updatedMovie = await prisma.movie.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: movieId ?? '__new_movie__' },
		create: {
			ownerId: userId,
			title,
            release,
		},
		update: {
			title,
            release
		},
	})

	return redirect(
		`/users/${updatedMovie.owner.username}/movies/${updatedMovie.id}`,
	)
}
