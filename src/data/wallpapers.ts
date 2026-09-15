export type Wallpaper = {
  id: string
  titulo: string
  imagem: string
  categoriaId: string
}

export type CategoriaWallpaper = {
  id: string
  nome: string
  limitePreview: number
}

export const categoriasWallpapers: CategoriaWallpaper[] = [
  {
    id: 'fe',
    nome: 'Fé',
    limitePreview: 4,
  },
  {
    id: 'jesus',
    nome: 'Jesus',
    limitePreview: 4,
  },
  {
    id: 'versiculos',
    nome: 'Versículos',
    limitePreview: 4,
  },
]

export const wallpapers: Wallpaper[] = [
  {
    id: 'fe-01',
    titulo: 'Confie em Deus',
    categoriaId: 'fe',
    imagem:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'fe-02',
    titulo: 'Permaneça firme',
    categoriaId: 'fe',
    imagem:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'fe-03',
    titulo: 'Deus está contigo',
    categoriaId: 'fe',
    imagem:
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'fe-04',
    titulo: 'Caminhe pela fé',
    categoriaId: 'fe',
    imagem:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=85',
  },

  {
    id: 'jesus-01',
    titulo: 'Com Cristo',
    categoriaId: 'jesus',
    imagem:
      'https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'jesus-02',
    titulo: 'Siga Jesus',
    categoriaId: 'jesus',
    imagem:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'jesus-03',
    titulo: 'Jesus é o caminho',
    categoriaId: 'jesus',
    imagem:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'jesus-04',
    titulo: 'Permaneça em Cristo',
    categoriaId: 'jesus',
    imagem:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=85',
  },

  {
    id: 'versiculos-01',
    titulo: 'Salmos 23',
    categoriaId: 'versiculos',
    imagem:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'versiculos-02',
    titulo: 'Salmos 37:5',
    categoriaId: 'versiculos',
    imagem:
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'versiculos-03',
    titulo: 'João 14:27',
    categoriaId: 'versiculos',
    imagem:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'versiculos-04',
    titulo: 'Isaías 41:10',
    categoriaId: 'versiculos',
    imagem:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85',
  },
]