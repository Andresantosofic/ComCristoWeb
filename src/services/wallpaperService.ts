import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore'

import { db } from '../firebase/firebase'

export type Wallpaper = {
  id: string
  titulo: string
  imagem: string
  categoriaId: string
  ativo: boolean
  ordem: number
}

export type CategoriaWallpaper = {
  id: string
  nome: string
  ordem: number
  ativo: boolean
  limitePreview: number
}

/**
 * Observa as categorias de wallpapers em tempo real.
 *
 * Firebase:
 * categorias_wallpapers
 *
 * Filtros:
 * ativo == true
 *
 * Ordenação:
 * ordem crescente
 */
export function observarCategoriasWallpapers(
  callback: (categorias: CategoriaWallpaper[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const referencia = collection(db, 'categorias_wallpapers')

  const consulta = query(
    referencia,
    where('ativo', '==', true),
    orderBy('ordem', 'asc'),
  )

  return onSnapshot(
    consulta,
    (snapshot) => {
      const categorias: CategoriaWallpaper[] = snapshot.docs.map((doc) => {
        const dados = doc.data()

        return {
          id: doc.id,
          nome: dados.nome ?? '',
          ordem: Number(dados.ordem ?? 0),
          ativo: dados.ativo ?? true,
          limitePreview: Number(dados.limitePreview ?? 4),
        }
      })

      callback(categorias)
    },
    (error) => {
      console.error(
        'Erro ao observar categorias de wallpapers:',
        error,
      )

      onError?.(error)
    },
  )
}

/**
 * Observa todos os wallpapers ativos em tempo real.
 *
 * Firebase:
 * wallpapers
 *
 * Filtros:
 * ativo == true
 *
 * Ordenação:
 * ordem crescente
 */
export function observarWallpapers(
  callback: (wallpapers: Wallpaper[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const referencia = collection(db, 'wallpapers')

  const consulta = query(
    referencia,
    where('ativo', '==', true),
    orderBy('ordem', 'asc'),
  )

  return onSnapshot(
    consulta,
    (snapshot) => {
      const wallpapers: Wallpaper[] = snapshot.docs.map((doc) => {
        const dados = doc.data()

        return {
          id: doc.id,
          titulo: dados.titulo ?? '',
          imagem: dados.imagem ?? '',
          categoriaId: dados.categoriaId ?? '',
          ativo: dados.ativo ?? true,
          ordem: Number(dados.ordem ?? 0),
        }
      })

      callback(wallpapers)
    },
    (error) => {
      console.error(
        'Erro ao observar wallpapers:',
        error,
      )

      onError?.(error)
    },
  )
}
export function observarWallpaperPorId(
  wallpaperId: string,
  callback: (wallpaper: Wallpaper | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const referencia = doc(db, 'wallpapers', wallpaperId)

  return onSnapshot(
    referencia,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      const dados = snapshot.data()

      const wallpaper: Wallpaper = {
        id: snapshot.id,
        titulo: dados.titulo ?? '',
        imagem: dados.imagem ?? '',
        categoriaId: dados.categoriaId ?? '',
        ativo: dados.ativo ?? true,
        ordem: Number(dados.ordem ?? 0),
      }

      if (wallpaper.ativo !== true) {
        callback(null)
        return
      }

      callback(wallpaper)
    },
    (error) => {
      console.error(
        'Erro ao carregar wallpaper:',
        error,
      )

      onError?.(error)
    },
  )
}