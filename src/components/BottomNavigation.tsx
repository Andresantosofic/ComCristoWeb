import { NavLink, useLocation } from 'react-router-dom'
import {
  Home as HomeIcon,
  Heart,
  Compass,
  Newspaper,
  Menu as MenuIcon,
} from 'lucide-react'
import './BottomNavigation.css'

function BottomNavigation() {
  const location = useLocation()

  const estaEmWallpaper =
    location.pathname === '/wallpapers' ||
    location.pathname.startsWith('/wallpapers/categoria/') ||
    location.pathname.startsWith('/wallpapers/')

  const rotasPrincipais = [
    '/',
    '/devocional',
    '/explorar',
    '/feed',
    '/menu',
  ]

  const exibirBottomNavigation =
    rotasPrincipais.includes(location.pathname) ||
    estaEmWallpaper ||
    location.pathname.startsWith('/biblia') ||
    location.pathname === '/perfil' ||
    location.pathname === '/favoritos' ||
    location.pathname === '/configuracoes' ||
    location.pathname === '/redes-sociais' ||
    location.pathname === '/feedback' ||
    location.pathname === '/sobre' ||
    location.pathname === '/termos-privacidade' ||
    location.pathname === '/licenca-biblia'

  if (!exibirBottomNavigation) {
    return null
  }

  return (
    <nav className="bottom-navigation">
      <NavLink
        to="/"
        end
        className="bottom-navigation-item"
      >
        <HomeIcon size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/devocional"
        className="bottom-navigation-item"
      >
        <Heart size={22} />
        <span>Devocional</span>
      </NavLink>

      <NavLink
        to="/explorar"
        className={() =>
          `bottom-navigation-item ${
            estaEmWallpaper ? 'active' : ''
          }`
        }
      >
        <Compass size={22} />
        <span>Explorar</span>
      </NavLink>

      <NavLink
        to="/feed"
        className="bottom-navigation-item"
      >
        <Newspaper size={22} />
        <span>Feed</span>
      </NavLink>

      <NavLink
        to="/menu"
        className="bottom-navigation-item"
      >
        <MenuIcon size={22} />
        <span>Menu</span>
      </NavLink>
    </nav>
  )
}

export default BottomNavigation