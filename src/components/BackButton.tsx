import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './BackButton.css'

type BackButtonProps = {
  label?: string
}

function BackButton({
  label = 'Voltar',
}: BackButtonProps) {
  const navigate = useNavigate()

  function voltar() {
    navigate(-1)
  }

  return (
    <button
      type="button"
      className="back-button"
      onClick={voltar}
      aria-label={label}
    >
      <ArrowLeft size={22} strokeWidth={2.3} />
      <span>{label}</span>
    </button>
  )
}

export default BackButton