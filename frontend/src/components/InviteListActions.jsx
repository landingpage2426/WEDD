import { useEffect, useState } from 'react'
import axios from 'axios'
import { downloadInviteListPdf } from '../utils/GenerateInviteListPdf'
import { useI18n } from '../i18n/I18nContext'

let sortOrder = null
let exportList = null
const listeners = new Set()

export function getInviteSortOrder() {
  return sortOrder
}

export function subscribeInviteSort(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setInviteExportList(list) {
  exportList = list
}

function setInviteSortOrder(next) {
  sortOrder = next
  listeners.forEach((listener) => listener(sortOrder))
}

export function sortInvites(invites, order = sortOrder) {
  if (!order) return invites
  const direction = order === 'asc' ? 1 : -1
  return [...invites].sort((a, b) => {
    const byNom = String(a.nom || '').localeCompare(String(b.nom || ''), 'fr', { sensitivity: 'base' })
    if (byNom !== 0) return byNom * direction
    return String(a.prenom || '').localeCompare(String(b.prenom || ''), 'fr', { sensitivity: 'base' }) * direction
  })
}

function InviteListActions() {
  const [order, setOrder] = useState(sortOrder)
  const [downloading, setDownloading] = useState(false)
  const { language, t } = useI18n()
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => subscribeInviteSort(setOrder), [])

  const download = async () => {
    setDownloading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      let list = exportList
      if (!list) {
        const response = await axios.get(`${apiUrl}/api/invites`, { headers, withCredentials: true })
        list = sortInvites(response.data.invites || [], order)
      }

      let wedding = {}
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        wedding = { nom: user.nom, prenom: user.prenom, dateMariage: user.dateMariage }
      } catch {
        wedding = {}
      }

      try {
        const profile = await axios.get(`${apiUrl}/api/profil`, { headers })
        const data = profile.data.user || {}
        wedding = {
          nom: data.mariesNom || data.nom || wedding.nom,
          prenom: data.mariesPrenom || data.prenom || wedding.prenom,
          dateMariage: data.dateMariagePrevu || data.dateMariage || wedding.dateMariage,
        }
      } catch {
        /* le profil local suffit */
      }

      downloadInviteListPdf(list, wedding, language)
    } catch (error) {
      console.error(error)
      alert(t('pdf.downloadError'))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 lg:flex lg:justify-end">
      <button
        type="button"
        onClick={() => setInviteSortOrder(order === 'asc' ? 'desc' : 'asc')}
        className={`w-full rounded-lg px-3 py-2.5 text-sm font-medium lg:w-auto ${
          order
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {order === 'desc' ? 'Z → A' : 'A → Z'}
      </button>
      <button
        type="button"
        onClick={download}
        disabled={downloading}
        className="w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 lg:w-auto"
      >
        {downloading ? 'Préparation...' : 'Télécharger la liste'}
      </button>
    </div>
  )
}

export default InviteListActions
