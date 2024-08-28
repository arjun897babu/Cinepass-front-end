import { MouseEvent, useEffect, useRef, useState } from "react";
import { ISeat } from "../../interface/theater/ITheaterScreen";

const SeatRow: React.FC<{ rowNumber: number; columnCount: number, action: boolean,seats:ISeat[],handleSeatClick?: (index: number) => void }> = ({ rowNumber, columnCount, action,seats,handleSeatClick }) => {
  // const [seats, setSeats] = useState<ISeat[]>(
  //   Array.from({ length: columnCount }, (_, col) => ({
  //     name: `${String.fromCharCode(64 + rowNumber)}${col + 1}`,
  //     available: true,
  //   }))
  // );
  console.log(seats);
  

  return (
    <div key={rowNumber} className="relative flex items-center">
      <div className="absolute -left-7 font-light text-xs text-black flex items-center justify-center">
        {String.fromCharCode(64 + rowNumber)}
      </div>
      {seats.map((seat, index) => (
        <div
          key={seat.name}
          onClick={() => handleSeatClick?.(index)}
          className={`seat border border-blue-300 rounded-md w-7 h-7 m-0.5 cursor-pointer ${seat.available ? "bg-white " : "  border-white"
            }`}
        />
      ))}
    </div>
  );
};


const ColumnNumbers: React.FC<{ columnCount: number }> = ({ columnCount }) => {
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

export const SeatLayoutModal: React.FC<{ seats: (ISeat[][] | undefined), rows: string, column: string, id: string, action: boolean, closeModal: () => void, name: string, handleSeatClick?: (rowIndex: number, colIndex: number) => void, }> = ({seats, rows, column, id, action, name, closeModal ,handleSeatClick}) => {

  const rowCount = parseInt(rows, 10);
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
          <div className="p-3 relative  ">

          {seats?.map((row, rowIndex) => (
              <SeatRow
                key={rowIndex}
                rowNumber={rowIndex + 1}
                columnCount={columnCount}
                action={action}
                seats={row}
                handleSeatClick={(index:number) => handleSeatClick?.(rowIndex, index)}
              />
            ))}
            {/* {Array.from({ length: rowCount }, (_, row) => (
              <SeatRow key={row + 1} rowNumber={row + 1} columnCount={columnCount} action={action} />
            ))} */}
            <ColumnNumbers columnCount={columnCount} />
          </div>
        </div>
      </dialog>
    </>
  )
}

