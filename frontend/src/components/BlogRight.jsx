import { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import InfoProfile from './InfoProfile'
import Notification from './Notification'

let panelOpen = true

export function openRightPanel() {
  panelOpen = true
}

function BlogRight() {
  const [role, setRole] = useState('')
  const [open, setOpen] = useState(panelOpen)

  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      const user = JSON.parse(userString)
      setRole(user.role || '')
    }
  }, [])

  const isAdmin = role === 'admin'

  const changeOpen = (next) => {
    panelOpen = next
    setOpen(next)
  }

  const toggle = (event) => {
    event.stopPropagation()
    changeOpen(!open)
  }

  return (
    <div
      className={`relative h-full border-l border-gray-200 bg-white transition-[width] duration-300 ease-out ${
        open ? 'w-80' : 'w-12 hover:bg-blue-50/70'
      } ${open ? '' : 'cursor-pointer'}`}
      onClick={() => {
        if (!open) changeOpen(true)
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="panneau-droit"
        title={open ? 'Fermer le panneau' : 'Ouvrir le panneau'}
        className={`absolute top-7 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          open ? 'left-0 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
        }`}
      >
        {open ? (
          <FiChevronRight className="h-5 w-5" aria-hidden="true" />
        ) : (
          <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
        )}
        <span className="sr-only">{open ? 'Fermer le panneau' : 'Ouvrir le panneau'}</span>
      </button>

      <div id="panneau-droit" className={open ? 'p-6' : 'hidden'}>
        <InfoProfile />
        {!isAdmin && (
          <>
            <hr className="my-8" />
            <Notification />
          </>
        )}
      </div>

      {!open && (
        <div className="flex h-full min-h-[70vh] items-start justify-center pt-24">
          <span className="select-none text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 [writing-mode:vertical-rl]">
            Profil
          </span>
        </div>
      )}
    </div>
  )
}

export default BlogRight
