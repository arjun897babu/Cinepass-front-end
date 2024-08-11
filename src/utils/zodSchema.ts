import { z } from 'zod'

export const movieSchema = z.object({
  movie_name: z
    .string()
    .min(1, 'enter a movie name(1-150 characters)')
    .max(150, 'enter a movie name(1-150 characters)')
    .regex(/^[a-zA-Z0-9']+(?: [a-zA-Z0-9\-:(),.']+)*$/, 'invalid movie name'), //correct the regex for first name
  release_date: z
    .string()
    .min(1, 'Release date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  run_time: z
    .string()
    .transform((value) => Number(value))
    .refine((value) => !isNaN(value), 'Invalid number')
    .refine((value) => value >= 60 && value <= 300, 'Must be between 60 and 300 minutes'),
  genres: z
    .array(z.string())
    .nonempty('choose one field'),
  languages: z
    .array(z.string())
    .nonempty('choode one field'),
  format: z
    .array(z.string())
    .nonempty('choose one field'),
  cover_photo: z
    .string()
    .min(1, 'image is required'),
  movie_poster: z
    .string()
    .min(1, 'image is required'),
  plan: z
    .string()
    .optional(),
});
