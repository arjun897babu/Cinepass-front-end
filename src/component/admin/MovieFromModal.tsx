import { MouseEvent, useEffect, useRef, useState } from "react";
import MovieForm from "./MovieForm";
import Toast2 from "../Toast2";
import { ToastMessage } from "../../pages/admin/layout/AdminUsers";
import {
  Action,
  IMovie,
  IStreamingMovieData,
  ITheaterMovieData,
  MovieType,
  ResponseStatus
} from "../../interface/Interface";

interface MovieModalProp {
  id: string // id for modal
  action: string // update or add 
  setToast: (alert: ResponseStatus, message: string) => void; // call back  for setting toast message
  closeModal: () => void //call back for updating modal view state
  movieType: MovieType
  updateMovieTable: (action: Action) => void;
  selectedData?: IMovie | ITheaterMovieData | IStreamingMovieData,// selected movie data | undefined for add movie
}

//modal for adding and updating movie
export const MovieModal: React.FC<MovieModalProp> = (
  {
    id,
    action,
    closeModal,
    setToast,
    movieType,
    selectedData,
    updateMovieTable
  }) => {

  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalToast, setModalToast] = useState<ToastMessage | null>(null);

  const setModalToastMessage = (alert: ResponseStatus, message: string) => setModalToast({ alert, message })
  const clearModalToast = () => setModalToast(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  const closeForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    modalRef.current?.close()
    closeModal()
  }
  return (

    <>
      <dialog ref={modalRef} id={`${id}_Form`} className="modal relative ">
        {modalToast &&
          <Toast2
            alert={modalToast.alert}
            clearToast={clearModalToast}
            message={modalToast.message}
            modalToast={true} />
        }

        <div className="modal-box w-11/12 max-w-3xl  ">

          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeForm}>✕</button>
          <h3 className="text-2xl font-bold mb-4 text-center uppercase">{action} Movie</h3>
          <MovieForm
            movieType={movieType}
            updateMovieTable={updateMovieTable}
            closeButtonRef={modalRef}
            selectedData={selectedData}
            setToast={setToast}
            closeModal={closeModal}
            setModalToast={setModalToastMessage}
            action={action}
          />
        </div>
      </dialog>
    </>
  )
}