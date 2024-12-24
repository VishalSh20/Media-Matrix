import {AlertTriangle} from "lucide-react"
import PropTypes from "prop-types"

ErrorComponent.propTypes = {
    message: PropTypes.string.isRequired,
}

function ErrorComponent({message,submessage}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center h-full rounded-lg p-4 bg-red-500/10">
        <AlertTriangle width={40} height={40} className="text-red-500 text-4xl" />
        <p className="text-red-500 text-lg">{message}</p>
        {
            submessage && (
                <p className="text-red-500 font-light">{submessage}</p>
            )
        }
    </div>
  )
}

export default ErrorComponent