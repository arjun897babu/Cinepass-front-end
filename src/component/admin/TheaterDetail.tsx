import { FormEvent, MouseEvent } from "react";
import { ITheaterOwnerEntity } from "../../interface/theater/ITheaterOwner";
import { ApprovalStatus, Status } from "../../interface/Interface";
import { RiRadioButtonLine } from "react-icons/ri";
import { ImBlocked } from "react-icons/im";
 

interface TheaterDetailsProps {
  owner: ITheaterOwnerEntity
}
export const TheaterDetails: React.FC<TheaterDetailsProps> = ({ owner }) => {

  const showModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(owner)
    const modal = document.getElementById(owner._id) as HTMLDialogElement
    if (modal) {
      modal.showModal()
    }
  };
  
  const closeModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation();
    const modal = document.getElementById(owner._id) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  }

  const setCity = async (e: FormEvent) => {
    try {

    } catch (error) {

    }
  }

  
  return (
    <>
      <button className="btn" onClick={showModal}>View</button>
      <dialog id={owner._id} className="modal backdrop:overflow-y-hidden">
        <div className="modal-box  max-w-2xl">
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <div className="mt-10">
            <div className="  sm:flex sm:justify-between sm:gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {owner.theater_name}
                </h3>
                <p className="mt-1 text-xs font-medium text-gray-600">{owner.address}</p>
              </div>
              {
                owner.approval_status !== ApprovalStatus.APPROVED ?
                  (
                    <button
                      className={`btn capitalize ${owner.approval_status === ApprovalStatus.REJECTED ?
                        'btn-error' : 'btn-warning'}`}
                    >
                      {
                        owner.approval_status === ApprovalStatus.REJECTED ?
                          ApprovalStatus.REJECTED : ApprovalStatus.PENDING
                      }
                    </button>
                  ) :
                  (
                    <button className={`btn border-none bg-white ${owner.status ?
                      'text-success  ' : 'text-error  '} `}
                    >
                      {owner.status ? Status.ACTIVE : Status.BLOCKED}
                      {owner.status ? (<RiRadioButtonLine size={20} />) : (<ImBlocked size={20} />
                      )}
                    </button>
                  )
              }
            </div>

            <div className="mt-4 px-12">
              <div className="mb-4 w-full flex items-center gap-3 ">
                <label htmlFor="name" className="text-xs font-medium">Theater Owner</label>
                <input
                  className="w-1/2 cursor-not-allowed rounded-lg  border p-3 text-sm focus:outline-none"
                  placeholder="Name"
                  type="text"
                  value={owner.name}
                  readOnly
                />
              </div>
              <div className="mb-4 flex flex-wrap gap-3">
                <div className="flex-1 flex justify-center items-center gap-3 relative">
                  <label className="text-xs font-medium " htmlFor="email">Email</label>
                  <input
                    className="cursor-not-allowed rounded-lg border p-3 text-sm focus:outline-none"
                    placeholder="email"
                    type="email"
                    value={owner.email}
                    readOnly
                  />
                 
                </div>

                <div className="flex-1 flex justify-center items-center gap-3 relative">
                  <label className="text-xs font-medium " htmlFor="phone">Phone</label>
                  <input
                    className="cursor-not-allowed rounded-lg border p-3 text-sm focus:outline-none"
                    placeholder="mobile_number"
                    type="tel"
                    value={owner.mobile_number}
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-3">
                <div className="flex-1 flex justify-center items-center gap-3">
                  <label className="text-xs font-medium " htmlFor="adhaar_number">Adhaar Number</label>
                  <input
                    className="cursor-not-allowed rounded-lg border p-3 text-sm focus:outline-none"
                    placeholder="adhaar_number"
                    type="text"
                    value={owner.adhaar_number}
                    readOnly
                  />
                </div>

                <div className="flex-1 flex justify-center items-center gap-3">
                  <label className="text-xs font-medium " htmlFor="theater_license">Theater License</label>
                  <input
                    className="cursor-not-allowed rounded-lg border p-3 text-sm focus:outline-none"
                    placeholder="theater_license"
                    type="text"
                    value={owner.theater_license}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-4 items-center gap-3 ">
                <h1 className="capitalize text-lg font-medium">Address</h1>
                <hr className="border-gray-400 mb-3" />
                <div className="mb-3">
                  <label htmlFor="address" className="mb-1">Address</label>
                  <textarea className="w-full rounded-lg border p-3 focus:outline-none" name="address" value={owner.address} readOnly>
                  </textarea>
                </div>
                <div className="mb-4 flex flex-wrap gap-3">
                  <div className="flex-1 flex justify-center items-center gap-3 relative">
                    <label className="text-xs font-medium " htmlFor="city">City</label>
                    <input
                      className="cursor-not-allowed rounded-lg text-gray-500 border p-3 text-sm focus:outline-none"
                      placeholder="city"
                      type="text"
                      value={owner.city}
                      readOnly
                    />
                  </div>
                  <form onSubmit={setCity} className="flex flex-1 justify-center items-center gap-2 relative">
                    <input
                      className="rounded-lg border p-3 text-sm  focus:outline-none"
                      placeholder="set city"
                      type="text"
                    />
                    <button className="btn btn-sm btn-neutral" type="submit">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
