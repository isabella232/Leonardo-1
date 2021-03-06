import * as React from 'react';
import './Slider.less';
import {useEffect, useState} from 'react';

export function Slider({children, onClose}) {
  const [currentData, setCurrentData] = useState(null);
  const [visible, setVisible] = useState(null);
  const close = (cancel) => {
    cancel && setCurrentData(null);
    setVisible(false);
  };

  useEffect(() => {
    if (visible === null) {
      setTimeout(() => setVisible(true), 50);
      return;
    }
    if (!visible) {
      setTimeout(() => onClose({
        canceled: !currentData,
        data: currentData
      }), 500);
    }
  }, [visible]);

  const onDataChanged = ({isValid = true, data}) => {
    setCurrentData(isValid ? data : null);
  };

  return (
    <div className={'slider-container ' + (visible === true ? 'slider-open' : 'slider-closed')}>
      <div className="slider-back"></div>
      <div className="slider-box" >
        <div className="slider-box-body">
          {React.cloneElement(children, { onDataChanged: onDataChanged })}
        </div>
        <div className="slider-box-footer">
          <button className="btn" onClick={() => close(true)}>Cancel</button>
          <button className="btn btn-action" onClick={() => close(false)} disabled={!currentData}>Apply</button>
        </div>
      </div>
    </div>
  );
}
