import React, { memo, MouseEvent } from "react"
interface IAddButtonProps {
  btnText: string,
  btnColor: 'bg-sky-400' | 'bg-neutral' ;
  cb: () => void
}
const AddButton: React.FC<IAddButtonProps> = ({ btnColor, btnText, cb }) => {

  const oncBtnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (cb) {
      cb()
    }
  }

  return (
    <>
      <div className="flex justify-end ">
        <button
          onClick={oncBtnClick}
          className={` btn ${btnColor} ${btnColor==='bg-sky-400'?'hover:bg-sky-500':''} `}
        >
          {btnText}
        </button>
      </div>

    </>
  )
}

export default memo(AddButton)