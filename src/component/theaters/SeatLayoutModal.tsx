import { MouseEvent, useEffect, useRef } from "react";
import { ISeat } from "../../interface/theater/ITheaterScreen";
import { IReservedSeats } from "../../interface/theater/IMovieShow";
import { Role } from "../../interface/Interface";

interface ISeatRowProps {
  rowNumber: number;
  seats: ISeat[];
  reserved?: IReservedSeats[];
  handleSeatClick?: (index: number) => void;
  role?: Role;
  selectedSeat?: string[]
}

export const SeatRow: React.FC<ISeatRowProps> = ({ rowNumber, seats, reserved, handleSeatClick, role, selectedSeat }) => {

console.log(reserved)

  return (
    <div key={rowNumber} className="relative flex items-center ">
      <div className="absolute -left-7 font-light text-xs text-black flex items-center justify-center">
        {String.fromCharCode(64 + rowNumber)}
      </div>
      {seats.map((seat, index) => {

        const isBooked = reserved?.some((reservation) => reservation.reservedSeats.includes(seat.name));
        // const isBooked = [ 'A1', 'B2', 'C4' ].includes(seat.name);
        const isSelected = selectedSeat?.includes(seat.name)

        if (isSelected) {
          console.log(selectedSeat)
        }
        return (
          <div className={`${role === Role.users && seat.available ? 'tooltip' : role !== Role.users ? 'tooltip' : ''}`} data-tip={seat.name}>
            <div
              key={seat.name}
              onClick={() => handleSeatClick?.(index)}
              className={`seat border rounded-md  w-7 h-7 m-0.5  
              ${seat.available ? (isBooked ? "bg-gray-400 pointer-events-none " : isSelected ? "bg-sky-400" : "bg-white border-sky-300") : "border-white"}
              ${role == Role.users
                  ? `  ${seat.available && !isSelected ? "cursor-pointer hover:bg-sky-300" : !seat.available ? "pointer-events-none" : ""}`
                  : `cursor-pointer   ${seat.available ? "" : "hover:bg-gray-500"}`
                }`}
            />
          </div>
        );
      })}
    </div>
  );
};


export const ColumnNumbers: React.FC<{ columnCount: number }> = ({ columnCount }) => {
  const columns = Array.from({ length: columnCount }, (_, col) => (
    <div
      key={`column-${col + 1}`}
      className="w-7 h-7 m-0.5 flex   justify-center font-light text-xs text-black"
    >
      {col + 1}
    </div>
  ));

  return (
    <div className="relative -bottom-2 flex   items-center mb-1">
      {columns}
    </div>
  );
};

interface ISeatLayoutModalProps {
  seats: (ISeat[][] | undefined);
  rows: string,
  column: string,
  id: string,
  action: boolean,
  closeModal: () => void,
  name: string,
  handleSeatClick?: (rowIndex: number, colIndex: number) => void,
}

export const SeatLayoutModal: React.FC<ISeatLayoutModalProps> = (
  {
    seats,
    column,
    id,
    name,
    closeModal,
    handleSeatClick,
   
  }
) => {

  const columnCount = parseInt(column, 10);
  const layoutModalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (layoutModalRef.current) {
      layoutModalRef.current.showModal();
    }
  }, []);

  const closeLayoutModal = (e: MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    layoutModalRef.current?.close()
    closeModal()
  }

  return (
    <>

      <dialog ref={layoutModalRef} id={`${id}_seat_layout`} className="modal overflow-x-visible ">
        <div className="relative modal-box max-w-max">

          <button onClick={closeLayoutModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <h3 className="text-xl text-center uppercase">screen layout <span className="font-bold text-2xl">{name}</span>  </h3>
          <div className="p-3 relative ">

            {seats?.map((row, rowIndex) => (
              <SeatRow
                key={rowIndex}
                rowNumber={rowIndex + 1}
                seats={row}
                handleSeatClick={(index: number) => handleSeatClick?.(rowIndex, index)}
              />
            ))}

            <ColumnNumbers columnCount={columnCount} />
          </div>
        </div>
      </dialog>
    </>
  )
}

