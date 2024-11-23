import Qrcode from "react-qr-code";

interface TicketQRCodeProps {
    seats: string[]
    bookingCode: string
}

function TicketQRCode({ bookingCode, seats }: TicketQRCodeProps) {
    return (
        <>
            <div className="h-auto w-full max-w-12 mx-0 my-auto" >
                <Qrcode
                    size={64}
                    value={`${bookingCode},\t seats:${seats.join(',')}`}
                />
            </div>
        </>
    )
}

export default TicketQRCode

