import { GiWashingMachine } from "react-icons/gi";

export default function UnauthorizedPage() {
  return (
    <div className="launderly-loader">
    <div className="loading-container">
      <GiWashingMachine className="washing-machine-icon" />
      <div className="loading-text">
        <span className="text-char">L</span>
        <span className="text-char">a</span>
        <span className="text-char">u</span>
        <span className="text-char">n</span>
        <span className="text-char">d</span>
        <span className="text-char">e</span>
        <span className="text-char">r</span>
        <span className="text-char">l</span>
        <span className="text-char">y</span>
      </div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  </div>
  )
}