import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAppAt } from '../test/renderAppAt'

describe('jornada demonstrativa administrativa', () => {
  it('mostra dashboard e muda período sem calcular dados reais', async () => {
    renderAppAt('/admin')
    expect(await screen.findByRole('heading', { name: 'Visão geral' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Período do dashboard' }), { target: { value: '7 dias' } })
    expect(screen.getByRole('combobox', { name: 'Período do dashboard' })).toHaveValue('7 dias')
    expect(screen.getByText(/métricas demonstrativas/i)).toBeInTheDocument()
  })

  it('altera somente estado visual de pedido e estoque', async () => {
    renderAppAt('/admin/pedidos')
    expect(await screen.findByRole('heading', { name: 'Pedidos' })).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Avançar visualmente' })[0])
    expect(screen.getAllByText('Em preparação')).toHaveLength(2)
    fireEvent.click(screen.getByRole('link', { name: 'MSG-1024' }))
    expect(await screen.findByRole('heading', { name: 'MSG-1024' })).toBeInTheDocument()
    expect(screen.getByText('Pagamento')).toBeInTheDocument()

    window.history.replaceState(null, '', '/admin/catalogo')
    fireEvent.popState(window)
    expect(await screen.findByRole('heading', { name: 'Catálogo e estoque' })).toBeInTheDocument()
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Estoque de Camiseta Boss' }), { target: { value: '0' } })
    expect(screen.getByRole('spinbutton', { name: 'Estoque de Camiseta Boss' })).toHaveValue(0)
    expect(screen.getByText(/não alteram estoque/i)).toBeInTheDocument()
  })

  it('distingue capacidade SELLER e SUPERADMIN', async () => {
    renderAppAt('/admin/configuracoes')
    expect(await screen.findByRole('heading', { name: 'Configurações e auditoria' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Capacidade restrita' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'SUPERADMIN' }))
    expect(screen.getByRole('heading', { name: 'Capacidade SUPERADMIN visual' })).toBeInTheDocument()
    expect(screen.getByText(/nenhuma configuração é alterada/i)).toBeInTheDocument()
  })
})
