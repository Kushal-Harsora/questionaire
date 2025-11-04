'use client';

// System Components Import
import React from 'react'
import { useRouter } from 'next/navigation'

// UI Components Import
import { Button } from '@/components/ui/button'


const Router = () => {

  const router = useRouter();

  return (
    <React.Fragment>
      <main className=' h-screen w-screen flex flex-col items-center justify-center'>

        <h1 className='absolute top-[10%] left-0 text-center w-full text-4xl font-bold'>
          Path Router
        </h1>

        <div className='h-fit w-full max-lg:w-3/4 flex flex-row max-lg:flex-col items-center justify-center gap-2'>
          <Button className=' w-fit max-lg:w-full' onClick={() => router.push("/form")}>
            Forms
          </Button>
          <Button className=' w-fit max-lg:w-full' onClick={() => router.push("/questions")}>
            Questionnaire
          </Button>
          <Button className=' w-fit max-lg:w-full' onClick={() => router.push("/backend")}>
            Backend
          </Button>
        </div>
      </main>
    </React.Fragment>
  )
}

export default Router