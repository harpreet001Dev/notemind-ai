import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import api from '../api/api';
import { handleFormError } from '../utlis/ApiError';
import { Link, useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.Login(data)
      localStorage.setItem('accesstoken', response.data?.accessToken)
      navigate('/notes')
    } catch (error) {
      handleFormError(error, setError)

    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card p-7 sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl font-bold text-white shadow-lg shadow-brand-500/20">N</div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-brand-600">NoteMind</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-800">Welcome back</h2>
          <p className="mt-2 text-sm text-stone-500">Sign in to continue to your notes.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-semibold text-stone-700">
            <span>Email</span>
            <input
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className="note-input mt-2 w-full rounded-xl px-4 py-3 outline-none transition placeholder:text-stone-400"
            />
            {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            <span>Password</span>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Enter your password"
                className="note-input w-full rounded-xl px-4 py-3 pr-12 outline-none transition placeholder:text-stone-400"
              />
              {errors.password && <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span>}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Show password"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-brand-600"
              >
                {
                  showPassword ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    :

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                      <path d="M9.88 4.24A10.75 10.75 0 0 1 12 4c5 0 8.5 4 10 8a16.7 16.7 0 0 1-3.17 4.73" />
                      <path d="M6.61 6.61C4.62 7.83 3.22 9.63 2 12c1.5 4 5 8 10 8a10.75 10.75 0 0 0 2.12-.24" />
                    </svg>
                }

              </button>
            </div>
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-base font-bold text-white transition hover:bg-brand-600"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 transition hover:text-brand-800">
            Register
          </Link>
        </p>
      </div>

    </section>
  )
}

export default Login
