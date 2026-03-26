import { useState, useMemo } from 'react'

const PAGE_SIZE = 20

export function usePagination<T>(items: T[], pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  // Reset to page 1 when filtered items change and current page is out of range
  const safePage = page > totalPages ? 1 : page

  const paged = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  )

  const onPageChange = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetPage = () => setPage(1)

  return { paged, page: safePage, totalPages, totalItems: items.length, pageSize, onPageChange, resetPage }
}
