import React from "react";

interface ActionProps {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  action: string;
}

export default function ActionConfirmation({
  handleClick,
  action,
}: ActionProps) {
  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="text-red-500 hover:font-bold"
        onClick={() =>
          (
            document.getElementById(`modal_${action}`) as HTMLDialogElement
          ).showModal()
        }
      >
        {action}
      </button>
      <dialog id={`modal_${action}`} className="modal">
        <div className="modal-box w-1/3 max-w-1/2">
          <h3 className="font-bold text-lg">Alert!</h3>
          <p className="py-4">Are you sure you want to {action}?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              {/* if there is a button, it will close the modal */}
              <button className="btn" onClick={handleClick}>
                Yes
              </button>
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
