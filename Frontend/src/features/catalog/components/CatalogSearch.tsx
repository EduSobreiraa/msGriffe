import { useRef, useState, type FormEvent } from 'react'
import { Button } from '../../../shared/components/Button'
import { Icon } from '../../../shared/components/Icon'
import { IconButton } from '../../../shared/components/IconButton'
import { useDebouncedCallback } from '../../../shared/hooks/useDebouncedCallback'

interface CatalogSearchProps {
  onSearch: (term: string) => void
  value?: string
}

const SEARCH_DELAY = 300

export function CatalogSearch({ onSearch, value = '' }: CatalogSearchProps) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const { cancel, schedule } = useDebouncedCallback(onSearch, SEARCH_DELAY)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    cancel()
    onSearch(inputValue.trim())
  }

  const clear = () => {
    cancel()
    setInputValue('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <form className="catalog-search" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="catalog-search-input">
        Buscar produtos
      </label>
      <span className="catalog-search__icon" aria-hidden="true">
        <Icon name="search" />
      </span>
      <input
        ref={inputRef}
        id="catalog-search-input"
        type="search"
        value={inputValue}
        placeholder="Buscar por nome do produto"
        autoComplete="off"
        onChange={(event) => {
          const term = event.target.value
          setInputValue(term)
          schedule(term.trim())
        }}
      />
      {inputValue && (
        <IconButton
          className="catalog-search__clear"
          icon="x"
          label="Limpar busca"
          onClick={clear}
        />
      )}
      <Button className="catalog-search__submit" type="submit" size="small">
        Buscar
      </Button>
    </form>
  )
}
