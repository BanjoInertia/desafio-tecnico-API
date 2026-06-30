import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { createUser, type NewUserData } from '../services/api';
import type { User } from '../types/user';

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.overlay};
  animation: ${fadeIn} 0.18s ease;
`;

const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.modalShadow};
  width: 100%;
  max-width: 460px;
  overflow: hidden;
  animation: ${popIn} 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.heroBg};
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2.5px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
`;

const HeaderPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    ${({ theme }) => theme.colors.heroPattern} 1.5px,
    transparent 1.5px
  );
  background-size: 18px 18px;
  pointer-events: none;
`;

const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.heroTitle};
  margin: 0;
  position: relative;
  z-index: 1;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid ${({ theme }) => theme.colors.toggleBorder};
  background: ${({ theme }) => theme.colors.toggleBg};
  color: ${({ theme }) => theme.colors.toggleColor};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.toggleBorder};
  }
`;

const Body = styled.form`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const Input = styled.input<{ $error?: boolean }>`
  padding: 10px 12px;
  border-radius: 7px;
  border: 2px solid ${({ theme, $error }) => ($error ? '#ef4444' : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;
  box-shadow: ${({ theme, $error }) => ($error ? '3px 3px 0 #ef4444' : theme.colors.inputShadow)};
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.colors.inputShadowFocus};
  }
`;

const ErrorMsg = styled.p`
  font-size: 11px;
  font-weight: 700;
  color: #ef4444;
  margin: 0;
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 700;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.colors.inputShadow};
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 5px 5px 0 ${({ theme }) => theme.colors.border};
    transform: translate(-1px, -1px);
  }
`;

const SubmitButton = styled.button`
  padding: 10px 22px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 14px;
  font-weight: 900;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.colors.cardShadow};
  transition: box-shadow 0.15s, transform 0.15s;
  min-width: 110px;

  &:hover:not(:disabled) {
    box-shadow: 5px 5px 0 ${({ theme }) => theme.colors.border};
    transform: translate(-1px, -1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApiNote = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding-top: 4px;
  margin: 0;
`;

interface FormErrors {
  name?: string;
  email?: string;
}

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (user: User) => void;
}

export function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
  const [form, setForm] = useState<NewUserData>({
    name: '', email: '', phone: '', company: '', city: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Nome é obrigatório';
    else if (form.name.trim().length < 2) next.name = 'Nome muito curto';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) next.email = 'Email é obrigatório';
    else if (!emailRegex.test(form.email)) next.email = 'Email inválido';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(field: keyof NewUserData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);
    try {
      const created = await createUser(form);
      onAdd(created);
      onClose();
    } catch (err) {
      setApiError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderPattern />
          <HeaderTitle>Novo Usuário</HeaderTitle>
          <CloseButton onClick={onClose} aria-label="Fechar">✕</CloseButton>
        </Header>

        <Body onSubmit={handleSubmit} noValidate>
          <Row>
            <Field>
              <Label>Nome <Required>*</Required></Label>
              <Input
                placeholder="Nome completo"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                $error={!!errors.name}
              />
              {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
            </Field>

            <Field>
              <Label>Email <Required>*</Required></Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                $error={!!errors.email}
              />
              {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Telefone</Label>
              <Input
                placeholder="(11) 99999-9999"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Field>

            <Field>
              <Label>Cidade</Label>
              <Input
                placeholder="São Paulo"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </Field>
          </Row>

          <Field>
            <Label>Empresa</Label>
            <Input
              placeholder="Nome da empresa"
              value={form.company}
              onChange={(e) => handleChange('company', e.target.value)}
            />
          </Field>

          {apiError && <ErrorMsg>{apiError}</ErrorMsg>}

          <Footer>
            <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Criando...' : 'Criar usuário'}
            </SubmitButton>
          </Footer>

          <ApiNote>Os dados são enviados ao JSONPlaceholder e adicionados localmente.</ApiNote>
        </Body>
      </Dialog>
    </Overlay>
  );
}
