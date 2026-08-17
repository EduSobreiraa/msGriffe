import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAppAt } from '../test/renderAppAt'

function completeCheckoutForm() {
  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Maria Silva' } })
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria@exemplo.com' } })
  fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(71) 99999-9999' } })
  fireEvent.change(screen.getByLabelText('Senha para criar conta'), { target: { value: 'senha-segura' } })
  fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '123.456.789-09' } })
  fireEvent.change(screen.getByLabelText('Data de nascimento'), { target: { value: '1990-01-20' } })
  fireEvent.click(screen.getByRole('button', { name: 'Continuar para entrega' }))
  fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '40000-000' } })
  fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua das Flores' } })
  fireEvent.change(screen.getByLabelText('Número'), { target: { value: '10' } })
  fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } })
  fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Salvador' } })
  fireEvent.change(screen.getByLabelText('Estado (UF)'), { target: { value: 'BA' } })
  fireEvent.click(screen.getByRole('button', { name: 'Continuar para revisão' }))
  fireEvent.click(screen.getByRole('radio', { name: /Pix/ }))
}

describe('jornada demonstrativa de checkout', () => {
  it('vai do produto à simulação aprovada sem iniciar operação real', async () => {
    renderAppAt('/produtos/camiseta-boss')

    await screen.findByRole('heading', { name: 'Camiseta Boss' })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar à sacola' }))
    fireEvent.click(screen.getByRole('button', { name: 'Abrir sacola, 1 item' }))
    fireEvent.click(screen.getByRole('link', { name: 'Ver sacola' }))
    fireEvent.click(screen.getByRole('link', { name: 'Continuar checkout demonstrativo' }))

    expect(await screen.findByRole('heading', { name: 'Finalizar compra' })).toBeInTheDocument()
    completeCheckoutForm()
    fireEvent.click(screen.getByRole('button', { name: 'Simular criação do pedido' }))
    fireEvent.click(screen.getByRole('button', { name: 'Simular pagamento aprovado' }))

    expect(screen.getByRole('status')).toHaveTextContent(/pagamento aprovado/i)
    expect(screen.getByRole('status')).toHaveTextContent(/reduzir estoque em transação/i)
    expect(window.location.pathname).toBe('/checkout')
    expect(Object.keys(window.localStorage)).not.toContain('msgriffe-checkout')
  })
})
