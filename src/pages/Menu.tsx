import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  User,
  Heart,
  Settings,
  Share2,
  MessageSquare,
  Info,
  ChevronRight,
} from 'lucide-react'
import './Menu.css'

type MenuItemProps = {
  icon: ReactNode
  title: string
  description: string
  onClick: () => void
}

function MenuItem({
  icon,
  title,
  description,
  onClick,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className="menu-item"
      onClick={onClick}
    >
      <div className="menu-item-icon">
        {icon}
      </div>

      <div className="menu-item-content">
        <strong>{title}</strong>

        <span>{description}</span>
      </div>

      <ChevronRight
        size={22}
        strokeWidth={2}
        className="menu-item-arrow"
      />
    </button>
  )
}

function Menu() {
  const navigate = useNavigate()

  return (
    <main className="menu-page">
      <section className="menu-content">

        {/* =========================
            CABEÇALHO
        ========================= */}

        <header className="menu-header">
          <h1>Menu</h1>

          <p>
            Gerencie sua conta e personalize sua experiência.
          </p>
        </header>

        {/* =========================
            OPÇÕES
        ========================= */}

        <section className="menu-options">

          <MenuItem
            icon={
              <User
                size={26}
                strokeWidth={2}
              />
            }
            title="Meu Perfil"
            description="Veja e edite suas informações"
            onClick={() => navigate('/perfil')}
          />

          <MenuItem
            icon={
              <Heart
                size={26}
                strokeWidth={2}
              />
            }
            title="Favoritos"
            description="Acesse seus conteúdos favoritos"
            onClick={() => navigate('/favoritos')}
          />

          <MenuItem
            icon={
              <Settings
                size={26}
                strokeWidth={2}
              />
            }
            title="Configurações"
            description="Personalize o aplicativo do seu jeito"
            onClick={() => navigate('/configuracoes')}
          />

          <MenuItem
            icon={
              <Share2
                size={26}
                strokeWidth={2}
              />
            }
            title="Redes Sociais"
            description="Siga-nos e fique por dentro"
            onClick={() => navigate('/redes-sociais')}
          />

          <MenuItem
            icon={
              <MessageSquare
                size={26}
                strokeWidth={2}
              />
            }
            title="Enviar Feedback!"
            description="Compartilhe sua opinião com a gente"
            onClick={() => navigate('/feedback')}
          />

          <MenuItem
            icon={
              <Info
                size={26}
                strokeWidth={2}
              />
            }
            title="Sobre"
            description="Saiba mais sobre o aplicativo"
            onClick={() => navigate('/sobre')}
          />

        </section>

      </section>
    </main>
  )
}

export default Menu