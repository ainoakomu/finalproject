
import '../styles.css/Button.css'

const Button = ({ onUp, onDown, onLeft, onRight }) => {
  return (
    <div className="buttons">
      <div className="upwards">
        <input className="btn-control up" onClick={onUp} type="button" value="↑" />
      </div>
      <div className="sideways">
        <input className="btn-control left" onClick={onLeft} type="button" value="←" />
        <input className="btn-control right" onClick={onRight} type="button" value="→" />
      </div>
      <div className="downwards">
        <input className="btn-control down" onClick={onDown} type="button" value="↓" />
      </div>
    </div>
  );
};
export default Button;

