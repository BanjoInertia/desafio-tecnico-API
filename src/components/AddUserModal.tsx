import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { createUser, type NewUserData } from '../services/api';
import { Combobox } from './Combobox';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
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
  max-width: 480px;
  animation: ${popIn} 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  flex-shrink: 0;
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
  background-image:
    linear-gradient(${({ theme }) => theme.colors.heroPattern} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.colors.heroPattern} 1px, transparent 1px);
  background-size: 24px 24px;
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
  min-width: 0;
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
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  box-shadow: ${({ theme, $error }) => ($error ? '3px 3px 0 #ef4444' : theme.colors.inputShadow)};
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }

  &:focus {
    border-color: ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.primary)};
    box-shadow: ${({ $error, theme }) => ($error ? '3px 3px 0 #ef4444' : theme.colors.inputShadowFocus)};
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
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
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
  font-size: 13px;
  font-weight: 900;
  font-family: inherit;
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

const RequiredNote = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: -4px 0 0;

  span {
    color: #ef4444;
  }
`;

const AVATAR_SEEDS = ['Luna', 'Felix', 'Nova', 'Zoe', 'Max', 'Ivy', 'Ace', 'Rio', 'Sam', 'Mia', 'Rex', 'Leo'];

const AvatarPickerLabel = styled.p`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 8px;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
`;

const AvatarOption = styled.button<{ $selected: boolean }>`
  aspect-ratio: 1;
  border-radius: 8px;
  border: 2px solid ${({ $selected, theme }) => ($selected ? theme.colors.heroTitle : theme.colors.border)};
  background: ${({ $selected, theme }) => ($selected ? theme.colors.toggleBg : theme.colors.surface)};
  padding: 4px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: ${({ $selected, theme }) => ($selected ? `0 0 8px ${theme.colors.heroTitle}` : 'none')};

  img {
    width: 100%;
    height: 100%;
    display: block;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.heroTitle};
  }
`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatZipcode(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

interface FormErrors {
  name?: string;
  email?: string;
}

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (user: User) => void;
  companies?: string[];
  cities?: string[];
}

export function AddUserModal({ onClose, onAdd, companies = [], cities = [] }: AddUserModalProps) {
  useBodyScrollLock();
  const dialogRef = useFocusTrap();
  const [form, setForm] = useState<NewUserData>({
    name: '', email: '', phone: '', website: '', street: '', suite: '', zipcode: '', city: '', company: '',
    avatarSeed: AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validateField(field: keyof FormErrors, value: string): string | undefined {
    if (field === 'name') {
      if (!value.trim()) return 'Nome é obrigatório';
      if (value.trim().length < 2) return 'Nome muito curto';
    }
    if (field === 'email') {
      if (!value.trim()) return 'Email é obrigatório';
      if (!emailRegex.test(value)) return 'Email inválido';
    }
  }

  function handleBlur(field: keyof FormErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function handleChange(field: keyof NewUserData, value: string) {
    const next = field === 'phone' ? formatPhone(value) : field === 'zipcode' ? formatZipcode(value) : value;
    setForm((prev) => ({ ...prev, [field]: next }));
    if (touched[field as keyof FormErrors]) {
      const error = validateField(field as keyof FormErrors, next);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }

  function validate(): boolean {
    const next: FormErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
    };
    setErrors(next);
    setTouched({ name: true, email: true });
    return !next.name && !next.email;
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
    <Overlay>
      <Dialog ref={dialogRef}>
        <Header>
          <HeaderPattern />
          <HeaderTitle>Novo Usuário</HeaderTitle>
          <CloseButton onClick={onClose} aria-label="Fechar">✕</CloseButton>
        </Header>

        <Body onSubmit={handleSubmit} noValidate>
          <RequiredNote><span>*</span> campos obrigatórios</RequiredNote>
          <Row>
            <Field>
              <Label>Nome <Required>*</Required></Label>
              <Input
                placeholder="Nome completo"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
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
                onBlur={() => handleBlur('email')}
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
                inputMode="numeric"
              />
            </Field>

            <Field>
              <Label>Website</Label>
              <Input
                placeholder="exemplo.com"
                value={form.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>Rua</Label>
              <Input
                placeholder="Nome da rua"
                value={form.street}
                onChange={(e) => handleChange('street', e.target.value)}
              />
            </Field>

            <Field>
              <Label>Complemento</Label>
              <Input
                placeholder="Apto, sala..."
                value={form.suite}
                onChange={(e) => handleChange('suite', e.target.value)}
              />
            </Field>
          </Row>

          <Row>
            <Field>
              <Label>CEP</Label>
              <Input
                placeholder="00000-000"
                value={form.zipcode}
                onChange={(e) => handleChange('zipcode', e.target.value)}
                inputMode="numeric"
              />
            </Field>

            <Field>
              <Label>Cidade</Label>
              <Combobox
                value={form.city}
                onChange={(v) => handleChange('city', v)}
                options={cities}
                placeholder="Selecione ou digite"
              />
            </Field>
          </Row>

          <Field>
            <Label>Empresa</Label>
            <Combobox
              value={form.company}
              onChange={(v) => handleChange('company', v)}
              options={companies}
              placeholder="Selecione ou digite"
            />
          </Field>

          <Field>
            <AvatarPickerLabel>Avatar</AvatarPickerLabel>
            <AvatarGrid>
              {AVATAR_SEEDS.map((seed) => (
                <AvatarOption
                  key={seed}
                  type="button"
                  $selected={form.avatarSeed === seed}
                  onClick={() => setForm((prev) => ({ ...prev, avatarSeed: seed }))}
                >
                  <img
                    src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=transparent`}
                    alt={seed}
                  />
                </AvatarOption>
              ))}
            </AvatarGrid>
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
