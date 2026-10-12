import { MessageCircle, Phone } from 'lucide-react'
import { Button } from './Button'
import { GiuliaButton } from './GiuliaButton'
import { telUrl, whatsappUrl } from '../config/site'

type Props = { dark?: boolean; className?: string; message?: string }

/** I due modi per contattare lo studio: WhatsApp (solo messaggi) e telefono fisso. Nessun modulo. */
export function ContactButtons({ dark = false, className = '', message }: Props) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button href={whatsappUrl(message)} variant={dark ? 'light' : 'primary'} icon={<MessageCircle size={17} strokeWidth={1.8} />}>
        Scrivici su WhatsApp
      </Button>
      <Button href={telUrl} external={false} variant={dark ? 'outline-light' : 'ghost'} icon={<Phone size={16} strokeWidth={1.8} />}>
        Chiama lo studio
      </Button>
      <GiuliaButton dark={dark} />
    </div>
  )
}
