import { string, z } from 'zod'
import { MovieFormat, Language } from './validator';
import { Action, MovieType } from '../interface/Interface';

export const movieSchema = (movieType: MovieType, action: Action) => {
  const baseSchema = {
    movie_name: z
      .string()
      .min(1, 'Enter a movie name (1-150 characters)')
      .max(150, 'Enter a movie name (1-150 characters)')
      .regex(/^[a-zA-Z0-9']+(?: [a-zA-Z0-9\-:(),.']+)*$/, 'Invalid movie name'),
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
      .nonempty('Choose at least one genre'),
    languages: z
      .array(z.string())
      .nonempty('Choose at least one language'),
    format: z
      .array(z.string())
      .nonempty('Choose at least one format'),
    cover_photo: z
      .string()
      .min(1, 'Cover photo is required'),
    movie_poster: z
      .string()
      .min(1, 'Movie poster is required'),
  };


  const fileSchema = z
    .instanceof(File)
    .refine((file) => {
      const validTypes = ['video/mp4', 'video/mpeg', 'video/webm', 'video/mkv'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const validExtensions = ['.mp4', '.mpeg', '.webm', '.mkv'];

      return validTypes.includes(file.type) || validExtensions.includes(fileExtension);
    }, {
      message: 'Invalid video format. Allowed formats are .mp4, .mpeg, .webm, .mkv',
    })
    .refine((file) => file.size <= 200 * 1024 * 1024, {
      message: 'File size must be less than 200MB',
    });

  const videoFileSchema = z.object({
    secure_url: z.string(),
    public_id: z.string(),
  });

  if (movieType === MovieType.stream) {
    if (action === Action.ADD) {
      return z.object({
        ...baseSchema,
        plan: z.string({
          required_error: 'Choose a plan',
        }),
        file: fileSchema.refine((file) => file !== undefined, {
          message: 'Please upload a movie video file.',
        }),
      });
    } else if (action === Action.UPDATE) {
      return z.object({
        ...baseSchema,
        plan: z.string().optional(),
        file: z.union([
          fileSchema.optional(),
          videoFileSchema.optional(),
        ]),
      });
    }
  }

  // For non-streaming movies or theater releases
  return z.object({
    ...baseSchema,
    plan: z.string().optional(),
    file: z.instanceof(File).optional(), // Optional file, not required in non-stream movies
  });
};



export const movieShowSchema = z.object({
  movieId: z
    .string({
      required_error: 'select a movie'
    })
    .nonempty('select movie'),

  language: z
    .nativeEnum(Language, {
      errorMap: (_, _ctx) => {
        return { message: 'choose a language' }
      }
    }),
  screenId: z
    .string({
      required_error: 'select screen'
    })
    .nonempty('select a screen '),
  showTime: z
    .string({
      required_error: 'choose show time'
    })
    .nonempty('set a show time'),
  format: z
    .nativeEnum(MovieFormat, {
      errorMap: (_, _ctx) => {
        return { message: 'choose a format' }
      }
    }),
  endTime: z
    .string({
      required_error: 'choose end Time'
    }),

  openingDate: z
    .string()
    .nonempty('choose a opening date for booking')
})

const TheaterOwnerEntitySchema = z.object({
  name: z
    .string()
    .nonempty('This filed is required')
    .min(3, 'enter name(3-20 characters)')
    .max(20, 'enter name(3-20 characters)')
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Invalid name'),
  email: z
    .string()
    .nonempty('This filed is required')
    .regex(/^(?=.{11,100}$)([a-zA-Z\d]+([.-_]?[a-zA-Z\d]+)*)\@([a-zA-Z]{5,9})+\.com$/, 'invalid email'),
  mobile_number: z
    .union([z.string(), z.number()])
    .transform((value) => String(value))
    .refine((value) => /^\d{10}$/.test(value), {
      message: 'Invalid mobile number',
    }),
  password: z
    .string()
    .nonempty('This filed is required'),
  adhaar_number: z
    .union([z.string(), z.number()])
    .transform((value) => String(value))
    .refine((value) => /^\d{12}$/.test(value), {
      message: 'invalid adhaar number',
    }),
  theater_name: z
    .string()
    .nonempty('this filed is requied')
    .min(3, 'enter name(3-150 characters)')
    .max(150, 'enter name(3-150 characters)')
    .regex(/^[a-zA-Z0-9,]+(?: [a-zA-Z0-9,]+)*$/),
  theater_license: z
    .string()
    .nonempty('this filed is requied')
    .regex(/^[a-zA-Z0-9]+$/, 'invalid theater license'),
  address: z
    .string()
    .min(30, 'enter name(3-120 characters)')
    .max(120, 'enter name(3-120 characters)')
    .regex(/^[a-zA-Z0-9, ]+$/, 'invalid address'),
  city: z
    .string()
    .min(3, 'enter name(3-25 characters)')
    .max(25, 'enter name(3-25 characters)')
    .regex(/^[a-zA-Z0-9, ]+$/, 'invalid address'),

});

export const TheaterOwnerSchema = TheaterOwnerEntitySchema.pick({
  name: true,
  email: true,
  mobile_number: true,
  adhaar_number: true,
});

export const TheaterProfileSchema = TheaterOwnerEntitySchema.pick({
  theater_name: true,
  theater_license: true,
  address: true,
  city: true,
})
// .extend({
//   images: z
//     .array(z.string())
//     .min(1, "At least one image is required")
//     .max(4, "You can upload up to 4 images")
//     .optional()

// })


export const theaterScreenSchema = z.object({
  screen_name: z
    .string()
    .min(4, { message: 'required at least 4 characters' })
    .max(20, { message: 'required at most 20 characters' })
    .regex(/^[a-zA-Z]+(?: [0-9]+)*$/, 'Invalid name'),
  rows: z
    .string()
    .regex(/^\d+$/, 'Enter a number')
    .refine((val) => parseInt(val, 10) >= 1, {
      message: 'Enter a valid row',
    }),
  column: z
    .string()
    .regex(/^\d+$/, 'Enter a number')
    .refine((val) => parseInt(val, 10) >= 1, {
      message: 'enter a valid number',
    }),
  amenity: z
    .nativeEnum(MovieFormat, {
      errorMap: (_, _ctx) => {
        return { message: 'choose a format' }
      }
    }),
  chargePerSeat: z
    .string()
    .regex(/^\d+$/, 'Enter a valid price')
    .refine((val) => parseInt(val, 10) >= 1, {
      message: 'enter a valid number',
    }),
  seating_capacity: z
    .string()
});



export const userProfileSchem = z.object({
  name: z
    .string()
    .nonempty('This filed is required')
    .min(3, 'enter name(3-20 characters)')
    .max(20, 'enter name(3-20 characters)')
    .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Invalid name'),
  mobile_number: z.preprocess(
    (value) => (value !== null ? Number(value) : value),
    z.union([z.number(), z.null()]).refine((value) => value !== null, {
      message: 'Add a mobile number',
    })
      .refine((value) => value !== null && /^\d{10}$/.test(value.toString()), {
        message: 'Invalid mobile number',
      })
  ),
})

export const ProfilePitcuteZchema = z.object({
  profile_picture: string()
})

export const changePasswordSchema = z.object({
  password: z
    .string()
    .nonempty('This filed is required')
    .min(6, 'password must be 6 - 20 characters long')
    .max(20, 'password must be 6 - 20 characters long'),
  confirm_password: z
    .string()
    .nonempty('This filed is required'),
})
  .refine((data) => {
    if (data.password && data.password !== data.confirm_password) {
      return false;
    }
    return true;
  }, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })


export const StreamPlanSchema = z.object({
  planName: z
    .string({
      required_error: generateFiledRequired('plan name'),
      invalid_type_error: "Invalid input type",
    })
    .min(4, { message: 'Please enter a valid plan name' })
    .max(15, { message: 'Plan name length exceeded' })
    .refine((val) => val.trim().length > 0, {
      message: "Plan name cannot be empty",
    })
    .refine((val) => !/^\d+$/.test(val.trim()), {
      message: 'Enter a valid plan name'
    }),

  price: z
    .number({
      required_error: generateFiledRequired('price'),
      invalid_type_error: "Price must be a number",
      coerce: true
    })
    .positive({ message: "Price must be a positive number" }),

  validity: z
    .number({
      required_error: generateFiledRequired('validity'),
      invalid_type_error: "Validity must be a number",
      coerce: true
    })
    .min(1, { message: "Validity must be at least 1 month" })
    .max(12, { message: "Validity can be at most 12 months" })
});


function generateFiledRequired(filed: string) {
  return `${filed} is required`
}