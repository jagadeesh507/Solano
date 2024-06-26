'use client'

import { Blog, Tag } from '@payload-types'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { AnimatedTooltip } from '@/components/common/AnimatedTooltip'
import { cn } from '@/utils/cn'

const getTagColors = ({ color }: { color: String }) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'gray':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    case 'red':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'green':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'indigo':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    case 'purple':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    case 'pink':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
}

const BlogPostCard = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-flow-row-dense grid-cols-1 gap-8 md:auto-rows-[28rem] md:grid-cols-2 xl:grid-cols-3',
        className,
      )}>
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  blog,
  header,
  icon,
}: {
  className?: string
  blog: Blog
  header?: React.ReactNode
  icon?: React.ReactNode
}) => {
  const { slug, title, sub_title } = blog
  return (
    <div
      className={cn(
        'group/bento relative row-span-1 flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200  bg-transparent text-white transition duration-200 hover:shadow-md dark:border-white/[0.2]',
        className,
      )}>
      {header}
      <div className='p-4'>
        {icon}
        <div className='flex flex-row justify-between gap-x-3 gap-y-3 md:gap-y-0'>
          <div className='flex gap-2 '>
            <div>
              <div className='mb-2 flex w-full flex-row items-center justify-center'>
                <AnimatedTooltip items={blog?.author as any} />
              </div>
            </div>
          </div>
          <div>
            {blog?.tags?.slice(0, 2)?.map((tag, idx) => (
              <span
                key={idx}
                className={`${getTagColors({ color: (tag?.value as Tag)?.color || 'blue' })} me-2 rounded px-2.5 py-0.5 text-xs font-medium`}>
                {(tag?.value as Tag)?.title}
              </span>
            ))}
          </div>
        </div>
        <div className='duration-500 group-hover:translate-x-2'>
          <Link
            href={`/blog/${blog?.slug}`}
            className='mb-2 mt-2 line-clamp-1 font-sans text-xl font-bold text-neutral-700 hover:text-neutral-900 dark:text-neutral-200'>
            {title}
          </Link>
          <Link
            href={`/blog/${blog?.slug}`}
            className='line-clamp-3 font-sans text-sm font-normal text-neutral-600 dark:text-neutral-300'>
            {sub_title}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPostCard

export const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string
  children: React.ReactNode | string
  childrenClassName?: string
  imageClassName?: string
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [direction, setDirection] = useState<
    'top' | 'bottom' | 'left' | 'right' | string
  >('left')

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (!ref.current) return

    const direction = getDirection(event, ref.current)
    switch (direction) {
      case 0:
        setDirection('top')
        break
      case 1:
        setDirection('right')
        break
      case 2:
        setDirection('bottom')
        break
      case 3:
        setDirection('left')
        break
      default:
        setDirection('left')
        break
    }
  }

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement,
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect()
    const x = ev.clientX - left - w / 2
    const y = ev.clientY - top - h / 2

    const dx = Math.abs(x / w)
    const dy = Math.abs(y / h)

    if (dx > dy) {
      return x < 0 ? 3 : 1
    } else {
      return y < 0 ? 0 : 2
    }
  }

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        'group/card relative flex h-full min-h-[10rem] w-full flex-1 overflow-hidden rounded-t-xl bg-transparent bg-white dark:bg-black',
        className,
      )}>
      <AnimatePresence mode='wait'>
        <motion.div
          className='relative h-full w-full'
          initial='initial'
          whileHover={direction}
          exit='exit'>
          <motion.div className='absolute inset-0 z-10 hidden h-full w-full bg-black/40 transition duration-500 group-hover/card:block' />
          <motion.div
            variants={variants}
            className='relative h-full w-full bg-gray-50 dark:bg-black'
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt='image'
              className={cn(
                'h-full w-full scale-[1.15] object-cover',
                imageClassName,
              )}
              width={10000}
              height={10000}
              src={imageUrl}
            />
          </motion.div>
          <motion.div
            variants={textVariants}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
            className={cn(
              'absolute bottom-4 left-4 z-40 text-white',
              childrenClassName,
            )}>
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

const variants = {
  initial: {
    x: 0,
  },

  exit: {
    x: 0,
    y: 0,
  },
  top: {
    y: 20,
  },
  bottom: {
    y: -20,
  },
  left: {
    x: 20,
  },
  right: {
    x: -20,
  },
}

const textVariants = {
  initial: {
    y: 0,
    x: 0,
    opacity: 0,
  },
  exit: {
    y: 0,
    x: 0,
    opacity: 0,
  },
  top: {
    y: -20,
    opacity: 1,
  },
  bottom: {
    y: 2,
    opacity: 1,
  },
  left: {
    x: -2,
    opacity: 1,
  },
  right: {
    x: 20,
    opacity: 1,
  },
}
