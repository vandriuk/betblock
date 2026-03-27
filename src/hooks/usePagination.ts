import { useState, useMemo, useEffect, useRef } from 'react'

const PAGE_SIZE = 20

export function usePagination<T>(items: T[], pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1)
  const prevLengthRef = useRef(items.length)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  // Reset to page 1 when filtered items count changes (user applied filter)
  useEffect(() => {
    if (items.length !== prevLengthRef.current) {
      setPage(1)
      prevLengthRef.current = items.length
    }
  }, [items.length])

  const safePage = page > totalPages ? 1 : page

  const paged = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  )

  const onPageChange = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetPage = () => setPage(1)

  return { paged, page: safePage, totalPages, totalItems: items.length, pageSize, onPageChange, resetPage }
}
