import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAppAt } from '../test/renderAppAt'

function createDemoAccount() {
  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Maria Silva' } })
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria@exemplo.com' } })
  fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(71) 99999-9999' } })
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-segura' } })
  fireEvent.click(screen.getByRole('button', { name: 'Criar conta demonstrativa' }))
}

describe('jornada demonstrativa de conta', () => {
  it('orienta login antes de proteger perfil e pedidos', async () => {
    renderAppAt('/conta')
    expect(await screen.findByRole('heading', { name: 'Entre para continuar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/entrar')
  })

  it('cria visualmente conta, adiciona endereço, consulta pedido e expira sessão', async () => {
    renderAppAt('/criar-conta')
    createDemoAccount()

    expect(await screen.findByRole('heading', { name: 'Verifique seu e-mail' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Abrir minha conta' }))
    expect(await screen.findByRole('heading', { name: 'Olá, Maria Silva' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Identificação'), { target: { value: 'Casa' } })
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '40000-000' } })
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua das Flores' } })
    fireEvent.change(screen.getByLabelText('Número'), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } })
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Salvador' } })
    fireEvent.change(screen.getByLabelText('Estado (UF)'), { target: { value: 'BA' } })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar endereço' }))
    expect(screen.getByRole('status')).toHaveTextContent(/somente nesta demonstração/i)

    fireEvent.click(screen.getByRole('link', { name: 'Pedidos' }))
    expect(await screen.findByRole('heading', { name: 'Seus pedidos' })).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('link', { name: 'Ver pedido' })[0])
    expect(await screen.findByRole('heading', { name: 'Enviado' })).toBeInTheDocument()

    window.history.replaceState(null, '', '/conta')
    fireEvent.popState(window)
    fireEvent.click(await screen.findByRole('button', { name: 'Encerrar sessão demonstrativa' }))
    expect(await screen.findByRole('heading', { name: 'Sessão expirada' })).toBeInTheDocument()
    expect(Object.keys(window.localStorage)).not.toContain('msgriffe-account')
  })

  it('informa recuperação sem revelar existência de conta', async () => {
    renderAppAt('/recuperar-senha')
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'qualquer@exemplo.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar recuperação' }))
    expect(await screen.findByRole('status')).toHaveTextContent(/se existir uma conta elegível/i)
  })

  it('apresenta estado de acesso negado sem expor dados', async () => {
    renderAppAt('/acesso-negado')
    expect(await screen.findByRole('heading', { name: 'Acesso negado' })).toBeInTheDocument()
    expect(screen.getByText(/backend decidirá autorização real/i)).toBeInTheDocument()
  })
})
