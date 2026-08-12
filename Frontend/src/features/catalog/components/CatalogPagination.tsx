import { IconButton } from '../../../shared/components/IconButton'

interface CatalogPaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2))
  const end = Math.min(totalPages, start + 2)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function CatalogPagination({
  currentPage,
  onPageChange,
  totalPages,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Paginação do catálogo">
      <IconButton
        className="pagination__arrow"
        icon="chevron-left"
        label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {getVisiblePages(currentPage, totalPages).map((page) => (
        <button
          className={`pagination__page ${page === currentPage ? 'active' : ''}`}
          type="button"
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={`Página ${page}`}
          key={page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <IconButton
        className="pagination__arrow"
        icon="chevron-right"
        label="Próxima página"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  )
}
