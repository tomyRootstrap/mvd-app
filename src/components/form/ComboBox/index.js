import { string, func, object } from 'prop-types';
import cn from 'classnames';
import './style.css';

const ComboBox = ({ register, name, dataSource, error, handleFocus }) => (
  <div className="comboBox">
    <select {...register(name)} className={cn({ error })} onFocus={handleFocus}>
      {dataSource.map((data, index) => {
        return (
          <option key={index} value={data.id}>
            {data.label}
          </option>
        );
      })}
    </select>
    <small className="error-message">{error?.message}</small>
  </div>
);

ComboBox.propTypes = {
  register: func.isRequired,
  error: object,
  name: string,
};

export default ComboBox;
