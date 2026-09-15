import { useCallback, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Biblia from './pages/Biblia'
import Devocional from './pages/Devocional'
import Explorar from './pages/Explorar'
import Feed from './pages/Feed'
import Menu from './pages/Menu'
import Ofertas from './pages/Ofertas'
import Favoritos from './pages/Favoritos'

import Wallpapers from './pages/Wallpapers'
import WallpapersCategoria from './pages/WallpapersCategoria'
import WallpaperDetalhe from './pages/WallpaperDetalhe'

import MeuPerfil from './pages/MeuPerfil'
import Configuracoes from './pages/Configuracoes'
import RedesSociais from './pages/RedesSociais'
import Feedback from './pages/Sugestao'
import Sobre from './pages/Sobre'
import TermosPrivacidade from './pages/TermosPrivacidade'
import LicencaBiblia from './pages/LicencaBiblia'
import Capitulos from './pages/Capitulos'
import Leitura from './pages/Leitura'

import BottomNavigation from './components/BottomNavigation'
import Splash from './components/Splash/Splash'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const [splashAtiva, setSplashAtiva] = useState(true)

  const finalizarSplash = useCallback(() => {
    setSplashAtiva(false)
  }, [])

  return (
    <>
      {splashAtiva && (
        <Splash onFinish={finalizarSplash} />
      )}

<BrowserRouter>
  <ScrollToTop />

  <Routes>
    ...
  </Routes>

  <BottomNavigation />
</BrowserRouter>

      <BrowserRouter>
        <Routes>

          {/* =========================
              PÁGINAS PRINCIPAIS
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/biblia"
            element={<Biblia />}
          />

          <Route
            path="/devocional"
            element={<Devocional />}
          />

          <Route
            path="/explorar"
            element={<Explorar />}
          />

          <Route
            path="/feed"
            element={<Feed />}
          />

          <Route
            path="/menu"
            element={<Menu />}
          />

          <Route
            path="/ofertas"
            element={<Ofertas />}
          />

          <Route
            path="/favoritos"
            element={<Favoritos />}
          />

          <Route
            path="/biblia/capitulos"
            element={<Capitulos />}
          />

          <Route
            path="/biblia/leitura"
            element={<Leitura />}
          />


          {/* =========================
              WALLPAPERS
          ========================= */}

          <Route
            path="/wallpapers"
            element={<Wallpapers />}
          />

          <Route
            path="/wallpapers/categoria/:categoriaId"
            element={<WallpapersCategoria />}
          />

          <Route
            path="/wallpapers/:wallpaperId"
            element={<WallpaperDetalhe />}
          />


          {/* =========================
              MENU
          ========================= */}

          <Route
            path="/perfil"
            element={<MeuPerfil />}
          />

          <Route
            path="/configuracoes"
            element={<Configuracoes />}
          />

          <Route
            path="/redes-sociais"
            element={<RedesSociais />}
          />

          <Route
            path="/feedback"
            element={<Feedback />}
          />

          <Route
            path="/sobre"
            element={<Sobre />}
          />


          {/* =========================
              SOBRE
          ========================= */}

          <Route
            path="/termos-privacidade"
            element={<TermosPrivacidade />}
          />

          <Route
            path="/licenca-biblia"
            element={<LicencaBiblia />}
          />

        </Routes>

        <BottomNavigation />

      </BrowserRouter>
    </>
  )
}

export default App
